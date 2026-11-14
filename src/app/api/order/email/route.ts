import { NextResponse } from "next/server";
import {
  sendOrderConfirmationEmail,
  sendPaymentReceiptEmail,
  sendShippingNotificationEmail,
  sendCancellationNotificationEmail,
  sendAdminOrderAlert,
  OrderEmailPayload,
} from "@/lib/email";

interface ExtendedOrderEmailRequest extends OrderEmailPayload {
  action?: "order_confirmation" | "payment_receipt" | "shipping" | "cancellation";
  paymentId?: string;
  carrier?: string;
  deliveredDate?: string;
  reason?: string;
  refundAmount?: number;
  customerPhone?: string;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as ExtendedOrderEmailRequest;

    if (!payload || !payload.orderId || !payload.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required order ID or customer email field" },
        { status: 400 }
      );
    }

    const action = payload.action || "order_confirmation";

    if (action === "payment_receipt" && payload.paymentId) {
      const receiptRes = await sendPaymentReceiptEmail({
        orderId: payload.orderId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        paymentId: payload.paymentId,
        paymentMethod: (payload.paymentMethod as "upi" | "card" | "netbanking" | "cod") || "upi",
        amount: payload.total,
      });
      return NextResponse.json(receiptRes);
    }

    if (action === "shipping" && payload.trackingNumber) {
      const shippingRes = await sendShippingNotificationEmail({
        orderId: payload.orderId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        carrier: payload.carrier || "BlueDart Air Express",
        trackingNumber: payload.trackingNumber,
        items: payload.items,
        shippingAddress: payload.shippingAddress,
      });
      return NextResponse.json(shippingRes);
    }

    if (action === "cancellation") {
      const cancelRes = await sendCancellationNotificationEmail({
        orderId: payload.orderId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        reason: payload.reason,
        refundAmount: payload.refundAmount || payload.total,
      });
      return NextResponse.json(cancelRes);
    }

    // Default action: Send Order Confirmation
    const result = await sendOrderConfirmationEmail(payload);

    // Asynchronously alert atelier admin team (non-blocking)
    sendAdminOrderAlert({
      orderId: payload.orderId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone || "Not specified",
      customerEmail: payload.customerEmail,
      total: payload.total,
      paymentMethod: payload.paymentMethod || "online",
      items: payload.items,
      shippingAddress: payload.shippingAddress,
    }).catch((err) => console.warn("[Email API] Admin alert notification notice:", err));

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Order confirmation email dispatch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error sending email",
      },
      { status: 500 }
    );
  }
}
