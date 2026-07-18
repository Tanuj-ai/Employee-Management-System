import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/stats",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  getDashboardStats
);

export default router;