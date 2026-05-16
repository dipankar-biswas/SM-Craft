"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

function VerifyEmailContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link");
      router.push("/admin/register");
      return;
    }

    setCurrentToken(token);

    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [token, router]);

  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    if (!currentToken) {
      toast.error("Invalid verification session");
      router.push("/admin/register");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: currentToken,
          otp: otp,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error);
        toast.error(result.error);

        if (result.error.includes("expired")) {
          setCanResend(true);
        }
      } else {
        toast.success(result.message);

        // ভেরিফিকেশন সফল - এখন লগইন করুন
        const signInResult = await signIn("credentials", {
          email: result.email,
          verifyEmail: true, // ভেরিফিকেশন ফ্লোতে লগইন হচ্ছে, তাই এই ফ্ল্যাগ পাঠাচ্ছি
          redirect: false, //手动控制 redirect
          callbackUrl: "/dashboard",
        });

        if (signInResult?.error) {
          console.error("Sign in error:", signInResult.error);
          toast.error("Auto-login failed. Please login manually.");
          router.push("/admin/login");
        } else {
          // সফলভাবে লগইন completed
          router.push("/dashboard");
        }
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
    if (!canResend) {
      toast.error(
        `Please wait ${formatTime(timer)} before requesting another code`,
      );
      return;
    }

    try {
      setLoading(true);

      console.log("Resending OTP for token:", currentToken);

      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: currentToken,
        }),
      });

      const result = await response.json();
      console.log("Resend response:", result);

      if (!response.ok) {
        toast.error(result.error);
      } else {
        toast.success(result.message);

        // নতুন টোকেন আপডেট করুন
        if (result.newToken) {
          setCurrentToken(result.newToken);
          // URL আপডেট করুন (optional)
          window.history.replaceState(
            {},
            "",
            `/admin/verify-email?token=${encodeURIComponent(result.newToken)}`,
          );
        }

        // টাইমার রিসেট করুন
        setTimer(600);
        setCanResend(false);
        setOtp("");
        setError("");

        // টাইমার স্টার্ট করুন
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setCanResend(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <form onSubmit={handleVerifyOTP} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                placeholder="000000"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-slate-400 mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <div className="text-center">
              {timer > 0 ? (
                <p className="text-sm text-slate-500">
                  Code expires in:{" "}
                  <span className="font-semibold text-red-600">
                    {formatTime(timer)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">
                  Code expired! Please request a new one.
                </p>
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
                disabled={loading}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {loading ? "Sending..." : "Resend Verification Code"}
              </button>
              {!canResend && timer > 0 && (
                <p className="text-xs text-slate-400 mt-1">
                  You can request a new code after {formatTime(timer)}
                </p>
              )}
            </div>

            <div className="text-center">
              <Link
                href="/admin/register"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to Registration
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>✓ Check your spam folder if you don't see the email</p>
          <p>✓ The verification code expires in 10 minutes</p>
          <p>✓ Each new code invalidates the previous one</p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
