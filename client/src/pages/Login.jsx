import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import QuickstoreLogo from '../assets/images/storelogo.png';
import GoogleLogo from '../assets/images/google.svg';

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
          <h1 className="text-xl font-semibold mb-1.5">Sign in</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-1">
            <div>
              <label className="text-sm font-medium">Email or mobile phone number</label>
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
                value={formData.password}
                onChange={handleChange}
                className="mt-1 border-gray-400"
                required
              />
              <Link
                to="#"
                className="text-xs text-blue-700 hover:underline mt-1 inline-block"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium mt-3"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center mt-3 space-x-2">
            <Checkbox id="keep-signed-in" />
            <label htmlFor="keep-signed-in" className="text-sm text-gray-700 cursor-pointer">
              Keep me signed in
            </label>
          </div>

          <p className="text-xs text-gray-600 mt-4">
            By continuing, you agree to Quickstore’s{" "}
            <span className="text-blue-700 hover:underline cursor-pointer">Conditions of Use</span>{" "}
            and{" "}
            <span className="text-blue-700 hover:underline cursor-pointer">Privacy Notice</span>.
          </p>

          <div className="h-px bg-gray-300 my-4"></div>

          <div className="text-sm text-center">
            <p>New to Quickstore?</p>
            <Link
              to="/signup"
              className="block bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md py-2 mt-2 text-gray-800 font-medium"
            >
              Create your Quickstore account
            </Link>
          </div>

          <div className="flex items-center my-2">
            <div className="grow h-px bg-gray-300"></div>
            <span className="shrink text-sm text-gray-500 px-3">or</span>
            <div className="grow h-px bg-gray-300"></div>
          </div>

          <Button
            variant="outline"
            onClick={loginWithGoogle}
            className="w-full ring-1 ring-gray-300 flex items-center justify-center"
          >
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
