"use client";

import * as React from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Search,
  MessageCircle,
  Phone,
  RefreshCw,
  Download,
  ShieldAlert,
  Crown,
  Eye,
  CheckCircle2,
  Clock,
  X,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { formatINR } from "@/lib/utils";
import { AbandonedCartRecord, CartRecoveryStatus } from "@/lib/abandonedCarts";

interface RecoveryMetrics {
  totalActiveCarts: number;
  potentialRevenue: number;
  recoveredCount: number;
  recoveredRevenue: number;
  highValueCount: number;
  paymentFailedCount: number;
}

export default function AdminAbandonedCartsPage() {
  const [carts, setCarts] = React.useState<AbandonedCartRecord[]>([]);
  const [metrics, setMetrics] = React.useState<RecoveryMetrics>({
    totalActiveCarts: 0,
    potentialRevenue: 0,
    recoveredCount: 0,
    recoveredRevenue: 0,
    highValueCount: 0,
    paymentFailedCount: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ACTIVE");
  const [selectedCart, setSelectedCart] = React.useState<AbandonedCartRecord | null>(null);

  const loadCarts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/abandoned-carts");
      const data = await res.json();
      if (data.success && Array.isArray(data.carts)) {
        setCarts(data.carts);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Failed to load abandoned carts:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCarts();
  }, []);

  const handleUpdateStatus = async (cartId: string, newStatus: CartRecoveryStatus) => {
    try {
      const res = await fetch("/api/admin/abandoned-carts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success(`Cart #${cartId} marked as ${newStatus}`);
        setCarts((prev) =>
          prev.map((c) => (c.id === cartId ? { ...c, recoveryStatus: newStatus } : c))
        );
        if (selectedCart && selectedCart.id === cartId) {
          setSelectedCart((prev) => (prev ? { ...prev, recoveryStatus: newStatus } : null));
        }
      } else {
        showToast.error(data.error || "Failed to update status");
      }
    } catch {
      showToast.error("Error updating recovery status");
    }
  };

  const handleOpenWhatsApp = (cart: AbandonedCartRecord) => {
    const cleanPhone = cart.phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const firstItem = cart.items[0]?.title || "handloom ensemble";

    const greeting = encodeURIComponent(
      `Namaste ${cart.customerName} garu! 🙏\n\nWarm greetings from Sreesha Elegance Atelier, Hyderabad.\n\nWe noticed you were curating "${firstItem}" (${formatINR(
        cart.total
      )}) on our boutique. As our handwoven silks are limited, one-of-a-kind looms, our resident Master Stylist can hold this piece for you or provide a quick video preview over WhatsApp.\n\nMay we assist with custom blouse measurements or completing your order?\n\nWarm regards,\nSreesha Elegance Atelier Concierge`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${greeting}`, "_blank");
    if (cart.recoveryStatus === "pending") {
      handleUpdateStatus(cart.id, "contacted");
    }
  };

  const handleExportCSV = () => {
    if (carts.length === 0) {
      showToast.info("No carts to export");
      return;
    }

    const headers = [
      "Cart ID",
      "Customer Name",
      "Mobile Number",
      "Email",
      "City",
      "Items Count",
      "Total (INR)",
      "Dropoff Step",
      "Last Error",
      "Recovery Status",
      "Created At",
    ];

    const rows = carts.map((c) => [
      c.id,
      `"${c.customerName.replace(/"/g, '""')}"`,
      `"+91${c.phone}"`,
      `"${c.email || ""}"`,
      `"${(c.city || "").replace(/"/g, '""')}"`,
      c.items.length,
      c.total,
      `"${c.dropoffStep}"`,
      `"${(c.lastError || "").replace(/"/g, '""')}"`,
      `"${c.recoveryStatus}"`,
      c.createdAt ? new Date(c.createdAt).toISOString().split("T")[0] : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sreesha_abandoned_carts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast.success("Abandoned cart pipeline exported to CSV");
  };

  const filtered = carts.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search.replace(/\D/g, "")) ||
      (c.city && c.city.toLowerCase().includes(search.toLowerCase())) ||
      c.items.some((it) => it.title.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") return c.recoveryStatus !== "dismissed";
    if (statusFilter === "HIGH_VALUE") return c.total >= 25000 && c.recoveryStatus !== "dismissed";
    if (statusFilter === "PAYMENT_FAILED")
      return c.dropoffStep === "payment_failed" && c.recoveryStatus !== "dismissed";
    if (statusFilter === "PENDING") return c.recoveryStatus === "pending";
    if (statusFilter === "CONTACTED") return c.recoveryStatus === "contacted";
    if (statusFilter === "RECOVERED") return c.recoveryStatus === "recovered";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Revenue Recovery &amp; Concierge Follow-Up
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">Abandoned Cart Recovery Hub</h1>
          <p className="text-xs text-stone-500 mt-1">
            Re-engage high-intent patrons, resolve payment drop-offs, and offer Masterji styling
            guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
            title="Download CSV Manifest"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadCarts}
            disabled={loading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Active Abandoned Carts
            </span>
            <ShoppingCart className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {metrics.totalActiveCarts}
          </p>
          <span className="text-[10px] text-amber-700 font-medium mt-1 block">
            {metrics.paymentFailedCount} failed at payment gate
          </span>
        </div>

        <div className="bg-white p-4 border border-[#B79B63]/40 rounded-xs shadow-xs bg-[#F7F3EB]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8C6D28] font-medium">
              Potential Revenue Pipeline
            </span>
            <CreditCard className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#8C6D28] mt-2">
            {formatINR(metrics.potentialRevenue)}
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">
            Across unrecovered bridal carts
          </span>
        </div>

        <div className="bg-white p-4 border border-[#2D6A4F]/40 rounded-xs shadow-xs bg-[#2D6A4F]/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#2D6A4F] font-semibold">
              Recovered Revenue
            </span>
            <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#2D6A4F] mt-2">
            {formatINR(metrics.recoveredRevenue)}
          </p>
          <span className="text-[10px] text-emerald-800 font-medium mt-1 block">
            {metrics.recoveredCount} carts converted to orders
          </span>
        </div>

        <div className="bg-white p-4 border border-stone-200 rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              High-Value Carts (&gt;₹25k)
            </span>
            <Crown className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {metrics.highValueCount}
          </p>
          <span className="text-[10px] text-stone-400 mt-1 block">Priority bridal trousseaus</span>
        </div>
      </div>

      {/* Filter Tabs & Search Box */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                statusFilter === "ACTIVE"
                  ? "bg-[#1C1B19] text-[#FAF7F2]"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Active Pipeline ({metrics.totalActiveCarts})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("HIGH_VALUE")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "HIGH_VALUE"
                  ? "bg-[#B79B63] text-[#1C1B19]"
                  : "bg-[#F7F3EB] text-[#8C6D28] hover:bg-[#F7F3EB]/80 border border-[#B79B63]/30"
              }`}
            >
              <Crown className="w-3 h-3 text-[#B79B63]" />
              <span>High Value &gt;₹25k ({metrics.highValueCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PAYMENT_FAILED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "PAYMENT_FAILED"
                  ? "bg-rose-700 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Payment Failed ({metrics.paymentFailedCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                statusFilter === "PENDING"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              Pending Action
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("CONTACTED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                statusFilter === "CONTACTED"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100"
              }`}
            >
              Contacted
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("RECOVERED")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                statusFilter === "RECOVERED"
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20"
              }`}
            >
              Recovered ({metrics.recoveredCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patron, phone, saree..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63]"
            />
          </div>
        </div>
      </div>

      {/* Carts Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Patron &amp; Location</th>
                <th className="p-3.5">Ensembles in Cart</th>
                <th className="p-3.5">Cart Value</th>
                <th className="p-3.5">Drop-off Stage</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Elapsed</th>
                <th className="p-3.5 pr-5 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B79B63]" />
                    <span>Loading abandoned cart pipeline...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No abandoned carts match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((cart) => {
                  const cleanPhone = cart.phone.replace(/\D/g, "");
                  const isHighValue = cart.total >= 25000;
                  const isPaymentFailed = cart.dropoffStep === "payment_failed";

                  return (
                    <tr key={cart.id} className="hover:bg-stone-50/50 transition-colors">
                      {/* Patron Info */}
                      <td className="p-3.5 pl-5">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1C1B19]">
                              {cart.customerName}
                            </span>
                            {isHighValue && (
                              <Crown className="w-3 h-3 text-[#B79B63] fill-current" />
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-stone-500">
                            +91 {cleanPhone}
                          </div>
                          {cart.city && (
                            <div className="text-[10px] text-stone-400 truncate max-w-xs">
                              {cart.city}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 shrink-0">
                            {cart.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="relative w-8 h-10 border border-white rounded-2xs overflow-hidden shadow-2xs bg-stone-100"
                              >
                                <Image
                                  src={item.primaryImage}
                                  alt={item.title}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="text-xs max-w-xs">
                            <p className="font-medium text-[#1C1B19] truncate">
                              {cart.items[0]?.title}
                            </p>
                            {cart.items.length > 1 && (
                              <span className="text-[10px] text-stone-400">
                                +{cart.items.length - 1} more ensemble
                                {cart.items.length > 2 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cart Total */}
                      <td className="p-3.5">
                        <span className="font-semibold text-sm text-[#1C1B19]">
                          {formatINR(cart.total)}
                        </span>
                        {cart.discount > 0 && (
                          <span className="text-[10px] text-emerald-700 block">
                            Privilege Code Applied
                          </span>
                        )}
                      </td>

                      {/* Drop-off Step */}
                      <td className="p-3.5">
                        {isPaymentFailed ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <ShieldAlert className="w-2.5 h-2.5" /> Gateway Failed
                            </span>
                            {cart.lastError && (
                              <p className="text-[10px] text-stone-500 mt-1 truncate max-w-xs">
                                {cart.lastError}
                              </p>
                            )}
                          </div>
                        ) : cart.dropoffStep === "payment_initiated" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-2.5 h-2.5" /> Payment Timeout
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                            Shipping Details Saved
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        {cart.recoveryStatus === "recovered" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Recovered
                          </span>
                        ) : cart.recoveryStatus === "contacted" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                            <MessageCircle className="w-2.5 h-2.5 text-blue-600" /> Contacted
                          </span>
                        ) : cart.recoveryStatus === "dismissed" ? (
                          <span className="text-[10px] text-stone-400 italic">Dismissed</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                            Pending Action
                          </span>
                        )}
                      </td>

                      {/* Elapsed */}
                      <td className="p-3.5 text-stone-500 text-[11px] font-mono">
                        {cart.createdAt
                          ? new Date(cart.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })
                          : "Recent"}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCart(cart)}
                            className="p-1.5 text-stone-600 hover:text-[#1C1B19] border border-stone-200 rounded-xs bg-white hover:border-[#B79B63] transition-colors cursor-pointer"
                            title="Inspect Cart Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={`tel:+91${cleanPhone}`}
                            className="p-1.5 text-stone-500 hover:text-[#1C1B19] border border-stone-200 rounded-xs bg-white transition-colors"
                            title="Call Patron"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(cart)}
                            className="p-1.5 bg-[#2D6A4F] text-white hover:bg-[#23533e] rounded-xs transition-colors cursor-pointer border border-[#2D6A4F]"
                            title="Send Stylist WhatsApp Recovery Message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Inspector Modal */}
      {selectedCart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 border border-[#E8E2D8] shadow-2xl rounded-xs space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Cart Recovery Inspector
                </span>
                <h3 className="font-serif text-lg text-[#1C1B19]">
                  {selectedCart.customerName}&apos;s Ensembles
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCart(null)}
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patron & Dropoff Info */}
            <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded-xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Contact Number:</span>
                <span className="font-mono font-semibold">+91 {selectedCart.phone}</span>
              </div>
              {selectedCart.email && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Email:</span>
                  <span>{selectedCart.email}</span>
                </div>
              )}
              {selectedCart.city && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Destination:</span>
                  <span>
                    {selectedCart.city}, {selectedCart.state}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                <span className="text-stone-500">Drop-off Stage:</span>
                <span className="font-semibold text-rose-700 uppercase tracking-wider text-[10px]">
                  {selectedCart.dropoffStep.replace(/_/g, " ")}
                </span>
              </div>
              {selectedCart.lastError && (
                <div className="p-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xs text-[11px]">
                  Error Log: {selectedCart.lastError}
                </div>
              )}
            </div>

            {/* Items in Cart */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] block">
                Ensembles in Cart ({selectedCart.items.length})
              </span>
              <div className="space-y-2">
                {selectedCart.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-[#E8E2D8] rounded-xs flex items-center gap-3 bg-white"
                  >
                    <div className="relative w-12 h-14 bg-stone-100 rounded-2xs overflow-hidden shrink-0">
                      <Image
                        src={it.primaryImage}
                        alt={it.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-[#1C1B19] truncate">{it.title}</p>
                      <p className="text-[10px] text-stone-500">Size: {it.size}</p>
                      {it.blouseOption && (
                        <p className="text-[10px] text-[#B79B63] font-medium">{it.blouseOption}</p>
                      )}
                    </div>
                    <div className="text-right text-xs font-semibold font-mono">
                      {formatINR(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-3 bg-white border border-[#E8E2D8] rounded-xs space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatINR(selectedCart.subtotal)}</span>
              </div>
              {selectedCart.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Privilege Discount ({selectedCart.appliedCoupon || "Applied"}):</span>
                  <span className="font-mono">-{formatINR(selectedCart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-[#1C1B19] pt-2 border-t border-[#E8E2D8]">
                <span>Total Cart Value:</span>
                <span className="font-mono text-[#B79B63]">{formatINR(selectedCart.total)}</span>
              </div>
            </div>

            {/* Status Management */}
            <div className="space-y-2 pt-2 border-t border-[#E8E2D8]">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 block">
                Update Recovery Status:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={selectedCart.recoveryStatus === "contacted" ? "primary" : "outline"}
                  onClick={() => handleUpdateStatus(selectedCart.id, "contacted")}
                  className="text-xs"
                >
                  Contacted
                </Button>
                <Button
                  size="sm"
                  variant={selectedCart.recoveryStatus === "recovered" ? "primary" : "outline"}
                  onClick={() => handleUpdateStatus(selectedCart.id, "recovered")}
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white"
                >
                  Recovered
                </Button>
                <Button
                  size="sm"
                  variant={selectedCart.recoveryStatus === "dismissed" ? "primary" : "outline"}
                  onClick={() => handleUpdateStatus(selectedCart.id, "dismissed")}
                  className="text-xs"
                >
                  Dismiss
                </Button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenWhatsApp(selectedCart)}
                className="w-full text-xs bg-[#2D6A4F] hover:bg-[#23533e] text-white gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Send WhatsApp Recovery Concierge</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
