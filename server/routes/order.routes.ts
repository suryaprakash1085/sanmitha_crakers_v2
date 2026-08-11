import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, OrderController.list);
router.get("/:id", requireAuth, OrderController.get);
router.post("/", OrderController.create);
router.put("/:id/status", requireAuth, OrderController.updateStatus);
router.put("/:id/payment-method", requireAuth, OrderController.updatePaymentMethod);
router.put("/:id", requireAuth, OrderController.update);
router.delete("/:id", requireAuth, OrderController.remove);

export default router;
