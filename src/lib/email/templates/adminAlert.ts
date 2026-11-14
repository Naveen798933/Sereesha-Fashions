import { AdminOrderAlertPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderAdminOrderAlertEmail(payload: AdminOrderAlertPayload): string {
  const itemsList = payload.items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #E8E2D8; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <td style="padding: 10px 0; color: #1C1B19;">${item.title} (Size: ${item.size})</td>
      <td style="padding: 10px 8px; text-align: center; color: #5A5650;">${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right; color: #1C1B19; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `
    )
    .join("");

  const content = `
    <div style="margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #B79B63; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Atelier Dispatch Alert
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        New Order Placed: #${payload.orderId}
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #5A5650;">
        A new handloom commission has been registered on the boutique platform.
      </p>
    </div>

    <!-- Patron & Order Overview -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; padding: 18px 20px; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.8;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td style="color: #8C867D;">Client Patron:</td>
          <td align="right" style="font-weight: 600; color: #1C1B19;">${payload.customerName}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Contact Phone:</td>
          <td align="right" style="color: #1C1B19;"><a href="tel:${payload.customerPhone}" style="color: #B79B63; text-decoration: none;">${payload.customerPhone}</a></td>
        </tr>
        ${
          payload.customerEmail
            ? `
        <tr>
          <td style="color: #8C867D;">Client Email:</td>
          <td align="right" style="color: #1C1B19;">${payload.customerEmail}</td>
        </tr>`
            : ""
        }
        <tr>
          <td style="color: #8C867D;">Payment Mode:</td>
          <td align="right" style="font-weight: 600; text-transform: uppercase; color: #1C1B19;">${payload.paymentMethod}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Total Amount:</td>
          <td align="right" style="font-size: 16px; font-weight: 700; color: #2D6A4F;">₹${payload.total.toLocaleString("en-IN")}</td>
        </tr>
      </table>
    </div>

    <!-- Items Table -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 2px solid #E8E2D8; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: #8C867D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <th align="left" style="padding-bottom: 6px;">Piece</th>
          <th align="center" style="padding-bottom: 6px;">Qty</th>
          <th align="right" style="padding-bottom: 6px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>

    <!-- Destination Address -->
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #5A5650; margin-bottom: 24px; padding-top: 14px; border-top: 1px solid #E8E2D8;">
      <strong style="color: #1C1B19;">Shipping Address:</strong><br>
      ${payload.shippingAddress.street}, ${payload.shippingAddress.city}, ${payload.shippingAddress.state} - ${payload.shippingAddress.pinCode}
    </div>

    <!-- Admin Link -->
    <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <a href="https://sreeshaelegance.com/admin/orders" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 11px 26px; background-color: #1C1B19; color: #FAF7F2; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px;">
        Open Atelier Admin Dashboard →
      </a>
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `[NEW ORDER] #${payload.orderId} — ₹${payload.total.toLocaleString("en-IN")}`,
    preheader: `New order #${payload.orderId} placed by ${payload.customerName}.`,
    content,
  });
}
