import { DeliveryNotificationPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderDeliveryNotificationEmail(payload: DeliveryNotificationPayload): string {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; margin: 0 auto 12px auto; background-color: #EBF5F0; border: 1px solid #C4E3D4; border-radius: 50%; text-align: center; line-height: 44px;">
        <span style="font-size: 20px; color: #2D6A4F;">🏡</span>
      </div>
      <span style="display: inline-block; padding: 4px 12px; background-color: #EBF5F0; border: 1px solid #C4E3D4; color: #2D6A4F; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Package Delivered
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        Delivered with Elegance
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Dear ${payload.customerName}, your Sreesha Elegance parcel for Order <strong>#${payload.orderId}</strong> was safely delivered to your doorstep on ${payload.deliveredDate}.
      </p>
    </div>

    <!-- Handloom Care Advice Card -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 22px; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #1C1B19; letter-spacing: 1px; text-transform: uppercase;">
        Heirloom Handloom Care Guidelines:
      </h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #5A5650; line-height: 1.7;">
        <li><strong>Dry Clean Only:</strong> Preserve the pure gold zari luster and natural mulberry silk fibers.</li>
        <li><strong>Muslin Storage:</strong> Wrap your pure silk saree in a soft white muslin cloth away from direct sunlight.</li>
        <li><strong>Refold Periodically:</strong> Change saree fold lines every 3 to 4 months to prevent crease friction.</li>
      </ul>
    </div>

    <div style="text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding-top: 8px;">
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #1C1B19; font-weight: 500;">
        How did you love your ensemble?
      </p>
      <a href="https://wa.me/916281344628?text=Hello%2C%20I%20would%20like%20to%20share%20my%20experience%20with%20Order%20${payload.orderId}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 24px; background-color: #1C1B19; color: #FAF7F2; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px;">
        Share Patron Review on WhatsApp →
      </a>
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `Order #${payload.orderId} Delivered — Sreesha Elegance`,
    preheader: `Your Sreesha Elegance parcel #${payload.orderId} has arrived safely.`,
    content,
  });
}
