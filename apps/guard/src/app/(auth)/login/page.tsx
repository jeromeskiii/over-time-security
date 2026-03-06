"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, Loader2, Phone, Lock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/home";
  const [step, setStep] = useState<"phone" | "otp" | "pin">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 10);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp", phone: digits }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send code");
        return;
      }

      setStep("otp");
      setCountdown(60);
    } catch (err) {
      setError("Failed to send code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-otp", phone: phone.replace(/\D/g, ""), otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      if (data.requiresPin) {
        setStep("pin");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError("Please enter your 4-digit PIN");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify-pin", phone: phone.replace(/\D/g, ""), pin }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid PIN");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request-otp", phone: phone.replace(/\D/g, "") }),
      });
      setCountdown(60);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-brand-accent" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">OTS Guard</h1>
          <p className="text-text-secondary text-sm mt-2">
            {step === "phone" && "Enter your phone number"}
            {step === "otp" && "Enter the code sent to your phone"}
            {step === "pin" && "Enter your PIN"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePhoneSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    setError("");
                  }}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-text-primary text-lg focus:outline-none focus:border-brand-accent/50"
                  placeholder="(555) 555-5555"
                  autoComplete="tel"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 text-white py-4 font-bold text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Code"
                )}
              </button>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleOtpSubmit}
              className="space-y-4"
            >
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      if (value) {
                        const newOtp = otp.slice(0, i) + value + otp.slice(i + 1);
                        setOtp(newOtp.slice(0, 4));
                        setError("");
                        if (i < 3 && value) {
                          const nextInput = e.target.parentElement?.querySelector(
                            `input:nth-child(${i + 2})`
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        const prevInput = e.currentTarget.parentElement?.querySelector(
                          `input:nth-child(${i})`
                        ) as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    className="w-16 h-16 bg-surface border border-white/10 rounded-xl text-center text-2xl font-bold text-text-primary focus:outline-none focus:border-brand-accent/50"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length !== 4}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 text-white py-4 font-bold text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="w-full text-text-secondary hover:text-text-primary text-sm font-semibold disabled:opacity-50"
              >
                {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
              </button>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-text-secondary text-xs"
              >
                Use different number
              </button>
            </motion.form>
          )}

          {step === "pin" && (
            <motion.form
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePinSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setError("");
                  }}
                  className="w-full bg-surface border border-white/10 rounded-xl pl-12 pr-4 py-4 text-text-primary text-lg tracking-[0.5em] text-center focus:outline-none focus:border-brand-accent/50"
                  placeholder="••••"
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || pin.length !== 4}
                className="w-full bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 text-white py-4 font-bold text-base uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-text-secondary text-xs mt-8">
          Contact your supervisor for account assistance
        </p>
      </div>
    </div>
  );
}
