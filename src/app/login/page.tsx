"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Sparkle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import {
  verifyAdminCredentials,
  saveClientAdminSession,
  getClientStaffList,
} from "@/lib/adminAuth";

const LOCAL_STORAGE_KEY = "sreesha_auth_customer";
const DEVICE_KNOWN_KEY = "sreesha_device_known";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const explicitMode = searchParams.get("mode");
  const tabParam = searchParams.get("tab") || searchParams.get("role");

  const { user, loginWithPhone, signupWithPhone, isLoading } = useAuth();

  // Mode: "signup" | "login" | "admin"
  const [mode, setMode] = React.useState<"signup" | "login" | "admin">("login");
  const [isNewDevice, setIsNewDevice] = React.useState<boolean>(false);
  const [hasCheckedDevice, setHasCheckedDevice] = React.useState<boolean>(false);

  // Customer form inputs
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Admin Portal form inputs
  const [adminName, setAdminName] = React.useState("");
  const [adminPhone, setAdminPhone] = React.useState("");
  const [adminOwnerId, setAdminOwnerId] = React.useState("");
  const [showOwnerId, setShowOwnerId] = React.useState(false);
  const [isAdminSubmitting, setIsAdminSubmitting] = React.useState(false);
  const [adminErrorMessage, setAdminErrorMessage] = React.useState<string | null>(null);

  // Detect tab / mode on mount
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (tabParam === "admin") {
      setMode("admin");
      setHasCheckedDevice(true);
      return;
    }

    const storedCustomer = localStorage.getItem(LOCAL_STORAGE_KEY);
    const knownDevice = localStorage.getItem(DEVICE_KNOWN_KEY);

    const isDeviceUnrecognized = !storedCustomer && !knownDevice;
    setIsNewDevice(isDeviceUnrecognized);

    if (explicitMode === "login") {
      setMode("login");
    } else if (explicitMode === "signup") {
      setMode("signup");
    } else if (explicitMode === "admin") {
      setMode("admin");
    } else if (isDeviceUnrecognized) {
      setMode("signup");
    } else {
      setMode("login");
    }

    setHasCheckedDevice(true);
  }, [explicitMode, tabParam]);

  // If already authenticated as customer (and NOT on admin tab), redirect to home page
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
    if (adminErrorMessage) setAdminErrorMessage(null);
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

  // Admin Form Submission (Owner / Staff Portal)
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminErrorMessage(null);

    const cleanName = adminName.trim();
    const cleanPhone = adminPhone.replace(/\D/g, "");
    const cleanOwnerId = adminOwnerId.trim();

    if (!cleanName) {
      setAdminErrorMessage("Please enter your administrator Name");
      return;
    }
    if (cleanPhone.length !== 10) {
      setAdminErrorMessage("Please enter your 10-digit registered mobile number");
      return;
    }
    if (!cleanOwnerId) {
      setAdminErrorMessage("Please enter your Owner ID / Security Passcode");
      return;
    }

    setIsAdminSubmitting(true);

    try {
      // 1. Try server verification first
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
        saveClientAdminSession(data.admin, true);
        showToast.success(`Welcome, ${data.admin.displayName}! Entering Atelier Admin Portal...`);
        router.push("/admin");
        return;
      }

      // 2. Client-side local verification fallback
      const staffList = getClientStaffList();
      const localResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (localResult.success && localResult.admin) {
        saveClientAdminSession(localResult.admin, true);
        showToast.success(
          `Welcome, ${localResult.admin.displayName}! Entering Atelier Admin Portal...`
        );
        router.push("/admin");
        return;
      }

      setAdminErrorMessage(
        data.error ||
          localResult.error ||
          "Invalid administrator credentials. Please check Name, Mobile, and Owner ID."
      );
    } catch {
      // Offline fallback verification
      const staffList = getClientStaffList();
      const fallbackResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (fallbackResult.success && fallbackResult.admin) {
        saveClientAdminSession(fallbackResult.admin, true);
        showToast.success(`Welcome, ${fallbackResult.admin.displayName}!`);
        router.push("/admin");
      } else {
        setAdminErrorMessage(
          fallbackResult.error || "Verification failed. Please check your admin credentials."
        );
      }
    } finally {
      setIsAdminSubmitting(false);
    }
  };

  const handleAutofillOwner = () => {
    setAdminName("sreesha");
    setAdminPhone("6281344628");
    setAdminOwnerId("8899");
    setAdminErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div
        className={cn(
          "w-full max-w-md border transition-all duration-300 shadow-sm overflow-hidden",
          mode === "admin"
            ? "bg-[#1C1B19] border-[#3E3A34] text-[#FAF7F2]"
            : "bg-white border-[#E8E2D8] text-[#1C1B19]"
        )}
      >
        {/* Device Status Ribbon if New Device */}
        {hasCheckedDevice && isNewDevice && mode !== "admin" && (
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

        {/* 3-Way Segmented Tabs (Customer Sign In | Sign Up | Admin Portal) */}
        <div
          className={cn(
            "grid grid-cols-3 border-b text-center text-xs font-semibold uppercase tracking-wider",
            mode === "admin" ? "bg-[#141312] border-[#2E2C28]" : "bg-[#FAF7F2]/60 border-[#E8E2D8]"
          )}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center",
              mode === "login"
                ? "border-[#B79B63] bg-white text-[#1C1B19] font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>Patron Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center",
              mode === "signup"
                ? "border-[#B79B63] bg-white text-[#1C1B19] font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>New Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("admin");
              setAdminErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-2 transition-all border-b-2 text-center flex items-center justify-center gap-1",
              mode === "admin"
                ? "border-[#B79B63] bg-[#1C1B19] text-[#B79B63] font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#B79B63]"
            )}
          >
            <Lock className="h-3 w-3" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Tab 1 & 2: Customer Sign In / Sign Up Form */}
        {mode !== "admin" ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F7F3EB] border border-[#D8C7A5] text-[#B79B63] text-[10px] uppercase tracking-[0.2em] font-bold">
                <Sparkle className="h-3 w-3" />
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
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3 bg-[#FAF0F0] border border-[#E8B4B4] text-xs text-[#992222] rounded-xs animate-in fade-in">
                {errorMessage}
              </div>
            )}

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
            </form>

            {/* Security & Convenience Assurance */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#2D6A4F] bg-[#2D6A4F]/8 p-2.5 border border-[#2D6A4F]/20">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Instant Recognition • No OTP or Password Friction</span>
            </div>
          </div>
        ) : (
          /* Tab 3: Dedicated Atelier Admin Portal Login Form */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#B79B63]/15 text-[#B79B63] mx-auto rounded-full flex items-center justify-center border border-[#B79B63]/30 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <span className="text-[10px] tracking-[0.25em] text-[#B79B63] uppercase font-bold block pt-1">
                Atelier Administration
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
                Owner &amp; Staff Portal
              </h1>
              <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                Separated from customer panel. Please provide your Administrator Name, registered
                Mobile, and Owner ID.
              </p>
            </div>

            {/* Registered Owner Helper Badge */}
            <div className="bg-[#24221E] border border-[#3E3A34] p-3 text-xs space-y-1.5 rounded-xs">
              <div className="flex items-center justify-between text-stone-400 text-[10px] uppercase tracking-wider">
                <span className="flex items-center gap-1 text-[#B79B63] font-semibold">
                  <ShieldCheck className="h-3 w-3" /> Registered Owner Credentials
                </span>
                <button
                  type="button"
                  onClick={handleAutofillOwner}
                  className="text-[#B79B63] hover:underline cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
              <div className="text-[11px] text-stone-300 grid grid-cols-3 gap-2 pt-1 border-t border-[#33302B]">
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase">Name:</span>
                  <span className="font-semibold text-white">sreesha</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase">Mobile:</span>
                  <span className="font-semibold text-white">6281344628</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase">Owner ID:</span>
                  <span className="font-semibold text-[#B79B63] font-mono">8899</span>
                </div>
              </div>
            </div>

            {/* Admin Error Message Banner */}
            {adminErrorMessage && (
              <div className="p-3 bg-[#3A1818] border border-[#8C2C2C] text-xs text-[#FFAAAA] rounded-xs animate-in fade-in flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{adminErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-4">
              {/* Admin Full Name Field */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                  Admin Name <span className="text-[#B79B63]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      if (adminErrorMessage) setAdminErrorMessage(null);
                    }}
                    placeholder="e.g. sreesha"
                    className="w-full pl-10 pr-4 py-3 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium outline-none focus:border-[#B79B63] transition-colors rounded-xs"
                  />
                </div>
              </div>

              {/* Admin Phone Field */}
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
                    value={adminPhone}
                    onChange={handleAdminPhoneChange}
                    placeholder="6281344628"
                    className="w-full pl-20 pr-4 py-3 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium tracking-wider outline-none focus:border-[#B79B63] transition-colors rounded-xs"
                  />
                </div>
              </div>

              {/* Owner ID / Security Passcode Field */}
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
                    value={adminOwnerId}
                    onChange={(e) => {
                      setAdminOwnerId(e.target.value);
                      if (adminErrorMessage) setAdminErrorMessage(null);
                    }}
                    placeholder="e.g. 8899"
                    className="w-full pl-10 pr-10 py-3 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-mono tracking-widest outline-none focus:border-[#B79B63] transition-colors rounded-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOwnerId(!showOwnerId)}
                    className="absolute right-3 text-stone-400 hover:text-white p-1"
                  >
                    {showOwnerId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Admin Login */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isAdminSubmitting || !adminName || !adminPhone || !adminOwnerId}
                className="w-full text-xs uppercase tracking-widest py-3.5 mt-2 bg-[#B79B63] hover:bg-[#a3874f] text-[#1C1B19] font-bold transition-all duration-300"
              >
                {isAdminSubmitting ? "Verifying Admin Authority..." : "Unlock Atelier Admin Portal"}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-xs text-stone-400 hover:text-white transition-colors"
                >
                  ← Return to Customer Shopping Experience
                </button>
              </div>
            </form>
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
