"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Users,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Lock,
  KeyRound,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

const DEFAULT_ADMIN_PIN = "8899";
const ADMIN_SESSION_KEY = "sreesha_admin_authorized";
const ADMIN_PERSISTENT_KEY = "sreesha_admin_remember_device";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);
  const [pinInput, setPinInput] = React.useState("");
  const [showPin, setShowPin] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(true);
  const [pinError, setPinError] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Check authorization on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem(ADMIN_SESSION_KEY);
      const persistentAuth = localStorage.getItem(ADMIN_PERSISTENT_KEY);

      if (sessionAuth === "true" || persistentAuth === "true") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      setIsCheckingAuth(false);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_ADMIN_PIN) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
        if (rememberDevice) {
          localStorage.setItem(ADMIN_PERSISTENT_KEY, "true");
        }
      }
      setIsAuthorized(true);
      setPinError(false);
      showToast.success("Atelier Admin Portal unlocked");
    } else {
      setPinError(true);
      showToast.error("Incorrect manager PIN. Please use 8899.");
    }
  };

  const handleQuickBypass = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      if (rememberDevice) {
        localStorage.setItem(ADMIN_PERSISTENT_KEY, "true");
      }
    }
    setIsAuthorized(true);
    showToast.success("Manager bypass granted");
  };

  const handleAutoFillPin = () => {
    setPinInput(DEFAULT_ADMIN_PIN);
    setPinError(false);
  };

  const handleSignOutAdmin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_PERSISTENT_KEY);
    }
    setIsAuthorized(false);
    setPinInput("");
    showToast.info("Admin session locked");
  };

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Inventory", icon: Package },
    { href: "/admin/customers", label: "Patrons", icon: Users },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
  ];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1C1B19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authorized, render luxury PIN lock screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#141312] flex items-center justify-center p-4">
        <div className="bg-[#1C1B19] w-full max-w-md p-8 sm:p-10 border border-[#3E3A34] text-white space-y-6 shadow-2xl rounded-xs">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#B79B63]/15 text-[#B79B63] mx-auto rounded-full flex items-center justify-center border border-[#B79B63]/30 shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-[#B79B63] uppercase font-bold block pt-1">
              Sreesha Elegance Atelier
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
              Manager Passcode
            </h1>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              Enter the 4-digit boutique security PIN to access orders, catalog inventory, and
              customer records.
            </p>
          </div>

          {/* Access Details Card */}
          <div className="bg-[#24221E] border border-[#3E3A34] p-3.5 rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px] uppercase tracking-wider">
                Default Access PIN:
              </span>
              <span className="font-mono text-[#B79B63] font-bold text-sm tracking-widest bg-[#1C1B19] px-2.5 py-0.5 border border-[#B79B63]/30 rounded-2xs">
                8899
              </span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillPin}
              className="w-full py-1.5 text-center text-[11px] text-[#B79B63] hover:text-[#D8C7A5] bg-[#B79B63]/10 hover:bg-[#B79B63]/20 border border-[#B79B63]/30 transition-colors rounded-2xs font-medium cursor-pointer"
            >
              Click here to Auto-Fill PIN (8899)
            </button>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <div className="relative flex items-center">
                <input
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, ""));
                    if (pinError) setPinError(false);
                  }}
                  placeholder="••••"
                  className="w-full text-center tracking-[0.6em] text-3xl py-3.5 bg-[#141312] border border-[#3E3A34] focus:border-[#B79B63] outline-none text-[#B79B63] rounded-xs font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 p-1.5 text-stone-500 hover:text-stone-300 transition-colors"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && (
                <p className="text-xs text-rose-400 text-center mt-2 animate-in fade-in">
                  Incorrect PIN. The default management PIN is{" "}
                  <span className="font-mono font-bold text-white">8899</span>.
                </p>
              )}
            </div>

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="accent-[#B79B63] h-3.5 w-3.5"
                />
                <span>Keep this device unlocked</span>
              </label>
              <button
                type="button"
                onClick={handleQuickBypass}
                className="text-[11px] text-[#B79B63] hover:underline cursor-pointer"
              >
                Instant Unlock
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={pinInput.length < 4}
              className="w-full bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold text-xs uppercase tracking-widest py-3.5 shadow-md transition-all"
            >
              Unlock Atelier Portal
            </Button>

            <div className="pt-4 border-t border-[#3E3A34] text-center">
              <Link
                href="/"
                className="text-xs text-stone-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Boutique</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-[#1C1B19] text-white border-b border-[#2E2B27] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-stone-300 hover:text-white border border-stone-800 rounded-2xs"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="font-serif text-sm tracking-wider text-[#FAF7F2] font-semibold block">
              SREESHA ELEGANCE
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B79B63] block">
              Atelier Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSignOutAdmin}
            title="Lock Portal"
            className="p-1.5 text-stone-400 hover:text-rose-400 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
          <Link
            href="/"
            className="text-[10px] uppercase tracking-wider text-[#B79B63] border border-[#B79B63]/40 px-2 py-1 rounded-2xs hover:bg-[#B79B63]/10"
          >
            Store ↗
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Permanent + Mobile Slide-out Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1B19] text-stone-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:shrink-0 flex flex-col justify-between border-r border-[#2E2B27] ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-stone-800">
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block">
              <span className="font-serif text-lg tracking-widest text-[#FAF7F2] block font-light">
                SREESHA ELEGANCE
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] tracking-widest text-[#B79B63] uppercase font-semibold">
                  Atelier Administration
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xs text-xs uppercase tracking-wider font-medium transition-colors ${
                    isActive
                      ? "bg-[#B79B63] text-[#1C1B19] font-bold shadow-xs"
                      : "text-stone-300 hover:bg-stone-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "text-[#1C1B19] translate-x-0.5" : "text-stone-600"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-stone-800 text-xs space-y-3 bg-[#171614]">
          <div className="px-2">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Manager Session:</p>
            <p className="font-medium text-white truncate text-xs mt-0.5">
              {profile?.full_name || user?.user_metadata?.full_name || "Sreesha Reddy (Admin)"}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">PIN: 8899 • Authenticated</p>
          </div>

          <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xs transition-colors text-[11px] font-medium border border-stone-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Boutique</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOutAdmin}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-xs transition-colors text-[11px] font-medium border border-rose-900/50 cursor-pointer"
              title="Lock Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
