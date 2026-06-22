import { Router } from "express";

import {
  requireAdmin,
  getImageKitAuth,
  listAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "../controllers/adminController.js";

const router = Router();

router.use(requireAdmin);

router.get("/imagekit/auth", getImageKitAuth);
router.get("/products", listAdminProducts);
router.post("/products", createAdminProduct);
router.patch("/products/:id", updateAdminProduct);
router.delete("/products/:id", deleteAdminProduct);

export default router;
