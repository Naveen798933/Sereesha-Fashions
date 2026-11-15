import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  sendOrderConfirmationEmail,
  sendPaymentReceiptEmail,
  sendShippingNotificationEmail,
  sendCancellationNotificationEmail,
  sendAdminOrderAlert,
  OrderEmailPayload,
} from "@/lib/email";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/serverAdminAuth";

interface ExtendedOrderEmailRequest extends OrderEmailPayload {
  action?: "order_confirmation" | "payment_receipt" | "shipping" | "cancellation";
  paymentId?: string;
  carrier?: string;
  deliveredDate?: string;
  reason?: string;
  refundAmount?: number;
  customerPhone?: string;
}

const emailRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = emailRateLimitMap.get(key);
  if (!record || now > record.resetAt) {
    emailRateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count += 1;
  return true;
}

function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "client-local";
}

export async function POST(req: Request) {
  try {
    const clientKey = getClientIdentifier(req);
    if (!checkRateLimit(`order_email:${clientKey}`, 20, 60000)) {
      return NextResponse.json(
        { success: false, error: "Too many email requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const payload = (await req.json()) as ExtendedOrderEmailRequest;

    if (!payload || !payload.orderId || !payload.customerEmail) {
      return NextResponse.json(
        { success: false, error: "Missing required order ID or customer email field" },
        { status: 400 }
      );
    }

    const action = payload.action || "order_confirmation";

    // Guard administrative actions (shipping and cancellation notices)
    if (action === "shipping" || action === "cancellation") {
      const cookieStore = await cookies();
      const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
      if (!adminToken || !verifySessionToken(adminToken)) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Administrative privileges required" },
          { status: 401 }
        );
      }
    }

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
