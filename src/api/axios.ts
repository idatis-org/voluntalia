import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",//import.meta.env.VITE_API_URL || "https://api.miapp.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // útil si tu API usa cookies/sesiones
});

// Interceptor de requests (para añadir token JWT)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de responses (para manejar errores globales)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
