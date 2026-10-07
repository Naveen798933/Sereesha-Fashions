"use client";

import * as React from "react";
import { Sparkles, PhoneCall } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      aria-label="Announcement"
      className="bg-[#1C1B19] text-[#FAF7F2] text-[11px] py-2 px-4 border-b border-[#2E2C28] tracking-[0.14em] uppercase transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-[#B79B63]">
          <Sparkles className="h-3 w-3" />
          <span className="text-[#FAF7F2] font-normal">
            Boutique Flagship: Banjara Hills, Hyderabad
          </span>
        </div>

        <div className="w-full sm:w-auto text-center font-medium">
          Complimentary Express Shipping Across India on Orders Above ₹2,999
        </div>

        <div className="hidden md:flex items-center gap-2">
          <PhoneCall className="h-3 w-3 text-[#B79B63]" />
          <a href="tel:+919876543210" className="text-[#D8C7A5] hover:text-white transition-colors">
            Boutique Concierge: +91 98765 43210
          </a>
        </div>
      </div>
    </aside>
  );
};
