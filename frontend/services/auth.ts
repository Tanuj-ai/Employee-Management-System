import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const me = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};