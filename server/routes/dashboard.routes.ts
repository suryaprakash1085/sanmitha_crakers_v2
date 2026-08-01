import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", requireAdmin, DashboardController.stats);

export default router;
