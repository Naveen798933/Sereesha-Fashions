"use client";

import * as React from "react";
import Link from "next/link";
import { Package, MapPin, Heart, Phone, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/utils";

export default function AccountPage() {
  const [activeTab, setActiveTab] = React.useState<"orders" | "addresses" | "styling">("orders");

  const mockOrders = [
    {
      id: "SE-84920",
      date: "04 October 2026",
      status: "Dispatched (In Transit)",
      carrier: "BlueDart Express",
      trackingNumber: "BD893201948IN",
      total: 18500,
      item: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
    },
    {
      id: "SE-79213",
      date: "18 September 2026",
      status: "Delivered",
      carrier: "Delhivery Surface",
      trackingNumber: "DL193840294IN",
      total: 8900,
      item: "Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Profile Summary */}
      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-16 w-16 bg-[#1C1B19] text-[#B79B63] flex items-center justify-center font-serif text-2xl font-semibold">
            S
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">Sreeja Varma</h1>
            <p className="text-xs text-[#5A5650] mt-0.5">
              sreeja.varma@example.com • +91 98490 12345
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-0.5 bg-[#F7F3EB] text-[#B79B63] border border-[#D8C7A5] text-[10px] uppercase tracking-wider font-semibold">
                Boutique Gold Patron
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/wishlist">
              <Heart className="mr-1.5 h-3.5 w-3.5" /> Wishlist
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/women/sarees">Shop New Drops</Link>
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border ${
              activeTab === "orders"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#B79B63]" /> My Orders
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border ${
              activeTab === "addresses"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#B79B63]" /> Saved Addresses
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("styling")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border ${
              activeTab === "styling"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#B79B63]" /> Concierge Styling
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-[#E8E2D8] p-6 sm:p-8">
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4">
                <h2 className="font-serif text-2xl text-[#1C1B19]">Recent Orders</h2>
                <p className="text-xs text-[#8C867D]">Manage and track your couture orders</p>
              </div>

              <div className="space-y-4">
                {mockOrders.map((ord) => (
                  <div key={ord.id} className="p-5 border border-[#E8E2D8] space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E8E2D8] pb-3 text-xs">
                      <div>
                        <span className="font-semibold text-[#1C1B19]">Order #{ord.id}</span>
                        <span className="text-[#8C867D] ml-3">Placed on {ord.date}</span>
                      </div>
                      <span className="px-2.5 py-0.5 bg-[#F7F3EB] text-[#B79B63] border border-[#D8C7A5] font-semibold text-[10px] uppercase tracking-wider">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-medium text-[#1C1B19]">{ord.item}</p>
                      <p className="text-[#5A5650]">
                        Courier: {ord.carrier} • Tracking:{" "}
                        <span className="font-mono">{ord.trackingNumber}</span>
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="font-semibold text-[#1C1B19] text-sm">
                        Total: {formatINR(ord.total)}
                      </span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/track-order?orderId=${ord.id}`}>Track Shipment</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1B19]">Saved Delivery Addresses</h2>
                  <p className="text-xs text-[#8C867D]">
                    Doorstep delivery destinations across India
                  </p>
                </div>
              </div>

              <div className="p-5 border border-[#B79B63] bg-[#F7F3EB]/30 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#1C1B19]">Sreeja Varma (Default)</span>
                  <span className="px-2 py-0.5 bg-[#B79B63] text-white text-[9px] uppercase font-bold">
                    Primary
                  </span>
                </div>
                <p className="text-[#5A5650]">
                  Flat 402, Royal Residency, Road No. 36, Jubilee Hills
                </p>
                <p className="text-[#5A5650]">Hyderabad, Telangana — 500033</p>
                <p className="text-[#5A5650]">Mobile: +91 98490 12345</p>
              </div>
            </div>
          )}

          {activeTab === "styling" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4">
                <h2 className="font-serif text-2xl text-[#1C1B19]">
                  Boutique Concierge &amp; Styling
                </h2>
                <p className="text-xs text-[#8C867D]">
                  Private virtual consults with Hyderabad master designers
                </p>
              </div>

              <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] space-y-4 text-xs">
                <ShieldCheck className="h-6 w-6 text-[#B79B63]" />
                <p className="text-sm font-medium text-[#1C1B19]">
                  Book a Complimentary 1-on-1 Video Consultation
                </p>
                <p className="text-[#5A5650] leading-relaxed">
                  Our resident master stylists in Banjara Hills will present weaves under studio
                  lighting, guide you on blouse embroidery, and confirm exact body measurements
                  before stitching.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hello%2C%20I%20would%20like%20to%20schedule%20a%20private%20virtual%20styling%20session%20with%20your%20Hyderabad%20atelier."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold"
                >
                  <Phone className="h-4 w-4" /> Schedule via WhatsApp Concierge
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
