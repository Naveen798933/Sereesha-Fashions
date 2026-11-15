import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServerAdminClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail, sendPaymentReceiptEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "sreesha_mock_secret_key_2026";

    if (!signature) {
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    // 1. Verify HMAC-SHA256 signature on the RAW unparsed request body
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "utf-8");
    const expBuf = Buffer.from(expectedSignature, "utf-8");
    const isMatch = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);

    if (!isMatch) {
      console.warn("[Razorpay Webhook] Signature verification failed.");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;
    const eventId =
      event.id ||
      event.event_id ||
      `${eventType}_${event.payload?.payment?.entity?.id || Date.now()}`;

    const supabase = createServerAdminClient();

    // 2. Idempotency Guard: Prevent duplicate processing of retried webhook events
    try {
      const { data: existingEvent } = await supabase
        .from("payment_webhook_events")
        .select("id")
        .eq("event_id", eventId)
        .single();

      if (existingEvent) {
        return NextResponse.json({
          status: "already_processed",
          message: "Event has already been recorded and processed",
          eventId,
        });
      }
    } catch {
      // Table check fallback
    }

    // 3. Process Payment & Order Events
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const payment = event.payload?.payment?.entity || {};
      const rzpOrderId = payment.order_id;
      const rzpPaymentId = payment.id;
      const amountPaid = payment.amount ? Math.round(Number(payment.amount) / 100) : 0;

      if (rzpOrderId) {
        // Find existing order in Supabase
        const { data: order } = await supabase
          .from("orders")
          .select("*")
          .eq("razorpay_order_id", rzpOrderId)
          .single();

        if (order) {
          // Update order status and record payment ID
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              razorpay_payment_id: rzpPaymentId,
              status: "Order Placed & Verified",
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);

          // Dispatch confirmation & payment receipt emails if customer email exists
          if (order.customer?.email && order.customer.email.includes("@")) {
            try {
              // Fetch order items
              const { data: items } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", order.id);

              await sendOrderConfirmationEmail({
                orderId: order.id,
                customerName: order.customer.fullName || "Valued Patron",
                customerEmail: order.customer.email,
                paymentMethod: order.payment_method || "Online",
                total: order.total,
                items: (items || []).map((it) => ({
                  title: it.title,
                  size: it.size,
                  quantity: it.quantity,
                  price: it.price,
                  image: it.primary_image,
                })),
                shippingAddress: {
                  street: order.customer.address || "",
                  city: order.customer.city || "",
                  state: order.customer.state || "",
                  pinCode: order.customer.pinCode || "",
                },
                trackingNumber: order.tracking_number,
              });

              if (rzpPaymentId) {
                const normalizedMethod: "upi" | "card" | "netbanking" | "cod" =
                  order.payment_method === "upi" ||
                  order.payment_method === "card" ||
                  order.payment_method === "netbanking" ||
                  order.payment_method === "cod"
                    ? order.payment_method
                    : "card";

                await sendPaymentReceiptEmail({
                  orderId: order.id,
                  paymentId: rzpPaymentId,
                  customerName: order.customer.fullName || "Valued Patron",
                  customerEmail: order.customer.email,
                  amount: amountPaid || order.total,
                  paymentMethod: normalizedMethod,
                  paymentDate: new Date().toISOString(),
                });
              }
            } catch (emailErr) {
              console.warn("[Razorpay Webhook] Email dispatch notice:", emailErr);
            }
          }
        }
      }
    } else if (eventType === "payment.failed") {
      const payment = event.payload?.payment?.entity || {};
      const rzpOrderId = payment.order_id;
      if (rzpOrderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", rzpOrderId)
          .eq("payment_status", "pending");
      }
    }

    // 4. Record event in webhook audit log
    try {
      await supabase.from("payment_webhook_events").insert({
        event_id: eventId,
        event_type: eventType,
        payload: event,
        processed_at: new Date().toISOString(),
      });
    } catch {
      // Event log persistence fallback
    }

    return NextResponse.json({
      status: "success",
      received: true,
      event: eventType,
    });
  } catch (error: unknown) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
