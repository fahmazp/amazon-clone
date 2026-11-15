import axios from "axios";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : import.meta.env.VITE_API_URL || "https://quickstore-clone-six.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // If a token is in localStorage for legacy / fallback, forward it; otherwise cookies are automatically passed
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
