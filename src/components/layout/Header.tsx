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
  ChevronDown,
  Phone,
  MapPin,
  Truck,
  Ruler,
  RotateCcw,
  HelpCircle,
  Sparkles,
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

interface SubCategoryItem {
  label: string;
  href: string;
  badge?: string;
}

interface MobileMenuItem {
  label: string;
  href: string;
  badge?: string;
  subItems?: SubCategoryItem[];
}

const MOBILE_MENU_ITEMS: MobileMenuItem[] = [
  {
    label: "New Arrivals",
    href: "/new-arrivals",
    badge: "NEW",
  },
  {
    label: "Handloom Sarees",
    href: "/women/sarees",
    badge: "SILK MARK",
    subItems: [
      { label: "All Sarees Collection", href: "/women/sarees" },
      { label: "Kanchipuram Pure Silk", href: "/women/sarees" },
      { label: "Banarasi Kadhwa Weaves", href: "/women/sarees" },
      { label: "Paithani Handloom Silk", href: "/women/sarees" },
      { label: "Pure Organza & Tissue Zari", href: "/women/sarees" },
    ],
  },
  {
    label: "Bridal & Festive Lehengas",
    href: "/women/lehengas",
    badge: "COUTURE",
    subItems: [
      { label: "All Lehengas Collection", href: "/women/lehengas" },
      { label: "Bridal Velvet Lehengas", href: "/women/lehengas" },
      { label: "Festive Raw Silk Lehengas", href: "/women/lehengas" },
      { label: "Pastel Organza & Tissue", href: "/women/lehengas" },
    ],
  },
  {
    label: "Kurtis & Anarkalis",
    href: "/women/kurtis",
    subItems: [
      { label: "All Kurtis & Sets", href: "/women/kurtis" },
      { label: "Pure Silk Anarkali Sets", href: "/women/kurtis" },
      { label: "Embroidered Chanderi Sets", href: "/women/kurtis" },
      { label: "Sharara & Gharara Sets", href: "/women/kurtis" },
    ],
  },
  {
    label: "Contemporary Silhouettes",
    href: "/contemporary",
    subItems: [
      { label: "All Contemporary", href: "/contemporary" },
      { label: "Pre-Draped Saree Gowns", href: "/contemporary" },
      { label: "Indo-Western Capes & Sets", href: "/contemporary" },
    ],
  },
  {
    label: "Curated Collections",
    href: "/collections",
    subItems: [
      { label: "All Collections", href: "/collections" },
      { label: "The Royal Nizam Heritage Edit", href: "/collections" },
      { label: "Bespoke Bridal Trousseau", href: "/collections" },
    ],
  },
  {
    label: "Our Atelier Heritage",
    href: "/about",
  },
];

