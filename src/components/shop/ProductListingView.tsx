"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpDown,
  Sparkles,
  Heart,
  SlidersHorizontal,
  LayoutGrid,
  Square,
  ShoppingBag,
  X,
  Check,
  ShieldCheck,
  Award,
  Eye,
  Scissors,
} from "lucide-react";
import { Product } from "@/data/products";
import { getCustomerProducts } from "@/lib/catalog";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";
type QuickFilter =
  "all" | "under-25k" | "above-35k" | "bestseller" | "new" | "kanchipuram" | "banarasi";

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

  const [catalogProducts, setCatalogProducts] = React.useState<Product[]>(() =>
    getCustomerProducts()
  );

  React.useEffect(() => {
    setCatalogProducts(getCustomerProducts());
  }, []);

  const [sortBy, setSortBy] = React.useState<SortOption>("featured");
  const [selectedFabric, setSelectedFabric] = React.useState<string>("all");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("all");
  const [mobileColumns, setMobileColumns] = React.useState<1 | 2>(2);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);
  const [quickViewImage, setQuickViewImage] = React.useState<string>("");
  const [quickViewSize, setQuickViewSize] = React.useState<string>("Standard");
  const [quickViewBlouse, setQuickViewBlouse] = React.useState<string>(
    "Unstitched Matching Blouse (Included)"
  );

  const handleOpenQuickView = (p: Product) => {
    setQuickViewProduct(p);
    setQuickViewImage(p.primaryImage);
    setQuickViewSize(p.sizes?.[0] || "Standard");
    setQuickViewBlouse("Unstitched Matching Blouse (Included)");
  };

  // Filter base list
  const baseProducts = React.useMemo(() => {
    return catalogProducts.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (collectionFilter && p.collection !== collectionFilter) return false;
      if (badgeFilter && p.badge !== badgeFilter) return false;
      if (
        selectedFabric !== "all" &&
        !(p.fabric || "").toLowerCase().includes(selectedFabric.toLowerCase())
      ) {
        return false;
      }
      if (quickFilter === "under-25k" && p.price >= 25000) return false;
      if (quickFilter === "above-35k" && p.price < 35000) return false;
      if (quickFilter === "bestseller" && p.badge !== "BESTSELLER") return false;
      if (quickFilter === "new" && p.badge !== "NEW") return false;
      if (
        quickFilter === "kanchipuram" &&
        !(p.title || "").toLowerCase().includes("kanchipuram") &&
        !(p.fabric || "").toLowerCase().includes("kanchipuram")
      ) {
        return false;
      }
      if (
        quickFilter === "banarasi" &&
        !(p.title || "").toLowerCase().includes("banarasi") &&
        !(p.fabric || "").toLowerCase().includes("banarasi")
      ) {
        return false;
      }
      return true;
    });
  }, [catalogProducts, categoryFilter, collectionFilter, badgeFilter, selectedFabric, quickFilter]);

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
    catalogProducts
      .filter((p) => categoryFilter === "all" || p.category === categoryFilter)
      .forEach((p) => fabrics.add((p.fabric || "Pure Silk").split(" ")[0]));
    return Array.from(fabrics);
  }, [catalogProducts, categoryFilter]);

  // Lock body scroll when mobile filter drawer is open
  React.useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterDrawerOpen]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24 sm:pb-12">
      {/* Category Banner / Header */}
      <div className="border-b border-[#E8E2D8] pb-6 sm:pb-8 mb-6 sm:mb-8 text-center sm:text-left">
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

      {/* Mobile Sticky Control Bar (Filters, Sort & Grid Toggle) */}
      <div className="sm:hidden mb-4 bg-white border border-[#E8E2D8] p-3 flex items-center justify-between gap-2 shadow-xs">
        <button
          type="button"
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E8E2D8] text-xs text-[#1C1B19] font-medium hover:border-[#B79B63] transition-colors"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#B79B63]" />
          <span>Filters</span>
          {selectedFabric !== "all" && (
            <span className="w-2 h-2 rounded-full bg-[#B79B63] inline-block ml-0.5" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-transparent text-xs text-[#1C1B19] border border-[#E8E2D8] px-2 py-1.5 outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low-High</option>
            <option value="price-desc">Price: High-Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* 1 vs 2 column toggle */}
          <div className="flex border border-[#E8E2D8] overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileColumns(1)}
              className={cn(
                "p-1.5 transition-colors cursor-pointer",
                mobileColumns === 1
                  ? "bg-[#1C1B19] text-[#FAF7F2]"
                  : "bg-white text-[#8C867D] hover:text-[#1C1B19]"
              )}
              aria-label="Editorial single column view"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setMobileColumns(2)}
              className={cn(
                "p-1.5 transition-colors cursor-pointer",
                mobileColumns === 2
                  ? "bg-[#1C1B19] text-[#FAF7F2]"
                  : "bg-white text-[#8C867D] hover:text-[#1C1B19]"
              )}
              aria-label="Two column grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop / Tablet Control Bar */}
      <div className="hidden sm:flex bg-white border border-[#E8E2D8] p-4 mb-8 flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Fabric pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
          <span className="text-[11px] uppercase tracking-wider text-[#8C867D] mr-1 shrink-0">
            Fabric:
          </span>
          <button
            type="button"
            onClick={() => setSelectedFabric("all")}
            className={cn(
              "px-3 py-1 text-xs transition-colors cursor-pointer border shrink-0",
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
                "px-3 py-1 text-xs transition-colors cursor-pointer border shrink-0",
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
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
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

      {/* 1-Tap Quick Filter Chips (Mobile & Desktop) */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-semibold mr-1 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-[#B79B63]" /> Curations:
        </span>
        {[
          { id: "all", label: "All Ensembles" },
          { id: "bestseller", label: "Bestsellers" },
          { id: "new", label: "New Arrivals" },
          { id: "kanchipuram", label: "Kanchipuram Silk" },
          { id: "banarasi", label: "Banarasi Kadhwa" },
          { id: "under-25k", label: "Under ₹25,000" },
          { id: "above-35k", label: "Heirloom Bridal (₹35k+)" },
        ].map((pill) => (
          <button
            key={pill.id}
            type="button"
            onClick={() => setQuickFilter(pill.id as QuickFilter)}
            className={cn(
              "px-3 py-1.5 text-xs whitespace-nowrap rounded-full transition-all cursor-pointer border shrink-0",
              quickFilter === pill.id
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] shadow-xs"
                : "bg-white text-[#5A5650] border-[#E8E2D8] hover:border-[#B79B63] hover:text-[#1C1B19]"
            )}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Royal Atelier Assurance Ribbon */}
      <div className="mb-6 p-3 bg-[#F7F3EB] border border-[#E8E2D8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A5650]">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-[#B79B63]" />
          <span>
            <strong className="text-[#1C1B19]">100% Certified Mulberry Silk:</strong> Authentic
            weaves sourced directly from master loomed cooperatives.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-[#8C867D]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2D6A4F]" /> Silk Mark Certified
          </span>
          <span>•</span>
          <span>Complimentary Fall &amp; Pico Hemming</span>
          <span>•</span>
          <span>Insured Pan-India Dispatch</span>
        </div>
      </div>

      {/* Product Grid (Responsive: 1-col or 2-col on mobile, 3-col on md, 4-col on lg) */}
      {sortedProducts.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#E8E2D8] space-y-4">
          <p className="font-serif text-2xl text-[#1C1B19]">No pieces match your filter</p>
          <p className="text-xs text-[#5A5650]">
            Try resetting your filters or curations to explore all designs.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFabric("all");
              setQuickFilter("all");
            }}
            className="px-6 py-2 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium cursor-pointer hover:bg-[#B79B63] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4 sm:gap-6",
            mobileColumns === 1
              ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
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
                className="group flex flex-col bg-white border border-[#E8E2D8] hover:border-[#D8C7A5] transition-all duration-300 relative luxury-card"
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
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
                    className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 h-8 w-8 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer shadow-xs"
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        wishlisted ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
                      )}
                    />
                  </button>

                  {/* Quick Action Overlay on Hover (Desktop) */}
                  <div className="hidden sm:grid grid-cols-2 gap-1.5 absolute inset-x-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <button
                      type="button"
                      onClick={() => handleOpenQuickView(product)}
                      className="h-9 bg-white/95 text-[#1C1B19] text-[10px] uppercase tracking-[0.14em] font-medium hover:bg-stone-100 transition-colors flex items-center justify-center gap-1 border border-stone-300 shadow-md cursor-pointer backdrop-blur-xs"
                      aria-label="Quick View piece"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#B79B63]" /> Quick View
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes[0])}
                      className="h-9 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-[0.14em] font-medium hover:bg-[#B79B63] hover:text-[#1C1B19] transition-colors flex items-center justify-center gap-1 shadow-md cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" /> + Bag
                    </button>
                  </div>

                  {/* Mobile Direct Action Buttons */}
                  <div className="sm:hidden absolute bottom-2 right-2 z-10 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenQuickView(product)}
                      className="h-8 w-8 bg-white/95 text-[#1C1B19] border border-stone-200 flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      aria-label={`Quick view ${product.title}`}
                    >
                      <Eye className="h-3.5 w-3.5 text-[#B79B63]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes[0])}
                      className="h-8 w-8 bg-[#1C1B19]/90 text-[#FAF7F2] flex items-center justify-center shadow-md active:scale-95 transition-transform"
                      aria-label={`Add ${product.title} to bag`}
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-[#FAF7F2]" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8C867D]">
                      <span>{product.categoryLabel}</span>
                      {product.silkMarkCertified && (
                        <span className="text-[#B79B63] font-medium">Silk Mark</span>
                      )}
                    </div>
                    <Link
                      href={`/women/${product.category}/${product.slug}`}
                      className="mt-1 block text-xs sm:text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-2 leading-snug"
                    >
                      {product.title}
                    </Link>
                  </div>

                  <div>
                    <div className="py-0.5">
                      <Rating value={product.rating} count={product.reviewCount} size="sm" />
                    </div>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-xs sm:text-sm font-semibold text-[#1C1B19]">
                        {formatINR(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] sm:text-xs text-[#8C867D] line-through font-normal">
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

      {/* Mobile Filter & Sort Drawer Bottom Sheet */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[70] sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1C1B19]/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Bottom Sheet */}
          <div
            className="fixed inset-x-0 bottom-0 bg-[#FAF7F2] border-t border-[#E8E2D8] p-5 shadow-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto space-y-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            style={{ animation: "slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#B79B63]" />
                <h3 className="font-serif text-lg text-[#1C1B19]">Filter {"&"} Sort</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="p-1 text-[#8C867D] hover:text-[#1C1B19]"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Section */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C867D] font-medium block">
                Sort Collection By
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { value: "featured", label: "Featured" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Rated" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSortBy(item.value as SortOption)}
                    className={cn(
                      "p-2.5 border text-left flex items-center justify-between transition-colors",
                      sortBy === item.value
                        ? "border-[#B79B63] bg-white text-[#1C1B19] font-medium"
                        : "border-[#E8E2D8] bg-white/60 text-[#5A5650]"
                    )}
                  >
                    <span>{item.label}</span>
                    {sortBy === item.value && <Check className="h-3.5 w-3.5 text-[#B79B63]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric Filter Section */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C867D] font-medium block">
                Filter by Handloom Fabric
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFabric("all")}
                  className={cn(
                    "px-3 py-1.5 text-xs border transition-colors",
                    selectedFabric === "all"
                      ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                      : "bg-white text-[#1C1B19] border-[#E8E2D8]"
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
                      "px-3 py-1.5 text-xs border transition-colors",
                      selectedFabric === f
                        ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                        : "bg-white text-[#1C1B19] border-[#E8E2D8]"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Curations Section */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C867D] font-medium block">
                Quick Curations
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All Ensembles" },
                  { id: "bestseller", label: "Bestsellers" },
                  { id: "new", label: "New Arrivals" },
                  { id: "kanchipuram", label: "Kanchipuram Silk" },
                  { id: "banarasi", label: "Banarasi Kadhwa" },
                  { id: "under-25k", label: "Under ₹25k" },
                  { id: "above-35k", label: "Bridal ₹35k+" },
                ].map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setQuickFilter(pill.id as QuickFilter)}
                    className={cn(
                      "px-3 py-1.5 text-xs border transition-colors",
                      quickFilter === pill.id
                        ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                        : "bg-white text-[#1C1B19] border-[#E8E2D8]"
                    )}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedFabric("all");
                  setQuickFilter("all");
                  setSortBy("featured");
                }}
                className="w-1/3 py-2.5 border border-[#E8E2D8] bg-white text-xs text-[#5A5650] uppercase tracking-wider cursor-pointer hover:bg-neutral-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-2/3 py-2.5 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-medium hover:bg-[#B79B63] transition-colors"
              >
                Show {sortedProducts.length} Pieces
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1B19]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-3xl bg-white border border-[#E8E2D8] shadow-2xl rounded-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3 right-3 z-20 p-1.5 bg-white/90 hover:bg-white text-stone-700 hover:text-[#1C1B19] rounded-full transition-colors cursor-pointer border border-[#E8E2D8] shadow-xs"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Product Image */}
              <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden">
                <Image
                  src={quickViewImage || quickViewProduct.primaryImage}
                  alt={quickViewProduct.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
                {quickViewProduct.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="gold">{quickViewProduct.badge}</Badge>
                  </div>
                )}
                {/* Thumbnails */}
                {quickViewProduct.galleryImages && quickViewProduct.galleryImages.length > 0 && (
                  <div className="absolute bottom-3 inset-x-3 flex items-center gap-2 overflow-x-auto p-1.5 bg-white/80 backdrop-blur-xs rounded-xs">
                    {[quickViewProduct.primaryImage, ...quickViewProduct.galleryImages]
                      .slice(0, 4)
                      .map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setQuickViewImage(img)}
                          className={`relative h-12 w-10 shrink-0 border overflow-hidden cursor-pointer ${
                            (quickViewImage || quickViewProduct.primaryImage) === img
                              ? "border-[#B79B63] ring-1 ring-[#B79B63]"
                              : "border-stone-300 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img}
                            alt="Thumbnail"
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* Details & Customization */}
              <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-stone-500">
                    <span>{quickViewProduct.categoryLabel}</span>
                    {quickViewProduct.silkMarkCertified && (
                      <span className="text-[#B79B63] font-semibold flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" /> Silk Mark Certified
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B19] font-normal leading-snug">
                    {quickViewProduct.title}
                  </h3>

                  <div className="flex items-baseline gap-2.5">
                    <span className="text-lg font-serif font-bold text-[#1C1B19]">
                      {formatINR(quickViewProduct.price)}
                    </span>
                    {quickViewProduct.originalPrice &&
                      quickViewProduct.originalPrice > quickViewProduct.price && (
                        <span className="text-xs text-stone-400 line-through">
                          {formatINR(quickViewProduct.originalPrice)}
                        </span>
                      )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {quickViewProduct.shortDescription || quickViewProduct.description}
                  </p>

                  {/* Size Option Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] uppercase tracking-wider text-stone-500 font-medium">
                      Select Option / Size:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(quickViewProduct.sizes || ["Standard"]).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setQuickViewSize(sz)}
                          className={`px-3 py-1 text-xs border rounded-xs transition-colors cursor-pointer ${
                            quickViewSize === sz
                              ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                              : "bg-white text-stone-700 border-stone-200 hover:border-[#B79B63]"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Blouse Option */}
                  {quickViewProduct.category === "sarees" && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] uppercase tracking-wider text-stone-500 font-medium flex items-center gap-1">
                        <Scissors className="h-3 w-3 text-[#B79B63]" /> Blouse Customization:
                      </label>
                      <select
                        value={quickViewBlouse}
                        onChange={(e) => setQuickViewBlouse(e.target.value)}
                        className="w-full text-xs p-2 border border-stone-200 rounded-xs bg-white text-stone-800 focus:outline-none focus:border-[#B79B63]"
                      >
                        <option value="Unstitched Matching Blouse (Included)">
                          Unstitched Matching Blouse Fabric (Complimentary)
                        </option>
                        <option value="Custom Masterji Tailored Blouse">
                          Bespoke Tailoring by Hyderabad Masterji (+₹1,500)
                        </option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-[#E8E2D8]">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
                    onClick={() => {
                      addToCart(quickViewProduct, quickViewSize, quickViewBlouse, 1);
                      setQuickViewProduct(null);
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4 text-[#B79B63]" />
                    Add to Bag • {formatINR(quickViewProduct.price)}
                  </Button>

                  <Link
                    href={`/women/${quickViewProduct.category}/${quickViewProduct.slug}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="block text-center text-xs text-stone-600 hover:text-[#B79B63] transition-colors py-1"
                  >
                    View Full Product Details &amp; Video Preview →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
