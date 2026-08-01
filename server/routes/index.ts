import { Router } from "express";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import productRoutes from "./product.routes";
import serviceRoutes from "./service.routes";
import orderRoutes from "./order.routes";
import userRoutes from "./user.routes";
import companyRoutes from "./company.routes";
import dashboardRoutes from "./dashboard.routes";
import reportRoutes from "./report.routes";
import emailSettingsRoutes from "./emailSettings.routes";
import accessControlRoutes from "./accessControl.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/services", serviceRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/company", companyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/email-settings", emailSettingsRoutes);
router.use("/access-control", accessControlRoutes);

export default router;