export interface HeaderProps {
  transparentInitially?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparentInitially = false }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>("Handloom Sarees");
  const pathname = usePathname();

  const {
    cartCount,
    wishlistCount,
    setIsCartDrawerOpen,
    isSearchOpen,
    setIsSearchOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  } = useCartWishlist();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile drawer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  // Close mobile drawer on route change
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const toggleCategory = (label: string) => {
    setExpandedCategory((prev) => (prev === label ? null : label));
  };

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
                onClick={() => setIsMobileMenuOpen(true)}
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
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#B79B63] text-[9px] font-bold text-white rounded-full">
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
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-[#1C1B19] text-[9px] font-bold text-[#FAF7F2] rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Slide-in Drawer with Interactive Accordion Toggle List */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#1C1B19]/70 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer Sheet */}
            <div
              className="fixed inset-y-0 left-0 w-[88%] max-w-sm bg-[#FAF7F2] shadow-2xl flex flex-col border-r border-[#E8E2D8] transition-transform duration-300 z-50"
              style={{ animation: "slideInLeft 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            >
              {/* 1. Fixed Header (Always Pinned at the Top) */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#E8E2D8] bg-[#FAF7F2] shrink-0 sticky top-0 z-20 shadow-xs">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/logo.png"
                    alt="Sreesha Elegance"
                    width={130}
                    height={52}
                    className="h-11 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 flex items-center justify-center text-[#1C1B19] hover:text-[#B79B63] transition-colors cursor-pointer border border-[#E8E2D8] bg-white"
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 2. Scrollable Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-6">
                {/* VIP Video Consultation Banner */}
                <div className="p-3 bg-white border border-[#D8C7A5] space-y-2 rounded-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#B79B63]">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                        Boutique Styling
                      </span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider bg-[#2D6A4F]/10 text-[#2D6A4F] px-1.5 py-0.5 font-medium">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5650] leading-snug">
                    Schedule a 1-on-1 WhatsApp video call with our Hyderabad saree stylists.
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Sreesha%20Elegance%2C%20I%20would%20like%20to%20book%20a%20virtual%20styling%20consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full py-2 bg-[#2D6A4F] text-white text-[11px] uppercase tracking-wider font-medium hover:bg-[#23533e] transition-colors gap-1.5 shadow-xs"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>WhatsApp Video Preview</span>
                  </a>
                </div>

                {/* Couture Collections Interactive Toggle List */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C867D] font-medium">
                      Couture Collections
                    </span>
                    <span className="text-[10px] text-[#B79B63] font-medium">Tap to explore</span>
                  </div>

                  <nav
                    aria-label="Mobile Navigation"
                    className="flex flex-col divide-y divide-[#EFE8DD] border border-[#E8E2D8] bg-white"
                  >
                    {MOBILE_MENU_ITEMS.map((item) => {
                      const hasSub = item.subItems && item.subItems.length > 0;
                      const isExpanded = expandedCategory === item.label;
                      const isActive = pathname === item.href;

                      return (
                        <div key={item.label} className="flex flex-col">
                          {/* Category Header Row */}
                          <div
                            className={cn(
                              "flex items-center justify-between p-3.5 transition-colors",
                              isActive && "bg-[#FAF7F2]"
                            )}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "flex-1 text-xs uppercase tracking-[0.14em] font-medium hover:text-[#B79B63] transition-colors flex items-center gap-2",
                                isActive ? "text-[#B79B63] font-semibold" : "text-[#1C1B19]"
                              )}
                            >
                              <span>{item.label}</span>
                              {item.badge && (
                                <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.2 bg-[#B79B63]/15 text-[#B79B63] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </Link>

                            {/* Toggle Button for Subcategories */}
                            {hasSub ? (
                              <button
                                type="button"
                                onClick={() => toggleCategory(item.label)}
                                className="p-1 text-[#8C867D] hover:text-[#1C1B19] transition-transform cursor-pointer"
                                aria-label={`Toggle ${item.label} subcategories`}
                                aria-expanded={isExpanded}
                              >
                                <ChevronDown
                                  className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isExpanded && "rotate-180 text-[#B79B63]"
                                  )}
                                />
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 text-[#8C867D]"
                                aria-label={item.label}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Link>
                            )}
                          </div>

                          {/* Accordion Sub-Item Dropdown List */}
                          {hasSub && isExpanded && (
                            <div className="bg-[#FAF7F2] py-2 px-4 space-y-1 border-t border-[#EFE8DD]">
                              {item.subItems!.map((sub) => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                      "flex items-center justify-between py-2 text-xs transition-colors hover:text-[#B79B63]",
                                      isSubActive
                                        ? "text-[#B79B63] font-semibold"
                                        : "text-[#5A5650]"
                                    )}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="h-1 w-1 rounded-full bg-[#B79B63]" />
                                      <span>{sub.label}</span>
                                    </span>
                                    <ChevronRight className="h-3 w-3 text-[#B79B63]/60" />
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                </div>

                {/* Client Care Services with bespoke icons */}
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C867D] font-medium px-1">
                    Client Concierge &amp; Care
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/track-order"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 bg-white border border-[#E8E2D8] text-[#1C1B19] hover:border-[#B79B63] transition-colors flex flex-col items-center justify-center text-center gap-1.5"
                    >
                      <Truck className="h-4 w-4 text-[#B79B63]" />
                      <span className="text-[11px] font-medium">Track Order</span>
                    </Link>
                    <Link
                      href="/size-guide"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 bg-white border border-[#E8E2D8] text-[#1C1B19] hover:border-[#B79B63] transition-colors flex flex-col items-center justify-center text-center gap-1.5"
                    >
                      <Ruler className="h-4 w-4 text-[#B79B63]" />
                      <span className="text-[11px] font-medium">Size Guide</span>
                    </Link>
                    <Link
                      href="/shipping-returns"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 bg-white border border-[#E8E2D8] text-[#1C1B19] hover:border-[#B79B63] transition-colors flex flex-col items-center justify-center text-center gap-1.5"
                    >
                      <RotateCcw className="h-4 w-4 text-[#B79B63]" />
                      <span className="text-[11px] font-medium">Exchanges</span>
                    </Link>
                    <Link
                      href="/faqs"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 bg-white border border-[#E8E2D8] text-[#1C1B19] hover:border-[#B79B63] transition-colors flex flex-col items-center justify-center text-center gap-1.5"
                    >
                      <HelpCircle className="h-4 w-4 text-[#B79B63]" />
                      <span className="text-[11px] font-medium">Boutique FAQs</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Fixed Bottom Atelier Info (Always Pinned at Bottom) */}
              <div className="p-4 sm:p-5 bg-white border-t border-[#E8E2D8] shrink-0 space-y-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="space-y-1 text-xs text-[#5A5650]">
                  <div className="flex items-start gap-2 text-[#1C1B19]">
                    <MapPin className="h-3.5 w-3.5 text-[#B79B63] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">
                      Road No. 10, Banjara Hills, Hyderabad
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#B79B63] shrink-0" />
                    <a href="tel:+919876543210" className="hover:underline text-[11px]">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#8C867D] border-t border-[#F0EBE1]">
                  <span>INR ₹ (India)</span>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#1C1B19] font-medium hover:text-[#B79B63] transition-colors"
                  >
                    My Account
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
