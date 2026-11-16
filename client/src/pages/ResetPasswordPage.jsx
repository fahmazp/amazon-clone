import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import QuickstoreLogo from "../assets/images/storelogo.png";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(`/user/reset-password/${token}`, { password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error?.message || "Password reset failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-zinc-50 pt-2">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-100 to-pink-100 animate-gradientSlow opacity-100" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-40 animate-floatSlow" />
      <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-pink-300 rounded-full blur-3xl opacity-35 animate-floatReverse" />
      <div className="absolute bottom-[-10rem] left-1/3 w-[30rem] h-[30rem] bg-emerald-200 rounded-full blur-3xl opacity-30 animate-floatSlow" />

      <div className="relative z-10 flex flex-col items-center">
        <Link to="/">
          <img src={QuickstoreLogo} alt="Logo" className="w-28 mb-3" />
        </Link>

        <div className="backdrop-blur-xl bg-white/90 rounded-md shadow-xl duration-300 hover:shadow-2xl">
          <Card className="w-[90vw] sm:w-[360px] border border-gray-300 rounded-md shadow-sm">
            <CardContent className="px-5 py-6">
              {!success ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="text-yellow-500 w-5 h-5" />
                    <h1 className="text-xl font-semibold text-gray-900">
                      Create new password
                    </h1>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    We'll ask for this password whenever you sign in.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        New password
                      </label>
                      <div className="relative mt-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="At least 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10 border-gray-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Passwords must be at least 6 characters.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-700">
                        Re-enter password
                      </label>
                      <div className="relative mt-1">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pr-10 border-gray-400"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium mt-2 disabled:opacity-60"
                    >
                      {loading ? "Updating password..." : "Save changes and sign in"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={26} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    Password Reset!
                  </h2>
                  <p className="text-xs text-gray-600 mb-4">
                    Your password has been changed. Redirecting to sign in...
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
                  >
                    Go to Sign in now
                  </Button>
                </div>
              )}

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="text-center">
                <Link to="/login" className="text-xs text-blue-700 hover:underline font-medium">
                  Back to Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="text-xs text-gray-500 mt-6 text-center">
          © {new Date().getFullYear()} Quickstore Shop | Built by Fahmaz Ashraf
        </footer>
      </div>
    </div>
  );
}
