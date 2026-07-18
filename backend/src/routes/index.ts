import { Router } from "express";
import authRoutes from "./auth.routes";
import employeeRoutes from "./employee.routes";
import dashboardRoutes from "./dashboard.routes";
const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "EMS API v1",
  });
});
router.use("/api/dashboard", dashboardRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/employees", employeeRoutes);
export default router;