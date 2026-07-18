"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Employee } from "@/types/employee";
import { updateEmployee } from "@/services/employee";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditEmployeeDialog({
  employee,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState<any>({});
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        department: employee.department,
        designation: employee.designation,
        salary: employee.salary,
        phone: employee.phone,
        status: employee.status,
      });

      setPreview(employee.photo || "");
      setPhoto(null);
    }
  }, [employee]);

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

  async function save() {
    if (!employee) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("department", form.department);
      formData.append("designation", form.designation);
      formData.append("salary", String(form.salary));
      formData.append("phone", form.phone);
      formData.append("status", form.status);

      if (photo) {
        formData.append("photo", photo);
      }

      await updateEmployee(employee._id, formData);

      toast.success("Employee updated successfully");

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Update failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return(
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-lg">

      <DialogHeader>
        <DialogTitle>Edit Employee</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">

        {/* Profile Image */}

        <div className="flex flex-col items-center gap-3">

          <img
            src={preview || "/avatar.png"}
            alt="Profile Preview"
            className="h-24 w-24 rounded-full border object-cover"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded border p-2"
          />

        </div>

        {/* Name */}

        <input
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Name"
        />

        {/* Department */}

        <input
          name="department"
          value={form.department || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Department"
        />

        {/* Designation */}

        <input
          name="designation"
          value={form.designation || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Designation"
        />

        {/* Phone */}

        <input
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Phone"
        />

        {/* Salary */}

        <input
          type="number"
          name="salary"
          value={form.salary || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
          placeholder="Salary"
        />

        {/* Status */}

        <select
          name="status"
          value={form.status || ""}
          onChange={handleChange}
          className="w-full rounded-lg border p-2"
        >
          <option value="ACTIVE">
            ACTIVE
          </option>

          <option value="INACTIVE">
            INACTIVE
          </option>
        </select>

        {/* Buttons */}

        <div className="flex gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </div>

      </div>

    </DialogContent>
  </Dialog>
);
}