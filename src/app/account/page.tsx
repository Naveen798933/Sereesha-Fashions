"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  MapPin,
  Heart,
  Phone,
  ShieldCheck,
  ChevronRight,
  Plus,
  Trash2,
  Truck,
  ExternalLink,
  LogOut,
  User as UserIcon,
  Crown,
  Sparkles,
  Gift,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatINR, cn } from "@/lib/utils";
import { getStoredOrders, fetchUserOrders, Order } from "@/lib/orders";
import { showToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getTierProgress, ALL_LOYALTY_TIERS } from "@/lib/loyalty";

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  type: "Home" | "Work" | "Atelier";
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    name: "Sreeja Varma",
    phone: "+91 98490 12345",
    street: "Flat 402, Royal Residency, Road No. 36, Jubilee Hills",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500033",
    isDefault: true,
    type: "Home",
  },
  {
    id: "addr-2",
    name: "Sreeja Varma (Studio)",
    phone: "+91 98490 12345",
    street: "Plot 18, Phase 2, Kavuri Hills, Madhapur",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "500081",
    isDefault: false,
    type: "Work",
  },
];

export default function AccountPage() {
  const { user, profile, signOut, isLoading } = useAuth();
  const [activeTab, setActiveTab] = React.useState<
    "orders" | "addresses" | "styling" | "privilege"
  >("orders");
  const [copiedCoupon, setCopiedCoupon] = React.useState(false);
  const [orders, setOrders] = React.useState<Order[]>(() => getStoredOrders());

  const lifetimeSpend = React.useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  }, [orders]);

  const tierProgress = React.useMemo(() => {
    return getTierProgress(lifetimeSpend);
  }, [lifetimeSpend]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    showToast.success(`Privilege coupon ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCoupon(false), 2500);
  };
  const [addresses, setAddresses] = React.useState<SavedAddress[]>(() => {
    if (typeof window === "undefined") return DEFAULT_ADDRESSES;
    try {
      const stored = localStorage.getItem("sreesha_saved_addresses");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_ADDRESSES;
  });

  // Load orders from Supabase if user is logged in
  React.useEffect(() => {
    fetchUserOrders(user?.id, profile?.phone || user?.phone).then((loaded) => {
      if (loaded && loaded.length > 0) {
        setOrders(loaded);
      }
    });
  }, [user, profile]);

  // Load addresses from Supabase if logged in
  React.useEffect(() => {
    if (!user) return;
    const fetchRemoteAddresses = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("addresses").select("*").eq("user_id", user.id);

        if (!error && data && data.length > 0) {
          interface RemoteAddressRow {
            id: string;
            name: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            pin_code: string;
            is_default: boolean;
            type: string;
          }
          const mapped: SavedAddress[] = (data as unknown as RemoteAddressRow[]).map((d) => ({
            id: d.id,
            name: d.name,
            phone: d.phone,
            street: d.street,
            city: d.city,
            state: d.state,
            pinCode: d.pin_code,
            isDefault: d.is_default,
            type: d.type === "Work" || d.type === "Atelier" ? d.type : "Home",
          }));
          setAddresses(mapped);
        }
      } catch (err) {
        console.warn("Addresses fetch error:", err);
      }
    };
    fetchRemoteAddresses();
  }, [user]);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [newAddr, setNewAddr] = React.useState({
    name: "",
    phone: "",
    street: "",
    city: "Hyderabad",
    state: "Telangana",
    pinCode: "",
    type: "Home" as "Home" | "Work" | "Atelier",
  });

  const handleOpenAddressModal = () => {
    setNewAddr({
      name: profile?.full_name || user?.user_metadata?.full_name || "",
      phone: profile?.phone || user?.phone || "",
      street: "",
      city: "Hyderabad",
      state: "Telangana",
      pinCode: "",
      type: "Home",
    });
    setIsAddressModalOpen(true);
  };

  // Ensure default addresses persisted to localStorage once on client
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("sreesha_saved_addresses");
      if (!stored) {
        localStorage.setItem("sreesha_saved_addresses", JSON.stringify(DEFAULT_ADDRESSES));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.name.trim() || !newAddr.street.trim() || !newAddr.pinCode.trim()) {
      showToast.error("Please fill in all required address fields");
      return;
    }

    const created: SavedAddress = {
      id: `addr-${Date.now()}`,
      name: newAddr.name.trim(),
      phone: newAddr.phone.trim() || profile?.phone || user?.phone || "+91 98490 12345",
      street: newAddr.street.trim(),
      city: newAddr.city.trim() || "Hyderabad",
      state: newAddr.state.trim() || "Telangana",
      pinCode: newAddr.pinCode.trim(),
      isDefault: addresses.length === 0,
      type: newAddr.type,
    };

    const updated = [...addresses, created];
    setAddresses(updated);
    try {
      localStorage.setItem("sreesha_saved_addresses", JSON.stringify(updated));
    } catch {}
    setIsAddressModalOpen(false);
    setNewAddr({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "Telangana",
      pinCode: "",
      type: "Home",
    });
    showToast.success("New delivery destination saved successfully");
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    try {
      localStorage.setItem("sreesha_saved_addresses", JSON.stringify(updated));
    } catch {}

    if (user) {
      try {
        const supabase = createClient();
        await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
      } catch (err) {
        console.warn("Could not delete address from Supabase:", err);
      }
    }
    showToast.success("Address removed");
  };

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    try {
      localStorage.setItem("sreesha_saved_addresses", JSON.stringify(updated));
    } catch {}
    showToast.success("Default delivery destination updated");
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user ? "Valued Client" : "Guest Client");
  const displayEmail = profile?.email || user?.email || "Guest Session";
  const displayInitial = (displayName || "S").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-28 sm:pb-12">
      {/* Guest Session Notification Banner if not logged in */}
      {!user && !isLoading && (
        <div className="bg-[#FAF7F2] border border-[#D8C7A5] p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-[#B79B63]" />
            <p className="text-xs text-[#5A5650]">
              You are currently viewing orders stored on this device.{" "}
              <strong className="text-[#1C1B19]">Sign in</strong> to sync your orders across all
              devices.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login?redirect=/account">Sign In</Link>
            </Button>
            <Button asChild variant="primary" size="sm">
              <Link href="/register?redirect=/account">Register</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-16 w-16 bg-[#1C1B19] text-[#B79B63] flex items-center justify-center font-serif text-2xl font-semibold border border-[#B79B63]">
            {displayInitial}
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">{displayName}</h1>
            <p className="text-xs text-[#5A5650] mt-0.5">
              {displayEmail} {profile?.phone ? `• ${profile.phone}` : ""}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`px-2.5 py-0.5 border text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1 ${
                  tierProgress.currentTier.id === "zari_crown"
                    ? "bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/40"
                    : tierProgress.currentTier.id === "royal_weaver"
                      ? "bg-[#F7F3EB] text-[#8C6D28] border-[#B79B63]/50"
                      : "bg-stone-100 text-stone-700 border-stone-300"
                }`}
              >
                {tierProgress.currentTier.id === "zari_crown" ? (
                  <Crown className="w-3 h-3 text-[#2D6A4F]" />
                ) : (
                  <Sparkles className="w-3 h-3 text-[#B79B63]" />
                )}
                <span>{tierProgress.currentTier.name}</span>
              </span>
              <span className="text-[11px] text-[#8C867D]">
                • {orders.length} Handloom Purchases ({formatINR(lifetimeSpend)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button asChild variant="outline" size="sm">
            <Link href="/wishlist">
              <Heart className="mr-1.5 h-3.5 w-3.5" /> Wishlist
            </Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/women/sarees">Shop New Drops</Link>
          </Button>
          {user && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-[#9A3434] hover:bg-[#9A3434]/10 cursor-pointer"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign Out
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border cursor-pointer ${
              activeTab === "orders"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#B79B63]" /> My Orders ({orders.length})
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privilege")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border cursor-pointer ${
              activeTab === "privilege"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-[#B79B63]" /> Atelier Privilege
            </span>
            <span className="text-[10px] font-bold text-[#B79B63] uppercase">
              {tierProgress.currentTier.badge}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("addresses")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border cursor-pointer ${
              activeTab === "addresses"
                ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#B79B63]" /> Saved Addresses ({addresses.length})
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("styling")}
            className={`w-full text-left p-3.5 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors border cursor-pointer ${
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
        <div className="lg:col-span-9 bg-white border border-[#E8E2D8] p-6 sm:p-8 rounded-xs shadow-xs">
          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1B19]">Recent Orders</h2>
                  <p className="text-xs text-[#8C867D]">
                    Manage, view invoices, and track your couture deliveries
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#B79B63]">
                  {orders.length} Registered Orders
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5A5650] space-y-3">
                  <Package className="h-10 w-10 text-[#B79B63] mx-auto" />
                  <p>You have no active or past orders registered.</p>
                  <Button asChild variant="primary" size="sm">
                    <Link href="/women/sarees">Browse Collections</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 border border-[#E8E2D8] hover:border-[#D8C7A5] transition-colors space-y-4 rounded-xs"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E8E2D8] pb-3 text-xs">
                        <div>
                          <span className="font-semibold text-[#1C1B19]">Order #{ord.id}</span>
                          <span className="text-[#8C867D] ml-3">Placed on {ord.date}</span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-[#F7F3EB] text-[#B79B63] border border-[#D8C7A5] font-semibold text-[10px] uppercase tracking-wider self-start sm:self-auto">
                          {ord.status}
                        </span>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs">
                            <div className="relative h-12 w-10 bg-[#EFE8DD] shrink-0 border border-[#E8E2D8] overflow-hidden">
                              <Image
                                src={item.primaryImage}
                                alt={item.title}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#1C1B19] truncate">{item.title}</p>
                              <p className="text-[10px] text-[#8C867D]">
                                Option: {item.size}{" "}
                                {item.blouseOption ? `• ${item.blouseOption}` : ""} • Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-[#1C1B19]">
                              {formatINR(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 border-t border-[#E8E2D8] text-xs">
                        <div className="text-[#5A5650]">
                          <span>
                            Total:{" "}
                            <strong className="text-[#1C1B19]">{formatINR(ord.total)}</strong>
                          </span>
                          <span className="ml-3 text-[11px] text-[#8C867D]">
                            Carrier: {ord.carrier} (AWB: {ord.trackingNumber})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/order-confirmation?orderId=${ord.id}`}>
                              <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> View Receipt
                            </Link>
                          </Button>
                          <Button asChild variant="primary" size="sm">
                            <Link href={`/track-order?orderId=${ord.id}`}>
                              <Truck className="mr-1.5 h-3.5 w-3.5" /> Track Shipment
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1B19]">Saved Delivery Addresses</h2>
                  <p className="text-xs text-[#8C867D]">
                    Manage doorstep delivery destinations across India
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddressModal}
                  className="cursor-pointer"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Address
                </Button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#D8C7A5] p-8 space-y-3 bg-[#FAF7F2] rounded-xs">
                  <MapPin className="h-8 w-8 text-[#B79B63] mx-auto" />
                  <p className="font-serif text-lg text-[#1C1B19]">No Saved Addresses Yet</p>
                  <p className="text-xs text-[#5A5650] max-w-sm mx-auto">
                    Add your delivery destination for seamless 1-click checkout and bespoke atelier
                    dispatch.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleOpenAddressModal}
                    className="mt-2 cursor-pointer"
                  >
                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Delivery Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={cn(
                        "p-4 border transition-colors space-y-2.5 text-xs rounded-xs relative",
                        addr.isDefault
                          ? "border-[#B79B63] bg-[#F7F3EB]/30"
                          : "border-[#E8E2D8] bg-white hover:border-[#D8C7A5]"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#1C1B19]">{addr.name}</span>
                          <span className="px-1.5 py-0.2 bg-white border border-[#E8E2D8] text-[9px] uppercase font-bold text-[#8C867D]">
                            {addr.type}
                          </span>
                        </div>
                        {addr.isDefault ? (
                          <span className="px-2 py-0.5 bg-[#B79B63] text-white text-[9px] uppercase font-bold">
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-[10px] text-[#B79B63] hover:underline font-medium cursor-pointer"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <p className="text-[#5A5650] leading-relaxed">{addr.street}</p>
                      <p className="text-[#5A5650]">
                        {addr.city}, {addr.state} — {addr.pinCode}
                      </p>
                      <p className="text-[#5A5650]">Phone: {addr.phone}</p>

                      <div className="pt-2 border-t border-[#E8E2D8] flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[#9A3434] hover:text-[#7A2828] text-xs flex items-center gap-1 cursor-pointer"
                          aria-label="Delete Address"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STYLING CONCIERGE TAB */}
          {activeTab === "styling" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4">
                <h2 className="font-serif text-2xl text-[#1C1B19]">
                  Boutique Concierge &amp; Styling
                </h2>
                <p className="text-xs text-[#8C867D]">
                  Private virtual consultations with Hyderabad master designers
                </p>
              </div>

              <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] space-y-4 text-xs rounded-xs">
                <ShieldCheck className="h-6 w-6 text-[#B79B63]" />
                <p className="text-sm font-medium text-[#1C1B19]">
                  Book a Complimentary 1-on-1 Video Consultation
                </p>
                <p className="text-[#5A5650] leading-relaxed">
                  Our resident master stylists in Jubilee Hills will present weaves under studio
                  lighting, guide you on blouse embroidery, and confirm exact body measurements
                  before stitching.
                </p>
                <a
                  href="https://wa.me/916281344628?text=Hello%2C%20I%20would%20like%20to%20schedule%20a%20private%20virtual%20styling%20session%20with%20your%20Hyderabad%20atelier."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#1ebe5c] transition-colors"
                >
                  <Phone className="h-4 w-4" /> Schedule via WhatsApp Concierge
                </a>
              </div>
            </div>
          )}

          {/* PRIVILEGE & REWARDS TAB */}
          {activeTab === "privilege" && (
            <div className="space-y-6">
              <div className="border-b border-[#E8E2D8] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1B19]">
                    Atelier Patron Privilege Circle
                  </h2>
                  <p className="text-xs text-[#8C867D]">
                    Exclusive couture benefits, bespoke tailoring services, and heirloom rewards
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="text-xs shrink-0">
                  <Link href="/appointments">Book Salon Visit</Link>
                </Button>
              </div>

              {/* Digital Luxury Member Card */}
              {(() => {
                const cur = tierProgress.currentTier;
                const isCrown = cur.id === "zari_crown";
                const isWeaver = cur.id === "royal_weaver";

                return (
                  <div className="space-y-6">
                    <div
                      className={`p-6 sm:p-8 rounded-xs border text-white shadow-xl relative overflow-hidden ${
                        isCrown
                          ? "bg-gradient-to-br from-[#1C1B19] via-[#2D6A4F] to-[#1C1B19] border-[#2D6A4F]"
                          : isWeaver
                            ? "bg-gradient-to-br from-[#1C1B19] via-[#3A3326] to-[#1C1B19] border-[#B79B63]"
                            : "bg-gradient-to-br from-[#23211F] via-[#2D2A27] to-[#1C1B19] border-stone-600"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#B79B63]/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          {isCrown ? (
                            <Crown className="h-4 w-4 text-[#B79B63]" />
                          ) : (
                            <Sparkles className="h-4 w-4 text-[#B79B63]" />
                          )}
                          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold">
                            Sreesha Elegance Atelier Privé
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#FAF7F2] text-[#1C1B19] rounded-2xs">
                          {cur.badge}
                        </span>
                      </div>

                      <div className="mt-6 relative z-10">
                        <span className="text-[11px] text-stone-300 font-medium uppercase tracking-wider block">
                          Patron Member
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
                          {displayName}
                        </h3>
                        <p className="text-xs text-stone-300 font-mono mt-1">
                          {profile?.phone || user?.phone
                            ? `+91 ${(profile?.phone || user?.phone || "").replace(/\D/g, "")}`
                            : "Verified Member"}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Lifetime Handloom Investment
                          </span>
                          <span className="font-semibold text-lg text-[#FAF7F2]">
                            {formatINR(lifetimeSpend)}
                          </span>
                        </div>

                        <div className="sm:text-right">
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Tier Privilege Coupon (
                            {cur.discountPercentage > 0
                              ? `${cur.discountPercentage}% Savings`
                              : "Welcome"}
                            )
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono font-bold text-sm tracking-wider text-[#E8D8B6] bg-black/40 px-2 py-0.5 border border-[#B79B63]/40">
                              {cur.couponCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCoupon(cur.couponCode)}
                              className="p-1 hover:text-[#B79B63] transition-colors cursor-pointer"
                              title="Copy code"
                            >
                              {copiedCoupon ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-stone-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress to Next Tier */}
                    {tierProgress.nextTier ? (
                      <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#1C1B19]">
                            Progress to{" "}
                            <strong className="font-serif">{tierProgress.nextTier.name}</strong> (
                            {tierProgress.nextTier.badge})
                          </span>
                          <span className="font-bold text-[#B79B63] font-mono">
                            {tierProgress.progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#B79B63] to-[#2D6A4F] transition-all duration-500"
                            style={{ width: `${tierProgress.progressPercent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span>Current Spend: {formatINR(lifetimeSpend)}</span>
                          <span>Next Tier: {formatINR(tierProgress.nextTier.minSpend)}</span>
                        </div>
                        <p className="text-xs text-[#5A5650] pt-1">
                          Invest an additional{" "}
                          <strong className="text-[#1C1B19]">
                            {formatINR(tierProgress.amountNeeded)}
                          </strong>{" "}
                          in handloom silk to unlock complimentary blouse customization and
                          exclusive preview privileges.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 rounded-xs flex items-center gap-3">
                        <Crown className="h-6 w-6 text-[#2D6A4F] shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#2D6A4F] uppercase tracking-wider">
                            Highest Atelier Honor Achieved
                          </p>
                          <p className="text-xs text-stone-600 mt-0.5">
                            You enjoy lifetime complimentary fall, pico, and silk tasseling, plus
                            dedicated 1-on-1 personal stylist access.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Current Tier Privileges Checklist */}
                    <div className="space-y-3">
                      <h3 className="font-serif text-lg text-[#1C1B19] flex items-center gap-2">
                        <Gift className="w-4 h-4 text-[#B79B63]" />
                        <span>Your Active {cur.name} Privileges</span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cur.perks.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-white border border-[#E8E2D8] rounded-xs flex items-start gap-2.5 shadow-2xs"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                            <span className="text-xs text-stone-700 leading-relaxed">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* All 3 Tiers Comparison Matrix */}
                    <div className="space-y-3 pt-2">
                      <h3 className="font-serif text-lg text-[#1C1B19]">
                        Atelier Privilege Tier Comparison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ALL_LOYALTY_TIERS.map((t) => {
                          const isCurrent = t.id === cur.id;
                          return (
                            <div
                              key={t.id}
                              className={`p-4 border rounded-xs transition-all relative ${
                                isCurrent
                                  ? "border-[#B79B63] bg-[#F7F3EB]/40 ring-1 ring-[#B79B63]"
                                  : "border-[#E8E2D8] bg-white opacity-85"
                              }`}
                            >
                              {isCurrent && (
                                <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-[#B79B63] text-[#1C1B19] text-[9px] uppercase font-bold tracking-wider rounded-2xs shadow-xs">
                                  Current Tier
                                </span>
                              )}
                              <p className="font-serif text-base font-medium text-[#1C1B19]">
                                {t.name}
                              </p>
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B79B63] block mt-0.5">
                                {t.badge}
                              </span>
                              <p className="text-xs text-stone-500 font-mono mt-2">
                                {t.minSpend === 0
                                  ? "Welcome Tier"
                                  : t.maxSpend
                                    ? `${formatINR(t.minSpend)} – ${formatINR(t.maxSpend)}`
                                    : `${formatINR(t.minSpend)}+`}
                              </p>
                              <div className="mt-3 pt-3 border-t border-stone-200 space-y-1.5 text-[11px] text-stone-600">
                                {t.perks.slice(0, 3).map((perk, i) => (
                                  <div key={i} className="flex items-start gap-1.5">
                                    <span className="text-[#B79B63] mt-0.5">•</span>
                                    <span>{perk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Direct Concierge Contact */}
                    <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xs">
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="text-xs font-semibold text-[#1C1B19] uppercase tracking-wider">
                          Need Personalized Styling or Blouse Consultation?
                        </p>
                        <p className="text-xs text-stone-500">
                          Connect with your Hyderabad atelier stylist via WhatsApp VIP concierge.
                        </p>
                      </div>
                      <a
                        href="https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20I%20am%20a%20patron%20inquiring%20about%20my%20privilege%20tier%20and%20bridal%20styling."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#B79B63] hover:text-[#1C1B19] transition-colors rounded-xs shadow-xs shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat with Atelier Stylist</span>
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal Dialog */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B19]/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] max-w-md w-full p-6 space-y-4 shadow-2xl rounded-xs">
            <div className="flex justify-between items-center border-b border-[#E8E2D8] pb-3">
              <h3 className="font-serif text-lg text-[#1C1B19]">Add Delivery Address</h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-[#8C867D] hover:text-[#1C1B19] text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sreeja Varma"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98490 12345"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                    Address Type
                  </label>
                  <select
                    value={newAddr.type}
                    onChange={(e) =>
                      setNewAddr({
                        ...newAddr,
                        type: e.target.value as "Home" | "Work" | "Atelier",
                      })
                    }
                    className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63] bg-white cursor-pointer"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work / Studio</option>
                    <option value="Atelier">Atelier / Hotel</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                  Street Address &amp; House/Flat No. *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Flat 301, Lakeview Manor, Road 12, Banjara Hills"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Hyderabad"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Telangana"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider font-medium text-[#1C1B19]">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="500034"
                    value={newAddr.pinCode}
                    onChange={(e) =>
                      setNewAddr({ ...newAddr, pinCode: e.target.value.replace(/\D/g, "") })
                    }
                    className="w-full border border-[#E8E2D8] p-2 outline-none focus:border-[#B79B63]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="w-1/2 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" className="w-1/2 cursor-pointer">
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
