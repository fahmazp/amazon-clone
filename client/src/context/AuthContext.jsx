import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user on mount
  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get("/user/me", { withCredentials: true });
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // JWT token from Google login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("userInfo", JSON.stringify({ token: tokenFromUrl }));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokenFromUrl}`;
      window.history.replaceState({}, document.title, "/");
    }

    fetchUser();
  }, [location]);

  // Email/password login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/user/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.get("/user/logout", { withCredentials: true });
    } catch (err) {
      console.error("Logout request failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/api/user/auth/google";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
