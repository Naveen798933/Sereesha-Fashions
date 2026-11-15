import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import {
  AbandonedCartRecord,
  getStoredAbandonedCarts,
  saveAbandonedCartLocal,
  updateCartRecoveryStatus,
} from "@/lib/abandonedCarts";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);

    if (!token || !verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    let carts: AbandonedCartRecord[] = getStoredAbandonedCarts();

    // Attempt to query Supabase abandoned_carts table if available
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("abandoned_carts")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        carts = data as unknown as AbandonedCartRecord[];
      }
    } catch {
      // Offline fallback to stored baseline
    }

    // Compute recovery metrics
    const nonDismissed = carts.filter((c) => c.recoveryStatus !== "dismissed");
    const activePipeline = nonDismissed.filter((c) => c.recoveryStatus !== "recovered");
    const recovered = carts.filter((c) => c.recoveryStatus === "recovered");

    const potentialRevenue = activePipeline.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const recoveredRevenue = recovered.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const highValueCount = activePipeline.filter((c) => (c.total || 0) >= 25000).length;
    const paymentFailedCount = activePipeline.filter(
      (c) => c.dropoffStep === "payment_failed"
    ).length;

    return NextResponse.json({
      success: true,
      carts,
      total: carts.length,
      metrics: {
        totalActiveCarts: activePipeline.length,
        potentialRevenue,
        recoveredCount: recovered.length,
        recoveredRevenue,
        highValueCount,
        paymentFailedCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load abandoned carts";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
    const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);

    if (!token || !verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cartId, status } = body;

    if (!cartId || !status) {
      return NextResponse.json(
        { success: false, error: "cartId and status are required" },
        { status: 400 }
      );
    }

    updateCartRecoveryStatus(cartId, status);

    try {
      const supabase = await createClient();
      await supabase
        .from("abandoned_carts")
        .update({ recovery_status: status, updated_at: new Date().toISOString() })
        .eq("id", cartId);
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      cartId,
      status,
      message: `Cart #${cartId} status updated to ${status}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update abandoned cart";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.phone || !body.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: "phone and items array are required" },
        { status: 400 }
      );
    }

    const saved = saveAbandonedCartLocal({
      customerName: body.customerName || "Patron",
      phone: body.phone,
      email: body.email,
      city: body.city,
      state: body.state,
      items: body.items,
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      total: Number(body.total) || 0,
      appliedCoupon: body.appliedCoupon,
      dropoffStep: body.dropoffStep || "contact_entered",
      recoveryStatus: "pending",
      lastError: body.lastError,
    });

    try {
      const supabase = await createClient();
      await supabase.from("abandoned_carts").upsert([
        {
          id: saved.id,
          customer_name: saved.customerName,
          phone: saved.phone,
          email: saved.email,
          city: saved.city,
          state: saved.state,
          items: saved.items,
          subtotal: saved.subtotal,
          discount: saved.discount,
          total: saved.total,
          applied_coupon: saved.appliedCoupon,
          dropoff_step: saved.dropoffStep,
          recovery_status: saved.recoveryStatus,
          last_error: saved.lastError,
          created_at: saved.createdAt,
          updated_at: saved.updatedAt,
        },
      ]);
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, cart: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record checkout progress";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
