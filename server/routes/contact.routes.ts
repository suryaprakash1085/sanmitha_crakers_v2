import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// Public — anyone can submit a contact form
router.post("/", ContactController.create);

// Admin only — view and manage submissions
router.get("/", requireAuth, requireAdmin, ContactController.getAll);
router.put("/:id/status", requireAuth, requireAdmin, ContactController.updateStatus);
router.delete("/:id", requireAuth, requireAdmin, ContactController.remove);

export default router;
