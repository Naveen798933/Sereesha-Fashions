import { AppointmentEmailPayload } from "../types";
import { renderLuxuryEmailLayout } from "./layout";

export function renderAppointmentConfirmationEmail(payload: AppointmentEmailPayload): string {
  const isVirtual = payload.mode === "virtual_video";

  const googleCalUrl =
    payload.calendarLink ||
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `Sreesha Elegance: ${payload.serviceLabel}`
    )}&details=${encodeURIComponent(
      `Atelier Consultation #${payload.appointmentId}\nService: ${payload.serviceLabel}\nPatron: ${payload.customerName}\nContact: +91 62813 44628`
    )}&location=${encodeURIComponent(
      isVirtual
        ? "WhatsApp Video Call (+91 62813 44628)"
        : "Sreesha Elegance, Opp JNTU Rd, HMT Hills, Kukatpally, Hyderabad 500085"
    )}`;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; padding: 4px 12px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #B79B63; font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
        Appointment #${payload.appointmentId} Confirmed
      </span>
      <h2 style="margin: 14px 0 6px 0; font-size: 23px; font-weight: 400; color: #1C1B19;">
        Your Private Atelier Session is Reserved
      </h2>
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.6; color: #5A5650;">
        Namaste ${payload.customerName}, we have reserved an exclusive styling slot for you with our senior atelier consultants in Hyderabad.
      </p>
    </div>

    <!-- Appointment Card -->
    <div style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 22px 24px; margin-bottom: 24px;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; line-height: 1.7;">
        <tr>
          <td style="color: #8C867D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Service Experience</td>
          <td align="right" style="font-weight: 700; color: #1C1B19; padding-bottom: 4px;">${payload.serviceLabel}</td>
        </tr>
        <tr>
          <td style="color: #8C867D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Date &amp; Time</td>
          <td align="right" style="font-weight: 600; color: #1C1B19; padding-bottom: 4px;">${payload.date} • ${payload.timeSlot}</td>
        </tr>
        <tr>
          <td style="color: #8C867D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Consultation Mode</td>
          <td align="right" style="font-weight: 600; color: ${isVirtual ? "#2D6A4F" : "#B79B63"}; padding-bottom: 4px;">
            ${isVirtual ? "📹 Private 1-on-1 Video Session" : "🏛️ Flagship Boutique Visit"}
          </td>
        </tr>
        <tr>
          <td style="color: #8C867D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Location / Access</td>
          <td align="right" style="font-size: 12px; color: #5A5650; padding-bottom: 4px;">
            ${
              isVirtual
                ? "Direct WhatsApp Call from Stylist (+91 62813 44628)"
                : "Opp JNTU Rd, HMT Hills, Kukatpally, Hyderabad"
            }
          </td>
        </tr>
        ${
          payload.occasionDate
            ? `<tr>
                <td style="color: #8C867D; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 4px;">Occasion / Wedding Date</td>
                <td align="right" style="font-size: 12px; color: #1C1B19; font-weight: 600; padding-bottom: 4px;">${payload.occasionDate}</td>
              </tr>`
            : ""
        }
      </table>

      ${
        payload.notes
          ? `<div style="margin-top: 14px; pt-3; border-top: 1px dashed #E8E2D8; font-size: 12px; color: #5A5650; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <strong style="color: #1C1B19;">Patron Notes:</strong> "${payload.notes}"
            </div>`
          : ""
      }
    </div>

    <!-- Quick Action Buttons -->
    <div style="text-align: center; margin-bottom: 28px;">
      <a href="${googleCalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #1C1B19; color: #FAF7F2; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px; margin-right: 8px; margin-bottom: 8px;">
        📅 Add to Calendar
      </a>
      <a href="https://wa.me/916281344628?text=${encodeURIComponent(
        `Namaste Sreesha Elegance, regarding my appointment #${payload.appointmentId} on ${payload.date}`
      )}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #F7F3EB; border: 1px solid #D8C7A5; color: #1C1B19; text-decoration: none; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px; margin-bottom: 8px;">
        💬 Chat on WhatsApp
      </a>
    </div>

    <!-- Atelier Preparation Guidelines -->
    <div style="border-top: 1px solid #E8E2D8; padding-top: 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.6; color: #8C867D;">
      <strong style="color: #1C1B19; text-transform: uppercase; font-size: 10px; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">
        Preparation for Your Session:
      </strong>
      • For bridal trousseaus, feel free to bring fabric swatches or jewelry photos for color harmony.<br>
      • For bespoke blouse measurements, our masterji will take exact millimeter adjustments.<br>
      • Need to reschedule? Please reply to this email or message us at <strong>+91 62813 44628</strong> at least 4 hours in advance.
    </div>
  `;

  return renderLuxuryEmailLayout({
    title: `Private Atelier Reservation #${payload.appointmentId}`,
    preheader: `Your Sreesha Elegance styling session on ${payload.date} is confirmed.`,
    content,
  });
}
