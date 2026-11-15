"use client";

import * as React from "react";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  UserPlus,
  ShieldCheck,
  Calendar,
  Sparkles,
  RefreshCw,
  Download,
  Crown,
  Eye,
  Gift,
  CheckCircle2,
  X,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { formatINR } from "@/lib/utils";
import { LoyaltyTierId, getPatronTierById, getTierProgress } from "@/lib/loyalty";

interface EnrichedCustomerRecord {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
  lifetimeSpend: number;
  orderCount: number;
  lastOrderDate: string | null;
  tierId: LoyaltyTierId;
  tierName: string;
  tierBadge: string;
}

interface CustomerMetrics {
  totalPatrons: number;
  totalRevenue: number;
  heritageCount: number;
  royalWeaverCount: number;
  zariCrownCount: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<EnrichedCustomerRecord[]>([]);
  const [metrics, setMetrics] = React.useState<CustomerMetrics>({
    totalPatrons: 0,
    totalRevenue: 0,
    heritageCount: 0,
    royalWeaverCount: 0,
    zariCrownCount: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [tierFilter, setTierFilter] = React.useState<"ALL" | LoyaltyTierId>("ALL");

  // Selected patron for 360° dossier view
  const [selectedPatron, setSelectedPatron] = React.useState<EnrichedCustomerRecord | null>(null);

  // New customer modal state
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.replace(/\D/g, "");
    if (!newName.trim() || cleanPhone.length !== 10) {
      showToast.error("Please provide a valid full name and 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          phone: cleanPhone,
          action: "signup",
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success(`Patron ${newName.trim()} enrolled successfully!`);
        setIsAddModalOpen(false);
        setNewName("");
        setNewPhone("");
        fetchCustomers();
      } else {
        showToast.error(data.error || "Failed to add patron");
      }
    } catch {
      showToast.error("Error creating customer record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (customers.length === 0) {
      showToast.info("No patron records to export");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Mobile Number",
      "Atelier Tier",
      "Lifetime Spend (INR)",
      "Total Orders",
      "Last Order Date",
      "Enrolled Date",
    ];

    const rows = customers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"+91${c.phone}"`,
      `"${c.tierName}"`,
      c.lifetimeSpend,
      c.orderCount,
      c.lastOrderDate ? new Date(c.lastOrderDate).toISOString().split("T")[0] : "None",
      c.created_at ? new Date(c.created_at).toISOString().split("T")[0] : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sreesha_atelier_patrons_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast.success("Patron directory exported with loyalty metrics");
  };

  const handleOpenWhatsApp = (patron: EnrichedCustomerRecord) => {
    const clean = patron.phone.replace(/\D/g, "");
    const formatted = clean.startsWith("91") ? clean : `91${clean}`;
    const tier = getPatronTierById(patron.tierId);

    const greeting =
      tier.id === "zari_crown"
        ? `Namaste ${patron.name} garu! 👑\n\nGreetings from Sreesha Elegance, Hyderabad Atelier. As a cherished Zari Crown Solitaire VIP patron, our Master Stylist has reserved exclusive private previews of our newest pure Kanchipuram bridal looms for you before public release.\n\nYour 20% Solitaire VIP privilege code ROYAL20 is ready for your trousseau additions. How may our concierge assist your wardrobe styling today?\n\nWarm regards,\nSreesha Elegance Hyderabad Atelier`
        : tier.id === "royal_weaver"
          ? `Namaste ${patron.name} garu! ✨\n\nWarm greetings from Sreesha Elegance. As a valued Royal Weaver Club patron, your complimentary Masterji custom blouse styling consultation and 15% privilege savings (Code: ROYAL15) are active.\n\nBrowse our new festive drops at https://sreeshaelegance.com or reply here to book your private atelier viewing.\n\nWarm regards,\nSreesha Elegance Team`
          : `Namaste ${patron.name}! 🙏\n\nGreetings from Sreesha Elegance, Hyderabad. We are delighted to welcome you to our exclusive boutique circle.\n\nYour 10% welcome privilege code WELCOME10 is valid on your next handwoven saree or anarkali ensemble. Our master stylists are here to assist with video previews anytime.\n\nWarm regards,\nSreesha Elegance Atelier Team`;

    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(greeting)}`, "_blank");
  };

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search.replace(/\D/g, "")) ||
      c.tierName.toLowerCase().includes(search.toLowerCase());

    const matchesTier = tierFilter === "ALL" || c.tierId === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Client Relations &amp; Privilege Tiers
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">Atelier Patrons &amp; Loyalty CRM</h1>
          <p className="text-xs text-stone-500 mt-1">
            Registered boutique clients, lifetime handloom investments, and luxury tier privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchCustomers}
            disabled={loading}
            className="text-xs gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Patron</span>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Total Enrolled Patrons
            </span>
            <Users className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {metrics.totalPatrons || customers.length}
          </p>
          <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3 h-3" /> 100% Verified Mobile Identity
          </span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Lifetime Patron Spend
            </span>
            <CreditCard className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {formatINR(metrics.totalRevenue)}
          </p>
          <span className="text-[10px] text-stone-400 mt-1 block">
            Net verified boutique orders
          </span>
        </div>

        <div className="bg-white p-4 border border-[#B79B63]/40 rounded-xs shadow-xs bg-[#F7F3EB]/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#8C6D28] font-medium">
              Royal Weaver Club (Gold)
            </span>
            <Sparkles className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#8C6D28] mt-2">
            {metrics.royalWeaverCount}
          </p>
          <span className="text-[10px] text-stone-500 mt-1 block">Spend: ₹50,000 – ₹1.49 Lakh</span>
        </div>

        <div className="bg-white p-4 border border-[#2D6A4F]/40 rounded-xs shadow-xs bg-[#2D6A4F]/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#2D6A4F] font-semibold">
              Zari Crown Solitaire VIP
            </span>
            <Crown className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#2D6A4F] mt-2">
            {metrics.zariCrownCount}
          </p>
          <span className="text-[10px] text-emerald-800 font-medium mt-1 block">
            Couture VIP (₹1.5 Lakh+)
          </span>
        </div>
      </div>

      {/* Tier Filter Pills & Search Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setTierFilter("ALL")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                tierFilter === "ALL"
                  ? "bg-[#1C1B19] text-[#FAF7F2]"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All Patrons ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setTierFilter("zari_crown")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                tierFilter === "zari_crown"
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-[#2D6A4F]/10 text-[#2D6A4F] hover:bg-[#2D6A4F]/20"
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>Zari Crown VIP ({metrics.zariCrownCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setTierFilter("royal_weaver")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
                tierFilter === "royal_weaver"
                  ? "bg-[#B79B63] text-[#1C1B19]"
                  : "bg-[#F7F3EB] text-[#8C6D28] hover:bg-[#F7F3EB]/80 border border-[#B79B63]/30"
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#B79B63]" />
              <span>Royal Weaver ({metrics.royalWeaverCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setTierFilter("heritage")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-colors shrink-0 cursor-pointer ${
                tierFilter === "heritage"
                  ? "bg-stone-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Heritage ({metrics.heritageCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patron name, phone, tier..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63]"
            />
          </div>
        </div>
      </div>

      {/* Patrons Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Patron Profile</th>
                <th className="p-3.5">Mobile Contact</th>
                <th className="p-3.5">Atelier Tier</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Orders</th>
                <th className="p-3.5">Enrolled On</th>
                <th className="p-3.5 pr-5 text-right">VIP Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B79B63]" />
                    <span>Loading patron directory and loyalty metrics...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No patrons match the selected tier filter or search query.
                  </td>
                </tr>
              ) : (
                filtered.map((patron) => {
                  const cleanPhone = patron.phone.replace(/\D/g, "");
                  const isZariCrown = patron.tierId === "zari_crown";
                  const isRoyalWeaver = patron.tierId === "royal_weaver";

                  const formattedDate = patron.created_at
                    ? new Date(patron.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr
                      key={patron.id || patron.phone}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      {/* Patron Profile */}
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-semibold text-xs border relative ${
                              isZariCrown
                                ? "bg-[#2D6A4F] text-[#FAF7F2] border-[#2D6A4F]"
                                : isRoyalWeaver
                                  ? "bg-[#1C1B19] text-[#B79B63] border-[#B79B63]"
                                  : "bg-stone-200 text-stone-700 border-stone-300"
                            }`}
                          >
                            {(patron.name || "P").charAt(0).toUpperCase()}
                            {isZariCrown && (
                              <Crown className="w-3 h-3 text-[#B79B63] absolute -top-1.5 -right-1 fill-current" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-[#1C1B19]">{patron.name}</p>
                              {isZariCrown && (
                                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 bg-[#2D6A4F] text-white rounded-2xs">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ID: {patron.id || `cust_${cleanPhone}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Mobile Contact */}
                      <td className="p-3.5">
                        <div className="font-mono text-[#1C1B19] font-medium flex items-center gap-1.5">
                          <span>🇮🇳 +91</span>
                          <span>{cleanPhone}</span>
                        </div>
                      </td>

                      {/* Atelier Tier */}
                      <td className="p-3.5">
                        {isZariCrown ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/30">
                            <Crown className="w-3 h-3 text-[#2D6A4F]" />
                            <span>{patron.tierName}</span>
                          </span>
                        ) : isRoyalWeaver ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#B79B63]/15 text-[#8C6D28] border border-[#B79B63]/40">
                            <Sparkles className="w-3 h-3 text-[#B79B63]" />
                            <span>{patron.tierName}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                            <span>{patron.tierName}</span>
                          </span>
                        )}
                      </td>

                      {/* Lifetime Spend */}
                      <td className="p-3.5">
                        <span className="font-semibold text-[#1C1B19]">
                          {formatINR(patron.lifetimeSpend)}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="p-3.5 text-stone-600">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-stone-400" />
                          <span>{patron.orderCount}</span>
                        </div>
                      </td>

                      {/* Enrolled On */}
                      <td className="p-3.5 text-stone-500">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      {/* VIP Actions */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPatron(patron)}
                            className="p-1.5 text-stone-600 hover:text-[#1C1B19] border border-stone-200 rounded-xs bg-white hover:border-[#B79B63] transition-colors cursor-pointer"
                            title="View 360° Patron Dossier"
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
                            onClick={() => handleOpenWhatsApp(patron)}
                            className={`p-1.5 rounded-xs transition-colors cursor-pointer border ${
                              isZariCrown
                                ? "bg-[#2D6A4F] text-white hover:bg-[#23533e] border-[#2D6A4F]"
                                : isRoyalWeaver
                                  ? "bg-[#B79B63]/20 text-[#8C6D28] hover:bg-[#B79B63]/30 border-[#B79B63]/40"
                                  : "text-[#2D6A4F] hover:bg-[#2D6A4F]/10 border-[#2D6A4F]/30 bg-white"
                            }`}
                            title="Send Tier-Tailored WhatsApp Greeting"
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

      {/* 360° Patron Dossier Modal */}
      {selectedPatron && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 border border-[#E8E2D8] shadow-2xl rounded-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Atelier Patron Dossier
                </span>
                <h3 className="font-serif text-lg text-[#1C1B19]">{selectedPatron.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatron(null)}
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Digital Privilege Card Preview */}
            {(() => {
              const tier = getPatronTierById(selectedPatron.tierId);
              const progress = getTierProgress(selectedPatron.lifetimeSpend);

              return (
                <div className="space-y-4">
                  <div
                    className={`p-5 rounded-xs border text-white shadow-md relative overflow-hidden ${
                      selectedPatron.tierId === "zari_crown"
                        ? "bg-gradient-to-br from-[#1C1B19] via-[#2D6A4F] to-[#1C1B19] border-[#2D6A4F]"
                        : selectedPatron.tierId === "royal_weaver"
                          ? "bg-gradient-to-br from-[#1C1B19] via-[#3A3326] to-[#1C1B19] border-[#B79B63]"
                          : "bg-gradient-to-br from-[#2B2927] to-[#1C1B19] border-stone-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-semibold">
                        Sreesha Elegance Atelier
                      </span>
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#FAF7F2] text-[#1C1B19] rounded-2xs">
                        {tier.badge}
                      </span>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-serif text-xl tracking-wide">{selectedPatron.name}</h4>
                      <p className="text-xs text-stone-300 font-mono mt-0.5">
                        +91 {selectedPatron.phone.replace(/\D/g, "")}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                          Lifetime Spend
                        </span>
                        <span className="font-semibold text-[#FAF7F2]">
                          {formatINR(selectedPatron.lifetimeSpend)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                          Active Privilege Code
                        </span>
                        <span className="font-mono font-bold text-[#B79B63]">
                          {tier.couponCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress towards next tier */}
                  {progress.nextTier && (
                    <div className="bg-[#FAF7F2] p-3 border border-[#E8E2D8] rounded-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-600 font-medium">
                          Progress to {progress.nextTier.name}:
                        </span>
                        <span className="font-bold text-[#1C1B19]">
                          {progress.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#B79B63] transition-all"
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-500">
                        {formatINR(progress.amountNeeded)} needed to unlock{" "}
                        {progress.nextTier.badge}.
                      </p>
                    </div>
                  )}

                  {/* Unlocked Tier Privileges */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1C1B19] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#B79B63]" />
                      <span>Unlocked Privileges &amp; Services</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xs border border-stone-200">
                      {tier.perks.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Concierge Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8E2D8]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenWhatsApp(selectedPatron)}
                      className="text-xs w-full gap-1.5 text-[#2D6A4F] border-[#2D6A4F]/40 hover:bg-[#2D6A4F]/10"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send VIP WhatsApp</span>
                    </Button>
                    <Button
                      asChild
                      variant="primary"
                      size="sm"
                      className="text-xs w-full bg-[#1C1B19] text-[#FAF7F2]"
                    >
                      <a href={`tel:+91${selectedPatron.phone.replace(/\D/g, "")}`}>
                        <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Patron Desk
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Patron Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 border border-[#E8E2D8] shadow-2xl rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Boutique Concierge
                </span>
                <h3 className="font-serif text-lg text-[#1C1B19]">Enroll New Patron</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sreesha Reddy"
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1C1B19] mb-1">
                  10-Digit Mobile Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-stone-400 font-mono">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98490 12345"
                    className="w-full pl-12 pr-3 py-2 text-xs border border-stone-200 rounded-xs focus:border-[#B79B63] outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Zero OTP requirement. Instant access enabled across the boutique.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !newName.trim() || newPhone.length < 10}
                  className="text-xs bg-[#B79B63] hover:bg-[#A88C55] text-[#1C1B19] font-bold"
                >
                  {isSubmitting ? "Enrolling..." : "Enroll Client"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
