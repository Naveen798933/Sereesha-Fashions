"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { PRODUCTS } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatINR } from "@/lib/utils";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    addToCart,
  } = useCartWishlist();

  const freeShippingThreshold = 2999;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1B19]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between border-l border-[#E8E2D8] transition-transform duration-300"
        style={{ animation: "slideInRight 0.3s ease forwards" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#B79B63]" />
            <h2 className="font-serif text-xl text-[#1C1B19] tracking-wide font-normal">
              Your Shopping Bag ({cart.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-[#1C1B19] hover:text-[#B79B63] transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-6 py-3 bg-[#F7F3EB] border-b border-[#E8E2D8] text-[11px] text-[#5A5650]">
          {remainingForFreeShipping > 0 ? (
            <p>
              Add{" "}
              <span className="font-semibold text-[#1C1B19]">
                {formatINR(remainingForFreeShipping)}
              </span>{" "}
              more to qualify for{" "}
              <span className="text-[#2D6A4F] font-semibold">Complimentary Express Shipping</span>!
            </p>
          ) : (
            <p className="text-[#2D6A4F] font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> You have qualified for Free Express Shipping
              across India!
            </p>
          )}
          <div className="w-full bg-[#E8E2D8] h-1.5 mt-2 rounded-full overflow-hidden">
            <div
              className="bg-[#B79B63] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="h-16 w-16 border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] mx-auto">
                <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
              </div>
              <h3 className="font-serif text-2xl text-[#1C1B19]">Your bag is empty</h3>
              <p className="text-xs text-[#5A5650] max-w-xs leading-relaxed">
                Explore our Royal Nizam festive edit or certified pure handloom silk sarees.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCartDrawerOpen(false)}
                asChild
              >
                <Link href="/women/sarees">Discover Collection</Link>
              </Button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#E8E2D8] hover:border-[#D8C7A5] transition-colors rounded-xs shadow-2xs"
                >
                  {/* Product Thumbnail */}
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/women/${item.product.category}/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-2 leading-snug"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8C867D] hover:text-[#9A3434] transition-colors p-1 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                        Option: {item.size}
                      </p>
                      {item.blouseOption && (
                        <p className="text-[10px] text-[#B79B63] font-medium">
                          Blouse: {item.blouseOption}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-[#1C1B19]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={10}
                        onChange={(q) => updateQuantity(item.id, q)}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Curated Atelier Recommendation / Quick Add */}
              {cart.length > 0 && (
                <div className="pt-3 border-t border-[#E8E2D8]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1C1B19] font-bold">
                      Atelier Recommends
                    </span>
                    <span className="text-[9px] text-[#B79B63] font-semibold uppercase tracking-wider">
                      Pair With Ensemble
                    </span>
                  </div>
                  {(() => {
                    const recommendation =
                      PRODUCTS.find((p) => !cart.some((c) => c.product.id === p.id)) || PRODUCTS[0];
                    return (
                      <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] flex items-center gap-3 rounded-xs">
                        <div className="relative h-14 w-12 shrink-0 bg-[#EFE8DD] overflow-hidden border border-[#E8E2D8]">
                          <Image
                            src={recommendation.primaryImage}
                            alt={recommendation.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-medium text-[#1C1B19] truncate">
                            {recommendation.title}
                          </p>
                          <p className="text-xs font-semibold text-[#B79B63]">
                            {formatINR(recommendation.price)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(recommendation, recommendation.sizes[0])}
                          className="px-2.5 py-1.5 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#B79B63] transition-colors shrink-0 rounded-2xs"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E8E2D8] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5A5650]">
                <span>Subtotal (Inclusive of All Taxes)</span>
                <span className="font-semibold text-[#1C1B19]">{formatINR(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-[#5A5650]">
                <span>Shipping</span>
                <span className="text-[#2D6A4F] font-medium">
                  {cartTotal >= freeShippingThreshold ? "FREE" : "₹150"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1C1B19] pt-2 border-t border-[#E8E2D8]">
                <span>Estimated Total</span>
                <span>
                  {formatINR(cartTotal >= freeShippingThreshold ? cartTotal : cartTotal + 150)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCartDrawerOpen(false)}
                asChild
              >
                <Link href="/cart">View Full Bag</Link>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCartDrawerOpen(false)}
                asChild
              >
                <Link href="/checkout">
                  Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
