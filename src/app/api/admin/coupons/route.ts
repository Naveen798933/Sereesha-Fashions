import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createServerAdminClient } from "@/lib/supabase/server";
import { readLocalCoupons, writeLocalCoupons, CouponRecord } from "@/lib/serverStores";

function checkAdminAuth(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);
  return Boolean(token && verifySessionToken(token));
}

// GET: Returns all coupons
export async function GET() {
  try {
    let coupons = readLocalCoupons();

    try {
      const supabase = createServerAdminClient();
      const { data, error } = await supabase.from("coupons").select("*");
      if (!error && data && data.length > 0) {
        coupons = data.map((d) => ({
          code: d.code,
          discount_type: d.discount_type,
          discount_value: Number(d.discount_value),
          min_order: Number(d.min_order || 0),
          active: d.active !== false,
          created_at: d.created_at,
          updated_at: d.updated_at,
        }));
        writeLocalCoupons(coupons);
      }
    } catch {
      // Return local cache on DB failure
    }

    return NextResponse.json({
      success: true,
      coupons,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch coupons";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST: Upsert coupon
export async function POST(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { code, discount_type, discount_value, min_order = 0, active = true } = body;

    if (!code || discount_value === undefined) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount value are required." },
        { status: 400 }
      );
    }

    const cleanCode = String(code)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "");
    const now = new Date().toISOString();

    const couponItem: CouponRecord = {
      code: cleanCode,
      discount_type: discount_type === "fixed" ? "fixed" : "percentage",
      discount_value: Number(discount_value),
      min_order: Number(min_order) || 0,
      active: Boolean(active),
      updated_at: now,
    };

    // 1. Update local JSON file
    const current = readLocalCoupons();
    const existingIndex = current.findIndex((c) => c.code === cleanCode);
    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...couponItem };
    } else {
      current.unshift({ ...couponItem, created_at: now });
    }
    writeLocalCoupons(current);

    // 2. Upsert to Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase.from("coupons").upsert(couponItem);
    } catch (dbErr) {
      console.warn("[Coupons API] Supabase upsert notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      coupon: couponItem,
      message: `Coupon "${cleanCode}" saved successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete coupon
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Coupon code is required for deletion." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Remove from local JSON
    const current = readLocalCoupons();
    const updated = current.filter((c) => c.code !== cleanCode);
    writeLocalCoupons(updated);

    // 2. Remove from Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase.from("coupons").delete().eq("code", cleanCode);
    } catch (dbErr) {
      console.warn("[Coupons API] Supabase delete notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Coupon "${cleanCode}" removed successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
