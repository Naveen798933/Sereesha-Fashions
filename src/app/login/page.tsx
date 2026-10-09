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
  // By default, redirect to the Home page ("/") after login/signup
  const redirectUrl = searchParams.get("redirect") || "/";
  const explicitMode = searchParams.get("mode");

  const { user, loginWithPhone, signupWithPhone, isLoading } = useAuth();

  // Mode: "signup" or "login"
  const [mode, setMode] = React.useState<"signup" | "login">("signup");
  const [isNewDevice, setIsNewDevice] = React.useState<boolean>(false);
  const [hasCheckedDevice, setHasCheckedDevice] = React.useState<boolean>(false);

  // Form inputs
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Detect whether this is a new device on mount
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
      // New device detected: ask signup first!
      setMode("signup");
    } else {
      // Returning device detected: show sign in
      setMode("login");
    }

    setHasCheckedDevice(true);
  }, [explicitMode]);

  // If already authenticated, redirect to home page (or explicit redirectUrl)
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        // Redirect to Home Page after successful registration
        router.push(redirectUrl);
      } else if (res.error) {
        setErrorMessage(res.error);
      }
    } else {
      // Login mode
      setIsSubmitting(true);
      const res = await loginWithPhone(cleanPhone);
      setIsSubmitting(false);

      if (res.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem(DEVICE_KNOWN_KEY, "true");
        }
        // Redirect to Home Page after successful login
        router.push(redirectUrl);
      } else if (res.notFound) {
        // Unrecognized phone number -> switch seamlessly to signup mode
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
    <div className="min-h-[82vh] bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#E8E2D8] shadow-sm overflow-hidden">
        {/* Device Status Ribbon if New Device */}
        {hasCheckedDevice && isNewDevice && (
          <div className="bg-[#FAF4E6] border-b border-[#EBD7AF] px-4 py-2 flex items-center justify-between text-[11px] text-[#8C6D28]">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-[#B79B63] shrink-0" />
              <span>New Device Detected • Welcome to Sreesha Elegance</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold bg-[#B79B63]/20 px-1.5 py-0.5 rounded-2xs text-[#7A5B1A]">
              Step 1 of 1
            </span>
          </div>
        )}

        {/* Segmented Mode Selector Tabs */}
        <div className="flex border-b border-[#E8E2D8] bg-[#FAF7F2]/40">
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
            }}
            className={cn(
              "flex-1 py-3.5 px-3 text-xs uppercase tracking-[0.14em] font-semibold transition-all text-center border-b-2 relative",
              mode === "signup"
                ? "border-[#B79B63] text-[#1C1B19] bg-white font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>Sign Up</span>
              {isNewDevice && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#B79B63] animate-pulse" />
              )}
            </span>
            <span className="block text-[9px] normal-case tracking-normal text-[#8C867D] mt-0.5 font-normal">
              New Patron
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={cn(
              "flex-1 py-3.5 px-3 text-xs uppercase tracking-[0.14em] font-semibold transition-all text-center border-b-2",
              mode === "login"
                ? "border-[#B79B63] text-[#1C1B19] bg-white font-bold"
                : "border-transparent text-[#8C867D] hover:text-[#1C1B19]"
            )}
          >
            <span>Sign In</span>
            <span className="block text-[9px] normal-case tracking-normal text-[#8C867D] mt-0.5 font-normal">
              Returning Patron
            </span>
          </button>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
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
