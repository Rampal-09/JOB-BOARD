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
  console.log("send otp request come to api helper function(sendotp");
  api.post("/auth/send-otp", { email, role }).then((r) => r.data);
};

export const verifyOtp = (email, token) =>
  api.post("/auth/verify-otp", { email, token }).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
