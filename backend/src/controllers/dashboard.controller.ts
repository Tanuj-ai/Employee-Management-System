import { Request, Response } from "express";
import Employee, { EmployeeStatus } from "../models/Employee";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboardStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const totalEmployees = await Employee.countDocuments({
      isDeleted: false,
    });

    const activeEmployees = await Employee.countDocuments({
      isDeleted: false,
      status: EmployeeStatus.ACTIVE,
    });

    const inactiveEmployees = await Employee.countDocuments({
      isDeleted: false,
      status: EmployeeStatus.INACTIVE,
    });

    const departments = await Employee.distinct("department", {
      isDeleted: false,
    });

    const salaryStats = await Employee.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $group: {
          _id: null,
          averageSalary: { $avg: "$salary" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        departmentCount: departments.length,
        averageSalary: salaryStats[0]?.averageSalary || 0,
      },
    });
  }
);  