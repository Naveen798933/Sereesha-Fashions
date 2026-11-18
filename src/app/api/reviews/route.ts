import { NextRequest, NextResponse } from "next/server";
import { readLocalReviews, writeLocalReviews, ReviewRecord } from "@/lib/serverStores";
import { createServerAdminClient } from "@/lib/supabase/server";

// GET: Returns approved reviews for a specific product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let reviews = readLocalReviews().filter((r) => r.status === "approved");

    if (productId) {
      reviews = reviews.filter((r) => r.productId === productId);
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

// POST: Patron review submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productTitle = "Handloom Silk Saree",
      author,
      city = "Hyderabad",
      rating = 5,
      title = "",
      comment,
      fit = "Bespoke Master Fit",
    } = body;

    if (!productId || !author || !comment) {
      return NextResponse.json(
        { success: false, error: "Product, author name, and review comments are required." },
        { status: 400 }
      );
    }

    const todayStr = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const reviewId = `rev-${Date.now()}`;
    const newRecord: ReviewRecord = {
      id: reviewId,
      productId: String(productId).trim(),
      productTitle: String(productTitle).trim(),
      author: String(author).trim(),
      city: String(city).trim() || "Hyderabad",
      rating: Number(rating) || 5,
      date: todayStr,
      title: String(title).trim() || "Exquisite Handloom Craftsmanship",
      comment: String(comment).trim(),
      fit: String(fit).trim(),
      verified: true,
      status: "approved", // Pre-approved for instant satisfaction, manageable in admin
      createdAt: new Date().toISOString(),
    };

    // 1. Write to local JSON
    const current = readLocalReviews();
    current.unshift(newRecord);
    writeLocalReviews(current);

    // 2. Write to Supabase if available
    try {
      const supabase = createServerAdminClient();
      await supabase.from("reviews").insert({
        id: newRecord.id,
        product_id: newRecord.productId,
        product_title: newRecord.productTitle,
        author: newRecord.author,
        city: newRecord.city,
        rating: newRecord.rating,
        date: newRecord.date,
        title: newRecord.title,
        comment: newRecord.comment,
        fit: newRecord.fit,
        verified: newRecord.verified,
        status: newRecord.status,
        created_at: newRecord.createdAt,
      });
    } catch (dbErr) {
      console.warn("[Reviews API] Supabase insert notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      review: newRecord,
      message: "Thank you! Your verified review has been published.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to submit review";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
