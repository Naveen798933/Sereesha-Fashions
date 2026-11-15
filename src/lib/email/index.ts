/**
 * Sreesha Elegance — Enterprise Resend Email Service Engine
 *
 * Core guarantees:
 * 1. Safe server-side execution only (API keys never exposed to browser)
 * 2. Idempotent deduplication guard (prevents duplicate sends on webhook retries)
 * 3. Graceful simulation fallback when keys absent in dev/staging
 * 4. Structured delivery logging & error tracing
 */

import { getResendClient, getEmailFrom, getAdminNotificationEmail } from "./client";
import { isEmailDuplicate, recordSentEmail } from "./idempotency";
import {
  EmailResult,
  OrderEmailPayload,
  PaymentReceiptPayload,
  ShippingNotificationPayload,
  DeliveryNotificationPayload,
  CancellationNotificationPayload,
  WelcomeEmailPayload,
  AdminOrderAlertPayload,
  AppointmentEmailPayload,
} from "./types";
import { renderOrderConfirmedEmail } from "./templates/orderConfirmed";
import { renderPaymentReceiptEmail } from "./templates/paymentReceipt";
import { renderShippingNotificationEmail } from "./templates/shipping";
import { renderDeliveryNotificationEmail } from "./templates/delivery";
import { renderCancellationEmail } from "./templates/cancellation";
import { renderWelcomeEmail } from "./templates/welcome";
import { renderAdminOrderAlertEmail } from "./templates/adminAlert";
import { renderAppointmentConfirmationEmail } from "./templates/appointment";

export * from "./types";
export * from "./client";

/**
 * Internal dispatch worker with idempotency checks and delivery logging
 */
async function dispatchEmail({
  to,
  subject,
  html,
  idempotencyKey,
  eventType,
}: {
  to: string;
  subject: string;
  html: string;
  idempotencyKey?: string;
  eventType: string;
}): Promise<EmailResult> {
  const cleanTo = (to || "").trim();
  if (!cleanTo || !cleanTo.includes("@")) {
    console.warn(
      `[Email Engine] Skipped dispatch: Invalid recipient "${cleanTo}" for ${eventType}`
    );
    return { success: false, error: "Invalid recipient email address" };
  }

  // Idempotency check: prevent duplicate sends
  if (idempotencyKey) {
    const existing = isEmailDuplicate(idempotencyKey);
    if (existing) {
      console.info(
        `[Email Engine] Duplicate suppressed for key "${idempotencyKey}" (Original ID: ${existing.id})`
      );
      return { success: true, id: existing.id, duplicate: true };
    }
  }

  const resend = getResendClient();
  const from = getEmailFrom();

  if (resend) {
    try {
      const response = await resend.emails.send({
        from,
        to: cleanTo,
        subject,
        html,
      });

      if (response.error) {
        console.error(
          `[Email Engine] Resend API error for ${eventType} to ${cleanTo}:`,
          response.error
        );
        return { success: false, error: response.error.message };
      }

      const emailId = response.data?.id || `resend_${Date.now()}`;
      if (idempotencyKey) {
        recordSentEmail(idempotencyKey, emailId);
      }

      console.info(
        `[Email Engine] Successfully dispatched ${eventType} to ${cleanTo} (ID: ${emailId})`
      );
      return { success: true, id: emailId };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error during Resend dispatch";
      console.error(`[Email Engine] Unexpected error during ${eventType}:`, err);
      return { success: false, error: msg };
    }
  }

  // Graceful simulation fallback for development or unconfigured API keys
  const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  if (idempotencyKey) {
    recordSentEmail(idempotencyKey, simulatedId);
  }

  console.info(
    `[Email Engine: Simulation Mode] ${eventType} -> To: ${cleanTo} | Subject: "${subject}" | ID: ${simulatedId}`
  );
  return { success: true, id: simulatedId, simulated: true };
}

/**
 * 1. Send Order Confirmation Email
 */
export async function sendOrderConfirmationEmail(payload: OrderEmailPayload): Promise<EmailResult> {
  const html = renderOrderConfirmedEmail(payload);
  const idempotencyKey = `order_confirmation:${payload.orderId}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `✨ Your Atelier Order #${payload.orderId} Confirmed — Sreesha Elegance`,
    html,
    idempotencyKey,
    eventType: "Order Confirmation",
  });
}

/**
 * 2. Send Verified Payment Receipt
 */
export async function sendPaymentReceiptEmail(
  payload: PaymentReceiptPayload
): Promise<EmailResult> {
  const html = renderPaymentReceiptEmail(payload);
  const idempotencyKey = `payment_receipt:${payload.orderId}:${payload.paymentId}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `✓ Verified Payment Receipt: Order #${payload.orderId} (₹${payload.amount.toLocaleString("en-IN")}) — Sreesha Elegance`,
    html,
    idempotencyKey,
    eventType: "Payment Receipt",
  });
}

