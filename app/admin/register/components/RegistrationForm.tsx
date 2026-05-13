"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("register"); // register or verify
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  // Countdown timer for OTP expiry
  const startTimer = (duration = 600) => {
    setTimer(duration);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

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
        setRegisteredEmail(result.email);
        setStep("verify");
        startTimer(600); // 10 minutes timer
        toast.success(result.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: registeredEmail,
          otp: otp,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success(result.message);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: registeredEmail }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        startTimer(600); // Reset timer
        setOtp("");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8 text-white text-center bg-gradient-to-br from-emerald-500 to-teal-600">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
                ✉️
              </div>
              <h1 className="text-3xl font-bold">Verify Your Email</h1>
              <p className="text-sm mt-2 opacity-90">
                We've sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold mt-1">{registeredEmail}</p>
            </div>

            <form onSubmit={handleVerifyOTP} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  placeholder="000000"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-sm text-slate-500">
                    Code expires in: <span className="font-semibold text-red-600">{formatTime(timer)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-red-600">Code expired!</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white hover:shadow-lg transition-all duration-300 disabled:opacity-70 bg-gradient-to-br from-emerald-500 to-teal-600"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Verifying...
                  </span>
                ) : (
                  `Verify & Activate Account`
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || timer > 0}
                  className="text-sm text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {timer > 0 ? `Resend code in ${formatTime(timer)}` : "Resend Verification Code"}
                </button>
              </div>

              <div className="text-center">
                <Link href="/admin/login" className="text-sm text-slate-500 hover:text-slate-700">
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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