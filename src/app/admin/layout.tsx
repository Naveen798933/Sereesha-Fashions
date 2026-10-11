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
  Menu,
  X,
  ChevronRight,
  FolderTree,
  Star,
  UserCheck,
} from "lucide-react";
import { showToast } from "@/components/ui/Toast";
import { AdminRecord, getClientAdminSession, clearClientAdminSession } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [currentAdmin, setCurrentAdmin] = React.useState<AdminRecord | null>(null);
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // If we are on the dedicated admin login page, bypass the layout shell
  const isLoginPage = pathname === "/admin/login";

  // Check authorization on mount & pathname changes
  React.useEffect(() => {
    if (isLoginPage) {
      setIsCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/auth/verify");
        const data = await res.json();
        if (data.authenticated) {
          const clientSession = getClientAdminSession() || {
            id: data.admin?.id || "sreesha",
            name: "sreesha",
            displayName: "Sreesha",
            phone: "6281344628",
            ownerId: "8899",
            role: data.admin?.role || "Super Admin / Owner",
            status: "Active" as const,
            isOwner: true,
            createdAt: new Date().toISOString(),
          };
          setCurrentAdmin(clientSession);
          setIsAuthorized(true);
        } else {
          clearClientAdminSession();
          setIsAuthorized(false);
          router.replace("/admin/login");
        }
      } catch {
        const session = getClientAdminSession();
        if (session) {
          setCurrentAdmin(session);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace("/admin/login");
        }
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleSignOutAdmin = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    clearClientAdminSession();
    setIsAuthorized(false);
    setCurrentAdmin(null);
    showToast.info("Admin session locked");
    router.push("/admin/login");
  };

  const navLinks = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products & Catalog", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: FolderTree },
    { href: "/admin/orders", label: "Orders & Fulfillment", icon: ShoppingBag },
    { href: "/admin/reviews", label: "Customer Reviews", icon: Star },
    { href: "/admin/customers", label: "Patrons & Clients", icon: Users },
    { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag },
    { href: "/admin/staff", label: "Staff & Privileges", icon: UserCheck },
  ];

  // If on login page, render children directly without dashboard shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#1C1B19] flex items-center justify-center">
        <h1 className="sr-only">Admin Portal Authentication</h1>
        <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authorized, show security redirect skeleton
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#1C1B19] flex flex-col items-center justify-center space-y-3">
        <h1 className="sr-only">Admin Portal Authentication</h1>
        <div className="w-8 h-8 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-400 uppercase tracking-widest">
          Redirecting to Atelier Admin Login...
        </p>
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
              Role: {currentAdmin?.role || "Super Admin / Owner"}
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
