import "dotenv/config";
import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import apiRoutes from "./routes";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Uploaded files (product images, etc.) live in <project-root>/uploads and
  // are served as static assets at /uploads/... . The folder is created if
  // it doesn't exist so a fresh checkout doesn't need manual setup.
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", express.static(uploadsDir));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // MVC API routes: /api/auth, /api/products, /api/categories,
  // /api/services, /api/orders, /api/users, /api/company,
  // /api/dashboard, /api/reports
  app.use("/api", apiRoutes);

  return app;
}
