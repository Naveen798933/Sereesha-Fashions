"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  FlaskConical,
  Clock,
  Send,
  Download,
  RotateCw,
  ChevronRight,
  PhoneCall,
  MapPin,
} from "lucide-react";
import {
  SILK_CARE_PILLARS,
  calculateFoldSchedule,
  ATELIER_RESTORATION_SERVICES,
  FoldMilestone,
} from "@/lib/silkCare";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/components/ui/Toast";

export default function SilkCarePage() {
  const [activePillarId, setActivePillarId] = React.useState<string>(SILK_CARE_PILLARS[0].id);

  // Fold Rotation State (Safe for Next.js SSR / Prerender)
  const [purchaseDateInput, setPurchaseDateInput] = React.useState<string>("");
  const [sareeNickname, setSareeNickname] = React.useState<string>("Bridal Kanchipuram Heirloom");
  const [schedule, setSchedule] = React.useState<FoldMilestone[]>([]);

  // Restoration Inquiry Form
  const [restorationService, setRestorationService] = React.useState<string>(
    ATELIER_RESTORATION_SERVICES[0].id
  );
  const [clientName, setClientName] = React.useState<string>("");
  const [clientPhone, setClientPhone] = React.useState<string>("");
  const [sareeDescription, setSareeDescription] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Initialize dates safely in useEffect to prevent hydration mismatch
  React.useEffect(() => {
    const today = new Date();
    const isoDate = today.toISOString().split("T")[0];
    setPurchaseDateInput(isoDate);
    setSchedule(calculateFoldSchedule(today));
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateStr = e.target.value;
    setPurchaseDateInput(newDateStr);
    if (newDateStr) {
      const parsedDate = new Date(newDateStr);
      if (!isNaN(parsedDate.getTime())) {
        setSchedule(calculateFoldSchedule(parsedDate));
      }
    }
  };

  const activePillar =
    SILK_CARE_PILLARS.find((p) => p.id === activePillarId) || SILK_CARE_PILLARS[0];

  // Helper to generate Google Calendar URL for milestone
  const createGoogleCalendarUrl = (milestone: FoldMilestone) => {
    const title = encodeURIComponent(
      `Sreesha Elegance Saree Care: ${milestone.actionTitle} (${sareeNickname})`
    );
    const details = encodeURIComponent(
      `Preservation Action: ${milestone.instructions}\n\nPreserve your pure handloom silk & silver zari. Recommended by Sreesha Elegance Atelier, Kukatpally, Hyderabad.`
    );
    // Parse scheduled date
    const d = new Date(purchaseDateInput || new Date().toISOString().split("T")[0]);
    d.setDate(d.getDate() + milestone.daysAfterPurchase);
    const dateStr = d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}/${dateStr}`;
  };

  // Generate downloadable .ics file for all 4 milestones
  const downloadIcsCalendar = () => {
    if (!schedule.length) return;
    const icsLines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sreesha Elegance//Atelier Silk Care//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    const base = new Date(purchaseDateInput || new Date().toISOString().split("T")[0]);

    schedule.forEach((m, idx) => {
      const mDate = new Date(base);
      mDate.setDate(mDate.getDate() + m.daysAfterPurchase);
      const startStr = mDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      icsLines.push(
        "BEGIN:VEVENT",
        `UID:sreesha-fold-${Date.now()}-${idx}@sreeshaelegance.com`,
        `DTSTAMP:${startStr}`,
        `DTSTART:${startStr}`,
        `SUMMARY:Sreesha Elegance Silk Care: ${m.actionTitle} (${sareeNickname})`,
        `DESCRIPTION:${m.instructions} Wrap individually in pure muslin cloth. Sreesha Elegance Concierge: +91 62813 44628`,
        "LOCATION:Home Wardrobe Archival Storage",
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    icsLines.push("END:VCALENDAR");
    const blob = new Blob([icsLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `Sreesha_Silk_Care_${sareeNickname.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast.success("iCal Preservation Reminders downloaded successfully!");
  };

  const handleRestorationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast.error("Please provide your name and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    const serviceObj = ATELIER_RESTORATION_SERVICES.find((s) => s.id === restorationService);

    // Create WhatsApp message
    const whatsappMsg = encodeURIComponent(
      `*Sreesha Elegance — Atelier Restoration Request*\n\n` +
        `• *Client Name:* ${clientName}\n` +
        `• *Phone:* ${clientPhone}\n` +
        `• *Service Requested:* ${serviceObj?.name || restorationService}\n` +
        `• *Saree Details:* ${sareeDescription || "Pure Handloom Silk"}\n\n` +
        `Please advise on drop-off at Kukatpally atelier or insured courier pickup.`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      showToast.success("Inquiry submitted! Opening WhatsApp Concierge...");
      window.open(`https://wa.me/916281344628?text=${whatsappMsg}`, "_blank");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1B19] pb-24 pt-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#B79B63]/20 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2] py-16">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#B79B63_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B79B63]/10 border border-[#B79B63]/30 text-xs font-semibold tracking-wider text-[#B79B63] uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-[#B79B63]" />
            Atelier Archival Preservation
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] tracking-tight leading-tight max-w-3xl mx-auto">
            The Science of Silk Care &amp; Heirloom Preservation
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#1C1B19]/70 max-w-2xl mx-auto leading-relaxed">
            Authentic handloom silks and pure silver zari are living works of art. Protect your
            trousseau investments from tarnishing, crease-line tears, and fiber degradation for
            generations to come.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-xl border border-[#B79B63]/20 shadow-sm text-left">
              <span className="text-xs uppercase tracking-wider text-[#1C1B19]/60 font-semibold block">
                Recommended Wrap
              </span>
              <span className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5 block">
                100% Muslin Mulmul
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-medium block mt-1">
                Zero Plastic Off-Gas
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#B79B63]/20 shadow-sm text-left">
              <span className="text-xs uppercase tracking-wider text-[#1C1B19]/60 font-semibold block">
                Fold Rotation
              </span>
              <span className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5 block">
                Every 90 Days
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-medium block mt-1">
                Prevents Warp Cracking
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#B79B63]/20 shadow-sm text-left">
              <span className="text-xs uppercase tracking-wider text-[#1C1B19]/60 font-semibold block">
                Dry Clean Method
              </span>
              <span className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5 block">
                Hydrocarbon Only
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-medium block mt-1">
                No Water Immersion
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#B79B63]/20 shadow-sm text-left">
              <span className="text-xs uppercase tracking-wider text-[#1C1B19]/60 font-semibold block">
                Zari Protection
              </span>
              <span className="font-serif text-lg font-bold text-[#1C1B19] mt-0.5 block">
                Perfume Free
              </span>
              <span className="text-[11px] text-[#2D6A4F] font-medium block mt-1">
                Prevents Silver Sulphide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 space-y-16">
        {/* Section 1: The 5 Archival Pillars */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#B79B63]/20 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B79B63] font-semibold block">
                Curated by Sreesha Master Weavers
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-1">
                Five Foundations of Saree Longevity
              </h2>
            </div>
            <p className="text-xs text-[#1C1B19]/60 max-w-sm">
              Explore the laboratory-proven principles of protein fiber care and genuine silver zari
              preservation.
            </p>
          </div>

          {/* Pillar Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-8">
            {SILK_CARE_PILLARS.map((p) => {
              const isSelected = p.id === activePillarId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillarId(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-[#1C1B19] text-white border-[#1C1B19] shadow-md shadow-black/10 scale-[1.02]"
                      : "bg-white text-[#1C1B19] border-[#B79B63]/20 hover:border-[#B79B63]/50 hover:bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-[#B79B63] text-white" : "bg-[#B79B63]/10 text-[#B79B63]"
                      }`}
                    >
                      Pillar 0{p.pillarNumber}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-bold ${
                        isSelected ? "text-[#FAF7F2]/70" : "text-[#2D6A4F]"
                      }`}
                    >
                      {p.importance}
                    </span>
                  </div>
                  <div className="font-serif text-xs sm:text-sm font-semibold line-clamp-2">
                    {p.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Card */}
          <div className="bg-white rounded-2xl border border-[#B79B63]/20 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#FAF7F2]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#B79B63] font-semibold">
                  Pillar 0{activePillar.pillarNumber} &bull; {activePillar.subtitle}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-1">
                  {activePillar.title}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#2D6A4F]/10 text-[#2D6A4F] border border-[#2D6A4F]/20 self-start md:self-auto">
                <ShieldCheck className="w-4 h-4" />
                {activePillar.importance} Protocol
              </span>
            </div>

            <p className="mt-6 text-sm sm:text-base text-[#1C1B19]/80 leading-relaxed max-w-4xl">
              {activePillar.description}
            </p>

            {/* Dos and Donts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Dos */}
              <div className="p-5 rounded-xl bg-[#2D6A4F]/5 border border-[#2D6A4F]/20">
                <div className="flex items-center gap-2 text-sm font-bold text-[#2D6A4F] uppercase tracking-wider mb-4">
                  <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                  Preservation Best Practices (Do)
                </div>
                <ul className="space-y-3">
                  {activePillar.dos.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1C1B19]/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Donts */}
              <div className="p-5 rounded-xl bg-red-50/60 border border-red-200">
                <div className="flex items-center gap-2 text-sm font-bold text-red-700 uppercase tracking-wider mb-4">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Irreversible Damage Hazards (Never Do)
                </div>
                <ul className="space-y-3">
                  {activePillar.donts.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1C1B19]/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Scientific Reason */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAF7F2] border border-[#B79B63]/30 flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-[#B79B63] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#B79B63] block">
                  Textile Science &amp; Metallurgy Insight
                </span>
                <p className="text-xs sm:text-sm text-[#1C1B19]/80 mt-1 leading-relaxed">
                  {activePillar.scientificReason}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive 90-Day Fold-Change Calculator */}
        <section className="bg-gradient-to-br from-white to-[#FAF7F2] p-6 sm:p-10 rounded-2xl border border-[#B79B63]/30 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#B79B63]/20">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#B79B63] uppercase mb-1">
                <RotateCw className="w-4 h-4 text-[#B79B63]" />
                Interactive Preservation Planner
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19]">
                90-Day Fold Rotation Matrix &amp; Calendar Alerts
              </h2>
              <p className="text-xs sm:text-sm text-[#1C1B19]/70 mt-1 max-w-2xl">
                Enter your saree&apos;s purchase date or last aeration date to generate a rolling
                4-quarter schedule. Add reminder alerts to your Google or Apple Calendar to protect
                delicate fold creases.
              </p>
            </div>

            {/* Calendar Export Button */}
            <Button
              onClick={downloadIcsCalendar}
              variant="outline"
              className="border-[#B79B63] text-[#B79B63] hover:bg-[#B79B63] hover:text-white shrink-0 self-start md:self-auto gap-2"
            >
              <Download className="w-4 h-4" />
              Download .ICS Calendar File
            </Button>
          </div>

          {/* Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-2">
                Saree Identifier or Nickname
              </label>
              <input
                type="text"
                value={sareeNickname}
                onChange={(e) => setSareeNickname(e.target.value)}
                placeholder="e.g. Bridal Crimson Kanchipuram"
                className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-2">
                Purchase or Last Aerated Date
              </label>
              <input
                type="date"
                value={purchaseDateInput}
                onChange={handleDateChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
              />
            </div>
          </div>

          {/* 4 Quarter Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {schedule.map((milestone) => (
              <div
                key={milestone.cycle}
                className="bg-white p-5 rounded-xl border border-[#B79B63]/20 shadow-sm flex flex-col justify-between hover:border-[#B79B63] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#B79B63] mb-2">
                    <span>Quarter 0{milestone.cycle}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B79B63]/10">
                      Day {milestone.daysAfterPurchase}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#1C1B19]/60 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B79B63]" />
                    <span>{milestone.scheduledDate}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#1C1B19] mb-2">
                    {milestone.actionTitle}
                  </h4>
                  <p className="text-xs text-[#1C1B19]/70 leading-relaxed">
                    {milestone.instructions}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#FAF7F2]">
                  <a
                    href={createGoogleCalendarUrl(milestone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2D6A4F] hover:text-[#1C1B19] transition-colors"
                  >
                    <span>Add to Google Cal</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Atelier Heirloom Restoration Services */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#B79B63]/20 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#B79B63] font-semibold block">
                Master Conservators &bull; Kukatpally Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1C1B19] mt-1">
                Atelier Restoration &amp; Re-Luster Services
              </h2>
            </div>
            <p className="text-xs text-[#1C1B19]/60 max-w-sm">
              From restoring 50-year-old mother’s bridal heirlooms to re-twisting delicate handloom
              pallu tassels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ATELIER_RESTORATION_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-6 rounded-2xl border border-[#B79B63]/20 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#B79B63]/30 text-[10px] font-bold text-[#B79B63]">
                      {srv.turnaroundTime}
                    </span>
                    <Clock className="w-4 h-4 text-[#B79B63]" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C1B19] leading-snug">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[#1C1B19]/70 mt-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#FAF7F2]">
                  <span className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-wider block mb-2">
                    Recommended For
                  </span>
                  <p className="text-[11px] text-[#1C1B19]/80 italic">
                    &ldquo;{srv.recommendedFor}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Restoration Inquiry Form */}
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#B79B63]/20 shadow-sm max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#B79B63] font-semibold block">
                Atelier Conservator Consultation
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#1C1B19] mt-1">
                Request an Heirloom Assessment
              </h3>
              <p className="text-xs text-[#1C1B19]/70 mt-1">
                Drop off at our Hyderabad flagship or ship via insured courier with white-glove
                tracking.
              </p>
            </div>

            <form onSubmit={handleRestorationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-1.5">
                  Service of Interest
                </label>
                <select
                  value={restorationService}
                  onChange={(e) => setRestorationService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
                >
                  {ATELIER_RESTORATION_SERVICES.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} ({srv.turnaroundTime})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B19]/80 uppercase tracking-wider mb-1.5">
                  Saree Provenance &amp; Current Condition
                </label>
                <textarea
                  rows={3}
                  value={sareeDescription}
                  onChange={(e) => setSareeDescription(e.target.value)}
                  placeholder="Describe your saree (e.g. 25-year-old Kanchipuram wedding saree with tarnish on silver zari pallu, requires de-creasing)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#B79B63]/30 bg-[#FAF7F2] text-sm focus:outline-none focus:ring-2 focus:ring-[#B79B63]"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1C1B19] text-white hover:bg-[#B79B63] transition-colors py-3 rounded-xl font-medium gap-2 text-sm shadow-md"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting
                    ? "Connecting Conservator..."
                    : "Send Assessment Request via WhatsApp"}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Section 4: Kukatpally Atelier Concierge Card */}
        <section className="bg-[#1C1B19] text-[#FAF7F2] rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#B79B63]/10 to-transparent pointer-events-none" />
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#B79B63] font-semibold block mb-2">
              Hyderabad Atelier Flagship
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white">
              Complimentary Heirloom Inspection at Our Atelier
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#FAF7F2]/70 leading-relaxed">
              Visit our Kukatpally flagship salon with your heirloom sarees. Our master weavers will
              conduct a complimentary microscope zari purity test and prescribe a custom archival
              preservation plan.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B79B63]" />
                <span>MIG-211, Road No 1, KPHB Colony, Kukatpally, Hyderabad</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#B79B63]" />
                <span>+91 62813 44628</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/appointments">
                <Button className="bg-[#B79B63] text-white hover:bg-white hover:text-[#1C1B19] font-medium text-xs px-6 py-2.5 rounded-xl">
                  Book In-Store Atelier Appointment
                </Button>
              </Link>
              <Link href="/video-shopping">
                <Button
                  variant="outline"
                  className="border-[#FAF7F2]/30 text-[#FAF7F2] hover:bg-white/10 text-xs px-6 py-2.5 rounded-xl"
                >
                  Schedule Virtual Inspection
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
