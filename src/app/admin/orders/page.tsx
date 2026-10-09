"use client";

import * as React from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Truck,
  RotateCw,
  MessageSquare,
  Printer,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Order,
  OrderStatus,
  DbOrder,
  DbOrderItem,
  getStoredOrders,
  updateOrderStatus,
  updateOrderTracking,
} from "@/lib/orders";
import { formatINR } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

const ORDER_STATUSES = [
  "Order Placed & Verified",
  "Atelier Inspection & Silk Tagged",
  "Dispatched via BlueDart Express",
  "Out for Doorstep Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");

  // Selected order for detailed modal
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isEditingTracking, setIsEditingTracking] = React.useState(false);
  const [trackingInput, setTrackingInput] = React.useState("");
  const [carrierInput, setCarrierInput] = React.useState("BlueDart Express");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: dbOrders, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });

      if (!error && dbOrders && dbOrders.length > 0) {
        const mapped: Order[] = (dbOrders as unknown as DbOrder[]).map((o) => ({
          id: o.id,
          date: o.date,
          createdAt: o.created_at,
          status: o.status,
          carrier: o.carrier,
          trackingNumber: o.tracking_number,
          estimatedDelivery: o.estimated_delivery,
          subtotal: Number(o.subtotal),
          shippingFee: Number(o.shipping_fee),
          discount: Number(o.discount),
          total: Number(o.total),
          paymentMethod: o.payment_method,
          customer: o.customer,
          items: ((o.order_items || []) as DbOrderItem[]).map((it) => ({
            id: it.id,
            title: it.title,
            category: it.category || "Ethnic Wear",
            primaryImage: it.primary_image || "",
            price: Number(it.price),
            size: it.size,
            blouseOption: it.blouse_option,
            quantity: it.quantity,
          })),
        }));
        setOrders(mapped);
      } else {
        setOrders(getStoredOrders());
      }
    } catch {
      setOrders(getStoredOrders());
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadOrders();

    try {
      const supabase = createClient();
      const channel = supabase
        .channel("realtime-admin-orders")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          () => {
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // offline fallback
    }
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const status = newStatus as OrderStatus;
    await updateOrderStatus(orderId, status);

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
    showToast.success(`Order #${orderId} status set to "${newStatus}"`);
  };

  const handleSaveTracking = async (orderId: string) => {
    const tracking = trackingInput.trim();
    const carrier = carrierInput.trim() || "BlueDart Express";

    await updateOrderTracking(orderId, tracking, carrier);

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, trackingNumber: tracking, carrier } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, trackingNumber: tracking, carrier } : null));
    }
    setIsEditingTracking(false);
    showToast.success(`Tracking updated: ${carrier} AWB #${tracking}`);
  };

  const handleOpenWhatsApp = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const text = encodeURIComponent(
      `Namaste ${order.customer.fullName}! 🙏\n\nGreetings from Sreesha Elegance Atelier, Hyderabad.\n\nYour order #${order.id} is currently: *${order.status}*.\nTotal: ${formatINR(order.total)}\n${
        order.trackingNumber
          ? `Dispatch AWB: ${order.trackingNumber} (${order.carrier || "BlueDart"})\n`
          : ""
      }\nTrack your bespoke order online at: https://sreeshaelegance.com/track-order?orderId=${order.id}\n\nWarm regards,\nSreesha Elegance Concierge Team`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.phone.includes(search) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Fulfillment Queue
          </span>
          <h1 className="text-2xl font-serif text-[#1C1B19]">
            Order Tracking &amp; Status Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage dispatch, update BlueDart tracking, and send WhatsApp patron notifications.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E8E2D8] text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xs self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <RotateCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-[#E8E2D8] rounded-xs shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, client name, mobile..."
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
            <option value="ALL">All Statuses ({orders.length})</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-400">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">
            No matching orders found in the atelier queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="p-3.5 pl-5">Order Reference</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Delivery Destination</th>
                  <th className="p-3.5">Items Summary</th>
                  <th className="p-3.5">Total Paid</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]/60">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="p-3.5 pl-5">
                      <p className="font-mono font-bold text-[#1C1B19]">#{order.id}</p>
                      <p className="text-[11px] text-stone-400">{order.date}</p>
                      {order.trackingNumber && (
                        <span className="inline-block text-[10px] text-[#B79B63] font-mono mt-0.5 bg-[#FAF7F2] px-1.5 py-0.5 border border-[#E8E2D8] rounded-2xs">
                          {order.carrier || "BlueDart"}: {order.trackingNumber}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <p className="font-semibold text-[#1C1B19]">{order.customer.fullName}</p>
                      <p className="text-[11px] text-stone-600 font-mono">{order.customer.phone}</p>
                      {order.customer.email && (
                        <p className="text-[11px] text-stone-400 truncate max-w-[140px]">
                          {order.customer.email}
                        </p>
                      )}
                    </td>

                    <td className="p-3.5 max-w-[200px]">
                      <p className="truncate text-stone-700">{order.customer.address}</p>
                      <p className="text-[11px] text-stone-500">
                        {order.customer.city}, {order.customer.state} - {order.customer.pinCode}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <span className="font-medium text-[#1C1B19]">
                        {order.items.length} item(s)
                      </span>
                      <p className="text-[11px] text-stone-500 truncate max-w-[150px]">
                        {order.items.map((i) => i.title).join(", ")}
                      </p>
                    </td>

                    <td className="p-3.5 font-semibold text-[#1C1B19]">
                      {formatINR(order.total)}
                      <p className="text-[10px] text-stone-400 uppercase font-normal">
                        {order.paymentMethod}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="text-xs border border-stone-200 rounded-xs py-1.5 px-2 bg-stone-50 focus:outline-none focus:border-[#B79B63] font-medium max-w-[180px]"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingInput(order.trackingNumber || "");
                            setCarrierInput(order.carrier || "BlueDart Express");
                          }}
                          className="p-1.5 text-stone-600 hover:text-[#B79B63] border border-stone-200 hover:border-[#B79B63] rounded-xs bg-white transition-colors"
                          title="View Full Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(order)}
                          className="p-1.5 text-[#2D6A4F] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F]/30 rounded-xs bg-white transition-colors"
                          title="Notify Client on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl border border-[#E8E2D8] shadow-2xl rounded-xs max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#B79B63] font-bold">
                  Order Invoice &amp; Dispatch Inspector
                </span>
                <h3 className="font-serif text-xl text-[#1C1B19]">Order #{selectedOrder.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs">
              {/* Quick Status Bar */}
              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                    Current Fulfillment Status
                  </span>
                  <span className="font-semibold text-sm text-[#1C1B19] mt-0.5 block">
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenWhatsApp(selectedOrder)}
                    className="text-xs border-[#2D6A4F]/40 text-[#2D6A4F] hover:bg-[#2D6A4F]/10 gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send WhatsApp Update</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                    className="text-xs gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </Button>
                </div>
              </div>

              {/* Client & Shipping Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-[#E8E2D8] p-4 rounded-xs space-y-2">
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-stone-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B79B63]" />
                    <span>Client Details</span>
                  </h4>
                  <p className="font-semibold text-sm text-[#1C1B19]">
                    {selectedOrder.customer.fullName}
                  </p>
                  <p className="text-stone-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <a
                      href={`tel:${selectedOrder.customer.phone}`}
                      className="hover:underline text-[#B79B63] font-mono"
                    >
                      {selectedOrder.customer.phone}
                    </a>
                  </p>
                  {selectedOrder.customer.email && (
                    <p className="text-stone-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{selectedOrder.customer.email}</span>
                    </p>
                  )}
                </div>

                <div className="border border-[#E8E2D8] p-4 rounded-xs space-y-2">
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-stone-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B79B63]" />
                    <span>Delivery Destination</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">{selectedOrder.customer.address}</p>
                  <p className="text-stone-600 font-medium">
                    {selectedOrder.customer.city}, {selectedOrder.customer.state} -{" "}
                    <span className="font-mono">{selectedOrder.customer.pinCode}</span>
                  </p>
                </div>
              </div>

              {/* BlueDart Tracking Editor */}
              <div className="border border-[#E8E2D8] p-4 rounded-xs space-y-3 bg-[#FAF7F2]/40">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold uppercase tracking-wider text-[11px] text-stone-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#B79B63]" />
                    <span>Dispatch &amp; Airway Bill (AWB)</span>
                  </h4>
                  {!isEditingTracking && (
                    <button
                      type="button"
                      onClick={() => setIsEditingTracking(true)}
                      className="text-[#B79B63] hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      {selectedOrder.trackingNumber ? "Edit AWB" : "+ Assign Tracking"}
                    </button>
                  )}
                </div>

                {isEditingTracking ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="text"
                      value={carrierInput}
                      onChange={(e) => setCarrierInput(e.target.value)}
                      placeholder="Courier (e.g. BlueDart)"
                      className="w-full sm:w-1/3 px-2.5 py-1.5 border border-stone-200 text-xs rounded-xs"
                    />
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder="AWB Number (e.g. BD789456123IN)"
                      className="w-full sm:w-2/3 px-2.5 py-1.5 border border-stone-200 text-xs font-mono rounded-xs"
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleSaveTracking(selectedOrder.id)}
                      className="text-xs bg-[#B79B63] text-[#1C1B19] shrink-0"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingTracking(false)}
                      className="text-xs shrink-0"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-400">Carrier: </span>
                      <span className="font-medium text-stone-700">
                        {selectedOrder.carrier || "BlueDart Express"}
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400">AWB Tracking: </span>
                      <span className="font-mono font-bold text-[#1C1B19]">
                        {selectedOrder.trackingNumber || "Not yet assigned"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div className="space-y-3">
                <h4 className="font-semibold uppercase tracking-wider text-[11px] text-stone-500">
                  Ensembles in this Order ({selectedOrder.items.length})
                </h4>
                <div className="border border-[#E8E2D8] divide-y divide-[#E8E2D8] rounded-xs overflow-hidden">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {it.primaryImage && (
                          <div className="relative w-12 h-14 bg-stone-100 border border-stone-200 rounded-xs overflow-hidden shrink-0">
                            <Image
                              src={it.primaryImage}
                              alt={it.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-[#1C1B19]">{it.title}</p>
                          <p className="text-[11px] text-stone-500">
                            Size: {it.size || "Free Size"} • Qty: {it.quantity || 1}
                          </p>
                          {it.blouseOption && (
                            <p className="text-[10px] text-[#B79B63] italic">
                              Blouse: {it.blouseOption}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-semibold text-[#1C1B19]">
                        {formatINR(it.price * (it.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded-xs space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>{formatINR(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Atelier Promo Discount:</span>
                    <span>-{formatINR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Express Shipping:</span>
                  <span>
                    {selectedOrder.shippingFee === 0
                      ? "Complimentary"
                      : formatINR(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[#1C1B19] pt-2 border-t border-[#E8E2D8]">
                  <span>Total Amount:</span>
                  <span>{formatINR(selectedOrder.total)}</span>
                </div>
                <p className="text-[10px] text-stone-400 text-right uppercase">
                  Payment Method: {selectedOrder.paymentMethod}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E2D8] bg-stone-50 flex items-center justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
                className="text-xs"
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
