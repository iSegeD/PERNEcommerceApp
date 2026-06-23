import { type RequestHandler } from "express";
import { getAuth } from "@clerk/express";

import { getLocalUser } from "../lib/users.js";
import { isStaff } from "../lib/roles.js";
import {
  getStreamChatServer,
  streamChatDisplayName,
  streamUserId,
} from "../lib/stream.js";
import { getEnv } from "../lib/env.js";

import { db } from "../db/index.js";
import { orderItems, orders, products, users } from "../db/schema.js";

import { eq, desc, asc, inArray } from "drizzle-orm";

const env = getEnv();

type PreviewItems = {
  name: string;
  slug: string;
  imageUrl: string | null;
  quantity: number;
};

export const listOrders: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const localUser = await getLocalUser(userId);

    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const rows = isStaff(localUser.role)
      ? await db.select().from(orders).orderBy(desc(orders.createdAt))
      : await db
          .select()
          .from(orders)
          .where(eq(orders.userId, localUser.id))
          .orderBy(desc(orders.createdAt));

    const orderIds = rows.map((item) => item.id);

    const previewByOrder = new Map<string, PreviewItems[]>();

    if (orderIds.length > 0) {
      const itemRows = await db
        .select({
          orderId: orderItems.orderId,
          quantity: orderItems.quantity,
          name: products.name,
          slug: products.slug,
          imageUrl: products.imageUrl,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(inArray(orderItems.orderId, orderIds))
        .orderBy(asc(orderItems.id));

      for (const row of itemRows) {
        const list = previewByOrder.get(row.orderId) ?? [];

        list.push({
          name: row.name,
          slug: row.slug,
          imageUrl: row.imageUrl,
          quantity: row.quantity,
        });

        previewByOrder.set(row.orderId, list);
      }
    }

    const ordersPayload = rows.map((item) => ({
      ...item,
      previewItems: previewByOrder.get(item.id) ?? [],
    }));

    res.status(200).json({ orders: ordersPayload });
  } catch (error: unknown) {
    next(error);
  }
};

export const getOrder: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const localUser = await getLocalUser(userId);

    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, req.params.id as string))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const canAccess = order.userId === localUser.id || isStaff(localUser.role);

    if (!canAccess) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const items = await db
      .select({
        id: orderItems.id,
        quantity: orderItems.quantity,
        unitPriceCents: orderItems.unitPriceCents,
        product: products,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));

    res.status(200).json({ order, items });
  } catch (error: unknown) {
    next(error);
  }
};

export const createStreamChannel: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const server = getStreamChatServer(env);

    const localUser = await getLocalUser(userId);

    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, req.params.id as string))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const isOwner = order.userId === localUser.id;

    if (!isOwner && !isStaff(localUser.role)) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    if (order.status !== "paid") {
      res
        .status(403)
        .json({ error: "Order must be paid to open support chat" });
      return;
    }

    const streamChatUserId = streamUserId(userId);

    await server.upsertUser({
      id: streamChatUserId,
      name: streamChatDisplayName(
        localUser.role,
        localUser.displayName,
        localUser.email,
      ),
    });

    const channelId = `order-${order.id}`;

    const channel = server.channel("messaging", channelId, {
      name: `Support · order ${order.id.slice(0, 8)}`,
      created_by_id: streamChatUserId,
    });

    await channel.create();

    await channel.addMembers([streamChatUserId]);

    res.status(200).json({
      channelType: "messaging",
      channelId,
      streamUserId: streamChatUserId,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const createVideoInvite: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const server = getStreamChatServer(env);

    const localUser = await getLocalUser(userId);

    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    if (!isStaff(localUser.role)) {
      res
        .status(403)
        .json({ error: "Only support or admin can send a video invite" });
      return;
    }

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, req.params.id as string))
      .limit(1);

    if (!order || order.status !== "paid") {
      res.status(404).json({ error: "Order not found or not paid" });
      return;
    }

    const [owner] = await db
      .select()
      .from(users)
      .where(eq(users.id, order.userId))
      .limit(1);

    if (!owner) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const customerStreamId = streamUserId(owner.clerkUserId);
    await server.upsertUser({
      id: customerStreamId,
      name: owner.displayName ?? owner.email ?? "Customer",
    });

    const staffStreamUserId = streamUserId(userId);
    await server.upsertUser({
      id: staffStreamUserId,
      name: streamChatDisplayName(
        localUser.role,
        localUser.displayName,
        localUser.email,
      ),
    });

    const channelId = `order-${order.id}`;
    const channel = server.channel("messaging", channelId, {
      name: `Support · order ${order.id.slice(0, 8)}`,
      created_by_id: customerStreamId,
    });

    await channel.create();
    await channel.addMembers([customerStreamId, staffStreamUserId]);

    const joinUrl = `${env.FRONTEND_URL.replace(/\/+$/, "")}/orders/${order.id}/call`;

    await channel.sendMessage({
      text: `Video call - tap Join below (same link for everyone): ${joinUrl}`,
      user_id: staffStreamUserId,
      custom: {
        video_invite: true,
        join_url: joinUrl,
      },
    });

    res.status(200).json({ ok: true, joinUrl });
  } catch (error: unknown) {
    next(error);
  }
};
