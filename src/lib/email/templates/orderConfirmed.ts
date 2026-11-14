import { OrderEmailPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderOrderConfirmedEmail(payload: OrderEmailPayload): string {
  const itemsHtml = payload.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #F3ECE2;">
      <td style="padding: 14px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <strong style="color: #1C1B19; font-size: 13px;">${item.title}</strong><br>
        <span style="font-size: 11px; color: #8C867D;">Size: ${item.size}</span>
      </td>
      <td style="padding: 14px 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #5A5650;">
        ${item.quantity}
      </td>
      <td style="padding: 14px 0; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">
        ₹${(item.price * item.quantity).toLocaleString("en-IN")}
      </td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 12px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #B79B63; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Order #${payload.orderId} Confirmed
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        Thank You for Your Order, ${payload.customerName}
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Our Hyderabad master artisans have received your handloom commission. Each piece is being inspected under studio lighting and carefully folded into our gold-embossed packaging.
      </p>
    </div>

    <!-- Items Table -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid #E8E2D8; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #8C867D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <th align="left" style="padding-bottom: 8px;">Ensemble</th>
          <th align="center" style="padding-bottom: 8px;">Qty</th>
          <th align="right" style="padding-bottom: 8px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals Summary -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 18px 20px; margin-bottom: 24px;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px;">
        <tr>
          <td style="color: #5A5650; padding-bottom: 6px;">Total Amount:</td>
          <td align="right" style="font-size: 16px; font-weight: 700; color: #1C1B19;">₹${payload.total.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #5A5650; font-size: 11px;">Shipping:</td>
          <td align="right" style="font-size: 11px; font-weight: 600; color: #2D6A4F; text-transform: uppercase;">Complimentary BlueDart Express</td>
        </tr>
      </table>
    </div>

    <!-- Shipping Destination -->
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.6; color: #5A5650; border-top: 1px solid #E8E2D8; padding-top: 18px;">
      <strong style="color: #1C1B19; font-size: 13px; display: block; margin-bottom: 4px;">Delivery Destination:</strong>
      ${payload.shippingAddress.street}<br>
      ${payload.shippingAddress.city}, ${payload.shippingAddress.state} — ${payload.shippingAddress.pinCode}<br>
      ${payload.trackingNumber ? `<span style="color: #B79B63; font-weight: 600;">BlueDart Air AWB: ${payload.trackingNumber}</span>` : ""}
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `Order #${payload.orderId} Confirmed — Sreesha Elegance`,
    preheader: `We are preparing your handcrafted handloom order #${payload.orderId} for dispatch.`,
    content,
  });
}
