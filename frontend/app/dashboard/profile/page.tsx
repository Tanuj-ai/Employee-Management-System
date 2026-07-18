"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Employee } from "@/types/employee";
import { getMyProfile, updateMyProfile } from "@/services/employee";

export default function MyProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await getMyProfile();
      setEmployee(res.data);
      setPhone(res.data.phone || "");
      setPreview(res.data.photo || "");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to load your profile"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("phone", phone);
      if (photo) formData.append("photo", photo);

      const res = await updateMyProfile(formData);
      setEmployee(res.data);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Loading your profile...</p>;
  }

  if (!employee) {
    return (
      <p className="text-gray-500">
        No employee profile is linked to your account yet.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

      <div className="rounded-xl bg-white p-6 shadow">
        <div className="mb-6 flex flex-col items-center gap-3">
          <img
            src={preview || "/avatar.png"}
            alt={employee.name}
            className="h-24 w-24 rounded-full border object-cover"
          />
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>

        {/* Read-only fields */}
        <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Employee ID</p>
            <p className="font-medium">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{employee.name}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Department</p>
            <p className="font-medium">{employee.department}</p>
          </div>
          <div>
            <p className="text-gray-500">Designation</p>
            <p className="font-medium">{employee.designation}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{employee.status}</p>
          </div>
        </div>

        {/* Editable fields */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-500">
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border p-2"
              placeholder="Phone"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
