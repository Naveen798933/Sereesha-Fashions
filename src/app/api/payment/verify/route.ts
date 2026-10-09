import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (process.env.NODE_ENV === "production" && !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { verified: false, error: "Payment verification misconfigured on server" },
        { status: 500 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "sreesha_mock_secret_key_2026";

    // If using mock order prefix in test mode, approve directly
    if (razorpay_order_id?.startsWith("order_rzp_") && !process.env.RAZORPAY_KEY_SECRET) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { verified: false, error: "Mock test order verification is prohibited in production." },
          { status: 403 }
        );
      }
      return NextResponse.json({
        verified: true,
        message: "Payment successfully verified in development test mode",
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing required Razorpay payment signature parameters" },
        { status: 400 }
      );
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    const isMatch = generatedSignature === razorpay_signature;

    if (!isMatch) {
      return NextResponse.json(
        {
          verified: false,
          error: "Cryptographic signature mismatch. Payment verification failed.",
        },
        { status: 400 }
      );
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
