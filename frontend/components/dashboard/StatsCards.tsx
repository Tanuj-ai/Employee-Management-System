"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/employee";

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentCount: number;
  averageSalary: number;
}

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departmentCount: 0,
    averageSalary: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      color: "bg-blue-500",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      color: "bg-green-500",
    },
    {
      title: "Inactive Employees",
      value: stats.inactiveEmployees,
      color: "bg-red-500",
    },
    {
      title: "Departments",
      value: stats.departmentCount,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg"
        >
          <div
            className={`mb-4 h-2 rounded-full ${card.color}`}
          />

          <h3 className="text-gray-500 text-sm">
            {card.title}
          </h3>

          <p className="mt-2 text-3xl font-bold">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}