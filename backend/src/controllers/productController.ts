import { type RequestHandler } from "express";
import { db } from "../db/index.js";
import { products } from "../db/schema.js";
import { eq, desc, and } from "drizzle-orm";


type ProductParams = {
  slug: string;
};

export const listProducts: RequestHandler = async (req, res, next) => {
  try {
    const category =
      typeof req.query.category === "string" ? req.query.category.trim() : "";

    const activeOnly = eq(products.active, true);
    const whereClause = category
      ? and(activeOnly, eq(products.category, category))
      : activeOnly;

    const rows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt));

    res.json({ products: rows });
  } catch (error: unknown) {
    next(error);
  }
};

export const getCategories: RequestHandler = async (_req, res, next) => {
  try {
    const rows = await db
      .select({ category: products.category })
      .from(products)
      .where(eq(products.active, true));

    const categories = [...new Set(rows.map((item) => item.category))].sort(
      (a, b) => a.localeCompare(b),
    );

    res.json({ categories });
  } catch (error: unknown) {
    next(error);
  }
};

export const getProductBySlug: RequestHandler<ProductParams> = async (
  req,
  res,
  next,
) => {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, req.params.slug))
      .limit(1);

    if (!row || !row.active) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json({ product: row });
  } catch (error: unknown) {
    next(error);
  }
};
