import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const isProduction = process.env.NODE_ENV === "production";
    const liveSecret = process.env.RAZORPAY_KEY_SECRET;
    const hasLiveSecret = Boolean(liveSecret && liveSecret !== "sreesha_mock_secret_key_2026");

    // In development or test environments without live secrets, allow simulated orders
    if (!isProduction && !hasLiveSecret && razorpay_order_id?.startsWith("order_rzp_")) {
      return NextResponse.json({
        verified: true,
        message: "Payment verified in atelier development simulation mode",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`,
      });
    }

    // Require all 3 verification parameters in production / live mode
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing required Razorpay payment signature parameters" },
        { status: 400 }
      );
    }

    if (isProduction && !hasLiveSecret) {
      console.error("Critical: RAZORPAY_KEY_SECRET is not configured in production environment.");
      return NextResponse.json(
        { verified: false, error: "Payment gateway server configuration error" },
        { status: 500 }
      );
    }

    const secret = liveSecret || "sreesha_mock_secret_key_2026";

    // Compute expected HMAC SHA-256 signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const genBuf = Buffer.from(generatedSignature, "utf-8");
    const sigBuf = Buffer.from(String(razorpay_signature), "utf-8");
    const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    if (!isMatch) {
      return NextResponse.json(
        {
          verified: false,
          error: "Cryptographic signature mismatch. Payment verification failed.",
        },
        { status: 400 }
      );
    }

    // If an order has already been recorded in database with this razorpay_order_id, update it to paid
    try {
      const supabase = createServerAdminClient();
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          razorpay_payment_id: razorpay_payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);
    } catch {
      // Database update failure should not fail verification response
    }

    return NextResponse.json({
      verified: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error: unknown) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { verified: false, error: "Payment verification error" },
      { status: 500 }
    );
  }
}
