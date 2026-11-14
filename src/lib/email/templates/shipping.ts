import { ShippingNotificationPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderShippingNotificationEmail(payload: ShippingNotificationPayload): string {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="width: 44px; height: 44px; margin: 0 auto 12px auto; background-color: #F7F3EB; border: 1px solid #D8C7A5; border-radius: 50%; text-align: center; line-height: 44px;">
        <span style="font-size: 20px; color: #B79B63;">✈</span>
      </div>
      <span style="display: inline-block; padding: 4px 12px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #B79B63; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Order Dispatched
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 22px; font-weight: 400; color: #1C1B19;">
        Your Atelier Parcel is on its Way
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Dear ${payload.customerName}, your handcrafted handlooms for Order <strong>#${payload.orderId}</strong> have passed final Silk Mark inspection and have been handed over to ${payload.carrier}.
      </p>
    </div>

    <!-- Tracking Card -->
    <div style="background-color: #1C1B19; color: #FAF7F2; border-radius: 2px; padding: 24px; margin-bottom: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #B79B63;">
        ${payload.carrier} Tracking Number
      </p>
      <p style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; letter-spacing: 2px; font-family: monospace; color: #FAF7F2;">
        ${payload.trackingNumber}
      </p>
      <a href="https://www.bluedart.com" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 22px; background-color: #B79B63; color: #1C1B19; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px;">
        Track Consignment Live →
      </a>
    </div>

    <!-- Delivery Estimate & Address -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; padding: 18px 20px; margin-bottom: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.6; color: #5A5650;">
      <strong style="color: #1C1B19; font-size: 13px;">Dispatch Details:</strong><br>
      Estimated Arrival: <strong style="color: #2D6A4F;">${payload.estimatedDelivery || "Within 2 - 4 Business Days"}</strong><br>
      Destination: ${payload.shippingAddress.street}, ${payload.shippingAddress.city}, ${payload.shippingAddress.state} — ${payload.shippingAddress.pinCode}
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `Your Order #${payload.orderId} Has Been Dispatched — Sreesha Elegance`,
    preheader: `Consignment ${payload.trackingNumber} dispatched via ${payload.carrier}.`,
    content,
  });
}
