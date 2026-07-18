import { Router } from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
 assignManager,
  getReportees,
  getOrganizationTree,
  getMyProfile,
  updateMyProfile,
} from "../controllers/employee.controller";

import upload from "../middleware/upload";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/* ===========================
   Self-service (any authenticated user)
   Must be registered before "/:id" routes.
=========================== */

router.get("/me", protect, getMyProfile);

router.patch(
  "/me",
  protect,
  upload.single("photo"),
  updateMyProfile
);

/* ===========================
   Employee CRUD
=========================== */

// Create Employee
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  upload.single("photo"),
  createEmployee
);

// Get All Employees
router.get(
  "/",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  getEmployees
);

// Get Employee by ID
router.get(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  getEmployeeById
);

// Update Employee
router.patch(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  upload.single("photo"),
  updateEmployee
);

// Delete Employee
router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN"),
  deleteEmployee
);

/* ===========================
   Organization Structure
=========================== */

// Organization Tree
router.get(
  "/organization/tree",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  getOrganizationTree
);

// Get Reportees
router.get(
  "/:id/reportees",
  protect,
  authorize("SUPER_ADMIN", "HR_MANAGER"),
  getReportees
);

// Assign Reporting Manager
router.patch(
  "/:id/manager",
  protect,
  authorize("SUPER_ADMIN"),
  assignManager
);

export default router;