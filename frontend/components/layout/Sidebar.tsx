"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  LogOut,
  User,
} from "lucide-react";
import { logout } from "@/services/auth";
import { useAuth } from "@/lib/AuthContext";

const adminMenuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    name: "Organization",
    href: "/dashboard/organization",
    icon: GitBranch,
  },
];

const employeeMenuItems = [
  {
    name: "My Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const menuItems =
    user?.role === "EMPLOYEE" ? employeeMenuItems : adminMenuItems;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shadow-lg">
      {/* Logo */}
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-2xl font-bold tracking-wide">
          EMS
        </h1>

        <p className="text-sm text-slate-400">
          Employee Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}