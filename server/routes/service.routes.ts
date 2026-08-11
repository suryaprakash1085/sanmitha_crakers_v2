import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", ServiceController.list);
router.get("/:id", ServiceController.get);
router.post("/", requireAuth, ServiceController.create);
router.put("/:id", requireAuth, ServiceController.update);
router.delete("/:id", requireAuth, ServiceController.remove);

export default router;
