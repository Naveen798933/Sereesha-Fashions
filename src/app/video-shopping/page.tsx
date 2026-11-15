"use client";

import * as React from "react";
import {
  Video,
  Globe2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Plane,
  Star,
} from "lucide-react";
import {
  NRI_TIMEZONES,
  ATELIER_VIDEO_SLOTS,
  VIDEO_SHOPPING_WEAVES,
  NRI_BUDGET_TIERS,
  NRI_REVIEWS,
  TimezoneOption,
  convertSlotToLocalTime,
  generateGoogleCalendarUrl,
} from "@/lib/videoShopping";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";
import { saveAppointmentLocal, AppointmentRecord } from "@/lib/appointments";

export default function VideoShoppingPage() {
  const [selectedTimezone, setSelectedTimezone] = React.useState<TimezoneOption>(
    NRI_TIMEZONES[0] // US Eastern default
  );

  // Available rolling 14 dates (computed client-side in useEffect)
  const [availableDates, setAvailableDates] = React.useState<
    { dateObj: Date; label: string; value: string; day: string }[]
  >([]);
  const [selectedDateIndex, setSelectedDateIndex] = React.useState(0);
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState(3); // 7:00 PM IST default (great for US & UK)

  // Selected weaves
  const [selectedWeaves, setSelectedWeaves] = React.useState<string[]>([
    "kanchipuram_bridal",
    "banarasi_katan",
  ]);

  // Selected budget
  const [selectedBudget, setSelectedBudget] = React.useState(NRI_BUDGET_TIERS[1].id);

  // Preferred platform
  const [platform, setPlatform] = React.useState<"whatsapp" | "google_meet">("whatsapp");

  // Form details
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    country: "United States",
    occasionDate: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [confirmedBooking, setConfirmedBooking] = React.useState<AppointmentRecord | null>(null);

  // Rolling 14-day date generator
  React.useEffect(() => {
    const dates: { dateObj: Date; label: string; value: string; day: string }[] = [];
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
      dates.push({ dateObj: d, label, value: fullValue, day });
    }
    setAvailableDates(dates);
  }, []);

  // Update country when timezone changes
  const handleTimezoneChange = (tz: TimezoneOption) => {
    setSelectedTimezone(tz);
    setFormData((prev) => ({ ...prev, country: tz.country }));
  };

  const toggleWeave = (weaveId: string) => {
    setSelectedWeaves((prev) =>
      prev.includes(weaveId) ? prev.filter((id) => id !== weaveId) : [...prev, weaveId]
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const activeDate = availableDates[selectedDateIndex];
  const activeSlot = ATELIER_VIDEO_SLOTS[selectedSlotIndex];

  // Local time computation for active slot
  const activeLocalTime = activeDate
    ? convertSlotToLocalTime(activeDate.dateObj, activeSlot, selectedTimezone.timeZone)
    : {
        localTimeString: activeSlot.istSlot,
        localDateString: "",
        isDifferentDay: false,
        dayDifferenceText: "",
      };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showToast.error("Please fill in your name, contact phone, and email.");
      return;
    }

    if (!formData.email.includes("@")) {
      showToast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const slotSummary = `${activeLocalTime.localTimeString} (${selectedTimezone.label}) / ${activeSlot.istSlot}`;
    const dateSummary = activeDate ? activeDate.value : "Upcoming Date";

    const fullNotes = [
      `Client Timezone: ${selectedTimezone.label} (${selectedTimezone.city})`,
      `Preferred Platform: ${platform === "whatsapp" ? "WhatsApp HD Video" : "Google Meet"}`,
      `Budget Tier: ${NRI_BUDGET_TIERS.find((b) => b.id === selectedBudget)?.label || selectedBudget}`,
      `Weaves of Interest: ${selectedWeaves.join(", ") || "General Bridal Curation"}`,
      formData.notes ? `Special Request: ${formData.notes}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          serviceType: "virtual_nri_video",
          mode: "virtual_video",
          date: dateSummary,
          timeSlot: slotSummary,
          city: `${formData.city || selectedTimezone.city}, ${formData.country}`,
          occasionDate: formData.occasionDate,
          notes: fullNotes,
        }),
      });

      const data = await res.json();

      if (data.success && data.appointment) {
        saveAppointmentLocal(data.appointment);
        setConfirmedBooking(data.appointment);
        showToast.success("Virtual Shopping Session Confirmed!");
        window.scrollTo({ top: 200, behavior: "smooth" });
      } else {
        // Offline / fallback reservation
        const fallback: AppointmentRecord = {
          id: `SE-APT-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          serviceType: "virtual_nri_video",
          serviceTitle: "Global NRI 1-on-1 Video Shopping",
          mode: "virtual_video",
          date: dateSummary,
          timeSlot: slotSummary,
          city: `${formData.city || selectedTimezone.city}, ${formData.country}`,
          occasionDate: formData.occasionDate,
          notes: fullNotes,
          status: "Confirmed",
        };
        saveAppointmentLocal(fallback);
        setConfirmedBooking(fallback);
        showToast.success("Virtual Shopping Session Reserved!");
        window.scrollTo({ top: 200, behavior: "smooth" });
      }
    } catch {
      showToast.error("Network issue. Please try again or WhatsApp our concierge directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19]">
      {/* Hero Header */}
      <section className="relative bg-[#1C1B19] text-[#FAF7F2] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#2E2C28]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B79B63_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#B79B63]/10 border border-[#B79B63]/30 text-[#B79B63] text-xs uppercase tracking-[0.2em] font-medium">
            <Video className="h-3.5 w-3.5" />
            <span>Global NRI Privé • 1-on-1 Video Salon</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            Virtual Bridal Video Shopping
          </h1>

          <p className="text-xs sm:text-base text-[#C7BEAF] max-w-2xl mx-auto leading-relaxed">
            Experience our Kukatpally flagship atelier from anywhere in the world. Our master
            curators walk you through authentic Kanchipuram pure silks, Banarasi brocades, and royal
            lehengas over private HD video—draping the pallu and verifying Silk Mark seals live.
          </p>

          {/* Quick Worldwide Express Shipping Assurance */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#E8E2D8]">
            <span className="flex items-center gap-1.5 text-[#B79B63]">
              <Plane className="h-4 w-4" />
              <span>DHL Express 3–5 Days to USA, UK &amp; UAE</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#2D6A4F]" />
              <span>100% Insured Doorstep Delivery</span>
            </span>
            <span className="text-[#3E3A34]">•</span>
            <span>No Custom Hassle</span>
          </div>
        </div>
      </section>

      {/* Main Booking Suite or Confirmation Screen */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {confirmedBooking ? (
          /* Confirmation Success Card */
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#B79B63] p-8 sm:p-12 shadow-lg text-center space-y-6">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#F7F3EB] border-2 border-[#B79B63] flex items-center justify-center text-[#B79B63]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#2D6A4F] font-semibold">
                Private Consultation Confirmed
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">
                We Look Forward to Welcoming You
              </h2>
              <p className="text-xs text-[#8C867D]">
                Reference ID:{" "}
                <strong className="text-[#1C1B19] font-mono">{confirmedBooking.id}</strong>
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-left space-y-2">
              <div className="flex justify-between border-b border-[#E8E2D8] pb-1.5">
                <span className="text-[#8C867D]">Patron Name:</span>
                <span className="font-semibold text-[#1C1B19]">
                  {confirmedBooking.customerName}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-1.5">
                <span className="text-[#8C867D]">Scheduled Date:</span>
                <span className="font-semibold text-[#1C1B19]">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E2D8] pb-1.5">
                <span className="text-[#8C867D]">Local &amp; Atelier Slot:</span>
                <span className="font-semibold text-[#1C1B19]">{confirmedBooking.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C867D]">Video Platform:</span>
                <span className="font-semibold text-[#2D6A4F]">
                  {platform === "whatsapp"
                    ? "WhatsApp Video (+91 62813 44628)"
                    : "Google Meet Video"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={generateGoogleCalendarUrl({
                  id: confirmedBooking.id,
                  title: confirmedBooking.serviceTitle,
                  dateStr: confirmedBooking.date,
                  timeSlot: confirmedBooking.timeSlot,
                  clientTimezone: selectedTimezone.label,
                  customerName: confirmedBooking.customerName,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#1C1B19] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#B79B63] transition-colors flex items-center justify-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Add to Google Calendar</span>
              </a>

              <a
                href={`https://wa.me/916281344628?text=${encodeURIComponent(
                  `Namaste Sreesha Elegance, I have booked a virtual video shopping session #${confirmedBooking.id} for ${confirmedBooking.date} (${confirmedBooking.timeSlot}). Looking forward!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#25D366] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#1fb854] transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>

            <p className="text-[11px] text-[#8C867D] pt-2">
              Our lead bridal stylist will reach out on WhatsApp prior to the appointment with a
              brief palette questionnaire and catalog links.
            </p>
          </div>
        ) : (
          /* The Interactive Booking Suite */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Cols: Timezone Synchronizer & Form */}
            <div className="lg:col-span-7 space-y-8">
              {/* STEP 1: TIMEZONE SYNCHRONIZER */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E2D8]">
                  <div className="h-7 w-7 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                    1
                  </div>
                  <div>
                    <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                      Select Your Local Timezone
                    </h2>
                    <p className="text-xs text-[#8C867D]">
                      We automatically convert Hyderabad atelier slots to your local clock.
                    </p>
                  </div>
                </div>

                {/* Timezone Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NRI_TIMEZONES.map((tz) => (
                    <button
                      key={tz.id}
                      type="button"
                      onClick={() => handleTimezoneChange(tz)}
                      className={`p-2.5 text-left border text-xs transition-all ${
                        selectedTimezone.id === tz.id
                          ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                          : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{tz.flag}</span>
                        <span className="text-[10px] font-mono text-[#8C867D]">{tz.utcOffset}</span>
                      </div>
                      <p className="font-semibold text-[#1C1B19] mt-1 text-[11px] truncate">
                        {tz.label.split(" ")[0]} {tz.label.split(" ")[1]}
                      </p>
                      <p className="text-[10px] text-[#8C867D] truncate">{tz.city.split(",")[0]}</p>
                    </button>
                  ))}
                </div>

                {/* Live Dual-Clock Display */}
                <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-[#B79B63]" />
                    <span>
                      <strong className="text-[#1C1B19]">Your Local Slot:</strong>{" "}
                      <span className="text-[#2D6A4F] font-semibold">
                        {activeLocalTime.localTimeString}
                      </span>{" "}
                      <span className="text-[#8C867D]">({selectedTimezone.label})</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-[#8C867D]">
                    Atelier: <strong className="text-[#1C1B19]">{activeSlot.istSlot}</strong>
                  </div>
                </div>
              </div>

              {/* STEP 2: DATE & TIME SLOT SELECTION */}
              <div className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E2D8]">
                  <div className="h-7 w-7 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                    2
                  </div>
                  <div>
                    <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                      Select Preferred Date &amp; Slot
                    </h2>
                    <p className="text-xs text-[#8C867D]">
                      Slots are 90 minutes with dedicated camera zooming and drape demonstration.
                    </p>
                  </div>
                </div>

                {/* Rolling Date Selector Horizontal Slider */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Select Date (Next 14 Days):
                  </label>
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {availableDates.map((d, index) => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setSelectedDateIndex(index)}
                        className={`px-3 py-2.5 border text-center shrink-0 min-w-[70px] transition-all ${
                          selectedDateIndex === index
                            ? "bg-[#1C1B19] text-[#FAF7F2] border-[#1C1B19]"
                            : "bg-white text-[#1C1B19] border-[#E8E2D8] hover:border-[#B79B63]"
                        }`}
                      >
                        <span className="block text-[10px] uppercase font-semibold text-[#8C867D]">
                          {d.day}
                        </span>
                        <span className="block text-xs font-serif font-bold mt-0.5">{d.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Converted Time Slot Cards */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Available Video Slots (Converted to {selectedTimezone.city}):
                  </label>

                  <div className="space-y-2.5">
                    {ATELIER_VIDEO_SLOTS.map((slot, idx) => {
                      const converted = activeDate
                        ? convertSlotToLocalTime(
                            activeDate.dateObj,
                            slot,
                            selectedTimezone.timeZone
                          )
                        : {
                            localTimeString: slot.istSlot,
                            localDateString: "",
                            isDifferentDay: false,
                            dayDifferenceText: "",
                          };

                      const isSelected = selectedSlotIndex === idx;

                      return (
                        <button
                          key={slot.istSlot}
                          type="button"
                          onClick={() => setSelectedSlotIndex(idx)}
                          className={`w-full p-3.5 border text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
                            isSelected
                              ? "border-[#B79B63] bg-[#FAF7F2] ring-1 ring-[#B79B63]"
                              : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? "border-[#B79B63] bg-[#B79B63]" : "border-[#8C867D]"
                              }`}
                            >
                              {isSelected && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                            </div>
                            <div>
                              <p className="font-serif font-semibold text-sm text-[#1C1B19]">
                                {converted.localTimeString}
                              </p>
                              <p className="text-[11px] text-[#8C867D]">
                                Atelier Hyderabad: {slot.istSlot}{" "}
                                {converted.dayDifferenceText && (
                                  <span className="text-amber-700 font-semibold">
                                    {converted.dayDifferenceText}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D8] text-[#5C5549] self-start sm:self-center">
                            {slot.recommendedTimezone}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* STEP 3: CURATION PREFERENCES & CONTACT */}
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-[#E8E2D8] p-6 sm:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E8E2D8]">
                  <div className="h-7 w-7 rounded-full bg-[#1C1B19] text-[#FAF7F2] flex items-center justify-center text-xs font-semibold">
                    3
                  </div>
                  <div>
                    <h2 className="font-serif text-lg text-[#1C1B19] font-medium">
                      Patron Details &amp; Viewing Preferences
                    </h2>
                    <p className="text-xs text-[#8C867D]">
                      Help our master draper prepare matching weaves and color palettes in advance.
                    </p>
                  </div>
                </div>

                {/* Weaves of Interest Checkboxes */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Select Weaves You Wish to Inspect Live:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VIDEO_SHOPPING_WEAVES.map((w) => {
                      const checked = selectedWeaves.includes(w.id);
                      return (
                        <label
                          key={w.id}
                          className={`p-2.5 border cursor-pointer text-xs flex items-start gap-2.5 transition-colors ${
                            checked
                              ? "border-[#B79B63] bg-[#FAF7F2]"
                              : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleWeave(w.id)}
                            className="mt-0.5 accent-[#B79B63]"
                          />
                          <div>
                            <p className="font-semibold text-[#1C1B19]">{w.title}</p>
                            <p className="text-[10px] text-[#8C867D] leading-tight mt-0.5">
                              {w.desc}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Tier */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Planned Budget Envelope:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {NRI_BUDGET_TIERS.map((tier) => (
                      <label
                        key={tier.id}
                        className={`p-2.5 border cursor-pointer text-xs flex items-start gap-2.5 transition-colors ${
                          selectedBudget === tier.id
                            ? "border-[#B79B63] bg-[#FAF7F2]"
                            : "border-[#E8E2D8] bg-white hover:border-[#B79B63]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={tier.id}
                          checked={selectedBudget === tier.id}
                          onChange={() => setSelectedBudget(tier.id)}
                          className="mt-0.5 accent-[#B79B63]"
                        />
                        <div>
                          <p className="font-semibold text-[#1C1B19]">{tier.label}</p>
                          <p className="text-[10px] text-[#8C867D]">{tier.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Video Platform Choice */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
                    Preferred Video Platform:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 border cursor-pointer text-xs flex items-center gap-2.5 transition-colors ${
                        platform === "whatsapp"
                          ? "border-[#25D366] bg-[#25D366]/5 font-semibold text-[#1C1B19]"
                          : "border-[#E8E2D8] bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value="whatsapp"
                        checked={platform === "whatsapp"}
                        onChange={() => setPlatform("whatsapp")}
                        className="accent-[#25D366]"
                      />
                      <Phone className="h-4 w-4 text-[#25D366]" />
                      <span>WhatsApp HD Video (Recommended)</span>
                    </label>

                    <label
                      className={`p-3 border cursor-pointer text-xs flex items-center gap-2.5 transition-colors ${
                        platform === "google_meet"
                          ? "border-[#B79B63] bg-[#FAF7F2] font-semibold text-[#1C1B19]"
                          : "border-[#E8E2D8] bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value="google_meet"
                        checked={platform === "google_meet"}
                        onChange={() => setPlatform("google_meet")}
                        className="accent-[#B79B63]"
                      />
                      <Video className="h-4 w-4 text-[#B79B63]" />
                      <span>Google Meet Calendar Link</span>
                    </label>
                  </div>
                </div>

                {/* Form Fields: Name, International Phone, Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block text-[#1C1B19] font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Radhika Varma"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1C1B19] font-medium mb-1">
                      International Mobile with Country Code *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +1 (408) 555-0199 or +44 7911 123456"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1C1B19] font-medium mb-1">
                      Email Address (For Calendar Invite) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="radhika.varma@example.com"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#1C1B19] font-medium mb-1">
                      City &amp; State
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Dallas, Texas"
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#1C1B19] font-medium mb-1">
                      Occasion / Specific Saree SKUs to Inspect (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="e.g. Looking for an emerald Muhurtham Kanchipuram and pastel reception lehenga for my wedding on Feb 18th."
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E2D8] focus:border-[#B79B63] outline-none resize-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Video className="h-4 w-4" />
                      <span>Confirm Virtual Video Shopping Reservation</span>
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center text-[#8C867D]">
                  ✦ 100% Complimentary Service • No Minimum Purchase Required • Reschedule Anytime
                </p>
              </form>
            </div>

            {/* Right 5 Cols: Express International Guarantees & Real NRI Stories */}
            <div className="lg:col-span-5 space-y-6">
              {/* International Shipping Card */}
              <div className="bg-[#1C1B19] text-[#FAF7F2] p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2 text-[#B79B63] text-xs uppercase tracking-widest font-semibold">
                  <Plane className="h-4 w-4" />
                  <span>Express Global Delivery</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Doorstep Delivery via DHL Express
                </h3>

                <p className="text-xs text-[#C7BEAF] leading-relaxed">
                  We ship directly from our Hyderabad atelier to 45+ countries. Every order is fully
                  insured against loss and transit damage.
                </p>

                <div className="space-y-2 pt-2 border-t border-[#3E3A34] text-xs">
                  <div className="flex justify-between py-1 border-b border-[#2E2C28]">
                    <span className="text-[#A69E92]">USA &amp; Canada:</span>
                    <span className="font-semibold text-white">3 – 5 Business Days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2E2C28]">
                    <span className="text-[#A69E92]">United Kingdom &amp; Europe:</span>
                    <span className="font-semibold text-white">3 – 4 Business Days</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#2E2C28]">
                    <span className="text-[#A69E92]">UAE &amp; Gulf (GCC):</span>
                    <span className="font-semibold text-white">2 – 3 Business Days</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#A69E92]">Australia &amp; NZ:</span>
                    <span className="font-semibold text-white">4 – 6 Business Days</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[#B79B63]">
                  ✦ Free Worldwide Express Shipping on all orders above $750 / ₹60,000.
                </div>
              </div>

              {/* What Happens on the Call */}
              <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-xs">
                <h3 className="font-serif text-lg font-medium text-[#1C1B19]">
                  What Happens on Your Video Call?
                </h3>

                <div className="space-y-3 text-xs text-[#5C5549]">
                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#FAF7F2] border border-[#B79B63] text-[#B79B63] flex items-center justify-center shrink-0 font-semibold text-[11px]">
                      1
                    </span>
                    <p>
                      <strong>Natural Studio Lighting:</strong> We display each saree in true 5000K
                      daylight to reflect authentic color tones without harsh glare.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#FAF7F2] border border-[#B79B63] text-[#B79B63] flex items-center justify-center shrink-0 font-semibold text-[11px]">
                      2
                    </span>
                    <p>
                      <strong>Shoulder Drape Simulation:</strong> Our master draper drapes the pallu
                      and pleats over her shoulder so you see the movement and fall.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-[#FAF7F2] border border-[#B79B63] text-[#B79B63] flex items-center justify-center shrink-0 font-semibold text-[11px]">
                      3
                    </span>
                    <p>
                      <strong>Macro Zari &amp; Silk Mark Inspection:</strong> We zoom in to examine
                      the fine zari wire, petni borders, and verified Silk Mark label.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real NRI Patron Testimonials */}
              <div className="bg-white border border-[#E8E2D8] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-medium text-[#1C1B19]">
                    NRI Patron Experiences
                  </h3>
                  <div className="flex text-[#B79B63]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-xs divide-y divide-[#E8E2D8]">
                  {NRI_REVIEWS.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="pt-3 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1C1B19] flex items-center gap-1.5">
                          <span>{rev.flag}</span>
                          <span>{rev.name}</span>
                        </span>
                        <span className="text-[10px] text-[#8C867D]">{rev.city}</span>
                      </div>
                      <p className="text-[11px] text-[#8C867D] italic">
                        Purchased: {rev.sareePurchased}
                      </p>
                      <p className="text-[#5C5549] leading-relaxed text-[11px]">
                        &quot;{rev.review}&quot;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
