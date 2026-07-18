"use client";

import EmployeeTable from "@/components/employees/EmployeeTable";

export default function EmployeesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">Employees</h1>

      <EmployeeTable />
    </main>
  );
}
