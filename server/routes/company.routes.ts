import { Router } from "express";
import { CompanyController } from "../controllers/company.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", CompanyController.get);
router.put("/", requireAdmin, CompanyController.update);

export default router;
