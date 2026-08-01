import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", ServiceController.list);
router.get("/:id", ServiceController.get);
router.post("/", requireAdmin, ServiceController.create);
router.put("/:id", requireAdmin, ServiceController.update);
router.delete("/:id", requireAdmin, ServiceController.remove);

export default router;
