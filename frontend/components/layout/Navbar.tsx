"use client";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">
          Welcome 👋
        </h2>

        <p className="text-sm text-gray-500">
          Employee Management System
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">Admin</p>
          <p className="text-sm text-gray-500">
            admin@ems.com
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}