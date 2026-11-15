"use client";

import * as React from "react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Video,
  Phone,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import {
  APPOINTMENT_SERVICES,
  ATELIER_TIME_SLOTS,
  AppointmentServiceType,
  AppointmentRecord,
  saveAppointmentLocal,
} from "@/lib/appointments";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function AppointmentsPage() {
  const [selectedService, setSelectedService] =
    React.useState<AppointmentServiceType>("bridal_trousseau");
  const [selectedMode, setSelectedMode] = React.useState<"in_store" | "virtual_video">("in_store");

  // Date selection state - deferred to useEffect to prevent unstable new Date() during static prerender
  const [availableDates, setAvailableDates] = React.useState<
    { label: string; value: string; day: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(ATELIER_TIME_SLOTS[0]);

  React.useEffect(() => {
    const list: { label: string; value: string; day: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const day = d.toLocaleDateString("en-US", { weekday: "short" });
      const label = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      const fullValue = d.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      list.push({ label, value: fullValue, day });
    }
    setAvailableDates(list);
    setSelectedDate((prev) => prev || list[0]?.value || "");
  }, []);

  // Form details
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Hyderabad",
    occasionDate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = React.useState<AppointmentRecord | null>(
    null
  );

  const activeServiceDef =
    APPOINTMENT_SERVICES.find((s) => s.id === selectedService) || APPOINTMENT_SERVICES[0];

  // Adjust mode if active service does not allow current mode
  React.useEffect(() => {
    if (activeServiceDef && !activeServiceDef.allowedModes.includes(selectedMode)) {
      setSelectedMode(activeServiceDef.defaultMode);
    }
  }, [activeServiceDef, selectedMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      showToast.error("Please provide your full name");
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, "").length < 10) {
      showToast.error("Please provide a valid 10-digit mobile number");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      showToast.error("Please provide a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          serviceType: selectedService,
          mode: selectedMode,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          city: formData.city,
          occasionDate: formData.occasionDate,
          notes: formData.notes,
        }),
      });

      const data = await res.json();
      if (data.success && data.appointment) {
        saveAppointmentLocal(data.appointment);
        setConfirmedAppointment(data.appointment);
        showToast.success("Atelier reservation confirmed!");
      } else {
        showToast.error(data.error || "Unable to book appointment");
      }
    } catch {
      // Local fallback
      const localApt: AppointmentRecord = {
        id: `SE-APT-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        serviceType: selectedService,
        serviceTitle: activeServiceDef.title,
        mode: selectedMode,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        city: formData.city,
        occasionDate: formData.occasionDate,
        notes: formData.notes,
        status: "Confirmed",
      };
      saveAppointmentLocal(localApt);
      setConfirmedAppointment(localApt);
      showToast.success("Atelier reservation confirmed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleCalUrl = confirmedAppointment
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        `Sreesha Elegance: ${confirmedAppointment.serviceTitle}`
      )}&details=${encodeURIComponent(
        `Atelier Consultation #${confirmedAppointment.id}\nService: ${confirmedAppointment.serviceTitle}\nContact: +91 62813 44628`
      )}&location=${encodeURIComponent(
        confirmedAppointment.mode === "virtual_video"
          ? "WhatsApp Video Call (+91 62813 44628)"
          : "Sreesha Elegance, Opp JNTU Rd, HMT Hills, Kukatpally, Hyderabad 500085"
      )}`
    : "";

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 sm:pb-16">
      {/* ── 1. EDITORIAL HEADER ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 bg-[#1C1B19] text-[#FAF7F2] border-b border-[#2E2C28] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Sreesha Elegance Hyderabad Atelier"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19] via-[#1C1B19]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B79B63]/15 border border-[#B79B63]/30 text-[#B79B63] text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Private Atelier Consultations • Flagship Salon</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight">
            Reserve Your Private Styling Session
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#C7BEAF] leading-relaxed">
            Experience our pure handloom silk weaves, bridal lehengas, and bespoke masterji blouse
            fittings at our Kukatpally boutique or via a private 1-on-1 virtual video walkthrough.
          </p>
        </div>
      </section>

      {/* ── 2. CONFIRMATION VIEW IF BOOKED ──────────────────────────────────── */}
      {confirmedAppointment ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 rounded-xs shadow-xs space-y-8 text-center">
            <div className="h-16 w-16 bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 text-[#2D6A4F] flex items-center justify-center mx-auto rounded-full">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-bold">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1B19]">
                Thank You, {confirmedAppointment.customerName}
              </h2>
              <p className="text-xs sm:text-sm text-[#5A5650] max-w-md mx-auto">
                Your private styling appointment{" "}
                <strong className="text-[#1C1B19]">#{confirmedAppointment.id}</strong> is confirmed.
                We have sent your full itinerary to{" "}
                <strong className="text-[#1C1B19]">{confirmedAppointment.customerEmail}</strong>.
              </p>
            </div>

            {/* Appointment Details Box */}
            <div className="p-5 bg-[#FAF7F2] border border-[#E8E2D8] text-left text-xs space-y-3 rounded-xs max-w-lg mx-auto">
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#8C867D] uppercase tracking-wider text-[10px]">
                  Experience
                </span>
                <span className="font-semibold text-[#1C1B19]">
                  {confirmedAppointment.serviceTitle}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#8C867D] uppercase tracking-wider text-[10px]">
                  Date &amp; Time
                </span>
                <span className="font-semibold text-[#1C1B19]">
                  {confirmedAppointment.date} • {confirmedAppointment.timeSlot}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-2">
                <span className="text-[#8C867D] uppercase tracking-wider text-[10px]">Mode</span>
                <span className="font-semibold text-[#2D6A4F]">
                  {confirmedAppointment.mode === "virtual_video"
                    ? "Private 1-on-1 Video Session"
                    : "In-Store Flagship Salon"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C867D] uppercase tracking-wider text-[10px]">
                  Location
                </span>
                <span className="font-medium text-stone-700 text-right max-w-xs">
                  {confirmedAppointment.mode === "virtual_video"
                    ? "WhatsApp Video Call from Senior Stylist (+91 62813 44628)"
                    : "Opp JNTU Rd, HMT Hills, Kukatpally, Hyderabad"}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={googleCalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1C1B19] text-[#FAF7F2] hover:bg-[#B79B63] hover:text-[#1C1B19] text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs shadow-xs"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Add to Google Calendar</span>
              </a>

              <a
                href={`https://wa.me/916281344628?text=${encodeURIComponent(
                  `Namaste Sreesha Elegance, regarding my appointment #${confirmedAppointment.id} on ${confirmedAppointment.date}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366]/15 text-[#128C7E] border border-[#25D366]/30 hover:bg-[#25D366]/25 text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs"
              >
                <Phone className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp Stylist</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setConfirmedAppointment(null)}
                className="text-xs text-[#8C867D] hover:text-[#B79B63] transition-colors cursor-pointer underline"
              >
                Book another consultation
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── 3. BOOKING FORM WIZARD ─────────────────────────────────────────── */
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E8E2D8] rounded-xs shadow-md p-6 sm:p-10 space-y-10"
          >
            {/* ── STEP 1: SERVICE EXPERIENCE ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B79B63]">
                  Step 1 of 3
                </span>
                <span className="text-xs text-stone-500">Choose Consultation Service</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {APPOINTMENT_SERVICES.map((srv) => {
                  const isSelected = selectedService === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv.id)}
                      className={`p-4 border rounded-xs cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#B79B63] bg-[#F7F3EB]/40 ring-1 ring-[#B79B63]"
                          : "border-[#E8E2D8] hover:border-stone-400 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-serif text-base font-medium text-[#1C1B19]">
                          {srv.title}
                        </span>
                        {srv.badge && (
                          <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#B79B63]/15 text-[#B79B63] rounded-xs shrink-0">
                            {srv.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium mb-2">{srv.subtitle}</p>
                      <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                        {srv.description}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-wider">
                        <Clock className="h-3.5 w-3.5 text-[#B79B63]" />
                        <span>Duration: {srv.duration}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In-Store vs Virtual Video Switcher (if service supports both) */}
              {activeServiceDef.allowedModes.length > 1 && (
                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-wider font-medium text-stone-600 mb-2">
                    Consultation Mode:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMode("in_store")}
                      className={`p-3 border rounded-xs text-left transition-colors cursor-pointer flex items-center gap-3 ${
                        selectedMode === "in_store"
                          ? "border-[#1C1B19] bg-[#1C1B19] text-[#FAF7F2]"
                          : "border-[#E8E2D8] bg-white text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <MapPin className="h-4 w-4 shrink-0 text-[#B79B63]" />
                      <div>
                        <p className="text-xs font-semibold">Flagship Boutique Visit</p>
                        <p className="text-[10px] opacity-80">Kukatpally Atelier, Hyderabad</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMode("virtual_video")}
                      className={`p-3 border rounded-xs text-left transition-colors cursor-pointer flex items-center gap-3 ${
                        selectedMode === "virtual_video"
                          ? "border-[#1C1B19] bg-[#1C1B19] text-[#FAF7F2]"
                          : "border-[#E8E2D8] bg-white text-stone-700 hover:border-stone-400"
                      }`}
                    >
                      <Video className="h-4 w-4 shrink-0 text-[#2D6A4F]" />
                      <div>
                        <p className="text-xs font-semibold">Private 1-on-1 Video Preview</p>
                        <p className="text-[10px] opacity-80">WhatsApp Video Walkthrough</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── STEP 2: DATE & TIME SLOT ── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B79B63]">
                  Step 2 of 3
                </span>
                <span className="text-xs text-stone-500">Choose Date &amp; Atelier Time Slot</span>
              </div>

              {/* Date Pills */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-medium text-stone-600">
                  Select Preferred Date:
                </label>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {availableDates.length === 0 ? (
                    <div className="text-xs text-stone-400 py-2">Loading atelier calendar...</div>
                  ) : (
                    availableDates.map((d) => {
                      const isSelected = selectedDate === d.value;
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setSelectedDate(d.value)}
                          className={`px-3 py-2 text-center rounded-xs border transition-colors shrink-0 cursor-pointer ${
                            isSelected
                              ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19] shadow-xs"
                              : "bg-[#FAF7F2] text-stone-700 border-[#E8E2D8] hover:border-[#B79B63]"
                          }`}
                        >
                          <p className="text-[10px] uppercase tracking-wider font-bold text-[#B79B63]">
                            {d.day}
                          </p>
                          <p className="text-xs font-semibold mt-0.5">{d.label}</p>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs uppercase tracking-wider font-medium text-stone-600">
                  Select Time Slot (IST):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ATELIER_TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 text-xs font-mono font-medium rounded-xs border text-center transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#B79B63] text-[#1C1B19] border-[#B79B63] font-semibold"
                            : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── STEP 3: PATRON DETAILS ── */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B79B63]">
                  Step 3 of 3
                </span>
                <span className="text-xs text-stone-500">Patron Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sowmya Kamineni"
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98490 12345"
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    Email Address (For Calendar Invite) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patron@example.com"
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Hyderabad, India or Dallas, USA"
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    Occasion / Wedding Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.occasionDate}
                    onChange={(e) => setFormData({ ...formData, occasionDate: e.target.value })}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-stone-600 font-medium">
                    Weave / Color Preferences or Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Looking for heavy gold zari bridal Kanchipuram in crimson or peacock blue; need custom sleeve maggam work blouse."
                    className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#E8E2D8]">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer"
              >
                {isSubmitting
                  ? "Reserving Atelier Slot..."
                  : "Confirm Atelier Reservation • Complimentary Consultation"}
              </Button>
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2D6A4F]" />
                <span>Zero Booking Charges • Complimentary Refreshments &amp; Valet Parking</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── 4. FLAGSHIP ATELIER LOCATION CARD ─────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-6 sm:p-8 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79B63] font-bold">
              Flagship Boutique
            </span>
            <h3 className="text-xl font-serif text-[#1C1B19]">Sreesha Elegance, Hyderabad</h3>
            <p className="text-xs text-stone-600 max-w-md leading-relaxed">
              Opp, JNTU Rd, HMT Hills, Kukatpally, Hyderabad, Telangana 500085. Open 7 days a week
              from 10:30 AM to 09:00 PM IST.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://maps.app.goo.gl/KPp3kgQXKQoW5urG6?g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E8E2D8] text-xs font-medium text-stone-800 hover:border-[#B79B63] transition-colors rounded-xs shadow-xs"
            >
              <MapPin className="h-3.5 w-3.5 text-[#B79B63]" />
              <span>Google Maps Directions</span>
              <ExternalLink className="h-3 w-3 text-stone-400" />
            </a>
            <a
              href="tel:+916281344628"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1C1B19] text-[#FAF7F2] hover:bg-[#B79B63] hover:text-[#1C1B19] text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Atelier Desk</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
