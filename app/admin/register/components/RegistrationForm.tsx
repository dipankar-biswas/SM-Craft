"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("dipankarbiswas.smvisabd@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(result.message);
        // রেজিস্ট্রেশনের পর ভেরিফিকেশন পেজে রিডাইরেক্ট
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 text-white text-center bg-gradient-to-br from-emerald-500 to-teal-600">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-sm mt-2 opacity-90">Register to get started</p>
          </div>

          <form onSubmit={handleRegister} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

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
                placeholder="•••••••• (min. 6 characters)"
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
                  Creating account...
                </span>
              ) : (
                `Register & Verify Email`
              )}
            </button>

            <div className="text-center text-sm">
              Already have an account?
              <Link
                href="/admin/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium ml-2"
              >
                Login
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          We'll send a verification code to your email. Please verify to activate your account.
        </p>
      </div>
    </div>
  );
}