"use client";

import * as React from "react";
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
  cartCount?: number;
  wishlistCount?: number;
  transparentInitially?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  wishlistCount = 0,
  transparentInitially = false,
}) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
              className="p-2 text-current hover:text-[#B79B63] transition-colors cursor-pointer"
              aria-label="Search catalog"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Brand Logo & Hyderabad Tag */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link href="/" className="inline-block group focus:outline-none">
              <span className="block font-serif text-2xl sm:text-3xl tracking-[0.14em] uppercase font-normal text-current transition-colors">
                Sreesha Elegance
              </span>
              <span className="block text-[9px] uppercase tracking-[0.32em] text-[#B79B63] font-medium -mt-1">
                Hyderabad • Boutique
              </span>
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

            <Link
              href="/cart"
              className="relative flex items-center justify-center p-2 text-current hover:text-[#B79B63] transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#1C1B19] text-[9px] font-bold text-[#FAF7F2]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1C1B19]/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-[#E8E2D8]">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div>
                  <span className="block font-serif text-xl tracking-[0.14em] uppercase text-[#1C1B19]">
                    Sreesha
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#B79B63]">
                    Hyderabad
                  </span>
                </div>
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
              <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between py-2.5 text-xs uppercase tracking-[0.16em] text-[#1C1B19] hover:text-[#B79B63] transition-colors border-b border-[#F0EBE1]"
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
                  <MapPin className="h-3.5 w-3.5 text-[#B79B63]" />
                  <span>Road No. 10, Banjara Hills, Hyderabad</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#B79B63]" />
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
    </header>
  );
};
