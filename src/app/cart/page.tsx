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
} from "lucide-react";
import { useCartWishlist } from "@/context/CartWishlistContext";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { showToast } from "@/components/ui/Toast";

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCartWishlist();

  const [couponCode, setCouponCode] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState<number>(0);
  const [couponMessage, setCouponMessage] = React.useState<string | null>(null);

  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [orderCompleted, setOrderCompleted] = React.useState(false);
  const [orderId, setOrderId] = React.useState<string>("");

  const freeShippingThreshold = 2999;
  const shippingFee = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 150;
  const discountedTotal = Math.max(0, cartTotal - appliedDiscount);
  const finalTotal = discountedTotal + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "BRIDE15") {
      const disc = Math.round(cartTotal * 0.15);
      setAppliedDiscount(disc);
      setCouponMessage("Festive 15% discount applied successfully!");
      showToast.success("Promo code BRIDE15 applied (-15%)");
    } else if (code === "ELEGANCE10") {
      const disc = Math.round(cartTotal * 0.1);
      setAppliedDiscount(disc);
      setCouponMessage("Boutique 10% welcome discount applied!");
      showToast.success("Promo code ELEGANCE10 applied (-10%)");
    } else {
      setCouponMessage("Invalid coupon code. Try BRIDE15 or ELEGANCE10");
      showToast.error("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate secure Razorpay gateway checkout
    setTimeout(() => {
      const generatedId = `SE-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(generatedId);
      setIsCheckingOut(false);
      setOrderCompleted(true);
      clearCart();
      showToast.success("Payment verified! Order placed successfully.");
    }, 1800);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center space-y-6">
        <div className="h-16 w-16 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19] font-normal">
          Thank You for Shopping with Us
        </h1>
        <p className="text-sm text-[#5A5650] max-w-md mx-auto leading-relaxed">
          Your order <strong className="text-[#1C1B19]">#{orderId}</strong> has been received by our
          Hyderabad atelier. A confirmation receipt and tracking updates have been sent to your
          registered contact.
        </p>

        <div className="p-6 bg-white border border-[#E8E2D8] max-w-md mx-auto text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-[#E8E2D8] pb-2 font-medium text-[#1C1B19]">
            <span>Order Reference</span>
            <span>#{orderId}</span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Payment Method</span>
            <span>Razorpay (UPI / NetBanking / Cards)</span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Delivery Timeline</span>
            <span>2-4 Business Days Express</span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Shipping</span>
            <span>Banjara Hills Atelier, Hyderabad</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild variant="primary" size="lg">
            <Link href={`/track-order?orderId=${orderId}`}>Track Order Timeline</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/women/sarees">Continue Browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] py-20 px-4 max-w-2xl mx-auto text-center space-y-5">
        <div className="h-16 w-16 border border-[#D8C7A5] flex items-center justify-center text-[#B79B63] mx-auto">
          <ShoppingBag className="h-8 w-8 stroke-[1.2]" />
        </div>
        <h1 className="text-3xl font-serif text-[#1C1B19]">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-[#5A5650] leading-relaxed max-w-sm mx-auto">
          Explore our certified Kanchipuram silk sarees or explore our signature Royal Nizam festive
          edit.
        </p>
        <div className="pt-2">
          <Button asChild variant="primary" size="lg">
            <Link href="/women/sarees">
              Explore Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-12">
      <div className="border-b border-[#E8E2D8] pb-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">Shopping Bag</h1>
        <p className="text-xs text-[#8C867D] mt-1">{cart.length} unique pieces in your selection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart items (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white border border-[#E8E2D8] flex gap-4 sm:gap-6 items-start"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#EFE8DD] border border-[#E8E2D8]">
                <Image
                  src={item.product.primaryImage}
                  alt={item.product.title}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
                      {item.product.categoryLabel}
                    </span>
                    <Link
                      href={`/women/${item.product.category}/${item.product.slug}`}
                      className="block text-sm font-medium text-[#1C1B19] hover:text-[#B79B63] transition-colors line-clamp-1"
                    >
                      {item.product.title}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-[#8C867D] hover:text-[#9A3434] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs text-[#5A5650] space-y-0.5">
                  <p>
                    Option: <strong className="text-[#1C1B19]">{item.size}</strong>
                  </p>
                  {item.blouseOption && (
                    <p className="text-[#B79B63]">Blouse: {item.blouseOption}</p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    min={1}
                    max={10}
                    onChange={(q) => updateQuantity(item.id, q)}
                    size="sm"
                  />
                  <span className="text-sm font-semibold text-[#1C1B19]">
                    {formatINR(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Assurances */}
          <div className="p-4 bg-[#F7F3EB] border border-[#E8E2D8] flex items-center gap-3 text-xs text-[#5A5650]">
            <ShieldCheck className="h-5 w-5 text-[#B79B63] shrink-0" />
            <p>
              Every pure silk weave arrives with authentic <strong>Silk Mark certification</strong>{" "}
              and tamper-proof security seals.
            </p>
          </div>
        </div>

        {/* Order Summary (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white border border-[#E8E2D8] space-y-5">
            <h2 className="font-serif text-xl text-[#1C1B19]">Order Summary</h2>

            {/* Voucher code */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#8C867D] block">
                Promo or Gift Code
              </label>
              <div className="flex border border-[#E8E2D8] focus-within:border-[#B79B63]">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. BRIDE15"
                  className="w-full px-3 py-2 text-xs bg-transparent outline-none uppercase"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider hover:bg-[#B79B63] transition-colors"
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

            {/* Totals Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-[#E8E2D8] text-xs text-[#5A5650]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1C1B19] font-medium">{formatINR(cartTotal)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#2D6A4F] font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" /> Discount Applied
                  </span>
                  <span>-{formatINR(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span
                  className={shippingFee === 0 ? "text-[#2D6A4F] font-semibold" : "text-[#1C1B19]"}
                >
                  {shippingFee === 0 ? "FREE" : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (Included)</span>
                <span>5% - 12%</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#1C1B19] pt-3 border-t border-[#E8E2D8]">
                <span>Total Amount</span>
                <span>{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              disabled={isCheckingOut}
              onClick={handleCheckout}
              className="w-full"
            >
              <Lock className="h-4 w-4 mr-2 text-[#B79B63]" />
              {isCheckingOut
                ? "Connecting to Razorpay..."
                : `Pay ${formatINR(finalTotal)} via Razorpay`}
            </Button>

            <div className="pt-2 text-center text-[10px] text-[#8C867D] space-y-1">
              <p>🔒 256-Bit Encrypted Checkout Powered by Razorpay</p>
              <p>UPI, RuPay, Visa, Mastercard &amp; NetBanking Accepted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
