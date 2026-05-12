"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function FormSet() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const data = {
        email: email.trim().toLowerCase(),
      };
      
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setEmailSent(true);
        toast.success(result.message || "Reset link sent to your email!");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 text-white text-center bg-gradient-to-br from-emerald-500 to-teal-600">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
                ✉️
              </div>
              <h1 className="text-3xl font-bold">Check Your Email</h1>
            </div>
            <div className="p-8 space-y-6">
              <div className="text-center">
                <p className="text-slate-600 mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                  {email}
                </p>
                <p className="text-sm text-slate-500 mt-4">
                  The link will expire in 1 hour.
                </p>
              </div>
              <button
                onClick={() => router.push("/admin/login")}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-500 to-teal-600"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-8 text-white text-center bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
              🔐
            </div>
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-sm mt-2 opacity-90">
              Enter your email to receive reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="admin@slotsbytes.com"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white hover:shadow-lg transition-all duration-300 disabled:opacity-70 bg-gradient-to-br from-emerald-500 to-teal-600"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Sending...
                </span>
              ) : (
                `Send Reset Link`
              )}
            </button>

            <div className="text-center">
              <Link href="/admin/login" className="text-sm text-emerald-600 hover:text-emerald-700">
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-8">
          Secure password reset. Link expires in 1 hour.
        </p>
      </div>
    </div>
  );
}