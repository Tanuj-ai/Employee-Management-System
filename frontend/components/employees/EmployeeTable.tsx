"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Employee } from "@/types/employee";
import {
  getEmployees,
  deleteEmployee,
} from "@/services/employee";

import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployeeDialog from "./EditEmployeeDialog";

import { exportEmployeesToExcel } from "@/utils/exportExcel";
import { exportEmployeesToPDF } from "@/utils/exportPDF";
import { useAuth } from "@/lib/AuthContext";

export default function EmployeeTable() {
  const { user } = useAuth();
  const canDelete = user?.role === "SUPER_ADMIN";
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadEmployees() {
    setLoading(true);

    try {
      const res = await getEmployees({
        search,
        department,
        role,
        status,
        page,
        limit,
      });

      setEmployees(res.data);

      if (res.pagination) {
        setTotalPages(res.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(id);

      toast.success("Employee deleted successfully");

      loadEmployees();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete employee");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, [page]);

  return (
    <div className="mt-10">

      {/* Top Actions */}
      {/* Top Actions */}

<div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  <AddEmployeeForm onSuccess={loadEmployees} />

  <div className="flex flex-wrap gap-3">

    <button
      onClick={() => exportEmployeesToExcel(employees)}
      className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
    >
      📊 Export Excel
    </button>

    <button
      onClick={() => exportEmployeesToPDF(employees)}
      className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
    >
      📄 Export PDF
    </button>

  </div>

</div>

{/* Search & Filters */}

<div className="mb-6 rounded-xl bg-white p-5 shadow">

  <h2 className="mb-4 text-lg font-semibold">
    Search Employees
  </h2>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">

    <input
      type="text"
      placeholder="Search by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="rounded-lg border p-2 outline-none focus:border-blue-500"
    />

    <select
      value={department}
      onChange={(e) => setDepartment(e.target.value)}
      className="rounded-lg border p-2"
    >
      <option value="">All Departments</option>
      <option value="Engineering">Engineering</option>
      <option value="HR">HR</option>
      <option value="Finance">Finance</option>
      <option value="Marketing">Marketing</option>
    </select>

    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="rounded-lg border p-2"
    >
      <option value="">All Roles</option>
      <option value="SUPER_ADMIN">
        SUPER_ADMIN
      </option>
      <option value="ADMIN">
        ADMIN
      </option>
      <option value="HR_MANAGER">
        HR_MANAGER
      </option>
      <option value="EMPLOYEE">
        EMPLOYEE
      </option>
    </select>

    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="rounded-lg border p-2"
    >
      <option value="">All Status</option>
      <option value="ACTIVE">
        ACTIVE
      </option>
      <option value="INACTIVE">
        INACTIVE
      </option>
    </select>

    <button
      onClick={() => {
        setPage(1);
        loadEmployees();
      }}
      className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
    >
      🔍 Search
    </button>

  </div>

</div>

{/* Table */}
{/* Table */}

{loading ? (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

    <p className="mt-4 text-gray-500">
      Loading employees...
    </p>
  </div>
) : (
  <>
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-semibold">
              Employee ID
            </th>

            <th className="p-4 text-left font-semibold">
              Employee
            </th>

            <th className="p-4 text-left font-semibold">
              Department
            </th>

            <th className="p-4 text-left font-semibold">
              Designation
            </th>

            <th className="p-4 text-left font-semibold">
              Role
            </th>

            <th className="p-4 text-left font-semibold">
              Status
            </th>

            <th className="p-4 text-center font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="p-10 text-center text-gray-500"
              >
                No employees found.
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr
                key={emp._id}
                className="border-t transition hover:bg-gray-50"
              >
                <td className="p-4 font-medium">
                  {emp.employeeId}
                </td>

                {/* Employee */}

                <td className="p-4">
                  <div className="flex items-center gap-3">

                    <img
                      src={emp.photo || "/avatar.png"}
                      alt={emp.name}
                      className="h-12 w-12 rounded-full border object-cover"
                    />

                    <div>
                      <p className="font-semibold">
                        {emp.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {emp.email}
                      </p>
                    </div>

                  </div>
                </td>

                <td className="p-4">
                  {emp.department}
                </td>

                <td className="p-4">
                  {emp.designation}
                </td>

                <td className="p-4">
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {emp.role}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      emp.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">

                    <Link
                      href={`/dashboard/employees/${emp._id}`}
                      className="rounded bg-blue-600 px-3 py-2 text-sm text-white transition hover:bg-blue-700"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setDialogOpen(true);
                      }}
                      className="rounded bg-yellow-500 px-3 py-2 text-sm text-white transition hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    {canDelete && (
                      <button
                        onClick={() =>
                          handleDelete(emp._id)
                        }
                        className="rounded bg-red-600 px-3 py-2 text-sm text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {/* Pagination */}

<div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">

  <button
    disabled={page === 1}
    onClick={() => setPage((prev) => prev - 1)}
    className="rounded-lg bg-gray-700 px-5 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
  >
    ← Previous
  </button>

  <span className="rounded-lg bg-gray-100 px-4 py-2 font-semibold">
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage((prev) => prev + 1)}
    className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    Next →
  </button>

</div>

</>
)}

{/* Edit Employee Dialog */}

<EditEmployeeDialog
  employee={selectedEmployee}
  open={dialogOpen}
  onClose={() => setDialogOpen(false)}
  onSuccess={loadEmployees}
/>

</div>
);
}