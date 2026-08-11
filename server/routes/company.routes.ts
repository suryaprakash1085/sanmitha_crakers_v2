import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { imageUpload, publicUploadUrl } from "../middleware/upload.middleware";
import { Request, Response } from "express";

const router = Router();

router.get("/", CompanyController.get);
router.put("/", requireAuth, CompanyController.update);

// Upload company logo — returns { url } for use in ImagePicker
router.post(
  "/upload-logo",
  requireAuth,
  imageUpload("logos"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file provided" });
    }
    const url = publicUploadUrl("logos", req.file.filename);
    res.json({ success: true, url });
  }
);

export default router;
