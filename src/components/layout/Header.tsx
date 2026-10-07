"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronRight,
  Phone,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { SearchModal } from "@/components/layout/SearchModal";

interface NavItem {
  label: string;
  href: string;
  featured?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "New In", href: "/new-arrivals", featured: true },
  { label: "Sarees", href: "/women/sarees" },
  { label: "Lehengas", href: "/women/lehengas" },
  { label: "Kurtis & Sets", href: "/women/kurtis" },
  { label: "Contemporary", href: "/contemporary" },
  { label: "Collections", href: "/collections" },
  { label: "Our Story", href: "/about" },
];

export interface HeaderProps {
  transparentInitially?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparentInitially = false }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const pathname = usePathname();

  const { cartCount, wishlistCount, setIsCartDrawerOpen } = useCartWishlist();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isTransparent = transparentInitially && !isScrolled;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isTransparent
            ? "bg-transparent text-white border-b border-white/10"
            : "bg-[#FAF7F2]/95 text-[#1C1B19] backdrop-blur-md border-b border-[#E8E2D8] shadow-xs"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-current hover:text-[#B79B63] transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-current hover:text-[#B79B63] transition-colors cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start">
              <Link href="/" className="inline-block group focus:outline-none">
                <Image
                  src="/logo.png"
                  alt="Sreesha Elegance — Hyderabad Boutique"
                  width={160}
                  height={64}
                  className="h-14 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary"
              className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-[0.16em] font-medium"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative py-2 transition-colors duration-200 hover:text-[#B79B63]",
                      isActive ? "text-[#B79B63]" : "text-current",
                      item.featured && "font-semibold"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B79B63]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right utility actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden lg:flex items-center justify-center p-2 text-current hover:text-[#B79B63] transition-colors cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/account"
                className="hidden sm:flex items-center justify-center p-2 text-current hover:text-[#B79B63] transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>

              <Link
                href="/wishlist"
                className="relative flex items-center justify-center p-2 text-current hover:text-[#B79B63] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#B79B63] text-[9px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative flex items-center justify-center p-2 text-current hover:text-[#B79B63] transition-colors cursor-pointer"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#1C1B19] text-[9px] font-bold text-[#FAF7F2]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#1C1B19]/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Sheet */}
            <div
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E8E2D8]"
              style={{ animation: "slideInLeft 0.3s ease forwards" }}
            >
              <div className="space-y-6">
                {/* Header with Logo */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                  <Image
                    src="/logo.png"
                    alt="Sreesha Elegance"
                    width={120}
                    height={48}
                    className="h-12 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 text-[#1C1B19] hover:text-[#B79B63] transition-colors cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav aria-label="Mobile Navigation" className="flex flex-col space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between py-3 text-xs uppercase tracking-[0.16em] transition-colors border-b border-[#F0EBE1]",
                        item.featured
                          ? "text-[#B79B63] font-semibold"
                          : "text-[#1C1B19] hover:text-[#B79B63]"
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#8C867D]" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Bottom Boutique Contacts */}
              <div className="pt-6 border-t border-[#E8E2D8] space-y-4">
                <div className="space-y-2 text-xs text-[#5A5650]">
                  <div className="flex items-center gap-2 text-[#1C1B19]">
                    <MapPin className="h-3.5 w-3.5 text-[#B79B63] shrink-0" />
                    <span>Road No. 10, Banjara Hills, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#B79B63] shrink-0" />
                    <a href="tel:+919876543210" className="hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8C867D]">
                  <span>INR ₹ (India)</span>
                  <Link href="/account" className="text-[#1C1B19] font-medium hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
