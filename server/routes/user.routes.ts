import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, UserController.list);
router.get("/:id", requireAuth, UserController.get);
router.post("/", requireAuth, UserController.create);
router.put("/:id", requireAuth, UserController.update);
router.delete("/:id", requireAuth, UserController.remove);

export default router;
