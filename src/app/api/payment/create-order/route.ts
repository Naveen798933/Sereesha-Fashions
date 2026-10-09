import { NextResponse } from "next/server";
import { razorpay, getRazorpayKeyId } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid order amount specified" }, { status: 400 });
    }

    // Razorpay amount is in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch {
      if (
        process.env.NODE_ENV === "production" &&
        process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET
      ) {
        return NextResponse.json(
          { error: "Payment gateway error. Please try again." },
          { status: 502 }
        );
      }
      // In dev or demo mode without live Razorpay keys, gracefully provide mock order
      const orderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      order = {
        id: orderId,
        entity: "order",
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency,
        receipt: options.receipt,
        status: "created",
        created_at: Math.floor(Date.now() / 1000),
      };
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment gateway order" },
      { status: 500 }
    );
  }
}
