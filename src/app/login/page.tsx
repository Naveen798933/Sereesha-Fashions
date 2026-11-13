"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, User, KeyRound, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { saveClientAdminSession, verifyAdminCredentials } from "@/lib/adminAuth";
import { showToast } from "@/components/ui/Toast";

const LOCAL_STORAGE_KEY = "sreesha_auth_customer";
const DEVICE_KNOWN_KEY = "sreesha_device_known";

type AuthMode = "login" | "signup" | "admin";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const explicitMode = searchParams.get("mode");
  const tabParam = searchParams.get("tab") || searchParams.get("role");

  const { user, loginWithPhone, signupWithPhone, isLoading } = useAuth();

  // Mode: "signup" | "login" | "admin"
  const [mode, setMode] = React.useState<AuthMode>("login");
  const [isNewDevice, setIsNewDevice] = React.useState<boolean>(false);
  const [hasCheckedDevice, setHasCheckedDevice] = React.useState<boolean>(false);

  // Customer form inputs
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Admin form inputs
  const [adminName, setAdminName] = React.useState("");
  const [adminPhone, setAdminPhone] = React.useState("");
  const [adminOwnerId, setAdminOwnerId] = React.useState("");
  const [showAdminPin, setShowAdminPin] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Detect mode & recognized device status on mount or when searchParams change
  React.useEffect(() => {
    if (tabParam === "admin" || explicitMode === "admin") {
      setMode("admin");
      setHasCheckedDevice(true);
      return;
    }

    if (typeof window === "undefined") return;

    const storedCustomer = localStorage.getItem(LOCAL_STORAGE_KEY);
    const knownDevice = localStorage.getItem(DEVICE_KNOWN_KEY);

    const isDeviceUnrecognized = !storedCustomer && !knownDevice;
    setIsNewDevice(isDeviceUnrecognized);

    if (explicitMode === "login") {
      setMode("login");
    } else if (explicitMode === "signup") {
      setMode("signup");
    } else if (isDeviceUnrecognized) {
      setMode("signup");
    } else {
      setMode("login");
    }

    setHasCheckedDevice(true);
  }, [explicitMode, tabParam]);

  // If already authenticated as customer, redirect to destination (unless admin mode is active)
  React.useEffect(() => {
    if (user && !isLoading && mode !== "admin") {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl, mode]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleAdminPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setAdminPhone(val);
    if (errorMessage) setErrorMessage(null);
  };

  // Customer Form Submission (Sign In or Sign Up)
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number");
      return;
    }

    if (mode === "signup") {
      const cleanName = fullName.trim();
      if (!cleanName) {
        setErrorMessage("Please enter your full name to complete registration");
        return;
      }

      setIsSubmitting(true);
      const res = await signupWithPhone(cleanName, cleanPhone);
      setIsSubmitting(false);

      if (res.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem(DEVICE_KNOWN_KEY, "true");
        }
        router.push(redirectUrl);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } else {
      setIsSubmitting(true);
      const res = await loginWithPhone(cleanPhone);
      setIsSubmitting(false);

      if (res.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem(DEVICE_KNOWN_KEY, "true");
        }
        router.push(redirectUrl);
      } else if (res.notFound) {
        setMode("signup");
        setErrorMessage(
          "We could not find an existing account with this number. Please provide your full name to register instantly!"
        );
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  // Atelier Admin Login Submission
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = adminName.trim();
    const cleanPhone = adminPhone.replace(/\D/g, "");
    const cleanPin = adminOwnerId.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your registered administrator name.");
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    if (!cleanPin) {
      setErrorMessage("Please enter your Owner ID / Security Passcode.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_login",
          name: cleanName,
          phone: cleanPhone,
          ownerId: cleanPin,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const adminSession = {
          id: data.admin?.id || "admin_owner_primary",
          name: cleanName.toLowerCase(),
          displayName: data.admin?.displayName || cleanName,
          phone: cleanPhone,
          ownerId: cleanPin,
          role: data.admin?.role || "Super Admin / Owner",
          status: "Active" as const,
          isOwner: Boolean(data.admin?.isOwner ?? cleanPin === "8899"),
          createdAt: data.admin?.createdAt || new Date().toISOString(),
        };

        saveClientAdminSession(adminSession);
        showToast.success(
          `Welcome back, ${adminSession.displayName}! Entering Atelier Admin Portal...`
        );
        router.push("/admin");
        return;
      }

      // Client-side fallback check
      const localResult = verifyAdminCredentials(cleanName, cleanPhone, cleanPin);
      if (localResult.success && localResult.admin) {
        saveClientAdminSession(localResult.admin);
        showToast.success(
          `Welcome back, ${localResult.admin.displayName}! Entering Atelier Admin Portal...`
        );
        router.push("/admin");
        return;
      }

      setErrorMessage(
        data.error || "Invalid administrator credentials. Please check Name, Mobile, and Owner ID."
      );
    } catch {
      const localResult = verifyAdminCredentials(cleanName, cleanPhone, cleanPin);
      if (localResult.success && localResult.admin) {
        saveClientAdminSession(localResult.admin);
        showToast.success(
          `Welcome back, ${localResult.admin.displayName}! Entering Atelier Admin Portal...`
        );
        router.push("/admin");
        return;
      }
      setErrorMessage(
        "Invalid administrator credentials. Please check Name, Mobile, and Owner ID."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = mode === "admin";

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div
        className={cn(
          "w-full max-w-md border transition-all duration-300 overflow-hidden shadow-sm",
          isAdmin
            ? "bg-[#1C1B19] border-[#3E3A34] text-[#FAF7F2] shadow-2xl"
            : "bg-white border-[#E8E2D8] text-[#1C1B19]"
        )}
      >
        {/* Device Status Ribbon if New Device (Customer mode) */}
        {!isAdmin && hasCheckedDevice && isNewDevice && (
          <div className="bg-[#FAF4E6] border-b border-[#EBD7AF] px-4 py-2 flex items-center justify-between text-[11px] text-[#8C6D28]">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#B79B63] shrink-0" />
              <span>New Device Detected • Welcome to Sreesha Elegance</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold bg-[#B79B63]/20 px-1.5 py-0.5 rounded-2xs text-[#7A5B1A]">
              Client Access
            </span>
          </div>
        )}

        {/* 3-Way Segmented Tabs (Patron Sign In | New Client | Atelier Admin) */}
        <div
          className={cn(
            "grid grid-cols-3 border-b text-center text-[11px] font-semibold uppercase tracking-wider",
            isAdmin ? "bg-[#151412] border-[#2E2C28]" : "bg-[#FAF7F2]/70 border-[#E8E2D8]"
          )}
        >
          {/* Tab 1: Patron Sign In */}
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center cursor-pointer truncate",
              mode === "login"
                ? "border-[#B79B63] bg-white text-[#1C1B19] font-bold"
                : isAdmin
                  ? "border-transparent text-[#8C867D] hover:text-white"
                  : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>Patron Sign In</span>
          </button>

          {/* Tab 2: New Client */}
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center cursor-pointer truncate",
              mode === "signup"
                ? "border-[#B79B63] bg-white text-[#1C1B19] font-bold"
                : isAdmin
                  ? "border-transparent text-[#8C867D] hover:text-white"
                  : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>New Client</span>
          </button>

          {/* Tab 3: Atelier Admin */}
          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center cursor-pointer flex items-center justify-center gap-1 truncate",
              mode === "admin"
                ? "border-[#B79B63] bg-[#24221F] text-[#FAF7F2] font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#B79B63]"
            )}
          >
            <KeyRound className="h-3 w-3 text-[#B79B63]" />
            <span>Atelier Admin</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            {isAdmin ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B79B63]/15 border border-[#B79B63]/40 text-[#B79B63] text-[10px] uppercase tracking-[0.2em] font-bold">
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Atelier Management Suite</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-white">Atelier Admin Access</h1>
                <p className="text-xs text-[#A69E92] max-w-xs mx-auto leading-relaxed">
                  Enter registered administrator credentials to access inventory, orders, and
                  governance.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F7F3EB] border border-[#D8C7A5] text-[#B79B63] text-[10px] uppercase tracking-[0.2em] font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {mode === "signup" ? "New Client Registration" : "Instant Atelier Access"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#1C1B19]">
                  {mode === "signup" ? "Create Your Account" : "Welcome Back"}
                </h1>
                <p className="text-xs text-[#5A5650] max-w-xs mx-auto leading-relaxed">
                  {mode === "signup"
                    ? "Join our circle. Simply enter your Name and Mobile Number — no OTPs or passwords required."
                    : "Enter your registered mobile number for instant patron recognition."}
                </p>
              </>
            )}
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div
              className={cn(
                "p-3 text-xs rounded-xs animate-in fade-in",
                isAdmin
                  ? "bg-[#3A1818] border border-[#6B2A2A] text-[#FCA5A5]"
                  : "bg-[#FAF0F0] border border-[#E8B4B4] text-[#992222]"
              )}
            >
              {errorMessage}
            </div>
          )}

          {/* Form Content: Admin vs Customer */}
          {isAdmin ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Administrator Name */}
              <div>
                <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 uppercase tracking-wider">
                  Administrator Full Name <span className="text-[#B79B63]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C867D]" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Administrator name"
                    className="w-full pl-10 pr-4 py-3 bg-[#24221F] border border-[#3E3A34] text-sm text-white font-medium outline-none focus:border-[#B79B63] transition-colors"
                  />
                </div>
              </div>

              {/* Registered Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 uppercase tracking-wider">
                  Registered 10-Digit Mobile <span className="text-[#B79B63]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-[#8C867D] border-r border-[#3E3A34] pr-2 pointer-events-none flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    value={adminPhone}
                    onChange={handleAdminPhoneChange}
                    placeholder="10-digit registered mobile"
                    className="w-full pl-20 pr-4 py-3 bg-[#24221F] border border-[#3E3A34] text-sm text-white font-medium tracking-wider outline-none focus:border-[#B79B63] transition-colors"
                  />
                </div>
              </div>

              {/* Owner ID / Security Passcode */}
              <div>
                <label className="block text-xs font-semibold text-[#D8C7A5] mb-1.5 uppercase tracking-wider">
                  Owner ID / Security Passcode <span className="text-[#B79B63]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C867D]" />
                  <input
                    type={showAdminPin ? "text" : "password"}
                    required
                    value={adminOwnerId}
                    onChange={(e) => {
                      setAdminOwnerId(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Enter security passcode"
                    className="w-full pl-10 pr-11 py-3 bg-[#24221F] border border-[#3E3A34] text-sm text-white font-mono tracking-wider outline-none focus:border-[#B79B63] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C867D] hover:text-white transition-colors p-1"
                    aria-label={showAdminPin ? "Hide passcode" : "Show passcode"}
                  >
                    {showAdminPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Demo Fill Helper Pill */}
              <button
                type="button"
                onClick={() => {
                  setAdminName("sreesha");
                  setAdminPhone("6281344628");
                  setAdminOwnerId("8899");
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full py-2 px-3 text-[11px] bg-[#24221F] border border-[#3E3A34] hover:border-[#B79B63] text-[#D8C7A5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-2xs"
              >
                <Sparkles className="h-3 w-3 text-[#B79B63]" />
                <span>Demo Fill: Registered Owner (Sreesha • 8899)</span>
              </button>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting || !adminName || adminPhone.length < 10 || !adminOwnerId}
                className="w-full text-xs uppercase tracking-widest py-3.5 mt-2 bg-[#B79B63] hover:bg-[#A3874F] text-[#1C1B19] font-bold transition-all duration-300"
              >
                {isSubmitting ? "Verifying Credentials..." : "Authorize & Enter Atelier"}
              </Button>

              {/* Dedicated Standalone Portal Link */}
              <div className="pt-3 border-t border-[#2E2C28] text-center">
                <Link
                  href="/admin/login"
                  className="text-[11px] text-[#A69E92] hover:text-[#B79B63] inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Open Dedicated Full-Screen Admin Portal</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {/* Full Name Field (Sign Up Mode) */}
              {mode === "signup" && (
                <div className="animate-in fade-in duration-200">
                  <label className="block text-xs font-semibold text-[#1C1B19] mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-[#B79B63]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C867D]" />
                    <input
                      type="text"
                      required
                      autoFocus
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="e.g. Sreesha Reddy"
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] font-medium outline-none focus:border-[#B79B63] focus:bg-white transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-[#8C867D] mt-1">
                    Used for personalized greetings and boutique orders
                  </p>
                </div>
              )}

              {/* Mobile Number Field */}
              <div>
                <label className="block text-xs font-semibold text-[#1C1B19] mb-1.5 uppercase tracking-wider">
                  Mobile Number <span className="text-[#B79B63]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-[#8C867D] border-r border-[#E8E2D8] pr-2 pointer-events-none flex items-center gap-1">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    autoFocus={mode === "login"}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98490 12345"
                    className="w-full pl-20 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] font-medium tracking-wider outline-none focus:border-[#B79B63] focus:bg-white transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#8C867D] mt-1">10-digit Indian mobile number</p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={
                  isSubmitting || phone.length < 10 || (mode === "signup" && !fullName.trim())
                }
                className="w-full text-xs uppercase tracking-widest py-3.5 mt-2 bg-[#1C1B19] hover:bg-[#B79B63] text-white transition-all duration-300"
              >
                {isSubmitting
                  ? mode === "signup"
                    ? "Creating Patron Account..."
                    : "Recognizing Patron..."
                  : mode === "signup"
                    ? "Register & Enter Boutique"
                    : "Sign In Instantly"}
              </Button>

              {/* Toggle Helper Under Button */}
              <div className="text-center pt-2">
                {mode === "signup" ? (
                  <p className="text-xs text-[#5A5650]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMessage(null);
                      }}
                      className="text-[#B79B63] font-semibold hover:underline cursor-pointer"
                    >
                      Sign in with your phone
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#5A5650]">
                    New client on this device?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setErrorMessage(null);
                      }}
                      className="text-[#B79B63] font-semibold hover:underline cursor-pointer"
                    >
                      Register with Name &amp; Phone
                    </button>
                  </p>
                )}
              </div>

              {/* Guest Browsing Link */}
              <div className="pt-3 border-t border-[#E8E2D8] text-center">
                <Link
                  href={redirectUrl}
                  className="text-[11px] text-[#8C867D] hover:text-[#1C1B19] inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Browse Boutique as Guest</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Security & Convenience Assurance */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-[#2D6A4F] bg-[#2D6A4F]/8 p-2.5 border border-[#2D6A4F]/20">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Instant Recognition • No OTP or Password Friction</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer Gateway Switcher */}
        {!isAdmin && (
          <div className="bg-[#FAF7F2] border-t border-[#E8E2D8] px-6 py-3 flex items-center justify-between text-[11px] text-[#8C867D]">
            <span>Atelier Management Staff?</span>
            <button
              type="button"
              onClick={() => {
                setMode("admin");
                setErrorMessage(null);
              }}
              className="text-[#B79B63] hover:text-[#1C1B19] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <KeyRound className="h-3 w-3" />
              <span>Admin Panel Access</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] bg-[#FAF7F2] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthForm />
    </React.Suspense>
  );
}
