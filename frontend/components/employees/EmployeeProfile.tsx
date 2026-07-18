"use client";

import { useEffect, useState } from "react";
import { getEmployeeById } from "@/services/employee";
import { useRouter } from "next/navigation";

interface Props {
  employeeId: string;
}

export default function EmployeeProfile({ employeeId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<any>(null);
  const [reportees, setReportees] = useState<any[]>([]);

  useEffect(() => {
    loadEmployee();
  }, []);

  async function loadEmployee() {
    try {
      const res = await getEmployeeById(employeeId);

      setEmployee(res.data.employee);
      setReportees(res.data.reportees || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading Employee...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-10 text-center">
        Employee not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-8">

      <button
        onClick={() => router.back()}
        className="mb-6 rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
      >
        ← Back
      </button>

      <div className="rounded-xl bg-white p-8 shadow">

        {/* Header */}

        <div className="flex items-center gap-5">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
            {employee.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {employee.name}
            </h1>

            <p className="text-gray-500">
              {employee.designation}
            </p>
          </div>

        </div>

        {/* Personal Info */}

        <div className="mt-10 grid grid-cols-2 gap-6">

          <InfoCard title="Employee ID" value={employee.employeeId} />
          <InfoCard title="Email" value={employee.email} />
          <InfoCard title="Phone" value={employee.phone} />
          <InfoCard title="Department" value={employee.department} />
          <InfoCard title="Designation" value={employee.designation} />
          <InfoCard title="Role" value={employee.role} />
          <InfoCard title="Salary" value={`₹ ${employee.salary}`} />
          <InfoCard
            title="Joining Date"
            value={new Date(employee.joiningDate).toLocaleDateString()}
          />

        </div>

        {/* Status */}

        <div className="mt-8">

          <h2 className="mb-2 text-xl font-semibold">
            Status
          </h2>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              employee.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {employee.status}
          </span>

        </div>

        {/* Manager */}

        <div className="mt-10">

          <h2 className="mb-4 text-xl font-semibold">
            Reporting Manager
          </h2>

          {employee.reportingManager ? (
            <div className="rounded-lg border p-4">

              <p className="font-semibold">
                {employee.reportingManager.name}
              </p>

              <p className="text-gray-500">
                {employee.reportingManager.employeeId}
              </p>

              <p className="text-sm text-gray-500">
                {employee.reportingManager.designation}
              </p>

            </div>
          ) : (
            <p className="text-gray-500">
              No reporting manager assigned.
            </p>
          )}

        </div>

        {/* Reportees */}

        <div className="mt-10">

          <h2 className="mb-4 text-xl font-semibold">
            Reportees
          </h2>

          {reportees.length === 0 ? (
            <p className="text-gray-500">
              No reportees.
            </p>
          ) : (
            <div className="space-y-3">

              {reportees.map((emp) => (
                <div
                  key={emp._id}
                  className="rounded-lg border p-4"
                >
                  <p className="font-semibold">
                    {emp.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {emp.employeeId}
                  </p>

                  <p className="text-sm text-gray-500">
                    {emp.designation}
                  </p>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm text-gray-500">
        {title}
      </h3>

      <p className="mt-2 text-lg font-semibold">
        {value || "-"}
      </p>
    </div>
  );
}