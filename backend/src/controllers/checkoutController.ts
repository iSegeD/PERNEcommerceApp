import { type RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import z from "zod";

import { getEnv } from "../lib/env.js";
import { getLocalUser } from "../lib/users.js";

import {
  checkOutSessions,
  products,
  type CheckOutSessionLine,
} from "../db/schema.js";
import { db } from "../db/index.js";
import { eq, and, inArray } from "drizzle-orm";
import { polarCreateCheckout } from "../lib/polar.js";

const env = getEnv();

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const createCheckout: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsedData = cartSchema.safeParse(req.body);

    if (!parsedData.success) {
      res
        .status(400)
        .json({ error: "Invalid cart", details: parsedData.error.flatten() });
      return;
    }

    if (!env.POLAR_ACCESS_TOKEN) {
      res.status(503).json({ error: "Payments are not configured" });
      return;
    }

    const localUser = await getLocalUser(userId);
    if (!localUser) {
      res.status(503).json({ errro: "Account not synced yet" });
      return;
    }

    const ids = parsedData.data.items.map((item) => item.productId);

    const prodRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.active, true)));

    if (prodRows.length !== ids.length) {
      res.status(400).json({ error: "One or more products are invalid" });
      return;
    }

    const byId = new Map(prodRows.map((item) => [item.id, item]));

    let totalCents = 0;

    const lines: CheckOutSessionLine[] = [];

    for (const line of parsedData.data.items) {
      const p = byId.get(line.productId)!;

      totalCents += p.priceCents * line.quantity;

      lines.push({
        productId: p.id,
        quantity: line.quantity,
        unitPriceCents: p.priceCents,
      });
    }

    if (totalCents < 10) {
      res.status(400).json({
        error:
          "Total below Polar minimum (e.g. EUR requires at least 10 cents)",
      });
      return;
    }

    const [session] = await db
      .insert(checkOutSessions)
      .values({
        userId: localUser.id,
        lines,
        totalCents,
        currency: "eur",
      })
      .returning();

    if (!session) {
      res.status(500).json({ error: "Failed to create ckecout session" });
      return;
    }

    const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
    const returnUrl = `${env.FRONTEND_URL}/cart`;

    const checkout = await polarCreateCheckout(env, {
      products: [env.POLAR_CHECKOUT_PRODUCTION_ID],
      prices: {
        [env.POLAR_CHECKOUT_PRODUCTION_ID]: [
          {
            amount_type: "fixed",
            price_currency: "eur",
            price_amount: totalCents,
          },
        ],
      },

      success_url: successUrl,
      return_url: returnUrl,
      external_customer_id: userId,
      metadata: { checkout_session_id: session.id },
    });

    await db
      .update(checkOutSessions)
      .set({ polarCheckoutId: checkout.id })
      .where(eq(checkOutSessions.id, session.id));

    res.json({ checkoutUrl: checkout.url });
  } catch (error: unknown) {
    next(error);
  }
};
