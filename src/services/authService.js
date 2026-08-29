
import api from "../utils/api";

export const loginApi = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const registerApi = async (username, email, password) => {
  const { data } = await api.post("/auth/register", { username, email, password });
  return data;
};

export const logoutApi = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const refreshTokenApi = async () => {
  const { data } = await api.post("/auth/refresh");
  return data;
};

export const forgotPasswordApi = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPasswordApi = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};
