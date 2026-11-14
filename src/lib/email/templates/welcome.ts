import { WelcomeEmailPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderWelcomeEmail(payload: WelcomeEmailPayload): string {
  const content = `
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="width: 44px; height: 44px; margin: 0 auto 12px auto; background-color: #F7F3EB; border: 1px solid #D8C7A5; border-radius: 50%; text-align: center; line-height: 44px;">
        <span style="font-size: 20px; color: #B79B63;">✦</span>
      </div>
      <span style="display: inline-block; padding: 4px 12px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #B79B63; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Patron Registry
      </span>
      <h2 style="margin: 12px 0 6px 0; font-size: 24px; font-weight: 400; color: #1C1B19;">
        Welcome to Sreesha Elegance, ${payload.customerName}
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        It is our honor to welcome you to our distinguished circle of handloom patrons. Rooted in the regal traditions of the Nizams, we celebrate the eternal poetry of authentic Indian silk.
      </p>
    </div>

    <!-- Welcome Privilege Voucher Card -->
    <div style="background-color: #1C1B19; color: #FAF7F2; border-radius: 2px; padding: 26px; margin-bottom: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2.5px; color: #B79B63; font-weight: 600;">
        Complimentary Atelier Welcome Privilege
      </p>
      <p style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; letter-spacing: 3px; font-family: monospace; color: #FAF7F2;">
        WELCOME10
      </p>
      <p style="margin: 0 0 18px 0; font-size: 12px; color: #D8C7A5;">
        Enjoy 10% savings on your inaugural pure silk handloom or bridal commission.
      </p>
      <a href="https://sreeshaelegance.com/women/sarees" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 11px 26px; background-color: #B79B63; color: #1C1B19; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px;">
        Explore Handloom Collection →
      </a>
    </div>

    <!-- Atelier Services -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 20px; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.6; color: #5A5650;">
      <strong style="color: #1C1B19; font-size: 13px; display: block; margin-bottom: 6px;">Your Patron Privileges:</strong>
      • <strong>Private Styling Concierge:</strong> Schedule 1-on-1 virtual consultations with Hyderabad stylists via WhatsApp video.<br>
      • <strong>Custom Blouse Tailoring:</strong> Bespoke neckline and embroidery customizations tailored to exact measurements.<br>
      • <strong>Silk Mark Guaranteed:</strong> Every pure zari warp and weft arrives with its verified purity certificate.
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `Welcome to Sreesha Elegance, ${payload.customerName}`,
    preheader: `Your inaugural atelier welcome privilege WELCOME10 is ready.`,
    content,
  });
}
