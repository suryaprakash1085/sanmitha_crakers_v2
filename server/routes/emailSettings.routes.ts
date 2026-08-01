import { Router } from "express";
import { EmailSettingsController } from "../controllers/emailSettings.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAdmin, EmailSettingsController.get);
router.post("/", requireAdmin, EmailSettingsController.create);
router.put("/", requireAdmin, EmailSettingsController.update);
router.post("/test", requireAdmin, EmailSettingsController.testConnection);
router.post("/send-test", requireAdmin, EmailSettingsController.sendTestEmail);

export default router;
