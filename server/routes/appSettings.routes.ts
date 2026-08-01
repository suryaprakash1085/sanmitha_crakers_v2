import { Router } from "express";
import { AppSettingsController } from "../controllers/appSettings.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", AppSettingsController.get);          // public — frontend needs it
router.put("/", requireAdmin, AppSettingsController.set);

export default router;
