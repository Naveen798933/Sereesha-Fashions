import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { razorpay } from "@/lib/razorpay";
import { createServerAdminClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";
import { sendCancellationNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    // 1. Verify administrative privileges
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!adminToken || !verifySessionToken(adminToken)) {
      return NextResponse.json(
        { error: "Unauthorized: Administrative privileges required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, reason = "Atelier administrative cancellation" } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const supabase = createServerAdminClient();

    // 2. Lookup target order
    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Handle Cash On Delivery
    if (order.payment_method === "cod") {
      await supabase
        .from("orders")
        .update({
          status: "Cancelled",
          refund_status: "none",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      // Dispatch cancellation notification
      if (order.customer?.email && order.customer.email.includes("@")) {
        await sendCancellationNotificationEmail({
          orderId: order.id,
          customerName: order.customer.fullName || "Valued Patron",
          customerEmail: order.customer.email,
          refundAmount: 0,
          reason,
        });
      }

      return NextResponse.json({
        success: true,
        message: "COD order cancelled. No financial gateway refund needed.",
      });
    }

    // 4. Handle Online Payment Gateway Refund
    const paymentId = order.razorpay_payment_id;
    let refundId = "";

    const hasLiveSecret = Boolean(
      process.env.RAZORPAY_KEY_SECRET &&
      process.env.RAZORPAY_KEY_SECRET !== "sreesha_mock_secret_key_2026"
    );

    if (paymentId && hasLiveSecret) {
      try {
        const refund = await razorpay.payments.refund(paymentId, {
          amount: Math.round(Number(order.total) * 100),
          notes: {
            orderId: order.id,
            reason,
          },
        });
        refundId = refund.id;
      } catch (refundError: unknown) {
        console.error("Razorpay refund error:", refundError);
        return NextResponse.json(
          {
            error:
              refundError instanceof Error ? refundError.message : "Payment gateway refund failed",
          },
          { status: 502 }
        );
      }
    } else {
      // In development or simulation mode
      refundId = `rfnd_sim_${Date.now()}`;
    }

    // 5. Update order record in database
    await supabase
      .from("orders")
      .update({
        status: "Cancelled",
        payment_status: "refunded",
        refund_status: "refunded",
        refund_id: refundId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // 6. Dispatch verified cancellation & refund notification email
    if (order.customer?.email && order.customer.email.includes("@")) {
      await sendCancellationNotificationEmail({
        orderId: order.id,
        customerName: order.customer.fullName || "Valued Patron",
        customerEmail: order.customer.email,
        refundAmount: order.total,
        reason,
      });
    }

    return NextResponse.json({
      success: true,
      refundId,
      message: `Refund of ₹${order.total} processed successfully`,
    });
  } catch (error: unknown) {
    console.error("Order refund endpoint error:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation and refund" },
      { status: 500 }
    );
  }
}
