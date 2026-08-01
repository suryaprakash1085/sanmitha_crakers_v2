import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAdmin, OrderController.list);
router.get("/:id", requireAdmin, OrderController.get);
router.post("/", OrderController.create);
router.put("/:id/status", requireAdmin, OrderController.updateStatus);
router.put("/:id/payment-method", requireAdmin, OrderController.updatePaymentMethod);
router.put("/:id", requireAdmin, OrderController.update);
router.delete("/:id", requireAdmin, OrderController.remove);

export default router;
