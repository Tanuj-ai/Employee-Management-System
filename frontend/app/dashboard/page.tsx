"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/dashboard/StatsCards";
import EmployeeChart from "@/components/dashboard/EmployeeChart";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { useAuth } from "@/lib/AuthContext";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role === "EMPLOYEE") {
      router.replace("/dashboard/profile");
    }
  }, [isLoading, user, router]);

  if (isLoading || user?.role === "EMPLOYEE") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-4xl font-bold">
        Employee Management System
      </h1>

      <StatsCards />

      <EmployeeChart />

      <EmployeeTable />
    </main>
  );
}