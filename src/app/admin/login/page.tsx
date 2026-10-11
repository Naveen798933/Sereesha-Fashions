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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import {
  verifyAdminCredentials,
  saveClientAdminSession,
  getClientStaffList,
  getClientAdminSession,
} from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [ownerId, setOwnerId] = React.useState("");
  const [showOwnerId, setShowOwnerId] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // If already authenticated, redirect immediately to /admin
  React.useEffect(() => {
    const existing = getClientAdminSession();
    if (existing) {
      router.replace("/admin");
    }
  }, [router]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanOwnerId = ownerId.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your registered Administrator Name");
      return;
    }
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter your 10-digit registered mobile number");
      return;
    }
    if (!cleanOwnerId) {
      setErrorMessage("Please enter your Owner ID / Security Passcode");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Server-side API verification first
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_login",
          name: cleanName,
          phone: cleanPhone,
          ownerId: cleanOwnerId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.admin) {
        saveClientAdminSession(data.admin, rememberDevice);
        showToast.success(`Welcome, ${data.admin.displayName}! Entering Atelier Admin Portal...`);
        router.push("/admin");
        return;
      }

      // 2. Client-side local verification fallback (for offline or local seed)
      const staffList = getClientStaffList();
      const localResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (localResult.success && localResult.admin) {
        saveClientAdminSession(localResult.admin, rememberDevice);
        showToast.success(
          `Welcome, ${localResult.admin.displayName}! Entering Atelier Admin Portal...`
        );
        router.push("/admin");
        return;
      }

      setErrorMessage(
        data.error ||
          localResult.error ||
          "Invalid administrator credentials. Verify your Name, Mobile, and Owner ID."
      );
    } catch {
      // Offline fallback verification
      const staffList = getClientStaffList();
      const fallbackResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (fallbackResult.success && fallbackResult.admin) {
        saveClientAdminSession(fallbackResult.admin, rememberDevice);
        showToast.success(`Welcome, ${fallbackResult.admin.displayName}!`);
        router.push("/admin");
      } else {
        setErrorMessage(
          fallbackResult.error || "Verification failed. Check your admin credentials."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141312] flex items-center justify-center p-4 sm:p-6 selection:bg-[#B79B63] selection:text-[#1C1B19]">
      <div className="bg-[#1C1B19] w-full max-w-md p-8 sm:p-10 border border-[#3E3A34] text-white space-y-6 shadow-2xl rounded-xs">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-[#B79B63]/15 text-[#B79B63] mx-auto rounded-full flex items-center justify-center border border-[#B79B63]/30 shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#B79B63] uppercase font-bold block pt-1">
            Sreesha Elegance Atelier
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
            Atelier Management Login
          </h1>
          <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
            Dedicated administrator portal. Authenticate with your registered Administrator Name,
            Phone, and Owner ID.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-[#24221E]/80 border border-[#3E3A34] p-3.5 rounded-xs flex items-center gap-2.5 text-stone-300 text-xs">
          <ShieldCheck className="h-4 w-4 text-[#B79B63] shrink-0" />
          <span className="text-[11px] leading-relaxed">
            Confidential Portal. Privileged access granted only to verified boutique management.
          </span>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-[#3A1818] border border-[#8C2C2C] text-xs text-[#FFAAAA] rounded-xs animate-in fade-in flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Admin Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Administrator Name <span className="text-[#B79B63]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="e.g. Sreesha"
                className="w-full pl-10 pr-4 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium outline-none focus:border-[#B79B63] transition-colors rounded-xs"
              />
            </div>
          </div>

          {/* Registered Mobile */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Registered Mobile <span className="text-[#B79B63]">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-semibold text-stone-400 border-r border-[#3E3A34] pr-2 pointer-events-none flex items-center gap-1">
                <span>🇮🇳</span>
                <span>+91</span>
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="6281344628"
                className="w-full pl-20 pr-4 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium tracking-wider outline-none focus:border-[#B79B63] transition-colors rounded-xs"
              />
            </div>
          </div>

          {/* Owner ID / Security Passcode */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Owner ID / Security Passcode <span className="text-[#B79B63]">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
              <input
                type={showOwnerId ? "text" : "password"}
                required
                maxLength={10}
                value={ownerId}
                onChange={(e) => {
                  setOwnerId(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Enter security passcode (e.g. 8899)"
                className="w-full pl-10 pr-10 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-mono tracking-widest outline-none focus:border-[#B79B63] transition-colors rounded-xs"
              />
              <button
                type="button"
                onClick={() => setShowOwnerId(!showOwnerId)}
                className="absolute right-3 text-stone-400 hover:text-white p-1 cursor-pointer"
                title={showOwnerId ? "Hide Passcode" : "Show Passcode"}
              >
                {showOwnerId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Device Option */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-stone-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="accent-[#B79B63] cursor-pointer"
              />
              <span>Keep Atelier session active</span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim() || phone.length < 10 || !ownerId.trim()}
            className="w-full py-3 bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold text-xs uppercase tracking-widest transition-all duration-300 mt-2"
          >
            {isSubmitting ? "Authenticating Authority..." : "Unlock Atelier Management Suite"}
          </Button>

          {/* Return to Customer Boutique Link */}
          <div className="pt-3 border-t border-[#3E3A34] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-[#B79B63] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Sreesha Elegance Store</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
