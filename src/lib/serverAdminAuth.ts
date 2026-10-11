import crypto from "crypto";

// ============================================================================
// CREDENTIAL CONFIGURATION & SECRETS
// ============================================================================

export interface ExpectedCredentials {
  adminId: string;
  password: string;
  securityCode: string;
}

/**
 * Retrieves the expected admin credentials from secure server-side environment variables.
 * In production, ADMIN_ID, ADMIN_PASSWORD, and ADMIN_SECURITY_CODE must be configured.
 * Development fallbacks are provided for local testing.
 */
export function getExpectedAdminCredentials(): ExpectedCredentials {
  return {
    adminId: process.env.ADMIN_ID || "sreesha",
    password: process.env.ADMIN_PASSWORD || "Sreesha@Atelier2026",
    securityCode: process.env.ADMIN_SECURITY_CODE || "8899",
  };
}

export function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "sreesha_atelier_luxury_session_secret_signing_key_2026_hyderabad"
  );
}

// ============================================================================
// TIMING-SAFE COMPARISON HELPER
// ============================================================================

export function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) {
      // Run dummy compare to prevent timing leak
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

// ============================================================================
// RATE LIMITING & ABUSE PROTECTION
// ============================================================================

interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

export function checkRateLimit(clientKey: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingMs: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(clientKey);

  if (!record) {
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingMs: 0 };
  }

  // Check active lockout
  if (record.lockedUntil > now) {
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingMs: record.lockedUntil - now,
    };
  }

  // Reset if window has elapsed
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    rateLimitMap.delete(clientKey);
    return { isLocked: false, remainingAttempts: MAX_ATTEMPTS, lockoutRemainingMs: 0 };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.attempts);
  return { isLocked: false, remainingAttempts: remaining, lockoutRemainingMs: 0 };
}

export function recordFailedAttempt(clientKey: string): {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingMs: number;
} {
  const now = Date.now();
  let record = rateLimitMap.get(clientKey);

  if (!record || now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    record = { attempts: 1, lastAttempt: now, lockedUntil: 0 };
  } else {
    record.attempts += 1;
    record.lastAttempt = now;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitMap.set(clientKey, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingMs: LOCKOUT_DURATION_MS,
    };
  }

  rateLimitMap.set(clientKey, record);
  return {
    isLocked: false,
    remainingAttempts: MAX_ATTEMPTS - record.attempts,
    lockoutRemainingMs: 0,
  };
}

export function clearRateLimit(clientKey: string): void {
  rateLimitMap.delete(clientKey);
}

// ============================================================================
// TOKEN & SESSION MANAGEMENT
// ============================================================================

export interface AdminSessionPayload {
  adminId: string;
  role: string;
  iat: number;
  exp: number;
}

export const ADMIN_COOKIE_NAME = "sreesha_admin_token";
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60; // 8 hours

export function createSessionToken(adminId: string, role: string = "Super Admin / Owner"): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    adminId,
    role,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const secret = getSessionSecret();
  const signature = crypto.createHmac("sha256", secret).update(payloadBase64).digest("base64url");

  return `${payloadBase64}.${signature}`;
}

export function verifySessionToken(token: string): AdminSessionPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [payloadBase64, providedSig] = token.split(".");
    if (!payloadBase64 || !providedSig) return null;

    const secret = getSessionSecret();
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(payloadBase64)
      .digest("base64url");

    if (!safeCompare(providedSig, expectedSig)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
