import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/summary", requireAuth, ReportController.summary);

export default router;
