import { Router } from "express";
import { AccessControlController } from "../controllers/accessControl.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

// All access-control routes require admin
router.use(requireAdmin);

// Roles
router.get("/roles", AccessControlController.getRoles);
router.put("/roles", AccessControlController.replaceRoles);

// Assignments
router.get("/assignments", AccessControlController.getAssignments);
router.put("/assignments", AccessControlController.replaceAssignments);

export default router;
