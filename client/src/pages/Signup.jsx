import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import QuickstoreLogo from '../assets/images/storelogo.png';
import GoogleLogo from '../assets/images/google.svg';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/user/register", formData);
      console.log("Signup Success:", data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white mt-2">
      <img
        src={QuickstoreLogo}
        alt="Logo"
        className="w-28 mb-3"
      />

      <Card className="w-[350px] border border-gray-300 rounded-md shadow-sm">
        <CardContent className="px-4">
          <h1 className="text-xl font-semibold mb-1.5">Create Account</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <div>
              <label className="text-sm font-medium">Your name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 border-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 border-gray-400"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Passwords must be at least 6 characters.
              </p>
            </div>

            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium mt-3"
            >
              Continue
            </Button>
          </form>

          <p className="text-xs text-gray-600 mt-4">
            By creating an account, you agree to Quickstore’s{" "}
            <span className="text-blue-700 hover:underline cursor-pointer">
              Conditions of Use
            </span>{" "}
            and{" "}
            <span className="text-blue-700 hover:underline cursor-pointer">
              Privacy Notice
            </span>
            .
          </p>

          <div className="h-px bg-gray-300 my-4"></div>

          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 hover:underline">
              Sign in
            </Link>
          </p>

            <div className="flex items-center my-2">
              <div className="grow h-px bg-gray-300"></div>
              <span className="shrink text-sm text-gray-500 px-3">or</span>
              <div className="grow h-px bg-gray-300"></div>
            </div>

          <Button variant="outline" onClick={loginWithGoogle} className="w-full ring-1 ring-gray-300">
          <img src={GoogleLogo} className="w-4 h-4 mr-1" />
          Sign in with Google
          </Button>
        </CardContent>
      </Card>

      <footer className="text-xs text-gray-500 mt-6 text-center">
        © 2025 Quickstore Clone | Built by Fahmaz Ashraf
      </footer>
    </div>
  );
}
