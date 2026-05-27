import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const sendOtp = (email, role) => {
  api.post("/auth/send-otp", { email, role }).then((r) => r.data);
};

export const verifyOtp = (email, token) => {
  api.post("/auth/verify-otp", { email, otp }).then((r) => r.data);
};

export const getMe = () => api.get("/auth/me").then((r) => r.data);
