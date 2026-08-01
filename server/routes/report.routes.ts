import { Router } from "express";
import { ReportController } from "../controllers/report.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/summary", requireAdmin, ReportController.summary);

export default router;
