"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Truck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "SE-84920";

  const [orderQuery, setOrderQuery] = React.useState(initialOrderId);
  const [searchedId, setSearchedId] = React.useState(initialOrderId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      setSearchedId(orderQuery.trim().toUpperCase());
    }
  };

  const steps = [
    { title: "Order Placed & Verified", date: "04 Oct, 02:30 PM", done: true },
    { title: "Atelier Inspection & Silk Tagged", date: "05 Oct, 11:00 AM", done: true },
    { title: "Packed in Luxury Hardbox", date: "05 Oct, 04:45 PM", done: true },
    {
      title: "Dispatched via BlueDart Express",
      date: "06 Oct, 09:15 AM",
      done: true,
      current: true,
    },
    { title: "Out for Delivery", date: "Expected 08 Oct", done: false },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Dispatch Timeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">Track Your Shipment</h1>
        <p className="text-xs text-[#5A5650] max-w-md mx-auto">
          Enter your order reference ID or registered contact number to check live transit status.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
        <div className="flex-1 flex items-center bg-white border border-[#E8E2D8] px-3 focus-within:border-[#B79B63]">
          <Search className="h-4 w-4 text-[#8C867D] mr-2" />
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="e.g. SE-84920"
            className="w-full py-2.5 text-xs text-[#1C1B19] outline-none uppercase"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Track
        </Button>
      </form>

      {/* Tracking Card */}
      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E8E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Order Reference
            </span>
            <p className="text-xl font-serif font-semibold text-[#1C1B19]">#{searchedId}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Estimated Delivery
            </span>
            <p className="text-sm font-semibold text-[#2D6A4F]">Thursday, 08 October 2026</p>
          </div>
        </div>

        {/* Timeline Visualizer */}
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
            Live Transit Milestones
          </p>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E2D8]">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border z-10 ${
                    st.current
                      ? "bg-[#B79B63] text-white border-[#B79B63] ring-4 ring-[#B79B63]/20"
                      : st.done
                        ? "bg-[#1C1B19] text-white border-[#1C1B19]"
                        : "bg-white text-[#8C867D] border-[#E8E2D8]"
                  }`}
                >
                  {st.done ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>

                <div className="flex-1 pt-1">
                  <p
                    className={`text-xs font-semibold ${st.done ? "text-[#1C1B19]" : "text-[#8C867D]"}`}
                  >
                    {st.title}
                  </p>
                  <p className="text-[11px] text-[#8C867D] mt-0.5">{st.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier Details */}
        <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[#B79B63]" />
            <div>
              <p className="font-semibold text-[#1C1B19]">BlueDart Air Cargo Priority</p>
              <p className="text-[11px] text-[#5A5650]">
                AWB Airway Bill: <span className="font-mono">BD893201948IN</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] font-semibold border border-[#2D6A4F]/30">
            On Schedule
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
