import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { requireAdmin } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", ProductController.list);
router.get("/:id", ProductController.get);
// Uploads a product image file to uploads/products/ on disk and returns its
// public URL. The frontend then sends that URL as the `image` field to the
// create/update endpoints below, so the DB only ever stores a URL string.
router.post("/upload", requireAdmin, imageUpload("products"), ProductController.uploadImage);
router.post("/", requireAdmin, ProductController.create);
router.put("/:id", requireAdmin, ProductController.update);
router.delete("/:id", requireAdmin, ProductController.remove);

export default router;
