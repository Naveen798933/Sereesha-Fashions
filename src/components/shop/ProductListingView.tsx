"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpDown, Sparkles, Heart } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

interface ProductListingViewProps {
  title: string;
  subtitle: string;
  categoryFilter?: "sarees" | "lehengas" | "kurtis" | "contemporary" | "all";
  collectionFilter?: string;
  badgeFilter?: string;
}

export const ProductListingView: React.FC<ProductListingViewProps> = ({
  title,
  subtitle,
  categoryFilter = "all",
  collectionFilter,
  badgeFilter,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCartWishlist();

  const [sortBy, setSortBy] = React.useState<SortOption>("featured");
  const [selectedFabric, setSelectedFabric] = React.useState<string>("all");

  // Filter base list
  const baseProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (collectionFilter && p.collection !== collectionFilter) return false;
      if (badgeFilter && p.badge !== badgeFilter) return false;
      if (
        selectedFabric !== "all" &&
        !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [categoryFilter, collectionFilter, badgeFilter, selectedFabric]);

  // Sort
  const sortedProducts = React.useMemo(() => {
    const list = [...baseProducts];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [baseProducts, sortBy]);

  // Unique fabrics in current category
  const availableFabrics = React.useMemo(() => {
    const fabrics = new Set<string>();
    PRODUCTS.filter((p) => categoryFilter === "all" || p.category === categoryFilter).forEach((p) =>
      fabrics.add(p.fabric.split(" ")[0])
    );
    return Array.from(fabrics);
  }, [categoryFilter]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Category Banner / Header */}
      <div className="border-b border-[#E8E2D8] pb-8 mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 text-[#B79B63] mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
            Boutique Catalog
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19] font-normal tracking-wide">
          {title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#5A5650] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Control Bar: Filter triggers and Sorting */}
      <div className="bg-white border border-[#E8E2D8] p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Fabric pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[#8C867D] mr-1">Fabric:</span>
          <button
            type="button"
            onClick={() => setSelectedFabric("all")}
            className={cn(
              "px-3 py-1 text-xs transition-colors cursor-pointer border",
              selectedFabric === "all"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-transparent text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            )}
          >
            All Fabrics
          </button>
          {availableFabrics.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedFabric(f)}
              className={cn(
                "px-3 py-1 text-xs transition-colors cursor-pointer border",
                selectedFabric === f
                  ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                  : "bg-transparent text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Right: Sort & Count */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#8C867D]">{sortedProducts.length} Pieces</span>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#B79B63]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs text-[#1C1B19] border border-[#E8E2D8] px-2.5 py-1.5 outline-none cursor-pointer focus:border-[#B79B63]"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E2D8] space-y-4">
          <p className="font-serif text-2xl text-[#1C1B19]">No pieces match your filter</p>
          <p className="text-xs text-[#5A5650]">
            Try resetting your fabric filter to explore all designs.
          </p>
          <button
            type="button"
            onClick={() => setSelectedFabric("all")}
            className="px-6 py-2 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const wishlisted = isInWishlist(product.id);
            const discountPercent =
              product.originalPrice && product.originalPrice > product.price
                ? Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )
                : null;

            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#E8E2D8]"
              >
                {/* 4:5 Aspect Ratio Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#EFE8DD]">
                  <Link
                    href={`/women/${product.category}/${product.slug}`}
                    className="block h-full w-full"
                  >
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {product.badge === "NEW" && <Badge variant="gold">NEW</Badge>}
                    {product.badge === "BESTSELLER" && <Badge variant="default">BESTSELLER</Badge>}
                    {product.badge === "LIMITED" && <Badge variant="goldSolid">LIMITED</Badge>}
                    {discountPercent && <Badge variant="sale">-{discountPercent}%</Badge>}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer"
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        wishlisted ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
                      )}
                    />
                  </button>

                  {/* Quick Add Overlay on Hover */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes[0])}
                      className="w-full h-9 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-[0.16em] font-medium hover:bg-[#B79B63] transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      Quick Add to Bag
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8C867D]">
                      <span>{product.categoryLabel}</span>
                      {product.silkMarkCertified && (
                        <span className="text-[#B79B63] font-medium">Silk Mark</span>
                      )}
                    </div>
                    <Link
                      href={`/women/${product.category}/${product.slug}`}
                      className="mt-1 block text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </Link>
                  </div>

                  <div>
                    <div className="py-1">
                      <Rating value={product.rating} count={product.reviewCount} size="sm" />
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-semibold text-[#1C1B19]">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-[#8C867D] line-through font-normal">
                          {formatINR(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
