import "dotenv/config";

import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import * as Sentry from "@sentry/node";

import { getEnv } from "./lib/env.js";
import { clerkWebhookHandler } from "./webhooks/clerk.js";
import { polarWebhookHandler } from "./webhooks/polar.js";

import fs from "node:fs";
import path from "node:path";

import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser.js";

import meRouter from "./routes/meRouter.js";
import productRouter from "./routes/productRouter.js";
import streamRouter from "./routes/streamRouter.js";
import checkoutRouter from "./routes/checkoutRouter.js";

const env = getEnv();
const app = express();

const rawJson = express.raw({ type: "application/json", limit: "1mb" });

app.post("/webhooks/clerk", rawJson, (req, res) => {
  void clerkWebhookHandler(req, res);
});

app.post("/webhooks/polar", rawJson, (req, res) => {
  void polarWebhookHandler(req, res);
});

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use(sentryClerkUserMiddleware);

app.use("/api/me", meRouter);
app.use("/api/products", productRouter);
app.use("/api/stream", streamRouter);
app.use("/api/checkout", checkoutRouter);

const publicDir = path.join(process.cwd(), "public");

if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

Sentry.setupExpressErrorHandler(app);

app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const sentryId = (res as Response & { sentry?: string }).sentry;

  res.status(500).json({
    error: "Internal server error",
    ...(sentryId !== undefined && { sentryId }),
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
