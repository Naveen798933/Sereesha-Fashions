"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  X,
  Sparkles,
  Video,
  Scissors,
  Truck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CONCIERGE_PROMPTS = [
  {
    icon: <Sparkles className="h-4 w-4 text-[#B79B63]" />,
    title: "Silk Mark & Saree Inquiries",
    desc: "Verify pure mulberry silk zari weight & drape",
    message:
      "Namaste Sreesha Elegance! 🙏 I would like to inquire about your pure handloom silk sarees and Silk Mark certification.",
  },
  {
    icon: <Scissors className="h-4 w-4 text-[#B79B63]" />,
    title: "Bespoke Blouse Tailoring",
    desc: "Custom necklines, sleeve work & padding",
    message:
      "Namaste! I would like masterji tailoring assistance for custom blouse stitching and measurements.",
  },
  {
    icon: <Video className="h-4 w-4 text-[#2D6A4F]" />,
    title: "Live Video Shopping Preview",
    desc: "Private 1-on-1 boutique viewing over WhatsApp",
    message:
      "Hello Sreesha Elegance! I would like to schedule a private WhatsApp video call to preview bridal ensembles live.",
  },
  {
    icon: <Truck className="h-4 w-4 text-[#B79B63]" />,
    title: "Express Delivery & Dispatch",
    desc: "Track shipment or inquire about urgent timelines",
    message: "Hello! I would like to check express delivery timelines to my location.",
  },
];

export const FloatingConcierge: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasUnreadAlert, setHasUnreadAlert] = React.useState(true);

  // Hide on admin routes or checkout to prevent distraction during payment
  const isHiddenRoute = pathname.startsWith("/admin") || pathname === "/checkout";

  if (isHiddenRoute) {
    return null;
  }

  const handleOpenWhatsApp = (customMessage?: string) => {
    const text = encodeURIComponent(
      customMessage ||
        "Namaste Sreesha Elegance! 🙏 I am browsing your online atelier and would like styling assistance."
    );
    window.open(`https://wa.me/916281344628?text=${text}`, "_blank");
    setIsOpen(false);
    setHasUnreadAlert(false);
  };

  return (
    <div
      className="fixed z-40 transition-all duration-300"
      style={{
        bottom: "calc(5.5rem + env(safe-area-inset-bottom))", // Sits above mobile bottom nav on mobile
      }}
    >
      <div className="fixed right-4 sm:right-6 bottom-20 lg:bottom-6 z-40">
        {/* Expanded Concierge Drawer / Card */}
        {isOpen && (
          <div
            className="mb-3 w-[calc(100vw-2rem)] max-w-sm bg-white border border-[#E8E2D8] rounded-xs shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
            role="dialog"
            aria-label="Atelier Styling Concierge"
          >
            {/* Header */}
            <div className="p-4 bg-[#1C1B19] text-[#FAF7F2] relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-[#B79B63] flex items-center justify-center text-[#1C1B19] font-serif font-bold text-sm">
                      SE
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1C1B19]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold tracking-wide text-white">
                      Atelier Concierge Desk
                    </h3>
                    <p className="text-[10px] text-[#D8C7A5] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live • Kukatpally Flagship, Hyderabad
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-stone-400 hover:text-white p-1 transition-colors cursor-pointer"
                  aria-label="Close concierge"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-stone-300 mt-2.5 leading-relaxed">
                Connect directly with our master stylists for fabric advice, blouse customization,
                or a live video walkthrough.
              </p>
            </div>

            {/* Quick Consultation Options */}
            <div className="p-3 bg-[#FAF7F2] divide-y divide-[#E8E2D8] max-h-72 overflow-y-auto">
              {CONCIERGE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOpenWhatsApp(prompt.message)}
                  className="w-full p-2.5 text-left flex items-center justify-between gap-3 hover:bg-white transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white border border-[#E8E2D8] flex items-center justify-center shrink-0 group-hover:border-[#B79B63] transition-colors">
                      {prompt.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#1C1B19] group-hover:text-[#B79B63] transition-colors">
                        {prompt.title}
                      </p>
                      <p className="text-[10px] text-stone-500 leading-tight">{prompt.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-[#B79B63] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            {/* Direct WhatsApp Call-to-Action */}
            <div className="p-3 bg-white border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => handleOpenWhatsApp()}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#1ebe5c] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp Now</span>
              </button>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
                <ShieldCheck className="h-3 w-3 text-[#2D6A4F]" />
                <span>Typical response: Under 5 minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        <div className="relative">
          {/* Subtle Attention Badge */}
          {!isOpen && hasUnreadAlert && (
            <div className="hidden sm:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-[#1C1B19] text-[#FAF7F2] text-[11px] font-medium py-1.5 px-3 whitespace-nowrap shadow-lg border border-[#B79B63]/40 items-center gap-2 rounded-xs animate-in fade-in slide-in-from-right-2 duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Styling Assistance Available</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasUnreadAlert(false);
                }}
                className="text-stone-400 hover:text-white ml-1 cursor-pointer"
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setHasUnreadAlert(false);
            }}
            className={cn(
              "h-12 w-12 sm:h-14 sm:w-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95 cursor-pointer relative",
              isOpen
                ? "bg-[#1C1B19] text-[#FAF7F2] border border-[#B79B63]"
                : "bg-[#25D366] hover:bg-[#1ebe5c] text-white ring-4 ring-[#25D366]/20"
            )}
            aria-label={isOpen ? "Close Concierge Menu" : "Open WhatsApp Styling Concierge"}
          >
            {isOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <>
                <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                {hasUnreadAlert && (
                  <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-[#B79B63] ring-2 ring-white" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
