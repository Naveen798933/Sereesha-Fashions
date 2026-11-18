"use client";

import * as React from "react";
import {
  Clock,
  MapPin,
  Video,
  Search,
  Filter,
  RotateCw,
  Download,
  MessageSquare,
} from "lucide-react";
import {
  AppointmentRecord,
  AppointmentStatus,
  getStoredAppointments,
  updateAppointmentStatusLocal,
} from "@/lib/appointments";
import { showToast } from "@/components/ui/Toast";

const STATUS_LIST: AppointmentStatus[] = ["Confirmed", "Completed", "Rescheduled", "Cancelled"];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = React.useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success && data.appointments && data.appointments.length > 0) {
        setAppointments(data.appointments);
      } else {
        setAppointments(getStoredAppointments());
      }
    } catch {
      setAppointments(getStoredAppointments());
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    const updated = updateAppointmentStatusLocal(id, newStatus);
    setAppointments(updated);
    try {
      await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch {}
    showToast.success(`Appointment #${id} updated to "${newStatus}"`);
  };

  const handleOpenWhatsApp = (apt: AppointmentRecord) => {
    const cleanPhone = apt.customerPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      showToast.error("Patron does not have a valid mobile number for WhatsApp");
      return;
    }
    const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = encodeURIComponent(
      `Namaste ${apt.customerName}! 🙏\n\nGreetings from Sreesha Elegance Atelier, Hyderabad.\n\nWe look forward to welcoming you for your *${apt.serviceTitle}* on:\n📅 Date: *${apt.date}*\n⏰ Time: *${apt.timeSlot}*\n📍 Mode: ${
        apt.mode === "virtual_video"
          ? "WhatsApp Video Call (+91 62813 44628)"
          : "Flagship Boutique, Kukatpally, Hyderabad"
      }\n\nPlease let us know if you have any questions or require directions.\n\nWarm regards,\nSreesha Elegance Concierge Team`
    );
    window.open(`https://wa.me/${formatted}?text=${text}`, "_blank");
  };

  const handleExportCSV = () => {
    if (appointments.length === 0) {
      showToast.error("No appointments to export");
      return;
    }

    const headers = [
      "Appointment ID",
      "Created Date",
      "Customer Name",
      "Phone",
      "Email",
      "Service",
      "Mode",
      "Date",
      "Time Slot",
      "City",
      "Occasion Date",
      "Notes",
      "Status",
    ];

    const rows = appointments.map((a) => [
      `"${a.id}"`,
      `"${a.createdAt}"`,
      `"${a.customerName.replace(/"/g, '""')}"`,
      `"${a.customerPhone}"`,
      `"${a.customerEmail}"`,
      `"${a.serviceTitle.replace(/"/g, '""')}"`,
      `"${a.mode}"`,
      `"${a.date}"`,
      `"${a.timeSlot}"`,
      `"${a.city}"`,
      `"${a.occasionDate || ""}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
      `"${a.status}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Sreesha_Elegance_Appointments_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast.success(`Exported ${appointments.length} appointments to CSV`);
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.customerPhone.includes(search) ||
      a.serviceTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Salon &amp; Bridal Bookings
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">Atelier Appointments Management</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage private salon visits, masterji tailoring appointments, and NRI video sessions.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E8E2D8] text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xs cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#B79B63]" /> Export CSV
          </button>
          <button
            onClick={loadAppointments}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E8E2D8] text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xs cursor-pointer shadow-xs"
          >
            <RotateCw className="w-3.5 h-3.5" /> Refresh List
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patron name, mobile, reference..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-stone-200 rounded-xs py-2 px-3 focus:outline-none focus:border-[#B79B63] bg-white w-full md:w-auto"
          >
            <option value="ALL">All Statuses ({appointments.length})</option>
            {STATUS_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No matching atelier appointments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="p-3.5 pl-5">Reference</th>
                  <th className="p-3.5">Patron</th>
                  <th className="p-3.5">Experience &amp; Mode</th>
                  <th className="p-3.5">Date &amp; Time Slot</th>
                  <th className="p-3.5">Occasion / Notes</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-semibold text-[#1C1B19]">#{apt.id}</td>

                    <td className="p-3.5">
                      <p className="font-semibold text-stone-800">{apt.customerName}</p>
                      <p className="text-[11px] text-stone-500 font-mono">{apt.customerPhone}</p>
                      <p className="text-[10px] text-stone-400">{apt.customerEmail}</p>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-stone-800">{apt.serviceTitle}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 mt-1 rounded-xs ${
                          apt.mode === "virtual_video"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[#F7F3EB] text-[#B79B63] border border-[#D8C7A5]"
                        }`}
                      >
                        {apt.mode === "virtual_video" ? (
                          <>
                            <Video className="w-3 h-3" /> WhatsApp Video
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3 h-3" /> In-Store Salon
                          </>
                        )}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-medium text-stone-800">{apt.date}</p>
                      <p className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#B79B63]" />
                        <span>{apt.timeSlot}</span>
                      </p>
                    </td>

                    <td className="p-3.5 max-w-xs">
                      {apt.occasionDate && (
                        <p className="text-[11px] text-[#B79B63] font-medium">
                          Occasion: {apt.occasionDate}
                        </p>
                      )}
                      {apt.notes ? (
                        <p className="text-[11px] text-stone-600 line-clamp-2 italic">
                          &ldquo;{apt.notes}&rdquo;
                        </p>
                      ) : (
                        <span className="text-[10px] text-stone-400">No special notes</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          handleUpdateStatus(apt.id, e.target.value as AppointmentStatus)
                        }
                        className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-xs border outline-none cursor-pointer ${
                          apt.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : apt.status === "Completed"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : apt.status === "Rescheduled"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {STATUS_LIST.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(apt)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 text-[11px] font-medium transition-colors rounded-xs cursor-pointer"
                        title="Chat with client on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>WhatsApp</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
