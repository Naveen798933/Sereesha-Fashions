"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

const DEVICE_KNOWN_KEY = "sreesha_device_known";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // By default, redirect to Home page ("/")
  const redirectUrl = searchParams.get("redirect") || "/";

  const { user, signupWithPhone, isLoading } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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

    const cleanName = fullName.trim();
    if (!cleanName) {
      setErrorMessage("Please enter your full name");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit Indian mobile number");
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
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 border border-[#E8E2D8] shadow-sm">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7F3EB] border border-[#D8C7A5] text-[#B79B63] text-[10px] uppercase tracking-[0.25em] font-bold">
            <Sparkles className="h-3 w-3" />
            <span>Client Registry</span>
          </div>
          <h1 className="text-3xl font-serif text-[#1C1B19]">Create Account</h1>
          <p className="text-xs text-[#5A5650] max-w-xs mx-auto">
            Join the Sreesha Elegance circle. Simply enter your name and phone number — no OTPs or
            passwords required.
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-[#FAF0F0] border border-[#E8B4B4] text-xs text-[#992222] rounded-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#1C1B19] mb-1.5 uppercase tracking-wider">
              Full Name <span className="text-[#B79B63]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C867D]" />
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
                className="w-full pl-9 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] font-medium outline-none focus:border-[#B79B63] focus:bg-white transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#8C867D] mt-1.5">
              Used for your atelier orders and greeting
            </p>
          </div>

          {/* Mobile Number */}
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
                value={phone}
                onChange={handlePhoneChange}
                placeholder="98490 12345"
                className="w-full pl-20 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E2D8] text-sm text-[#1C1B19] font-medium tracking-wider outline-none focus:border-[#B79B63] focus:bg-white transition-colors"
              />
            </div>
            <p className="text-[11px] text-[#8C867D] mt-1.5">
              10 digits • Used for delivery updates and instant login
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting || !fullName.trim() || phone.length < 10}
            className="w-full text-xs uppercase tracking-widest py-3.5 mt-2 bg-[#1C1B19] hover:bg-[#B79B63] text-white transition-all duration-300"
          >
            {isSubmitting ? "Registering Client Details..." : "Register & Access Boutique"}
          </Button>

          {/* Sign In Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#5A5650]">
              Already registered?{" "}
              <Link
                href={`/login?mode=login&redirect=${encodeURIComponent(redirectUrl)}`}
                className="text-[#B79B63] font-semibold hover:underline"
              >
                Sign in with Phone
              </Link>
            </p>
          </div>

          {/* Guest Link */}
          <div className="pt-4 border-t border-[#E8E2D8] text-center">
            <Link
              href={redirectUrl}
              className="text-[11px] text-[#8C867D] hover:text-[#1C1B19] inline-flex items-center justify-center gap-1 transition-colors"
            >
              <span>Continue as Guest Client</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </form>

        {/* Guarantee Banner */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#2D6A4F] bg-[#2D6A4F]/8 p-2.5 border border-[#2D6A4F]/20">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Stored Securely • No OTP or Password Friction</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </React.Suspense>
  );
}
