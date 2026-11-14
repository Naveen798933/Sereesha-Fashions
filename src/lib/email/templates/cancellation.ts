import { CancellationNotificationPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderCancellationEmail(payload: CancellationNotificationPayload): string {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; margin: 0 auto 12px auto; background-color: #FAF0F0; border: 1px solid #E8B4B4; border-radius: 50%; text-align: center; line-height: 44px;">
        <span style="font-size: 20px; color: #9A3434;">✕</span>
      </div>
      <span style="display: inline-block; padding: 4px 12px; background-color: #FAF0F0; border: 1px solid #E8B4B4; color: #9A3434; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Order Cancelled
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        Order #${payload.orderId} Has Been Cancelled
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Dear ${payload.customerName}, this email confirms that Order <strong>#${payload.orderId}</strong> has been cancelled as requested.
      </p>
    </div>

    <!-- Refund Details Box -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 20px; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.8;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        ${
          payload.refundAmount && payload.refundAmount > 0
            ? `
        <tr>
          <td style="color: #8C867D;">Refund Amount:</td>
          <td align="right" style="font-size: 16px; font-weight: 700; color: #1C1B19;">₹${payload.refundAmount.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td style="color: #8C867D;">Refund Turnaround:</td>
          <td align="right" style="color: #2D6A4F; font-weight: 600;">5 - 7 Business Days (Original Mode)</td>
        </tr>
        `
            : ""
        }
        ${
          payload.refundReference
            ? `
        <tr>
          <td style="color: #8C867D;">Banking Reference:</td>
          <td align="right" style="font-family: monospace; font-size: 12px; color: #1C1B19;">${payload.refundReference}</td>
        </tr>
        `
            : ""
        }
        ${
          payload.reason
            ? `
        <tr>
          <td style="color: #8C867D;">Cancellation Reason:</td>
          <td align="right" style="color: #5A5650;">${payload.reason}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.6; color: #5A5650; text-align: center; margin: 0;">
      If you did not request this cancellation or have queries regarding your refund, our Hyderabad atelier concierge is available 7 days a week at <a href="mailto:concierge@sreeshaelegance.com" style="color: #B79B63; text-decoration: none;">concierge@sreeshaelegance.com</a>.
    </p>
  `;

  return renderLuxuryEmailLayout({
    title: `Order #${payload.orderId} Cancelled — Sreesha Elegance`,
    preheader: `Confirmation of cancellation for Order #${payload.orderId}.`,
    content,
  });
}
