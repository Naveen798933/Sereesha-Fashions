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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  role: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

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

    const headers = ["ID", "Name", "Mobile Number", "Role", "Enrolled Date"];
    const rows = customers.map((c) => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"+91${c.phone}"`,
      c.role || "customer",
      c.created_at ? new Date(c.created_at).toISOString().split("T")[0] : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sreesha_patrons_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast.success("Patron list exported to CSV");
  };

  const handleOpenWhatsApp = (name: string, phone: string) => {
    const clean = phone.replace(/\D/g, "");
    const formatted = clean.startsWith("91") ? clean : `91${clean}`;
    const text = encodeURIComponent(
      `Namaste ${name}! 🙏\n\nGreetings from Sreesha Elegance, Hyderabad. We are delighted to welcome you to our exclusive boutique circle.\n\nOur stylists are available for bespoke wedding consultations and silk previews. Browse our latest couture edit at https://sreeshaelegance.com.\n\nWarm regards,\nSreesha Elegance Atelier Team`
    );
    window.open(`https://wa.me/${formatted}?text=${text}`, "_blank");
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search.replace(/\D/g, ""))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Client Relations
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">
            Atelier Patrons &amp; Walk-In Registry
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Registered boutique clients authenticated via frictionless 10-digit mobile identity.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Total Boutique Patrons
            </span>
            <Users className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {customers.length}
          </p>
          <span className="text-[10px] text-stone-400">Enrolled without OTP barrier</span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              Verified Mobile Numbers
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">
            {customers.length}
          </p>
          <span className="text-[10px] text-stone-400">100% reachable via WhatsApp &amp; Call</span>
        </div>

        <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
              VIP Atelier Tier
            </span>
            <Sparkles className="w-4 h-4 text-[#B79B63]" />
          </div>
          <p className="font-serif text-2xl font-semibold text-[#1C1B19] mt-2">Active</p>
          <span className="text-[10px] text-stone-400">Personal styling eligible</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron by name or 10-digit mobile..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63]"
          />
        </div>
      </div>

      {/* Patrons Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Patron Name</th>
                <th className="p-3.5">Mobile Number</th>
                <th className="p-3.5">Enrolled On</th>
                <th className="p-3.5">Atelier Tier</th>
                <th className="p-3.5 pr-5 text-right">Concierge Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#B79B63]" />
                    <span>Loading patron directory...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    No patrons match your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((patron) => {
                  const cleanPhone = patron.phone.replace(/\D/g, "");
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
                      <td className="p-3.5 pl-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1C1B19] text-[#B79B63] flex items-center justify-center font-serif font-semibold text-xs border border-[#B79B63]">
                            {(patron.name || "C").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1C1B19]">{patron.name}</p>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ID: {patron.id || `cust_${cleanPhone}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono text-[#1C1B19] font-medium flex items-center gap-1.5">
                          <span>🇮🇳 +91</span>
                          <span>{cleanPhone}</span>
                        </div>
                      </td>

                      <td className="p-3.5 text-stone-500">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#B79B63]/10 text-[#8C6D28] border border-[#B79B63]/30">
                          <Sparkles className="w-2.5 h-2.5 text-[#B79B63]" />
                          <span>Boutique Circle</span>
                        </span>
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`tel:+91${cleanPhone}`}
                            className="p-1.5 text-stone-500 hover:text-[#1C1B19] border border-stone-200 rounded-xs bg-white transition-colors"
                            title="Call Patron"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(patron.name, cleanPhone)}
                            className="p-1.5 text-[#2D6A4F] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 rounded-xs bg-white transition-colors cursor-pointer"
                            title="Send WhatsApp Greeting"
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
