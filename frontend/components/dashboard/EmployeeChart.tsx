"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getDashboardStats } from "@/services/employee";

export default function EmployeeChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getDashboardStats();

        setData([
          {
            name: "Active",
            employees: res.data.activeEmployees,
          },
          {
            name: "Inactive",
            employees: res.data.inactiveEmployees,
          },
          {
            name: "Departments",
            employees: res.data.departmentCount,
          },
        ]);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow">
      <h2 className="mb-5 text-xl font-semibold">
        Employee Overview
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="employees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}