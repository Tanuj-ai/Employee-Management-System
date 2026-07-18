"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createEmployee } from "@/services/employee";
import { useAuth } from "@/lib/AuthContext";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: "",
  role: "EMPLOYEE",
};

export default function AddEmployeeForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const canAssignSuperAdmin = user?.role === "SUPER_ADMIN";
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "salary"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("department", form.department);
      formData.append("designation", form.designation);
      formData.append("salary", String(form.salary));
      formData.append("joiningDate", form.joiningDate);
      formData.append("role", form.role);

      if (photo) {
        formData.append("photo", photo);
      }

      await createEmployee(formData);

      toast.success("Employee created successfully!");

      setForm(initialForm);
      setPhoto(null);
      setPreview("");

      onSuccess();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl bg-white p-6 shadow"
    >
      <div className="grid gap-4 md:grid-cols-2">

        <input
          name="name"
          placeholder="Name"
          className="rounded border p-2"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded border p-2"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="rounded border p-2"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          className="rounded border p-2"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="designation"
          placeholder="Designation"
          className="rounded border p-2"
          value={form.designation}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="rounded border p-2"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="joiningDate"
          className="rounded border p-2"
          value={form.joiningDate}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="rounded border p-2"
          value={form.role}
          onChange={handleChange}
        >
          <option value="EMPLOYEE">
            EMPLOYEE
          </option>

          <option value="HR_MANAGER">
            HR_MANAGER
          </option>

          {canAssignSuperAdmin && (
            <option value="SUPER_ADMIN">
              SUPER_ADMIN
            </option>
          )}
        </select>

        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded border p-2"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 h-28 w-28 rounded-full border object-cover"
            />
          )}
        </div>

      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Creating Employee..."
          : "Add Employee"}
      </button>
    </form>
  );
}