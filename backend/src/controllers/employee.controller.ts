import { Request, Response } from "express";
import Employee from "../models/Employee";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateOwnProfileSchema,
} from "../validators/employee.validator";
import { generateEmployeeId } from "../services/employee.service";
import { hasCircularReference } from "../services/hierarchy.service";

const buildTree = (employees: any[], managerId: any = null): any[] => {
  return employees
    .filter((emp) => {
      if (managerId === null) {
        return !emp.reportingManager;
      }

      return (
        emp.reportingManager &&
        emp.reportingManager.toString() === managerId.toString()
      );
    })
    .map((emp) => ({
      _id: emp._id,
      employeeId: emp.employeeId,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      children: buildTree(employees, emp._id),
    }));
};

// ==============================
// Create Employee
// ==============================
export const createEmployee = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = createEmployeeSchema.parse(req.body);

    if (data.role === "SUPER_ADMIN" && req.user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Only a Super Admin can assign the Super Admin role");
    }

    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      ...data,
      reportingManager: data.reportingManager || undefined,
      employeeId,

      // Cloudinary image URL
      photo: req.file
        ? (req.file as Express.Multer.File).path
        : "",
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee,
    });
  }
);

// ==============================
// Get All Employees
// ==============================
export const getEmployees = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = "1",
      limit = "10",
      search = "",
      department,
      status,
      role,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter: any = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search as string,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search as string,
            $options: "i",
          },
        },
      ];
    }

    if (department) filter.department = department;
    if (status) filter.status = status;
    if (role) filter.role = role;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const employees = await Employee.find(filter)
      .populate("reportingManager", "name employeeId")
      .sort({
        [sortBy as string]: order === "asc" ? 1 : -1,
      })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const total = await Employee.countDocuments(filter);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  }
);

// ==============================
// Get My Profile (self-service)
// ==============================
export const getMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user.employee) {
      throw new ApiError(404, "No employee profile linked to this account");
    }

    const employee = await Employee.findById(req.user.employee).populate(
      "reportingManager",
      "name employeeId designation"
    );

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    res.json({
      success: true,
      data: employee,
    });
  }
);

// ==============================
// Update My Profile (self-service, limited fields)
// ==============================
export const updateMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user.employee) {
      throw new ApiError(404, "No employee profile linked to this account");
    }

    const data = updateOwnProfileSchema.parse(req.body);

    const employee = await Employee.findById(req.user.employee);

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    if (req.file) {
      data.photo = (req.file as Express.Multer.File).path;
    }

    Object.assign(employee, data);

    await employee.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: employee,
    });
  }
);

// ==============================
// Get Employee By ID
// ==============================
export const getEmployeeById = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id)
      .populate("reportingManager", "name employeeId designation");

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    const reportees = await Employee.find({
      reportingManager: employee._id,
      isDeleted: false,
    }).select("name employeeId designation department");

    res.json({
      success: true,
      data: {
        employee,
        reportees,
      },
    });
  }
);

// ==============================
// Update Employee
// ==============================
export const updateEmployee = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = updateEmployeeSchema.parse(req.body);

    if (data.role === "SUPER_ADMIN" && req.user.role !== "SUPER_ADMIN") {
      throw new ApiError(403, "Only a Super Admin can assign the Super Admin role");
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    // Update uploaded photo (if provided)
    if (req.file) {
      data.photo = (req.file as Express.Multer.File).path;
    }

    Object.assign(employee, data);

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  }
);
// ==============================
// Soft Delete Employee
// ==============================
export const deleteEmployee = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id);

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    employee.isDeleted = true;

    await employee.save();

    res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  }
);

// ==============================
// Assign Reporting Manager
// ==============================
export const assignManager = asyncHandler(
  async (req: Request, res: Response) => {
    const { managerId } = req.body;

    const employee = await Employee.findById(req.params.id);

    if (!employee || employee.isDeleted) {
      throw new ApiError(404, "Employee not found");
    }

    if (employee._id.toString() === managerId) {
      throw new ApiError(
        400,
        "Employee cannot report to themselves"
      );
    }

    const manager = await Employee.findById(managerId);

    if (!manager || manager.isDeleted) {
      throw new ApiError(404, "Manager not found");
    }

    const circular = await hasCircularReference(
      employee._id.toString(),
      manager._id.toString()
    );

    if (circular) {
      throw new ApiError(
        400,
        "Circular reporting structure detected"
      );
    }

    employee.reportingManager = manager._id as any;

    await employee.save();

    res.json({
      success: true,
      message: "Reporting manager assigned successfully",
      data: employee,
    });
  }
);

// ==============================
// Get Reportees
// ==============================
export const getReportees = asyncHandler(
  async (req: Request, res: Response) => {
    const manager = await Employee.findById(req.params.id);

    if (!manager || manager.isDeleted) {
      throw new ApiError(404, "Manager not found");
    }

    const reportees = await Employee.find({
      reportingManager: manager._id,
      isDeleted: false,
    }).select("-__v");

    res.json({
      success: true,
      count: reportees.length,
      data: reportees,
    });
  }
);

// ==============================
// Organization Tree
// ==============================
export const getOrganizationTree = asyncHandler(
  async (_req: Request, res: Response) => {
    const employees = await Employee.find({
      isDeleted: false,
    });

    const tree = buildTree(employees);

    res.json({
      success: true,
      data: tree,
    });
  }
);