import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAdmin, UserController.list);
router.get("/:id", requireAdmin, UserController.get);
router.post("/", requireAdmin, UserController.create);
router.put("/:id", requireAdmin, UserController.update);
router.delete("/:id", requireAdmin, UserController.remove);

export default router;
