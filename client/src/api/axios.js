import axios from "axios";

const api = axios.create({
  baseURL: "https://task-tracker-backend.onrender.com/api",
  withCredentials: true
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
