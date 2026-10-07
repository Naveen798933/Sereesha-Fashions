"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Printer,
  Truck,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";
import { getOrderById, Order, getStoredOrders } from "@/lib/orders";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = React.useState<Order | null>(() => {
    if (typeof window === "undefined") return null;
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) return found;
    }
    const all = getStoredOrders();
    return all[0] || null;
  });

  React.useEffect(() => {
    if (!order) {
      const timer = setTimeout(() => {
        if (orderId) {
          const found = getOrderById(orderId);
          if (found) {
            setOrder(found);
            return;
          }
        }
        const all = getStoredOrders();
        setOrder(all[0] || null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [orderId, order]);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
        <Package className="h-12 w-12 text-[#B79B63]" />
        <h1 className="text-2xl font-serif text-[#1C1B19]">No Order Found</h1>
        <p className="text-xs text-[#5A5650]">
          Please check your order reference number or explore our collections.
        </p>
        <Button asChild variant="primary" size="md">
          <Link href="/women/sarees">Browse Sarees</Link>
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const whatsAppUpdateUrl = `https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20I%20would%20like%20to%20receive%20WhatsApp%20dispatch%20updates%20for%20order%20%23${order.id}.`;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-28 sm:pb-16 print:bg-white print:p-0">
      {/* Top Celebratory Header */}
      <div className="text-center space-y-4 mb-8 sm:mb-12 print:mb-6">
        <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] flex items-center justify-center mx-auto rounded-full shadow-xs">
          <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-bold">
            Order Confirmed &amp; Verified
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#1C1B19] font-normal mt-1">
            Thank You, {order.customer.fullName}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#5A5650] max-w-lg mx-auto leading-relaxed">
          Your order <strong className="text-[#1C1B19]">#{order.id}</strong> has been confirmed with
          our Kukatpally flagship atelier. We have dispatched your tax invoice receipt to{" "}
          <strong className="text-[#1C1B19]">{order.customer.phone}</strong>.
        </p>

        {/* Action Buttons for Patrons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 print:hidden">
          <Button asChild variant="primary" size="md">
            <Link href={`/track-order?orderId=${order.id}`}>
              <Truck className="mr-2 h-4 w-4" /> Track Dispatch Timeline
            </Link>
          </Button>

          <Button variant="outline" size="md" onClick={handlePrint} className="cursor-pointer">
            <Printer className="mr-2 h-4 w-4 text-[#B79B63]" /> Print / Save Tax Receipt
          </Button>

          <a
            href={whatsAppUpdateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/30 hover:bg-[#25D366]/25 transition-colors text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Dispatch Updates
          </a>
        </div>
      </div>

      {/* Printable Invoice Card */}
      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 shadow-xs space-y-8 rounded-xs print:border-none print:p-0">
        {/* Invoice Meta Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#E8E2D8]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Order Reference
            </span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-[#1C1B19]">#{order.id}</p>
            <p className="text-[11px] text-[#8C867D] mt-0.5">Placed on {order.date}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Status &amp; Timeline
            </span>
            <p className="text-sm font-semibold text-[#2D6A4F]">{order.status}</p>
            <p className="text-[11px] text-[#5A5650] mt-0.5">
              Est. Arrival: {order.estimatedDelivery}
            </p>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
            Ensembles in this Order ({order.items.length})
          </h2>

          <div className="divide-y divide-[#E8E2D8] border border-[#E8E2D8]">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex gap-4 items-center bg-white hover:bg-[#FAF7F2]/50">
                <div className="relative h-20 w-16 bg-[#EFE8DD] shrink-0 border border-[#E8E2D8] overflow-hidden">
                  <Image
                    src={item.primaryImage}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs space-y-1">
                  <p className="font-semibold text-[#1C1B19] line-clamp-1">{item.title}</p>
                  <p className="text-[11px] text-[#8C867D] uppercase tracking-wider">
                    Option / Size: {item.size}
                  </p>
                  {item.blouseOption && (
                    <p className="text-[11px] text-[#B79B63] font-medium">
                      Atelier Customization: {item.blouseOption}
                    </p>
                  )}
                  <p className="text-[11px] text-[#5A5650]">Qty: {item.quantity}</p>
                </div>
                <div className="text-right text-xs font-semibold text-[#1C1B19]">
                  {formatINR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address and Payment Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Shipping Address */}
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#1C1B19] block">
              Delivery Destination
            </span>
            <p className="font-medium text-[#1C1B19]">{order.customer.fullName}</p>
            <p className="text-[#5A5650]">{order.customer.address}</p>
            <p className="text-[#5A5650]">
              {order.customer.city}, {order.customer.state} — {order.customer.pinCode}
            </p>
            <p className="text-[#5A5650]">Contact: {order.customer.phone}</p>
          </div>

          {/* Payment & Courier Info */}
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#1C1B19] block">
              Payment &amp; Logistics
            </span>
            <div className="flex justify-between">
              <span className="text-[#8C867D]">Payment Mode:</span>
              <span className="font-medium text-[#1C1B19] uppercase">
                {order.paymentMethod === "upi"
                  ? "Razorpay UPI (Verified)"
                  : order.paymentMethod === "card"
                    ? "Credit / Debit Card"
                    : order.paymentMethod === "netbanking"
                      ? "NetBanking"
                      : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8C867D]">Carrier Partner:</span>
              <span className="font-medium text-[#1C1B19]">{order.carrier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8C867D]">Tracking AWB:</span>
              <span className="font-mono font-semibold text-[#1C1B19]">{order.trackingNumber}</span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-[#E8E2D8] pt-4 space-y-2 text-xs">
          <div className="flex justify-between text-[#5A5650]">
            <span>Subtotal</span>
            <span>{formatINR(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-[#2D6A4F] font-medium">
              <span>Promotional Discount Applied</span>
              <span>-{formatINR(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-[#5A5650]">
            <span>Express Courier Shipping</span>
            <span>{order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-[#5A5650]">
            <span>Applicable Goods &amp; Services Tax (GST Included)</span>
            <span>₹0 (Inclusive)</span>
          </div>
          <div className="flex justify-between text-base font-serif font-bold text-[#1C1B19] pt-3 border-t border-[#E8E2D8]">
            <span>Grand Total Paid</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>

        {/* Assurance Seal */}
        <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#8C867D]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#B79B63]" />
            <span>Authorized Silk Mark Certified Atelier • 7-Day Doorstep Exchange</span>
          </div>
          <span className="font-serif italic text-[#B79B63]">Sreesha Elegance, Kukatpally</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="pt-8 text-center print:hidden">
        <Button asChild variant="outline" size="lg">
          <Link href="/women/sarees">
            Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8 text-xs text-[#8C867D]">
          Loading order confirmation receipt...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
