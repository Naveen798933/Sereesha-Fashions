"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { PRODUCTS, Product } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All Curations" },
  { id: "sarees", label: "Silk Sarees" },
  { id: "lehengas", label: "Bridal Lehengas" },
  { id: "kurtis", label: "Kurtis & Sets" },
  { id: "contemporary", label: "Contemporary" },
];

export const FeaturedCollectionTabs: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const filteredProducts = React.useMemo(() => {
    if (activeTab === "all") {
      // Pick top handpicked pieces from each category
      return PRODUCTS.slice(0, 8);
    }
    return PRODUCTS.filter((p) => p.category === activeTab).slice(0, 8);
  }, [activeTab]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0] || "Standard", undefined, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 sm:px-5 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all duration-300 whitespace-nowrap cursor-pointer rounded-none border",
                isActive
                  ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] shadow-sm"
                  : "bg-white text-[#5A5650] border-[#E8E2D8] hover:border-[#B79B63] hover:text-[#1C1B19]"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Luxury Pieces */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => {
          const isFav = isInWishlist(product.id);
          const hasDiscount = product.originalPrice && product.originalPrice > product.price;
          const discountPercent = hasDiscount
            ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
            : null;
          const productHref = `/women/${product.category}/${product.slug}`;
          const isJustAdded = addedId === product.id;

          return (
            <div
              key={product.id}
              className="group relative flex flex-col bg-white border border-[#E8E2D8] hover:border-[#D8C7A5] hover:shadow-lg transition-all duration-500 rounded-none overflow-hidden"
            >
              {/* Image Frame */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE8DD]">
                <Link href={productHref} className="relative block h-full w-full">
                  <Image
                    src={product.primaryImage}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {product.galleryImages && product.galleryImages[1] && (
                    <Image
                      src={product.galleryImages[1]}
                      alt={`${product.title} alternate`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                    />
                  )}
                </Link>

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                  {product.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-semibold",
                        product.badge === "NEW" && "bg-[#B79B63] text-white",
                        product.badge === "BESTSELLER" && "bg-[#1C1B19] text-[#FAF7F2]",
                        product.badge === "LIMITED" && "bg-[#3D5A80] text-white",
                        product.badge === "SALE" && "bg-[#9A3434] text-white"
                      )}
                    >
                      {product.badge}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] font-semibold bg-[#9A3434] text-white">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 h-8 w-8 sm:h-9 sm:w-9 bg-white/90 backdrop-blur-xs border border-[#E8E2D8] flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors cursor-pointer"
                  aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors",
                      isFav ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
                    )}
                  />
                </button>

                {/* Quick Add to Bag on Hover */}
                <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden sm:flex translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    disabled={isJustAdded}
                    className={cn(
                      "w-full h-9 text-[10px] uppercase tracking-[0.16em] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md",
                      isJustAdded
                        ? "bg-[#2D6A4F] text-white"
                        : "bg-[#1C1B19] text-[#FAF7F2] hover:bg-[#B79B63]"
                    )}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-3.5 w-3.5 text-[#B79B63]" />
                        Quick Add to Bag
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-1.5">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-medium">
                    <span>{product.categoryLabel}</span>
                    {product.silkMarkCertified && (
                      <span className="text-[#B79B63] font-semibold">Silk Mark</span>
                    )}
                  </div>

                  <Link
                    href={productHref}
                    className="text-xs sm:text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-2 leading-snug mt-1"
                  >
                    {product.title}
                  </Link>
                </div>

                <div className="pt-2 border-t border-[#F3ECE2] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-semibold text-[#1C1B19]">
                      {formatINR(product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-[#8C867D] line-through">
                        {formatINR(product.originalPrice!)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#B79B63]">
                    <span>★ {product.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Mobile Tap to Add Button */}
                <div className="pt-2 sm:hidden">
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(product, e)}
                    disabled={isJustAdded}
                    className={cn(
                      "w-full py-2 text-[10px] uppercase tracking-[0.14em] font-medium transition-colors flex items-center justify-center gap-1.5 border",
                      isJustAdded
                        ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                        : "bg-[#FAF7F2] text-[#1C1B19] border-[#E8E2D8] active:bg-[#1C1B19] active:text-white"
                    )}
                  >
                    <ShoppingBag className="h-3 w-3 text-[#B79B63]" />
                    {isJustAdded ? "Added" : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
