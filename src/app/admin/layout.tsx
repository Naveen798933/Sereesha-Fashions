"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Users,
  ArrowLeft,
  Lock,
  KeyRound,
  Menu,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  ShieldCheck,
  UserCheck,
  User,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import {
  AdminRecord,
  getClientAdminSession,
  saveClientAdminSession,
  clearClientAdminSession,
  verifyAdminCredentials,
  getClientStaffList,
} from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentAdmin, setCurrentAdmin] = React.useState<AdminRecord | null>(null);
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);

  // Form Inputs for Admin Verification
  const [nameInput, setNameInput] = React.useState("");
  const [phoneInput, setPhoneInput] = React.useState("");
  const [ownerIdInput, setOwnerIdInput] = React.useState("");
  const [showOwnerId, setShowOwnerId] = React.useState(false);
  const [rememberDevice, setRememberDevice] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Check authorization on mount
  React.useEffect(() => {
    const session = getClientAdminSession();
    if (session) {
      setCurrentAdmin(session);
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanName = nameInput.trim();
    const cleanPhone = phoneInput.replace(/\D/g, "");
    const cleanOwnerId = ownerIdInput.trim();

    if (!cleanName || cleanPhone.length !== 10 || !cleanOwnerId) {
      setAuthError("Please provide Administrator Name, 10-digit Phone, and Owner ID.");
      return;
    }

    setIsSubmitting(true);

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
        saveClientAdminSession(data.admin, rememberDevice);
        setCurrentAdmin(data.admin);
        setIsAuthorized(true);
        showToast.success(`Welcome, ${data.admin.displayName}! Atelier Portal Unlocked.`);
        return;
      }

      // 2. Client-side local verification fallback
      const staffList = getClientStaffList();
      const localResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (localResult.success && localResult.admin) {
        saveClientAdminSession(localResult.admin, rememberDevice);
        setCurrentAdmin(localResult.admin);
        setIsAuthorized(true);
        showToast.success(`Welcome, ${localResult.admin.displayName}!`);
        return;
      }

      setAuthError(
        data.error ||
          localResult.error ||
          "Access Denied. Check your Name, registered Mobile, and Owner ID."
      );
    } catch {
      // Local fallback in case network fails
      const staffList = getClientStaffList();
      const fallbackResult = verifyAdminCredentials(cleanName, cleanPhone, cleanOwnerId, staffList);

      if (fallbackResult.success && fallbackResult.admin) {
        saveClientAdminSession(fallbackResult.admin, rememberDevice);
        setCurrentAdmin(fallbackResult.admin);
        setIsAuthorized(true);
        showToast.success(`Welcome, ${fallbackResult.admin.displayName}!`);
      } else {
        setAuthError(fallbackResult.error || "Verification failed. Check your admin credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoFillOwner = () => {
    setNameInput("sreesha");
    setPhoneInput("6281344628");
    setOwnerIdInput("8899");
    setAuthError(null);
  };

  const handleSignOutAdmin = () => {
    clearClientAdminSession();
    setIsAuthorized(false);
    setCurrentAdmin(null);
    setNameInput("");
    setPhoneInput("");
    setOwnerIdInput("");
    showToast.info("Admin session locked");
    router.push("/login?tab=admin");
  };

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/products", label: "Inventory", icon: Package },
    { href: "/admin/customers", label: "Patrons", icon: Users },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
    { href: "/admin/staff", label: "Staff & Access", icon: UserCheck },
  ];

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1C1B19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authorized, render dedicated Admin Authentication Screen
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
              Atelier Management Login
            </h1>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              Separated from customer panel. Provide your Administrator Name, Phone, and Owner ID to
              access orders, inventory, and staff management.
            </p>
          </div>

          {/* Quick-fill Owner details helper card */}
          <div className="bg-[#24221E] border border-[#3E3A34] p-3.5 rounded-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider flex items-center gap-1 font-semibold text-[#B79B63]">
                <ShieldCheck className="h-3.5 w-3.5" /> Registered Owner
              </span>
              <button
                type="button"
                onClick={handleAutoFillOwner}
                className="text-[11px] text-[#B79B63] hover:underline cursor-pointer font-medium"
              >
                Auto-Fill Owner Credentials
              </button>
            </div>
            <div className="text-[11px] text-stone-300 grid grid-cols-3 gap-2 pt-1 border-t border-[#33302B]">
              <div>
                <span className="text-[9px] text-stone-500 block uppercase">Name</span>
                <span className="font-semibold text-white">sreesha</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase">Mobile</span>
                <span className="font-semibold text-white">6281344628</span>
              </div>
              <div>
                <span className="text-[9px] text-stone-500 block uppercase">Owner ID</span>
                <span className="font-semibold text-[#B79B63] font-mono">8899</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3 bg-[#3A1818] border border-[#8C2C2C] text-xs text-[#FFAAAA] rounded-xs animate-in fade-in flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            {/* Admin Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
                Admin Name <span className="text-[#B79B63]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="e.g. sreesha"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium outline-none focus:border-[#B79B63] rounded-xs"
                />
              </div>
            </div>

            {/* Admin Phone */}
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
                  value={phoneInput}
                  onChange={(e) => {
                    setPhoneInput(e.target.value.replace(/\D/g, ""));
                    if (authError) setAuthError(null);
                  }}
                  placeholder="6281344628"
                  className="w-full pl-20 pr-4 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-medium tracking-wider outline-none focus:border-[#B79B63] rounded-xs"
                />
              </div>
            </div>

            {/* Owner ID */}
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
                  value={ownerIdInput}
                  onChange={(e) => {
                    setOwnerIdInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="8899"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#141312] border border-[#3E3A34] text-sm text-[#FAF7F2] font-mono tracking-widest outline-none focus:border-[#B79B63] rounded-xs"
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

            {/* Remember Device Checkbox */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="accent-[#B79B63] h-3.5 w-3.5"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting || !nameInput || phoneInput.length < 10 || !ownerIdInput}
              className="w-full bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold text-xs uppercase tracking-widest py-3.5 shadow-md transition-all"
            >
              {isSubmitting ? "Verifying..." : "Unlock Atelier Portal"}
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

  // Render Authorized Admin Portal
  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <header className="md:hidden bg-[#1C1B19] text-white border-b border-[#2E2B27] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-stone-300 hover:text-white border border-stone-800 rounded-2xs cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <span className="font-serif text-sm tracking-wider text-[#FAF7F2] font-semibold block">
              SREESHA ELEGANCE
            </span>
            <span className="text-[9px] uppercase tracking-widest text-[#B79B63] block">
              {currentAdmin?.displayName || "Admin"} • {currentAdmin?.role || "Staff"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSignOutAdmin}
            title="Lock Portal"
            className="p-1.5 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
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
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Active Admin:</p>
            <p className="font-medium text-white truncate text-xs mt-0.5">
              {currentAdmin?.displayName || "Sreesha"}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              Role: {currentAdmin?.role || "Owner"}
            </p>
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
