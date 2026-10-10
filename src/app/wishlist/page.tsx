"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Share2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setIsCartDrawerOpen, isHydrated } =
    useCartWishlist();

  const wishlistedProducts = React.useMemo(() => {
    return PRODUCTS.filter((p) => wishlist.includes(p.id));
  }, [wishlist]);

  const handleMoveAllToBag = () => {
    if (wishlistedProducts.length === 0) return;
    wishlistedProducts.forEach((product) => {
      addToCart(product, product.sizes[0] || "Standard");
    });
    showToast.success(`Moved ${wishlistedProducts.length} heirloom pieces to your shopping bag!`);
    setIsCartDrawerOpen(true);
  };

  const handleShareWishlist = () => {
    if (typeof window === "undefined") return;
    const itemsList = wishlistedProducts
      .map((p) => `• ${p.title} (${formatINR(p.price)})`)
      .join("\n");
    const shareText = encodeURIComponent(
      `Check out my curated bridal & silk wishlist from Sreesha Elegance, Hyderabad:\n\n${itemsList}\n\nExplore at: ${window.location.origin}/wishlist`
    );
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-16">
      {/* Header Banner */}
      <div className="border-b border-[#E8E2D8] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#B79B63] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              Private Wardrobe
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">
            Your Cherished Wishlist
          </h1>
          <p className="text-xs text-[#5A5650] mt-1">
            {wishlistedProducts.length} heirloom piece{wishlistedProducts.length === 1 ? "" : "s"}{" "}
            saved to your private atelier collection
          </p>
        </div>

        {/* Wishlist Actions */}
        {wishlistedProducts.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWishlist}
              className="text-xs tracking-wider cursor-pointer bg-white"
            >
              <Share2 className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
              Share on WhatsApp
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleMoveAllToBag}
              className="text-xs uppercase tracking-wider cursor-pointer"
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" />
              Move All to Bag ({wishlistedProducts.length})
            </Button>
          </div>
        )}
      </div>

      {!isHydrated ? (
        <div className="py-24 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8C867D] uppercase tracking-widest font-medium">
            Retrieving your private list...
          </p>
        </div>
      ) : wishlistedProducts.length === 0 ? (
        <div className="py-16 text-center max-w-3xl mx-auto space-y-6">
          <div className="relative inline-block">
            <div className="h-20 w-20 border border-[#D8C7A5] bg-[#F7F3EB] flex items-center justify-center text-[#B79B63] mx-auto shadow-xs">
              <Heart className="h-9 w-9 stroke-[1.2]" />
            </div>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#B79B63] rounded-full flex items-center justify-center text-[10px] text-white">
              0
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold">
              Empty Wardrobe
            </span>
            <h2 className="font-serif text-3xl text-[#1C1B19] mt-1">No Items Saved Yet</h2>
          </div>

          <p className="text-sm text-[#5A5650] leading-relaxed max-w-md mx-auto">
            Tap the heart icon on any handloom saree, bridal lehenga, or bespoke kurti to save it
            here while curating your festive trousseau.
          </p>

          <div className="pt-2">
            <Button asChild variant="primary" size="lg" className="px-8 shadow-xs">
              <Link href="/women/sarees">
                Explore Handloom Sarees <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Curated Recommendations */}
          <div className="mt-16 pt-12 border-t border-[#E8E2D8] text-left">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold">
                  Handcrafted In Hyderabad
                </span>
                <h3 className="font-serif text-2xl text-[#1C1B19] mt-0.5">
                  Recommended For Your Trousseau
                </h3>
              </div>
              <Link
                href="/women/sarees"
                className="text-xs text-[#B79B63] hover:text-[#1C1B19] font-medium underline"
              >
                View Full Catalog
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {PRODUCTS.slice(0, 4).map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8E2D8] p-3 flex flex-col justify-between luxury-card group"
                >
                  <div className="relative aspect-[4/5] bg-[#EFE8DD] overflow-hidden mb-3">
                    <Image
                      src={product.primaryImage}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(product.id);
                        showToast.success(`Saved ${product.title} to wishlist`);
                      }}
                      className="absolute top-2 right-2 h-8 w-8 bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#1C1B19] hover:text-[#9A3434] transition-colors border border-[#E8E2D8] cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
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
                    <p className="text-xs font-semibold text-[#1C1B19] mt-1">
                      {formatINR(product.price)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addToCart(product, product.sizes[0]);
                      showToast.success(`Added ${product.title} to bag`);
                      setIsCartDrawerOpen(true);
                    }}
                    className="mt-3 w-full text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1 text-[#B79B63]" /> Move to Bag
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-white border border-[#E8E2D8] luxury-card rounded-xs overflow-hidden"
            >
              {/* Product Image */}
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

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 z-10 bg-[#1C1B19] text-[#FAF7F2] text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium shadow-2xs">
                    {product.badge}
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast.info(`Removed ${product.title} from wishlist`);
                  }}
                  className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#8C867D] hover:text-[#9A3434] hover:bg-white transition-colors border border-[#E8E2D8] cursor-pointer"
                  aria-label="Remove from wishlist"
                  title="Remove from wishlist"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* Authenticity pill */}
                <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#1C1B19] border border-[#E8E2D8] font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#2D6A4F]" />
                  Silk Mark Certified
                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C867D] font-medium">
                    {product.categoryLabel}
                  </span>
                  <Link
                    href={`/women/${product.category}/${product.slug}`}
                    className="mt-1 block text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1"
                  >
                    {product.title}
                  </Link>

                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-sm font-serif font-bold text-[#1C1B19]">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-[#8C867D] line-through font-normal">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Bag Action */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    addToCart(product, product.sizes[0]);
                    showToast.success(`Added ${product.title} to bag`);
                    setIsCartDrawerOpen(true);
                  }}
                  className="w-full text-[10px] tracking-wider uppercase cursor-pointer py-2.5"
                >
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5 text-[#B79B63]" /> Move to Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
