"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCartWishlist();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="border-b border-[#E8E2D8] pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">Your Wishlist</h1>
        <p className="text-xs text-[#8C867D] mt-1">
          {wishlistedProducts.length} cherished pieces saved to your private list
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto space-y-5">
          <div className="h-16 w-16 border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] mx-auto">
            <Heart className="h-8 w-8 stroke-[1.2]" />
          </div>
          <h2 className="font-serif text-2xl text-[#1C1B19]">No Items Saved Yet</h2>
          <p className="text-xs text-[#5A5650] leading-relaxed">
            As you explore our Kanchipuram weaves and bridal ensembles, click the heart icon on any
            piece to save it here for later.
          </p>
          <Button asChild variant="primary" size="lg">
            <Link href="/women/sarees">
              Explore Handloom Sarees <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div key={product.id} className="group flex flex-col bg-white border border-[#E8E2D8]">
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

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 h-8 w-8 bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#9A3434] hover:bg-white transition-colors border border-[#E8E2D8]"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                    {product.categoryLabel}
                  </p>
                  <Link
                    href={`/women/${product.category}/${product.slug}`}
                    className="mt-1 block text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <p className="text-sm font-semibold text-[#1C1B19] mt-1">
                    {formatINR(product.price)}
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addToCart(product, product.sizes[0])}
                  className="w-full text-[10px] tracking-wider uppercase"
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
