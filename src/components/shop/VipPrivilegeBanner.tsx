"use client";

import * as React from "react";
import { Sparkles, Copy, Check, ShieldCheck, Phone, Crown } from "lucide-react";
import { showToast } from "@/components/ui/Toast";

export const VipPrivilegeBanner: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    showToast.success("Atelier Privilege code WELCOME10 copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1B19] via-[#2A2724] to-[#1C1B19] text-[#FAF7F2] border border-[#B79B63]/40 p-8 sm:p-12 shadow-2xl">
      {/* Decorative Gold Filigree Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#B79B63]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#B79B63]/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Left Column: Atelier Privé Message */}
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B79B63]/20 border border-[#B79B63]/50 text-[#D8C7A5]">
            <Crown className="h-3.5 w-3.5 text-[#B79B63]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
              The Sreesha Privé Circle
            </span>
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
            Enjoy 10% Welcome Privileges On Your First Handwoven Ensemble
          </h3>

          <p className="text-xs sm:text-sm text-[#C7BEAF] leading-relaxed">
            Apply privilege code at checkout to unlock complimentary bespoke blouse styling,
            fall-pico finishing, and guaranteed express courier dispatch across India.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-[11px] text-[#A69B8D] justify-center md:justify-start">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#B79B63]" /> Authentic Silk Mark
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#B79B63]" /> Hyderabad Master Tailoring
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Code Voucher Card */}
        <div className="bg-[#23211E]/90 border border-[#D8C7A5]/50 p-6 sm:p-7 w-full max-w-sm text-center space-y-4 shadow-xl">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79B63] font-semibold block">
            Welcome Privilege Code
          </span>

          <div className="flex items-center justify-between bg-[#141312] border border-[#B79B63]/60 px-4 py-3">
            <span className="font-mono text-lg font-bold tracking-widest text-[#E8D8B6]">
              WELCOME10
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-xs uppercase tracking-wider text-[#B79B63] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer pl-3 border-l border-[#333]"
              aria-label="Copy code WELCOME10"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#2D6A4F]" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-[#8C867D]">
            Valid on all Pure Handloom Sarees, Bridal Lehengas &amp; Festive Sets.
          </p>

          <div className="pt-2">
            <a
              href="https://wa.me/916281344628?text=Hello%20Sreesha%20Elegance%2C%20I%20would%20like%20to%20consult%20with%20your%20master%20stylist."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] text-white text-xs uppercase tracking-[0.16em] font-semibold hover:bg-[#1ebe5c] transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="h-3.5 w-3.5" /> Book Virtual Stylist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
