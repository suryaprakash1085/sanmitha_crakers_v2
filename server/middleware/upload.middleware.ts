import fs from "fs";
import path from "path";
import multer from "multer";
import { Request } from "express";

// All uploads live under <project-root>/uploads/<subfolder>, served statically
// at /uploads by server/index.ts. The folder is created on the fly if it
// doesn't exist yet — no manual setup needed on a fresh checkout.
const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

function ensureFolder(folder: string) {
  const dir = path.join(UPLOADS_ROOT, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

// Returns an Express middleware (single-file upload under field name "image")
// that stores the file in uploads/<folder>/ and creates the folder if needed.
export function imageUpload(folder: string) {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, ensureFolder(folder));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, unique);
    },
  });

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(new Error("Only image files (jpg, png, webp, gif, svg) are allowed"));
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  }).single("image");
}

// Builds the public URL (stored in the DB) for an uploaded file.
export function publicUploadUrl(folder: string, filename: string) {
  return `/uploads/${folder}/${filename}`;
}
