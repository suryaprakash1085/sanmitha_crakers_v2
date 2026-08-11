import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

// Public — anyone can submit a contact form
router.post("/", ContactController.create);

// Logged-in users — view and manage submissions
router.get("/", requireAuth, ContactController.getAll);
router.put("/:id/status", requireAuth, ContactController.updateStatus);
router.delete("/:id", requireAuth, ContactController.remove);

export default router;
