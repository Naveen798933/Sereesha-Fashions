"use client";

import * as React from "react";
import { Tag, Plus, Check, Trash2, Copy, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

interface CouponItem {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order: number;
  active: boolean;
}

const DEFAULT_COUPONS: CouponItem[] = [
  {
    code: "WELCOME10",
    discount_type: "percentage",
    discount_value: 10,
    min_order: 0,
    active: true,
  },
  {
    code: "ROYAL15",
    discount_type: "percentage",
    discount_value: 15,
    min_order: 15000,
    active: true,
  },
  {
    code: "BRIDE15",
    discount_type: "percentage",
    discount_value: 15,
    min_order: 25000,
    active: true,
  },
  {
    code: "FESTIVE2500",
    discount_type: "fixed",
    discount_value: 2500,
    min_order: 25000,
    active: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<CouponItem[]>(DEFAULT_COUPONS);
  const [loading, setLoading] = React.useState(true);
  const [newCode, setNewCode] = React.useState("");
  const [newType, setNewType] = React.useState<"percentage" | "fixed">("percentage");
  const [newValue, setNewValue] = React.useState("");
  const [newMinOrder, setNewMinOrder] = React.useState("");

  const loadCoupons = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("coupons").select("*");
      if (!error && data && data.length > 0) {
        setCoupons(data);
      }
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newValue) {
      showToast.error("Please supply coupon code and discount value");
      return;
    }

    const cleanCode = newCode
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "");
    const val = Number(newValue);
    const min = Number(newMinOrder) || 0;

    const newCoupon: CouponItem = {
      code: cleanCode,
      discount_type: newType,
      discount_value: val,
      min_order: min,
      active: true,
    };

    try {
      const supabase = createClient();
      const { error } = await supabase.from("coupons").insert([newCoupon]);
      if (error) throw error;
      setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== cleanCode)]);
      showToast.success(`Coupon ${cleanCode} saved to database`);
    } catch {
      setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== cleanCode)]);
      showToast.success(`Coupon ${cleanCode} active locally`);
    }

    setNewCode("");
    setNewValue("");
    setNewMinOrder("");
  };

  const toggleCouponStatus = async (code: string) => {
    const target = coupons.find((c) => c.code === code);
    if (!target) return;
    const nextState = !target.active;

    try {
      const supabase = createClient();
      await supabase.from("coupons").update({ active: nextState }).eq("code", code);
    } catch {}

    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: nextState } : c)));
    showToast.success(`Coupon ${code} ${nextState ? "activated" : "disabled"}`);
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!confirm(`Are you sure you want to remove coupon ${code}?`)) return;

    try {
      const supabase = createClient();
      await supabase.from("coupons").delete().eq("code", code);
    } catch {}

    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast.info(`Coupon ${code} removed`);
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      showToast.success(`Copied code "${code}" to clipboard`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#B79B63]">
          Incentive Engine
        </span>
        <h1 className="text-2xl font-serif text-[#1C1B19]">
          Promotional Coupons &amp; Atelier Privileges
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Create, toggle, and manage checkout discount codes with minimum order constraints.
        </p>
      </div>

      {/* Create Coupon Card */}
      <div className="bg-white p-6 border border-[#E8E2D8] rounded-xs shadow-xs">
        <h2 className="font-serif text-base text-[#1C1B19] mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#B79B63]" />
          <span>Create New Privilege Code</span>
        </h2>

        <form
          onSubmit={handleCreateCoupon}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"
        >
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Code *
            </label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. DIWALI20"
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xs uppercase font-mono focus:outline-none focus:border-[#B79B63] bg-[#FAF7F2]/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Discount Type *
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xs bg-white focus:outline-none focus:border-[#B79B63]"
            >
              <option value="percentage">Percentage (% OFF)</option>
              <option value="fixed">Fixed Rupees (₹ FLAT OFF)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Value *
            </label>
            <input
              type="number"
              required
              min={1}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder={newType === "percentage" ? "15" : "2000"}
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] font-mono bg-[#FAF7F2]/50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1">
              Min Cart (₹)
            </label>
            <input
              type="number"
              min={0}
              value={newMinOrder}
              onChange={(e) => setNewMinOrder(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full text-xs p-2.5 border border-stone-200 rounded-xs focus:outline-none focus:border-[#B79B63] font-mono bg-[#FAF7F2]/50"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-2.5 bg-[#1C1B19] hover:bg-[#B79B63] text-white text-xs uppercase tracking-wider font-semibold transition-all"
            >
              Add Coupon
            </Button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-[#E8E2D8] rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="p-3.5 pl-5">Coupon Code</th>
                <th className="p-3.5">Benefit</th>
                <th className="p-3.5">Min Order Requirement</th>
                <th className="p-3.5">State</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/60">
              {coupons.map((c) => (
                <tr key={c.code} className="hover:bg-stone-50/50 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1B19] tracking-wider bg-[#FAF7F2] px-2 py-1 border border-[#E8E2D8] rounded-2xs">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(c.code)}
                        className="p-1 text-stone-400 hover:text-[#B79B63] transition-colors"
                        title="Copy Code"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="p-3.5 font-semibold text-[#1C1B19]">
                    {c.discount_type === "percentage"
                      ? `${c.discount_value}% OFF`
                      : `${formatINR(c.discount_value)} FLAT OFF`}
                  </td>

                  <td className="p-3.5 text-stone-600">
                    {c.min_order > 0 ? (
                      <span>Orders above {formatINR(c.min_order)}</span>
                    ) : (
                      <span className="text-stone-400">No minimum limit</span>
                    )}
                  </td>

                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors cursor-pointer ${
                        c.active
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                          : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                      }`}
                    >
                      {c.active ? (
                        <>
                          <Check className="w-2.5 h-2.5" /> Active
                        </>
                      ) : (
                        <span>Disabled</span>
                      )}
                    </button>
                  </td>

                  <td className="p-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCouponStatus(c.code)}
                        className="text-[11px] uppercase tracking-wider font-semibold text-[#B79B63] hover:text-[#1C1B19] transition-colors cursor-pointer"
                      >
                        {c.active ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
