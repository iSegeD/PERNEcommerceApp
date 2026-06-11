import { Router } from "express";
import { getMe } from "../controllers/meController.js";

const router = Router();

router.get("/", getMe);

export default router;
