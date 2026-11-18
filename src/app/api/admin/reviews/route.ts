import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { createServerAdminClient } from "@/lib/supabase/server";
import { readLocalReviews, writeLocalReviews, ReviewRecord } from "@/lib/serverStores";

function checkAdminAuth(req: NextRequest): boolean {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  const token = req.cookies?.get?.(ADMIN_COOKIE_NAME)?.value || (match ? match[1] : undefined);
  return Boolean(token && verifySessionToken(token));
}

// GET: Returns all reviews (admin view)
export async function GET(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    let reviews = readLocalReviews();

    try {
      const supabase = createServerAdminClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        reviews = data.map((d) => ({
          id: d.id,
          productId: d.product_id,
          productTitle: d.product_title || "Handloom Silk Saree",
          author: d.author || "Patron",
          city: d.city || "Hyderabad",
          rating: Number(d.rating || 5),
          date: d.date || "Recent",
          title: d.title || "",
          comment: d.comment || "",
          fit: d.fit || "Bespoke Master Fit",
          verified: d.verified !== false,
          status: d.status || "approved",
          createdAt: d.created_at,
        }));
        writeLocalReviews(reviews);
      }
    } catch {
      // Return local cache on DB failure
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    if (statusFilter && statusFilter !== "all") {
      reviews = reviews.filter((r) => r.status === statusFilter);
    }

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch reviews";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// PATCH: Update review status
export async function PATCH(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Review ID and status are required." },
        { status: 400 }
      );
    }

    // 1. Update local JSON
    const current = readLocalReviews();
    const updated = current.map((r) =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    writeLocalReviews(updated);

    // 2. Update Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase.from("reviews").update({ status }).eq("id", id);
    } catch (dbErr) {
      console.warn("[Reviews API] Supabase update notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Review #${id} status updated to "${status}".`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update review status";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE: Delete review
export async function DELETE(req: NextRequest) {
  try {
    if (!checkAdminAuth(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Review ID is required for deletion." },
        { status: 400 }
      );
    }

    // 1. Update local JSON
    const current = readLocalReviews();
    const updated = current.filter((r) => r.id !== id);
    writeLocalReviews(updated);

    // 2. Delete from Supabase
    try {
      const supabase = createServerAdminClient();
      await supabase.from("reviews").delete().eq("id", id);
    } catch (dbErr) {
      console.warn("[Reviews API] Supabase delete notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Review #${id} removed successfully.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete review";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
