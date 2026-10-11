"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, Sparkles, User, Sparkle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LOCAL_STORAGE_KEY = "sreesha_auth_customer";
const DEVICE_KNOWN_KEY = "sreesha_device_known";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const explicitMode = searchParams.get("mode");
  const tabParam = searchParams.get("tab") || searchParams.get("role");

  const { user, loginWithPhone, signupWithPhone, isLoading } = useAuth();

  // Mode: "signup" | "login"
  const [mode, setMode] = React.useState<"signup" | "login">("login");
  const [isNewDevice, setIsNewDevice] = React.useState<boolean>(false);
  const [hasCheckedDevice, setHasCheckedDevice] = React.useState<boolean>(false);

  // Customer form inputs
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Redirect legacy /admin tab queries straight to dedicated Admin portal
  React.useEffect(() => {
    if (tabParam === "admin" || explicitMode === "admin") {
      router.replace("/admin");
    }
  }, [tabParam, explicitMode, router]);

  // Detect mode & recognized device status on mount
  React.useEffect(() => {
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
  }, [explicitMode]);

  // If already authenticated as customer, redirect to destination
  React.useEffect(() => {
    if (user && !isLoading) {
      router.push(redirectUrl);
    }
  }, [user, isLoading, router, redirectUrl]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
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

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#E8E2D8] text-[#1C1B19] shadow-sm overflow-hidden transition-all duration-300">
        {/* Device Status Ribbon if New Device */}
        {hasCheckedDevice && isNewDevice && (
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

        {/* 2-Way Segmented Tabs (Customer Sign In | Sign Up) */}
        <div className="grid grid-cols-2 border-b bg-[#FAF7F2]/60 border-[#E8E2D8] text-center text-xs font-semibold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={cn(
              "py-3.5 px-3 transition-all border-b-2 text-center cursor-pointer",
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
              "py-3.5 px-3 transition-all border-b-2 text-center cursor-pointer",
              mode === "signup"
                ? "border-[#B79B63] bg-white text-[#1C1B19] font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>New Client</span>
          </button>
        </div>

        {/* Customer Form Body */}
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

        {/* Professional Admin Panel Gateway Option */}
        <div className="bg-[#FAF7F2] border-t border-[#E8E2D8] px-6 py-3 flex items-center justify-between text-[11px] text-[#8C867D]">
          <span>Atelier Management Staff?</span>
          <Link
            href="/admin/login"
            className="text-[#B79B63] hover:text-[#1C1B19] font-semibold inline-flex items-center gap-1 transition-colors"
          >
            <span>Admin Panel Access</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
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
