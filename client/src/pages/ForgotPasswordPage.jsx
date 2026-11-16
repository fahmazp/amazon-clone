import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import QuickstoreLogo from "../assets/images/storelogo.png";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/forgot-password", { email });
      setSubmitted(true);
      if (data?.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
      toast.success("Password reset instructions dispatched!");
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error?.message || "Failed to process request";
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
              {!submitted ? (
                <>
                  <h1 className="text-xl font-semibold mb-1 text-gray-900">
                    Password assistance
                  </h1>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    Enter the email address associated with your QuickStore account to receive a password reset link.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Email</label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 border-gray-400"
                        required
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium mt-1 disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Continue"}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={26} />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    Check your email
                  </h2>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                    If an account with <strong>{email}</strong> exists, we've sent instructions to reset your password. The link is valid for 30 minutes.
                  </p>

                  {/* Dev Helper for local testing */}
                  {devResetUrl && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded text-left mb-4">
                      <p className="text-[11px] font-semibold text-amber-800 mb-1">
                        🛠️ Dev Mode Simulator:
                      </p>
                      <a
                        href={devResetUrl}
                        className="text-xs text-blue-600 hover:underline break-all block"
                      >
                        Click here to reset password directly
                      </a>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitted(false);
                      setDevResetUrl(null);
                    }}
                    className="w-full text-xs font-medium"
                  >
                    Resend link or try another email
                  </Button>
                </div>
              )}

              <div className="h-px bg-gray-200 my-4"></div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:underline font-medium"
                >
                  <ArrowLeft size={14} /> Back to Sign in
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
