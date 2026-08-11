import { Router } from "express";
import { EmailSettingsController } from "../controllers/emailSettings.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, EmailSettingsController.get);
router.post("/", requireAuth, EmailSettingsController.create);
router.put("/", requireAuth, EmailSettingsController.update);
router.post("/test", requireAuth, EmailSettingsController.testConnection);
router.post("/send-test", requireAuth, EmailSettingsController.sendTestEmail);

export default router;
