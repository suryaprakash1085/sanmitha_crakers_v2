import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { requireAdmin } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", CategoryController.list);
router.get("/:id", CategoryController.get);
// Uploads a category image file to uploads/categories/ on disk and returns its
// public URL. The frontend then sends that URL as the `image` field to the
// create/update endpoints below, so the DB only ever stores a URL string.
router.post("/upload", requireAdmin, imageUpload("categories"), CategoryController.uploadImage);
router.post("/", requireAdmin, CategoryController.create);
router.put("/:id", requireAdmin, CategoryController.update);
router.delete("/:id", requireAdmin, CategoryController.remove);

export default router;
