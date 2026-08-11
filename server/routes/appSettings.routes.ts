import { Router } from "express";
import { AppSettingsController } from "../controllers/appSettings.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", AppSettingsController.get);          // public — frontend needs it
router.put("/", requireAuth, AppSettingsController.set);

export default router;
