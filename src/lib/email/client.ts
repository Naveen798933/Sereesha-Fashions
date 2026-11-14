import { Resend } from "resend";

let cachedResend: Resend | null = null;

/**
 * Resolves the server-side Resend API key securely.
 * Never exposed to browser or client components.
 */
export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY;
}

/**
 * Resolves the sender email address, cleanly handling the
 * EMAIL_FROM vs FROM_EMAIL environment variable naming difference.
 */
export function getEmailFrom(): string {
  return (
    process.env.EMAIL_FROM || process.env.FROM_EMAIL || "Sreesha Elegance <onboarding@resend.dev>"
  );
}

/**
 * Resolves the atelier administrative notification recipient.
 */
export function getAdminNotificationEmail(): string {
  return (
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    process.env.NEXT_PUBLIC_STORE_EMAIL ||
    "concierge@sreeshaelegance.com"
  );
}

/**
 * Returns a configured Resend client instance if the API key is present.
 */
export function getResendClient(): Resend | null {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    return null;
  }
  if (!cachedResend) {
    cachedResend = new Resend(apiKey);
  }
  return cachedResend;
}
