/**
 * Sreesha Elegance — Luxury Email Layout Master Template
 * Colors: Ivory (#FAF7F2), Charcoal (#1C1B19), Champagne Gold (#B79B63), Emerald (#2D6A4F)
 */

interface BaseEmailLayoutOptions {
  title: string;
  preheader?: string;
  content: string;
}

export function renderLuxuryEmailLayout({
  title,
  preheader,
  content,
}: BaseEmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!--[if mso]>
    <style type="text/css">
      body, table, td { font-family: Georgia, 'Times New Roman', serif !important; }
    </style>
    <![endif]-->
  </head>
  <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: 'Playfair Display', Georgia, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, serif; color: #1C1B19; -webkit-font-smoothing: antialiased;">
    ${
      preheader
        ? `<div style="display: none; max-height: 0px; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; color: #FAF7F2;">${preheader}</div>`
        : ""
    }
    
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; padding: 40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E8E2D8; border-radius: 2px; overflow: hidden; box-shadow: 0 4px 20px rgba(28, 27, 25, 0.04);">
            
            <!-- Atelier Header -->
            <tr>
              <td style="background-color: #1C1B19; padding: 36px 30px 30px 30px; text-align: center; border-bottom: 2px solid #B79B63;">
                <div style="font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #B79B63; margin-bottom: 8px; font-weight: 600;">
                  ✦ HYDERABAD ATELIER & COUTURE ✦
                </div>
                <h1 style="margin: 0; font-size: 26px; letter-spacing: 4px; text-transform: uppercase; color: #FAF7F2; font-weight: 400; line-height: 1.2;">
                  SREESHA ELEGANCE
                </h1>
                <p style="margin: 6px 0 0 0; font-size: 12px; font-style: italic; color: #D8C7A5; letter-spacing: 1px;">
                  Wear Your Elegance
                </p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 36px 32px 28px 32px;">
                ${content}
              </td>
            </tr>

            <!-- Silk Mark & Craftsmanship Guarantee -->
            <tr>
              <td style="padding: 0 32px 28px 32px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAF7F2; border: 1px solid #E8E2D8; border-radius: 2px; padding: 16px 20px;">
                  <tr>
                    <td width="36" valign="middle" style="padding-right: 14px;">
                      <span style="font-size: 24px; color: #B79B63;">👑</span>
                    </td>
                    <td valign="middle" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; color: #5A5650; line-height: 1.5;">
                      <strong style="color: #1C1B19;">Certified Pure Mulberry Silk & Silk Mark Guaranteed</strong><br>
                      Every saree and lehenga is certified pure handloom woven by master artisans in Telangana & Tamil Nadu.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Atelier Footer -->
            <tr>
              <td style="background-color: #FAF7F2; border-top: 1px solid #E8E2D8; padding: 28px 30px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; color: #1C1B19; letter-spacing: 1px; text-transform: uppercase;">
                  Sreesha Elegance Atelier Flagship
                </p>
                <p style="margin: 0 0 14px 0; font-size: 11px; color: #8C867D; line-height: 1.6;">
                  Opp, JNTU Rd, HMT Hills, Kukatpally, Hyderabad, Telangana 500085<br>
                  Concierge: <a href="tel:+916281344628" style="color: #B79B63; text-decoration: none;">+91 62813 44628</a> • <a href="mailto:concierge@sreeshaelegance.com" style="color: #B79B63; text-decoration: none;">concierge@sreeshaelegance.com</a>
                </p>
                
                <div style="margin: 16px 0; border-top: 1px solid #E8E2D8;"></div>
                
                <p style="margin: 0; font-size: 10px; color: #8C867D; text-transform: uppercase; letter-spacing: 1px;">
                  © ${new Date().getFullYear()} Sreesha Elegance. All Rights Reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
