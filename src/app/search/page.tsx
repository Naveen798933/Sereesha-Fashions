"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Heart, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = React.useState(initialQuery);

  const filteredProducts = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return PRODUCTS;

    return PRODUCTS.filter((p) => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.weave.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.occasion.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.details.zariType.toLowerCase().includes(q) ||
        p.details.origin.toLowerCase().includes(q)
      );
    });
  }, [searchTerm]);

  const { isInWishlist, toggleWishlist, addToCart } = useCartWishlist();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-12">
      {/* Search Header */}
      <div className="border-b border-[#E8E2D8] pb-6 mb-8 text-center sm:text-left space-y-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-medium flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="h-3 w-3" /> Boutique Catalog Search
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19] mt-1">
            {searchTerm ? `Search Results for “${searchTerm}”` : "Search Collections"}
          </h1>
          <p className="text-xs text-[#8C867D] mt-1">
            Found {filteredProducts.length} pieces matching your query
          </p>
        </div>

        {/* Live Search Input Bar */}
        <div className="max-w-xl flex items-center bg-white border border-[#E8E2D8] px-4 py-2 focus-within:border-[#B79B63] transition-colors shadow-xs">
          <Search className="h-4 w-4 text-[#8C867D] mr-3 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search silk sarees, velvet lehengas, zari weaves..."
            className="w-full text-xs text-[#1C1B19] outline-none placeholder:text-[#8C867D]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="text-xs text-[#8C867D] hover:text-[#1C1B19] px-2 py-0.5 ml-2 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-4">
          <div className="h-14 w-14 border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] mx-auto">
            <Search className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl text-[#1C1B19]">No Pieces Found</h2>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            We couldn&apos;t find any pieces matching &ldquo;{searchTerm}&rdquo;. Try browsing our
            handloom sarees or explore our signature Royal Nizam edit.
          </p>
          <div className="pt-2">
            <Button asChild variant="primary" size="md">
              <Link href="/women/sarees">
                Explore Sarees <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
            const wishlisted = isInWishlist(product.id);
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-white border border-[#E8E2D8] hover:border-[#D8C7A5] transition-colors"
              >
                <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden">
                  <Link
                    href={`/women/${product.category}/${product.slug}`}
                    className="block h-full w-full"
                  >
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  {product.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <Badge variant={product.badge === "NEW" ? "gold" : "default"}>
                        {product.badge}
                      </Badge>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2.5 right-2.5 z-10 h-8 w-8 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer"
                    aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        wishlisted ? "fill-[#9A3434] text-[#9A3434]" : "text-[#1C1B19]"
                      )}
                    />
                  </button>

                  <div className="hidden sm:block absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                    <button
                      type="button"
                      onClick={() => addToCart(product, product.sizes[0])}
                      className="w-full h-9 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-[0.16em] font-medium hover:bg-[#B79B63] transition-colors flex items-center justify-center"
                    >
                      Quick Add to Bag
                    </button>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                      {product.categoryLabel}
                    </span>
                    <Link
                      href={`/women/${product.category}/${product.slug}`}
                      className="block text-xs font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1 mt-0.5"
                    >
                      {product.title}
                    </Link>
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-[#E8E2D8]">
                    <span className="text-xs font-semibold text-[#1C1B19]">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[10px] text-[#8C867D] line-through">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] py-20 text-center">
          <p className="text-xs text-[#8C867D]">Loading catalog search...</p>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
