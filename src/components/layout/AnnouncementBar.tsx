"use client";

import * as React from "react";
import { Sparkles, PhoneCall, Truck, Gift } from "lucide-react";

const ANNOUNCEMENTS = [
  {
    icon: <Truck className="h-3 w-3 shrink-0" />,
    text: "Complimentary Express Shipping Across India on Orders Above ₹2,999",
  },
  {
    icon: <Gift className="h-3 w-3 shrink-0" />,
    text: "Festive Season Special: Flat 15% Off on Bridal Lehengas — Code BRIDE15",
  },
  {
    icon: <Sparkles className="h-3 w-3 shrink-0" />,
    text: "New Kanchipuram & Banarasi Silk Arrivals — Shop the Royal Nizam Edit Now",
  },
  {
    icon: <PhoneCall className="h-3 w-3 shrink-0" />,
    text: "Book a Free Virtual Styling Consultation — WhatsApp Us at +91 98765 43210",
  },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
        setIsVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#1C1B19] text-[#FAF7F2] text-[11px] py-2.5 px-4 border-b border-[#2E2C28] tracking-[0.12em] uppercase overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Boutique tag */}
        <div className="hidden sm:flex items-center gap-2 text-[#B79B63] shrink-0">
          <Sparkles className="h-3 w-3" />
          <span className="text-[#D8C7A5] font-normal text-[10px] tracking-[0.2em]">
            Hyderabad Boutique
          </span>
        </div>

        {/* Center: Rotating announcement */}
        <div
          className="flex-1 flex items-center justify-center gap-2 font-medium transition-all duration-400"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(-6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <span className="text-[#B79B63]">{current.icon}</span>
          <span>{current.text}</span>
        </div>

        {/* Right: Phone */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <PhoneCall className="h-3 w-3 text-[#B79B63]" />
          <a href="tel:+919876543210" className="text-[#D8C7A5] hover:text-white transition-colors">
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-1.5 md:hidden">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className="h-1 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: i === currentIndex ? "16px" : "4px",
              backgroundColor: i === currentIndex ? "#B79B63" : "#4A4840",
            }}
            aria-label={`Announcement ${i + 1}`}
          />
        ))}
      </div>
    </aside>
  );
};
