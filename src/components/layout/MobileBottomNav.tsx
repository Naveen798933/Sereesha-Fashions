"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { cn } from "@/lib/utils";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const {
    cartCount,
    wishlistCount,
    isHydrated,
    setIsCartDrawerOpen,
    setIsSearchOpen,
    setIsMobileMenuOpen,
  } = useCartWishlist();

  const isPDP =
    (pathname.startsWith("/women/") && pathname.split("/").length >= 4) ||
    (pathname.split("/").length === 3 &&
      ["sarees", "lehengas", "kurtis", "contemporary"].includes(pathname.split("/")[1]));

  const isCheckout = pathname === "/checkout";

  if (isPDP || isCheckout) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#FAF7F2]/96 backdrop-blur-md border-t border-[#E8E2D8] shadow-[0_-4px_16px_rgba(28,27,25,0.06)] pb-[env(safe-area-inset-bottom)] transition-all duration-300"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-lg mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center py-1 text-center transition-colors relative group",
            pathname === "/" ? "text-[#B79B63]" : "text-[#5A5650] hover:text-[#1C1B19]"
          )}
          aria-label="Home"
        >
          <Home className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Home</span>
          {pathname === "/" && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B79B63]" />
          )}
        </Link>

        {/* 2. Explore / Categories */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center py-1 text-center transition-colors relative group cursor-pointer",
            pathname.startsWith("/women") || pathname === "/collections"
              ? "text-[#B79B63]"
              : "text-[#5A5650] hover:text-[#1C1B19]"
          )}
          aria-label="Browse Collections and Categories"
        >
          <LayoutGrid className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Explore</span>
          {(pathname.startsWith("/women") || pathname === "/collections") && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B79B63]" />
          )}
        </button>

        {/* 3. Search */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-center text-[#5A5650] hover:text-[#1C1B19] transition-colors relative group cursor-pointer"
          aria-label="Search Collection"
        >
          <Search className="h-5 w-5 stroke-[1.75]" />
          <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Search</span>
        </button>

        {/* 4. Wishlist */}
        <Link
          href="/wishlist"
          className={cn(
            "flex flex-col items-center justify-center py-1 text-center transition-colors relative group",
            pathname === "/wishlist" ? "text-[#B79B63]" : "text-[#5A5650] hover:text-[#1C1B19]"
          )}
          aria-label={`Wishlist (${wishlistCount} items)`}
        >
          <div className="relative">
            <Heart className="h-5 w-5 stroke-[1.75]" />
            {isHydrated && wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-4 px-1 items-center justify-center bg-[#B79B63] text-[9px] font-bold text-white rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Saved</span>
          {pathname === "/wishlist" && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B79B63]" />
          )}
        </Link>

        {/* 5. Bag */}
        <button
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center py-1 text-center transition-colors relative group cursor-pointer",
            pathname === "/cart" ? "text-[#B79B63]" : "text-[#5A5650] hover:text-[#1C1B19]"
          )}
          aria-label={`Shopping Bag (${cartCount} items)`}
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5 stroke-[1.75]" />
            {isHydrated && cartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-4 px-1 items-center justify-center bg-[#1C1B19] text-[9px] font-bold text-[#FAF7F2] rounded-full">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-wider uppercase mt-1 font-medium">Bag</span>
          {pathname === "/cart" && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#B79B63]" />
          )}
        </button>
      </div>
    </nav>
  );
};