/**
 * 3. Send Shipping / BlueDart Air Express Dispatch Notification
 */
export async function sendShippingNotificationEmail(
  payload: ShippingNotificationPayload
): Promise<EmailResult> {
  const html = renderShippingNotificationEmail(payload);
  const idempotencyKey = `shipping:${payload.orderId}:${payload.trackingNumber}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `✈ Dispatched: Your Order #${payload.orderId} via ${payload.carrier} (${payload.trackingNumber})`,
    html,
    idempotencyKey,
    eventType: "Shipping Notification",
  });
}

/**
 * 4. Send Doorstep Delivery Complete Notification
 */
export async function sendDeliveryNotificationEmail(
  payload: DeliveryNotificationPayload
): Promise<EmailResult> {
  const html = renderDeliveryNotificationEmail(payload);
  const idempotencyKey = `delivery:${payload.orderId}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `🏡 Delivered with Elegance: Order #${payload.orderId} has Arrived`,
    html,
    idempotencyKey,
    eventType: "Delivery Complete",
  });
}

/**
 * 5. Send Cancellation & Refund Notification
 */
export async function sendCancellationNotificationEmail(
  payload: CancellationNotificationPayload
): Promise<EmailResult> {
  const html = renderCancellationEmail(payload);
  const idempotencyKey = `cancellation:${payload.orderId}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `Notice: Order #${payload.orderId} Cancellation & Refund Details — Sreesha Elegance`,
    html,
    idempotencyKey,
    eventType: "Cancellation Notice",
  });
}

/**
 * 6. Send Patron Welcome Email
 */
export async function sendWelcomeEmail(payload: WelcomeEmailPayload): Promise<EmailResult> {
  const html = renderWelcomeEmail(payload);
  const idempotencyKey = `welcome:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `✦ Welcome to Sreesha Elegance — Your Atelier Privilege WELCOME10 Inside`,
    html,
    idempotencyKey,
    eventType: "Patron Welcome",
  });
}

/**
 * 7. Send High-Priority Atelier Admin New-Order Alert
 */
export async function sendAdminOrderAlert(payload: AdminOrderAlertPayload): Promise<EmailResult> {
  const adminEmail = getAdminNotificationEmail();
  const html = renderAdminOrderAlertEmail(payload);
  const idempotencyKey = `admin_alert:${payload.orderId}`;

  return dispatchEmail({
    to: adminEmail,
    subject: `🚨 [NEW ORDER ALERT] #${payload.orderId} — ₹${payload.total.toLocaleString("en-IN")} (${payload.customerName})`,
    html,
    idempotencyKey,
    eventType: "Admin Order Alert",
  });
}

/**
 * 8. Send VIP Atelier Appointment Confirmation
 */
export async function sendAppointmentConfirmationEmail(
  payload: AppointmentEmailPayload
): Promise<EmailResult> {
  const html = renderAppointmentConfirmationEmail(payload);
  const idempotencyKey = `appointment:${payload.appointmentId}:${payload.customerEmail}`;

  return dispatchEmail({
    to: payload.customerEmail,
    subject: `✨ Reserved: Your Private Atelier Session #${payload.appointmentId} (${payload.date}) — Sreesha Elegance`,
    html,
    idempotencyKey,
    eventType: "Appointment Confirmation",
  });
}

/**
 * 9. Send High-Priority Atelier Admin Appointment Alert
 */
export async function sendAdminAppointmentAlert(
  payload: AppointmentEmailPayload
): Promise<EmailResult> {
  const adminEmail = getAdminNotificationEmail();
  const idempotencyKey = `admin_appointment_alert:${payload.appointmentId}`;
  const html = `
    <div style="font-family: -apple-system, sans-serif; padding: 20px; color: #1C1B19;">
      <h2 style="color: #B79B63; margin-top: 0;">📅 New Atelier Appointment Booked</h2>
      <p><strong>Appointment ID:</strong> #${payload.appointmentId}</p>
      <p><strong>Patron:</strong> ${payload.customerName} (${payload.customerPhone}, ${payload.customerEmail})</p>
      <p><strong>Experience:</strong> ${payload.serviceLabel} (${payload.mode === "virtual_video" ? "Video Consultation" : "In-Store Visit"})</p>
      <p><strong>Date & Time:</strong> ${payload.date} at ${payload.timeSlot} IST</p>
      ${payload.occasionDate ? `<p><strong>Occasion Date:</strong> ${payload.occasionDate}</p>` : ""}
      ${payload.notes ? `<p><strong>Notes:</strong> ${payload.notes}</p>` : ""}
    </div>
  `;

  return dispatchEmail({
    to: adminEmail,
    subject: `📅 [NEW APPOINTMENT] #${payload.appointmentId} — ${payload.serviceLabel} (${payload.customerName})`,
    html,
    idempotencyKey,
    eventType: "Admin Appointment Alert",
  });
}
