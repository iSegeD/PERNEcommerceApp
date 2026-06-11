import { type RequestHandler } from "express";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users.js";

export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await getLocalUser(userId);
    res.json({ user });
  } catch (error: unknown) {
    next(error);
  }
};
