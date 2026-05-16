"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("dipankarbiswas.smvisabd@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: password,
        verifyEmail: false,
        redirect: false,
      });
      
      if (result?.error) {
        // Check if error is about unverified email
        if (result.error.includes("verify") || result.error.includes("verified")) {
          toast.error("Please verify your email first. Check your inbox for OTP.");
          router.push(`/admin/verify?email=${email}`);
        } else {
          setError(result.error);
          toast.error(result.error);
        }
      } else {
        toast.success("Login successful! Welcome back.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // ... same JSX as before but with note about verification
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 text-white text-center bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
              👑
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm mt-2 opacity-90">Sign in to your account</p>
            <p className="text-xs mt-2 opacity-75">Please verify your email before logging in</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <Link 
                href="/admin/forgot-password" 
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white hover:shadow-lg transition-all duration-300 disabled:opacity-70 bg-gradient-to-br from-emerald-500 to-teal-600"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Signing in...
                </span>
              ) : (
                `Sign In`
              )}
            </button>

            <div className="text-center text-sm">
              Don't have an account?
              <Link
                href="/admin/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium ml-2"
              >
                Create Account
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Secure access to your dashboard. Verify your email to activate account.
        </p>
      </div>
    </div>
  );
}