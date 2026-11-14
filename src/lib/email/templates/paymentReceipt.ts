import { PaymentReceiptPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderPaymentReceiptEmail(payload: PaymentReceiptPayload): string {
  const methodLabel =
    payload.paymentMethod === "upi"
      ? "UPI Instant Payment (PhonePe / GPay / Paytm)"
      : payload.paymentMethod === "card"
        ? "Debit / Credit Card (Encrypted via Razorpay)"
        : payload.paymentMethod === "netbanking"
          ? "NetBanking Verified"
          : "Cash on Delivery";

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; margin: 0 auto 12px auto; background-color: #EBF5F0; border: 1px solid #C4E3D4; border-radius: 50%; text-align: center; line-height: 44px;">
        <span style="font-size: 20px; color: #2D6A4F;">✓</span>
      </div>
      <span style="display: inline-block; padding: 4px 12px; background-color: #EBF5F0; border: 1px solid #C4E3D4; color: #2D6A4F; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Verified Payment Receipt
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        Payment Received for Order #${payload.orderId}
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Dear ${payload.customerName}, your payment has been cryptographically verified and credited to Sreesha Elegance Atelier.
      </p>
    </div>

    <!-- Payment Details Box -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 20px; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; line-height: 1.8;">
        <tr>
          <td style="color: #8C867D;">Amount Paid:</td>
          <td align="right" style="font-size: 17px; font-weight: 700; color: #1C1B19;">₹${payload.amount.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Transaction Reference:</td>
          <td align="right" style="font-family: monospace; font-size: 12px; color: #1C1B19;">${payload.paymentId}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Payment Mode:</td>
          <td align="right" style="color: #1C1B19; font-weight: 500;">${methodLabel}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Order ID:</td>
          <td align="right" style="font-weight: 600; color: #B79B63;">#${payload.orderId}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Status:</td>
          <td align="right" style="color: #2D6A4F; font-weight: 700; text-transform: uppercase; font-size: 11px;">Captured &amp; Settled</td>
        </tr>
      </table>
    </div>

    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #8C867D; text-align: center; margin: 0;">
      This electronic receipt serves as official proof of payment. GST invoice will accompany your luxury delivery package.
    </p>
  `;

  return renderLuxuryEmailLayout({
    title: `Payment Receipt for Order #${payload.orderId} — Sreesha Elegance`,
    preheader: `Payment of ₹${payload.amount.toLocaleString("en-IN")} for Order #${payload.orderId} successfully verified.`,
    content,
  });
}
