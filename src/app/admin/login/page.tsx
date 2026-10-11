"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { saveClientAdminSession, getClientAdminSession } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminId, setAdminId] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [securityCode, setSecurityCode] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);
  const [showSecurityCode, setShowSecurityCode] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isLocked, setIsLocked] = React.useState(false);
  const [lockoutRemaining, setLockoutRemaining] = React.useState<number | null>(null);

  // If already authenticated via active session, redirect to /admin
  React.useEffect(() => {
    async function checkExisting() {
      try {
        const res = await fetch("/api/admin/auth/verify");
        const data = await res.json();
        if (data.authenticated) {
          router.replace("/admin");
          return;
        }
      } catch {}

      const clientSession = getClientAdminSession();
      if (clientSession) {
        router.replace("/admin");
      }
    }
    checkExisting();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAdminId = adminId.trim();
    const cleanPassword = password;
    const cleanSecurityCode = securityCode.trim();

    // Client-side validations
    if (!cleanAdminId) {
      setErrorMessage("Please enter your Admin ID or username.");
      return;
    }

    if (!cleanPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (!cleanSecurityCode) {
      setErrorMessage("Please enter your security code.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: cleanAdminId,
          password: cleanPassword,
          securityCode: cleanSecurityCode,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save client session fallback
        saveClientAdminSession({
          id: data.admin?.id || cleanAdminId,
          name: cleanAdminId.toLowerCase(),
          displayName: data.admin?.displayName || "Sreesha",
          phone: "6281344628",
          ownerId: cleanSecurityCode,
          role: data.admin?.role || "Super Admin / Owner",
          status: "Active",
          isOwner: true,
          createdAt: new Date().toISOString(),
        });

        showToast.success("Three-Level Verification Passed! Welcome, Administrator.");
        router.push("/admin");
        return;
      }

      if (res.status === 429) {
        setIsLocked(true);
        setLockoutRemaining(data.remainingSeconds || 900);
        setErrorMessage(
          data.error ||
            "Too many failed login attempts. Account temporarily locked for security. Please try again later."
        );
      } else {
        setErrorMessage(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setErrorMessage("Network error during verification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#141312] text-[#FAF7F2] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Atelier Background Aura */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#B79B63] rounded-full blur-[140px] opacity-25" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1B19] border border-[#B79B63]/40 rounded-full text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold mb-2 shadow-xs">
            <ShieldCheck className="h-3 w-3 text-[#B79B63]" />
            Three-Level Security Clearance
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal tracking-wide">
            Sreesha Elegance
          </h1>
          <p className="text-xs text-[#A69E92] uppercase tracking-[0.18em]">
            Atelier Administration Portal
          </p>
        </div>

        {/* Security Form Card */}
        <div className="bg-[#1C1B19]/90 border border-[#B79B63]/30 p-6 sm:p-8 rounded-xs shadow-2xl backdrop-blur-md space-y-6">
          <div className="border-b border-[#2E2C28] pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#FAF7F2]">
              Administrator Authentication
            </h2>
            <p className="text-[11px] text-[#A69E92] mt-0.5">
              Requires valid Admin ID, master password, and authorized security code.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 bg-[#2A1616] border border-[#7D2929] rounded-2xs text-[#F2B8B8] text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              {isLocked ? (
                <Clock className="h-4 w-4 text-[#F28B82] shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="h-4 w-4 text-[#F28B82] shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block">Authentication Denied</span>
                <p className="text-[11px] leading-relaxed text-[#F2B8B8]/90">
                  {errorMessage}
                  {isLocked && lockoutRemaining
                    ? ` (${Math.ceil(lockoutRemaining / 60)} min cooldown)`
                    : ""}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            {/* LEVEL 1: Admin ID / Username */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-id"
                className="block text-xs uppercase tracking-wider text-[#D8C7A5] font-medium"
              >
                1. Admin ID / Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C867D]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="admin-id"
                  name="adminId"
                  type="text"
                  autoComplete="username"
                  required
                  disabled={isSubmitting || isLocked}
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter administrator ID"
                  className="w-full h-11 pl-9 pr-3 bg-[#141312] border border-[#2E2C28] text-xs text-[#FAF7F2] placeholder-[#5C564E] rounded-2xs focus:border-[#B79B63] focus:ring-1 focus:ring-[#B79B63] focus:outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* LEVEL 2: Password with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs uppercase tracking-wider text-[#D8C7A5] font-medium"
              >
                2. Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C867D]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting || isLocked}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter master password"
                  className="w-full h-11 pl-9 pr-10 bg-[#141312] border border-[#2E2C28] text-xs text-[#FAF7F2] placeholder-[#5C564E] rounded-2xs focus:border-[#B79B63] focus:ring-1 focus:ring-[#B79B63] focus:outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C867D] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* LEVEL 3: Security Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-security-code"
                  className="block text-xs uppercase tracking-wider text-[#D8C7A5] font-medium"
                >
                  3. Security Code *
                </label>
                <span className="text-[10px] text-[#8C867D]">Secret Passcode</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C867D]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="admin-security-code"
                  name="securityCode"
                  type={showSecurityCode ? "text" : "password"}
                  autoComplete="off"
                  required
                  disabled={isSubmitting || isLocked}
                  value={securityCode}
                  onChange={(e) => {
                    setSecurityCode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter security passcode"
                  className="w-full h-11 pl-9 pr-10 bg-[#141312] border border-[#2E2C28] text-xs text-[#FAF7F2] placeholder-[#5C564E] rounded-2xs focus:border-[#B79B63] focus:ring-1 focus:ring-[#B79B63] focus:outline-hidden transition-colors tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecurityCode(!showSecurityCode)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C867D] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label={showSecurityCode ? "Hide security code" : "Show security code"}
                >
                  {showSecurityCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-[#7A746B] italic">
                Confidential server-verified secret known strictly to authorized administrators.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting || isLocked}
                className="w-full h-11 text-xs font-semibold uppercase tracking-[0.16em] bg-[#B79B63] hover:bg-[#A3864F] text-[#1C1B19] flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1C1B19] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying All 3 Levels...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Temporarily Locked</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Security Assurance Badge */}
          <div className="pt-4 border-t border-[#2E2C28] text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8C867D]">
              <Sparkles className="h-3 w-3 text-[#B79B63]" />
              <span>Protected by Rate-Limiting &amp; Encrypted Sessions</span>
            </div>
            <p className="text-[9px] text-[#5C564E]">
              All unauthorized access attempts are logged and reported to the Atelier Security
              Council.
            </p>
          </div>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-[#A69E92] hover:text-[#B79B63] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
