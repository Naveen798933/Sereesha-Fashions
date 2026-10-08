"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  ShieldCheck,
  Tag,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Order, getStoredOrders } from "@/lib/orders";
import { formatINR } from "@/lib/utils";
import { PRODUCTS } from "@/data/products";
import { Button } from "@/components/ui/Button";

export default function AdminOverviewPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [customerCount, setCustomerCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Load registered patrons count
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && typeof d.total === "number") {
          setCustomerCount(d.total);
        }
      })
      .catch(() => {});

    async function loadStats() {
      try {
        const supabase = createClient();
        const { data: dbOrders, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .order("created_at", { ascending: false });

        if (!error && dbOrders && dbOrders.length > 0) {
          const mapped: Order[] = dbOrders.map((o: any) => ({
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
            items: (o.order_items || []).map((it: any) => ({
              id: it.id,
              title: it.title,
              category: it.category,
              primaryImage: it.primary_image,
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
    }
    loadStats();

    try {
      const supabase = createClient();
      const channel = supabase
        .channel("realtime-admin-overview")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          () => {
            loadStats();
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

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const pendingOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
            Operational Intelligence
          </span>
          <h1 className="text-2xl md:text-3xl font-serif text-[#1C1B19] mt-0.5">
            Boutique &amp; Atelier Performance
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time management for Sreesha Elegance flagship store and online atelier.
          </p>
        </div>

        {/* Manager Quick Access Badge */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2 rounded-xs self-start sm:self-auto">
          <KeyRound className="w-4 h-4 text-[#B79B63]" />
          <div className="text-left text-xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-medium">
              Access PIN:
            </span>
            <span className="font-mono font-bold text-[#1C1B19]">8899</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1B19]">
            {formatINR(totalRevenue)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Total atelier order volume</p>
        </div>

        <div className="bg-white p-5 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#B79B63]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1B19]">{totalOrders}</div>
          <p className="text-[11px] text-stone-400 mt-1">
            <span className="text-amber-600 font-semibold">{pendingOrders} pending</span>{" "}
            fulfillment
          </p>
        </div>

        <div className="bg-white p-5 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Average Basket</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1B19]">
            {formatINR(avgOrderValue)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Per patron transaction size</p>
        </div>

        <div className="bg-white p-5 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Patron Registry</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1B19]">{customerCount}</div>
          <Link
            href="/admin/customers"
            className="text-[11px] text-[#B79B63] hover:underline mt-1 block font-medium"
          >
            Manage patrons →
          </Link>
        </div>

        <div className="bg-white p-5 border border-[#E8E2D8] rounded-xs shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium">Active Ensembles</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#1C1B19]">{PRODUCTS.length}</div>
          <Link
            href="/admin/products"
            className="text-[11px] text-[#B79B63] hover:underline mt-1 block font-medium"
          >
            Stock levels →
          </Link>
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/orders"
          className="p-4 bg-white border border-[#E8E2D8] hover:border-[#B79B63] rounded-xs shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-5 h-5 text-[#B79B63]" />
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#B79B63] transition-colors" />
          </div>
          <p className="font-semibold text-xs text-[#1C1B19] uppercase tracking-wider">
            Process Orders
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">{pendingOrders} awaiting dispatch</p>
        </Link>

        <Link
          href="/admin/products"
          className="p-4 bg-white border border-[#E8E2D8] hover:border-[#B79B63] rounded-xs shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-[#B79B63]" />
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#B79B63] transition-colors" />
          </div>
          <p className="font-semibold text-xs text-[#1C1B19] uppercase tracking-wider">
            Add Products
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Update catalog &amp; weaves</p>
        </Link>

        <Link
          href="/admin/customers"
          className="p-4 bg-white border border-[#E8E2D8] hover:border-[#B79B63] rounded-xs shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-[#B79B63]" />
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#B79B63] transition-colors" />
          </div>
          <p className="font-semibold text-xs text-[#1C1B19] uppercase tracking-wider">
            Patron Directory
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Direct WhatsApp concierge</p>
        </Link>

        <Link
          href="/admin/coupons"
          className="p-4 bg-white border border-[#E8E2D8] hover:border-[#B79B63] rounded-xs shadow-xs group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <Tag className="w-5 h-5 text-[#B79B63]" />
            <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-[#B79B63] transition-colors" />
          </div>
          <p className="font-semibold text-xs text-[#1C1B19] uppercase tracking-wider">
            Privilege Codes
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">Festive discount engine</p>
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E8E2D8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-[#1C1B19]">Recent Atelier Purchases</h2>
            <p className="text-xs text-stone-500">Live order queue synced with database</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold uppercase tracking-wider text-[#B79B63] hover:text-[#1C1B19] transition-colors flex items-center gap-1"
          >
            Manage All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading order records...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            No orders placed yet. Customer orders from the checkout will automatically appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
                <tr>
                  <th className="p-3.5 pl-5">Order ID</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5 pr-5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]/60">
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-3.5 pl-5 font-mono font-medium text-[#1C1B19]">#{order.id}</td>
                    <td className="p-3.5">
                      <p className="font-medium text-[#1C1B19]">{order.customer.fullName}</p>
                      <p className="text-[11px] text-stone-400">{order.customer.city}</p>
                    </td>
                    <td className="p-3.5 text-stone-500">{order.date}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-2.5 h-2.5" />
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-600">{order.items.length} piece(s)</td>
                    <td className="p-3.5 pr-5 text-right font-semibold text-[#1C1B19]">
                      {formatINR(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
