import api from "@/lib/axios";

export interface EmployeeQuery {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export const getEmployees = async (params: {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/employees", {
    params,
  });

  return res.data;
};

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard/stats");
  return res.data;
};

export const createEmployee = async (
  data: FormData
) => {
  const response = await api.post(
    "/employees",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateEmployee = async (
  id: string,
  data: FormData
) => {
  const response = await api.patch(
    `/employees/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const res = await api.delete(`/employees/${id}`);
  return res.data;
};

export const organizationTree = async () => {
  const res = await api.get("/employees/organization/tree");
  return res.data;
};

export const getEmployeeById = async (id: string) => {
  const res = await api.get(`/employees/${id}`);
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get("/employees/me");
  return res.data;
};

export const updateMyProfile = async (data: FormData) => {
  const res = await api.patch("/employees/me", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
