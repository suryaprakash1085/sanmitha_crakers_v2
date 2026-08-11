import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", requireAuth, DashboardController.stats);

export default router;
