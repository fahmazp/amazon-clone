import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : import.meta.env.VITE_API_URL || "https://your-backend-url.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
