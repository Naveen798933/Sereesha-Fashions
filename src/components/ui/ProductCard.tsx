"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { formatINR, cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number; // in INR
  originalPrice?: number; // compare-at price
  primaryImage: string;
  secondaryImage?: string;
  badge?: "NEW" | "BESTSELLER" | "SALE" | "LIMITED";
  rating?: number;
  reviewCount?: number;
  sizes?: string[];
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onQuickAdd?: (id: string, size?: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  slug,
  title,
  category,
  price,
  originalPrice,
  primaryImage,
  secondaryImage,
  badge,
  rating,
  reviewCount,
  sizes = ["XS", "S", "M", "L", "XL"],
  isWishlisted = false,
  onWishlistToggle,
  onQuickView,
  onQuickAdd,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | undefined>(undefined);

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div
      className={cn("group relative flex flex-col text-left", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container (4:5 Editorial Ratio) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
        <Link href={`/${category.toLowerCase()}/${slug}`} className="relative block h-full w-full">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover object-center transition-all duration-700 ease-out",
              secondaryImage && isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100"
            )}
          />

          {/* Secondary Image Swap on Hover */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${title} alternate view`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className={cn(
                "object-cover object-center transition-all duration-700 ease-out",
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {badge === "NEW" && <Badge variant="gold">NEW</Badge>}
          {badge === "BESTSELLER" && <Badge variant="default">BESTSELLER</Badge>}
          {discountPercent && <Badge variant="sale">-{discountPercent}%</Badge>}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(id);
          }}
          className="absolute top-3 right-3 z-10 h-9 w-9 bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              isWishlisted ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
            )}
          />
        </button>

        {/* Quick View & Quick Add Action Bar (Slide up on hover) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden md:flex flex-col gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {/* Size Chips for Instant Selection */}
          {sizes.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 bg-white/95 p-1.5 border border-[#E8E2D8] backdrop-blur-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867D] mr-1">
                Size:
              </span>
              {sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    setSelectedSize(sz);
                    onQuickAdd?.(id, sz);
                  }}
                  className={cn(
                    "px-1.5 py-0.5 text-[10px] font-medium transition-colors cursor-pointer",
                    selectedSize === sz
                      ? "bg-[#1C1B19] text-[#FAF7F2]"
                      : "text-[#1C1B19] hover:bg-[#F5F2EB]"
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(id)}
                className="h-9 bg-white text-[#1C1B19] text-[10px] uppercase tracking-[0.14em] font-medium border border-[#E8E2D8] hover:bg-[#1C1B19] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Eye className="h-3.5 w-3.5" />
                Quick View
              </button>
            )}
            <button
              type="button"
              onClick={() => onQuickAdd?.(id, selectedSize || sizes[0])}
              className="h-9 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-[0.14em] font-medium hover:bg-[#2E2C28] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#B79B63]" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="pt-3 pb-2 flex flex-col space-y-1">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-medium">
          {category}
        </p>

        <Link
          href={`/${category.toLowerCase()}/${slug}`}
          className="text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1"
        >
          {title}
        </Link>

        {rating !== undefined && (
          <div className="py-0.5">
            <Rating value={rating} count={reviewCount} size="sm" />
          </div>
        )}

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-sm font-semibold text-[#1C1B19] tracking-tight">
            {formatINR(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-[#8C867D] line-through font-normal">
              {formatINR(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
