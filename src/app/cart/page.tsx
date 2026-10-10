"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  Sparkles,
  Gift,
  Truck,
  RotateCcw,
  Scissors,
  Check,
  Plus,
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { PRODUCTS, Product } from "@/data/products";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { showToast } from "@/components/ui/Toast";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity, addToCart, isHydrated } =
    useCartWishlist();

  const [couponCode, setCouponCode] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = React.useState<string | null>(null);
  const [couponMessage, setCouponMessage] = React.useState<string | null>(null);

  // Royal Gift Packaging Option
  const [includeGiftPackaging, setIncludeGiftPackaging] = React.useState(false);
  const [giftMessage, setGiftMessage] = React.useState("");

  const giftPackagingFee = includeGiftPackaging ? 250 : 0;
  const freeShippingThreshold = 2999;
  const shippingFee = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 150;
  const discountedTotal = Math.max(0, cartTotal - appliedDiscount);
  const finalTotal = discountedTotal + shippingFee + giftPackagingFee;
  const progressPercent = Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "BRIDE15") {
      const disc = Math.round(cartTotal * 0.15);
      setAppliedDiscount(disc);
      setAppliedCouponCode("BRIDE15");
      setCouponMessage("Festive 15% discount applied successfully!");
      showToast.success("Promo code BRIDE15 applied (-15%)");
    } else if (cleanCode === "ELEGANCE10" || cleanCode === "WELCOME10") {
      const disc = Math.round(cartTotal * 0.1);
      setAppliedDiscount(disc);
      setAppliedCouponCode(cleanCode);
      setCouponMessage("Boutique 10% welcome privilege applied!");
      showToast.success(`Privilege code ${cleanCode} applied (-10%)`);
    } else if (cleanCode === "ROYAL20") {
      if (cartTotal >= 40000) {
        const disc = Math.round(cartTotal * 0.2);
        setAppliedDiscount(disc);
        setAppliedCouponCode("ROYAL20");
        setCouponMessage("Royal Tier 20% privilege applied!");
        showToast.success("Privilege code ROYAL20 applied (-20%)");
      } else {
        setCouponMessage("ROYAL20 requires a minimum bag value of ₹40,000.");
        showToast.error("Requires minimum order of ₹40,000");
      }
    } else {
      setCouponMessage("Invalid coupon code. Try WELCOME10 or BRIDE15");
      showToast.error("Invalid coupon code");
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromo(couponCode);
  };

  const removeCoupon = () => {
    setAppliedDiscount(0);
    setAppliedCouponCode(null);
    setCouponCode("");
    setCouponMessage(null);
    showToast.info("Coupon removed");
  };

  // Cross-sell items not currently in the cart
  const crossSellItems: Product[] = React.useMemo(() => {
    return PRODUCTS.filter((p) => !cart.some((c) => c.product.id === p.id)).slice(0, 3);
  }, [cart]);

  if (!isHydrated) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center py-24">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#B79B63] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8C867D] uppercase tracking-widest font-medium">
            Opening your royal shopping bag...
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#FAF7F2] py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="h-20 w-20 border border-[#D8C7A5] bg-[#F7F3EB] flex items-center justify-center text-[#B79B63] mx-auto shadow-xs">
            <ShoppingBag className="h-9 w-9 stroke-[1.2]" />
          </div>
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#B79B63] rounded-full flex items-center justify-center text-[10px] text-white">
            0
          </span>
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold mb-2">
          Your Curated Selection
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19] font-normal mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-[#5A5650] leading-relaxed max-w-md mx-auto mb-8">
          Discover our certified pure Kanchipuram silk weaves, Nizam bridal lehengas, and
          contemporary couture ensembles handwoven by master artisans.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button asChild variant="primary" size="lg" className="px-8 shadow-xs">
            <Link href="/women/sarees">
              Explore Handloom Sarees <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/collections">The Royal Nizam Edit</Link>
          </Button>
        </div>

        {/* Featured Recommendations for Empty Cart */}
        <div className="mt-16 w-full pt-12 border-t border-[#E8E2D8] text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold">
                Curator&apos;s Recommendations
              </span>
              <h2 className="font-serif text-2xl text-[#1C1B19] mt-0.5">
                Most Cherished Heirlooms
              </h2>
            </div>
            <Link
              href="/women/sarees"
              className="text-xs text-[#B79B63] hover:text-[#1C1B19] transition-colors font-medium underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PRODUCTS.slice(0, 3).map((prod) => (
              <div
                key={prod.id}
                className="bg-white border border-[#E8E2D8] p-3 flex flex-col justify-between luxury-card group"
              >
                <div className="relative aspect-[3/4] bg-[#EFE8DD] overflow-hidden mb-3">
                  <Image
                    src={prod.primaryImage}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {prod.badge && (
                    <span className="absolute top-2 left-2 bg-[#1C1B19] text-[#FAF7F2] text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium">
                      {prod.badge}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                    {prod.categoryLabel}
                  </span>
                  <Link
                    href={`/women/${prod.category}/${prod.slug}`}
                    className="block text-xs font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1 mt-0.5"
                  >
                    {prod.title}
                  </Link>
                  <p className="text-xs font-semibold text-[#1C1B19] mt-1">
                    {formatINR(prod.price)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    addToCart(prod, prod.sizes[0]);
                    showToast.success(`Added ${prod.title} to bag`);
                  }}
                  className="mt-3 w-full text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add to Bag
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-32 sm:pb-16">
      {/* Top Header */}
      <div className="border-b border-[#E8E2D8] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#B79B63] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              Atelier Checkout
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">Shopping Bag</h1>
          <p className="text-xs text-[#5A5650] mt-1">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} item
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 1 ? "s" : ""} selected • Insured
            White-Glove Dispatch
          </p>
        </div>

        {/* Guaranteed Delivery Callout */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 bg-[#F7F3EB] border border-[#D8C7A5]/60 text-xs text-[#5A5650]">
          <Truck className="h-4 w-4 text-[#B79B63]" />
          <span>
            Express Dispatch from <strong className="text-[#1C1B19]">Kukatpally, Hyderabad</strong>
          </span>
        </div>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="mb-8 p-4 bg-white border border-[#E8E2D8] rounded-xs shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs mb-2.5">
          <div className="flex items-center gap-2">
            {remainingForFreeShipping === 0 ? (
              <span className="flex items-center gap-1.5 text-[#2D6A4F] font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Complimentary Royal White-Glove Delivery Unlocked!
              </span>
            ) : (
              <span className="text-[#5A5650]">
                Add{" "}
                <strong className="text-[#1C1B19]">{formatINR(remainingForFreeShipping)}</strong>{" "}
                more to qualify for{" "}
                <strong className="text-[#B79B63]">Complimentary Express Delivery</strong>
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#8C867D] font-medium">
            {progressPercent}% towards Free Shipping
          </span>
        </div>

        <div className="w-full bg-[#EFE8DD] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B79B63] to-[#DFCA9A] transition-all duration-700 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Bag Items & Options (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cart items list */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 bg-white border border-[#E8E2D8] flex gap-4 sm:gap-6 items-start luxury-card rounded-xs"
              >
                {/* Image */}
                <div className="relative h-32 w-24 sm:h-36 sm:w-28 shrink-0 overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
                  <Image
                    src={item.product.primaryImage}
                    alt={item.product.title}
                    fill
                    sizes="112px"
                    className="object-cover object-center"
                  />
                  {item.product.badge && (
                    <span className="absolute top-1.5 left-1.5 bg-[#1C1B19] text-[#FAF7F2] text-[8px] uppercase tracking-wider px-1.5 py-0.5">
                      {item.product.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8C867D] font-medium">
                        {item.product.categoryLabel}
                      </span>
                      <Link
                        href={`/women/${item.product.category}/${item.product.slug}`}
                        className="block text-sm sm:text-base font-serif text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1 mt-0.5"
                      >
                        {item.product.title}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromCart(item.id);
                        showToast.info(`Removed ${item.product.title}`);
                      }}
                      className="p-1.5 text-[#8C867D] hover:text-[#9A3434] transition-colors cursor-pointer"
                      aria-label="Remove item"
                      title="Remove from bag"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Attributes */}
                  <div className="text-xs text-[#5A5650] space-y-1">
                    <p className="flex items-center gap-1.5">
                      <span className="text-[#8C867D]">Option:</span>
                      <span className="font-medium text-[#1C1B19] px-2 py-0.5 bg-[#F7F3EB] border border-[#E8E2D8] text-[11px]">
                        {item.size}
                      </span>
                    </p>
                    {item.blouseOption && (
                      <p className="text-[11px] text-[#B79B63] flex items-center gap-1">
                        <Scissors className="h-3 w-3" />
                        <span>Blouse: {item.blouseOption}</span>
                      </p>
                    )}
                  </div>

                  {/* Pricing & Stepper */}
                  <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                    <QuantityStepper
                      value={item.quantity}
                      min={1}
                      max={10}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                    />
                    <div className="text-right">
                      <span className="text-base font-serif font-semibold text-[#1C1B19]">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#8C867D]">
                          {formatINR(item.product.price)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bespoke Royal Gift Packaging Toggle */}
          <div className="p-5 bg-white border border-[#E8E2D8] rounded-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 bg-[#F7F3EB] border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] shrink-0">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Signature Royal Gift Presentation (+₹250)
                  </h3>
                  <p className="text-xs text-[#5A5650] mt-0.5">
                    Gold-foil embossed Nizam keepsake hardbox, butter paper wrap, satin ribbon &amp;
                    handwritten calligraphy card.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="gift-packaging-toggle"
                checked={includeGiftPackaging}
                onChange={(e) => {
                  setIncludeGiftPackaging(e.target.checked);
                  if (e.target.checked) {
                    showToast.success("Royal Gift Box added (+₹250)");
                  } else {
                    setGiftMessage("");
                  }
                }}
                className="h-4 w-4 text-[#B79B63] focus:ring-[#B79B63] border-[#E8E2D8] rounded-xs cursor-pointer mt-1"
              />
            </div>

            {includeGiftPackaging && (
              <div className="pt-3 border-t border-[#E8E2D8] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label htmlFor="gift-message" className="text-[#5A5650] font-medium">
                    Personalized Calligraphy Note (Printed on Handmade Cotton Card):
                  </label>
                  <span className="text-[10px] text-[#8C867D]">{giftMessage.length}/180 chars</span>
                </div>
                <textarea
                  id="gift-message"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value.slice(0, 180))}
                  placeholder="e.g. Dearest Priya, May your special day shine as brilliantly as this heirloom weave. With all our love..."
                  rows={2}
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] focus:outline-none rounded-xs"
                />
              </div>
            )}
          </div>

          {/* Handloom & Silk Mark Assurances */}
          <div className="p-5 bg-[#F7F3EB] border border-[#D8C7A5]/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#5A5650]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-[#B79B63] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1C1B19] uppercase tracking-wider text-[11px]">
                  100% Certified Pure Silk
                </h4>
                <p className="text-[11px] mt-0.5 text-[#5A5650]">
                  Every saree comes with authentic Silk Mark certification tags and QR verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw className="h-5 w-5 text-[#B79B63] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-[#1C1B19] uppercase tracking-wider text-[11px]">
                  7-Day Atelier Exchange
                </h4>
                <p className="text-[11px] mt-0.5 text-[#5A5650]">
                  Hassle-free exchange policy with door-to-door courier pickup across India.
                </p>
              </div>
            </div>
          </div>

          {/* Atelier Recommends (Cross-sells) */}
          {crossSellItems.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#1C1B19]">
                  Complete The Ensemble
                </span>
                <span className="text-[10px] text-[#B79B63] uppercase tracking-wider font-medium">
                  Curated Pairs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {crossSellItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-[#E8E2D8] flex items-center gap-3 luxury-card"
                  >
                    <div className="relative h-14 w-12 shrink-0 bg-[#EFE8DD] overflow-hidden">
                      <Image
                        src={item.primaryImage}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-medium text-[#1C1B19] truncate">{item.title}</p>
                      <p className="text-xs font-semibold text-[#B79B63]">
                        {formatINR(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(item, item.sizes[0]);
                        showToast.success(`Added ${item.title}`);
                      }}
                      className="px-2.5 py-1.5 bg-[#1C1B19] text-[#FAF7F2] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#B79B63] transition-colors shrink-0 cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Checkout (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#E8E2D8] space-y-6 shadow-xs sticky top-24 rounded-xs">
            <div className="border-b border-[#E8E2D8] pb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold">
                Pricing Breakdown
              </span>
              <h2 className="font-serif text-2xl text-[#1C1B19] mt-0.5">Order Summary</h2>
            </div>

            {/* Voucher code form */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider text-[#8C867D] block font-medium">
                Privilege or Festive Promo Code
              </label>

              {appliedCouponCode ? (
                <div className="p-3 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#2D6A4F] font-semibold">
                    <Check className="h-4 w-4" />
                    <span>
                      {appliedCouponCode} applied (-{formatINR(appliedDiscount)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-[11px] text-[#9A3434] hover:underline cursor-pointer font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex border border-[#E8E2D8] focus-within:border-[#B79B63] transition-colors">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME10, BRIDE15"
                      className="w-full px-3 py-2.5 text-xs bg-transparent outline-none uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider hover:bg-[#B79B63] transition-colors font-medium shrink-0 cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={cn(
                        "text-[11px]",
                        appliedDiscount > 0 ? "text-[#2D6A4F]" : "text-[#9A3434]"
                      )}
                    >
                      {couponMessage}
                    </p>
                  )}
                </form>
              )}

              {/* Instant Privilege Chips */}
              {!appliedCouponCode && (
                <div className="pt-1">
                  <span className="text-[10px] text-[#8C867D] block mb-1.5 uppercase tracking-wider">
                    Available Offers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyPromo("WELCOME10")}
                      className="px-2 py-1 bg-[#F7F3EB] border border-[#D8C7A5] text-[10px] font-mono font-medium text-[#1C1B19] hover:bg-[#B79B63] hover:text-white transition-colors cursor-pointer"
                    >
                      WELCOME10 (-10%)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPromo("BRIDE15")}
                      className="px-2 py-1 bg-[#F7F3EB] border border-[#D8C7A5] text-[10px] font-mono font-medium text-[#1C1B19] hover:bg-[#B79B63] hover:text-white transition-colors cursor-pointer"
                    >
                      BRIDE15 (-15%)
                    </button>
                    {cartTotal >= 40000 && (
                      <button
                        type="button"
                        onClick={() => applyPromo("ROYAL20")}
                        className="px-2 py-1 bg-[#1C1B19] text-[#FAF7F2] text-[10px] font-mono font-medium hover:bg-[#B79B63] transition-colors cursor-pointer"
                      >
                        ROYAL20 (-20%)
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D8] text-xs text-[#5A5650]">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="text-[#1C1B19] font-medium">{formatINR(cartTotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#2D6A4F] font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" /> Promo Discount
                  </span>
                  <span>-{formatINR(appliedDiscount)}</span>
                </div>
              )}

              {includeGiftPackaging && (
                <div className="flex justify-between text-[#1C1B19]">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5 text-[#B79B63]" /> Royal Gift Hardbox
                  </span>
                  <span>{formatINR(giftPackagingFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Express Shipping</span>
                <span
                  className={shippingFee === 0 ? "text-[#2D6A4F] font-semibold" : "text-[#1C1B19]"}
                >
                  {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-[#8C867D]">
                <span>GST (Goods &amp; Services Tax)</span>
                <span>Included (5% - 12%)</span>
              </div>

              <div className="flex justify-between text-lg font-serif font-bold text-[#1C1B19] pt-4 border-t border-[#E8E2D8]">
                <span>Grand Total</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Button
              variant="primary"
              size="lg"
              asChild
              className="w-full text-xs uppercase tracking-[0.16em] py-4 shadow-sm"
            >
              <Link href="/checkout" className="flex items-center justify-center">
                <Lock className="h-4 w-4 mr-2 text-[#B79B63]" />
                Proceed to Checkout ({formatINR(finalTotal)})
              </Link>
            </Button>

            {/* Trust Assurances */}
            <div className="pt-2 text-center text-[10px] text-[#8C867D] space-y-1.5 border-t border-[#F0EBE1]">
              <p className="flex items-center justify-center gap-1 font-medium text-[#5A5650]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2D6A4F]" /> 256-Bit SSL Encrypted
                Checkout
              </p>
              <p>Supported: UPI (GPay, PhonePe, Paytm), Visa, Mastercard, RuPay &amp; NetBanking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Checkout Bar */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D8] p-4 shadow-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#8C867D] uppercase tracking-wider block">
            Total Amount
          </span>
          <span className="text-lg font-serif font-bold text-[#1C1B19]">
            {formatINR(finalTotal)}
          </span>
        </div>

        <Button asChild variant="primary" size="md" className="flex-1 py-3 text-xs tracking-wider">
          <Link href="/checkout" className="flex items-center justify-center">
            <Lock className="h-3.5 w-3.5 mr-1.5 text-[#B79B63]" />
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </div>
  );
}
