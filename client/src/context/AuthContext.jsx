import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile on mount & when location changes
  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get("/user/me");
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If a token was provided in the query string from Google OAuth redirect, handle cleanup
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("userInfo", JSON.stringify({ token: tokenFromUrl }));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchUser();
  }, [location.pathname]);

  // Email/password login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/login", { email, password });
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/register", { name, email, password });
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || error.message || "Registration failed";
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/user/logout");
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const loginWithGoogle = () => {
    const baseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "") || "https://quickstore-clone-six.vercel.app";

    window.location.href = `${baseURL}/api/user/auth/google`;
  };

  const isAdmin = Boolean(user && user.role === "admin");

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        register,
        logout,
        loginWithGoogle,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
