"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getOrderById, getStoredOrders, Order } from "@/lib/orders";
import { formatINR } from "@/lib/utils";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");

  const [orderQuery, setOrderQuery] = React.useState(urlOrderId || "SE-84920");
  const [searchedId, setSearchedId] = React.useState(urlOrderId || "SE-84920");
  const [matchedOrder, setMatchedOrder] = React.useState<Order | null>(() => {
    return getOrderById(urlOrderId || "SE-84920") || null;
  });

  // Sync state whenever URL search param changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const idToUse = urlOrderId || "SE-84920";
      setOrderQuery(idToUse);
      setSearchedId(idToUse.toUpperCase());
      const found = getOrderById(idToUse);
      setMatchedOrder(found || null);
    }, 0);
    return () => clearTimeout(timer);
  }, [urlOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      const clean = orderQuery.trim().toUpperCase();
      setSearchedId(clean);
      const found = getOrderById(clean);
      setMatchedOrder(found || null);
    }
  };

  const storedOrders = React.useMemo(() => getStoredOrders(), []);

  // Compute realistic milestones based on matched order
  const steps = React.useMemo(() => {
    const isDelivered = matchedOrder?.status === "Delivered";
    const isDispatched = matchedOrder?.status?.includes("Dispatched") || isDelivered;
    const orderDate = matchedOrder?.date || "04 Oct, 02:30 PM";

    return [
      { title: "Order Placed & Verified", date: `${orderDate}`, done: true },
      { title: "Atelier Inspection & Silk Tagged", date: "Verified Silk Mark SMOI", done: true },
      { title: "Packed in Luxury Hardbox", date: "Kukatpally Atelier", done: true },
      {
        title: matchedOrder?.carrier
          ? `Dispatched via ${matchedOrder.carrier}`
          : "Dispatched via BlueDart Express",
        date: matchedOrder?.trackingNumber
          ? `AWB: ${matchedOrder.trackingNumber}`
          : "Airway Bill Generated",
        done: isDispatched,
        current: isDispatched && !isDelivered,
      },
      {
        title: isDelivered ? "Delivered to Doorstep" : "Out for Doorstep Delivery",
        date: matchedOrder?.estimatedDelivery || "Expected in 2-4 Days",
        done: isDelivered,
        current: isDelivered,
      },
    ];
  }, [matchedOrder]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 pb-28 sm:pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#B79B63] font-medium">
          Dispatch Timeline
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1C1B19]">Track Your Shipment</h1>
        <p className="text-xs text-[#5A5650] max-w-md mx-auto">
          Enter your order reference ID (e.g. {storedOrders[0]?.id || "SE-84920"}) to check live
          transit status and courier checkpoints.
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
            className="w-full py-2.5 text-xs text-[#1C1B19] outline-none uppercase font-mono"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Track
        </Button>
      </form>

      {/* Quick Test Order Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-[11px] text-[#8C867D]">Recent Orders:</span>
        {storedOrders.slice(0, 3).map((ord) => (
          <button
            key={ord.id}
            type="button"
            onClick={() => {
              setOrderQuery(ord.id);
              setSearchedId(ord.id);
              setMatchedOrder(ord);
            }}
            className="px-2.5 py-1 bg-white border border-[#E8E2D8] hover:border-[#B79B63] text-[11px] font-mono text-[#1C1B19] transition-colors cursor-pointer"
          >
            #{ord.id}
          </button>
        ))}
      </div>

      {/* Tracking Card */}
      <div className="bg-white border border-[#E8E2D8] p-6 sm:p-10 space-y-8 rounded-xs shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E8E2D8] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Order Reference
            </span>
            <p className="text-xl sm:text-2xl font-serif font-semibold text-[#1C1B19]">
              #{searchedId}
            </p>
            {matchedOrder && (
              <p className="text-xs text-[#5A5650] mt-0.5">
                Recipient: {matchedOrder.customer.fullName} • Placed {matchedOrder.date}
              </p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase tracking-wider text-[#8C867D]">
              Estimated Delivery
            </span>
            <p className="text-sm font-semibold text-[#2D6A4F]">
              {matchedOrder?.estimatedDelivery || "Thursday, 08 October 2026"}
            </p>
            {matchedOrder && (
              <p className="text-[11px] text-[#8C867D] mt-0.5">
                Destination: {matchedOrder.customer.city}, {matchedOrder.customer.state}
              </p>
            )}
          </div>
        </div>

        {/* Ordered Pieces Preview if Matched */}
        {matchedOrder && matchedOrder.items.length > 0 && (
          <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#1C1B19] block">
              Ensemble in Transit ({matchedOrder.items.length})
            </span>
            <div className="space-y-2">
              {matchedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div className="relative h-12 w-10 bg-[#EFE8DD] shrink-0 border border-[#E8E2D8] overflow-hidden">
                    <Image
                      src={it.primaryImage}
                      alt={it.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1B19] truncate">{it.title}</p>
                    <p className="text-[10px] text-[#8C867D]">
                      Option: {it.size} {it.blouseOption ? `• ${it.blouseOption}` : ""} • Qty:{" "}
                      {it.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-[#1C1B19]">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Visualizer */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#1C1B19]">
              Live Transit Milestones
            </p>
            <span className="text-[10px] text-[#B79B63] font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Origin: Kukatpally Atelier
            </span>
          </div>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8E2D8]">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border z-10 transition-colors ${
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
              <p className="font-semibold text-[#1C1B19]">
                {matchedOrder?.carrier || "BlueDart Air Cargo Priority"}
              </p>
              <p className="text-[11px] text-[#5A5650]">
                AWB Airway Bill:{" "}
                <span className="font-mono font-medium">
                  {matchedOrder?.trackingNumber || "BD893201948IN"}
                </span>
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] font-semibold border border-[#2D6A4F]/30">
            {matchedOrder?.status === "Delivered" ? "Delivered" : "On Schedule"}
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
