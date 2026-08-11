import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { imageUpload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", ProductController.list);
router.get("/:id", ProductController.get);
// Uploads a product image file to uploads/products/ on disk and returns its
// public URL. The frontend then sends that URL as the `image` field to the
// create/update endpoints below, so the DB only ever stores a URL string.
router.post("/upload", requireAuth, imageUpload("products"), ProductController.uploadImage);
router.post("/", requireAuth, ProductController.create);
router.put("/:id", requireAuth, ProductController.update);
router.delete("/:id", requireAuth, ProductController.remove);

export default router;
