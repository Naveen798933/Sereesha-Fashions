import { NextRequest, NextResponse } from "next/server";
import {
  getExpectedAdminCredentials,
  safeCompare,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/serverAdminAuth";

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "client-local";
}

export async function POST(req: NextRequest) {
  try {
    const clientKey = getClientIdentifier(req);

    // 1. Rate-limit check
    const rateStatus = checkRateLimit(clientKey);
    if (rateStatus.isLocked) {
      const waitMinutes = Math.ceil(rateStatus.lockoutRemainingMs / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${waitMinutes} minutes.`,
          locked: true,
          remainingSeconds: Math.ceil(rateStatus.lockoutRemainingMs / 1000),
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { adminId, password, securityCode } = body;

    // 2. Validate input presence
    if (!adminId || typeof adminId !== "string" || !adminId.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your Admin ID or username." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    if (!securityCode || typeof securityCode !== "string" || !securityCode.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your security code." },
        { status: 400 }
      );
    }

    const cleanAdminId = adminId.trim().toLowerCase();
    const cleanPassword = password;
    const cleanSecurityCode = securityCode.trim();

    // 3. Compare all three credentials securely
    const expected = getExpectedAdminCredentials();
    const expectedAdminId = expected.adminId.trim().toLowerCase();

    // Support exact match, numeric phone match (last 10 digits), or username alias 'sreesha'
    const cleanAdminDigits = cleanAdminId.replace(/\D/g, "");
    const expectedAdminDigits = expectedAdminId.replace(/\D/g, "");

    const isIdValid =
      safeCompare(cleanAdminId, expectedAdminId) ||
      (expectedAdminDigits.length >= 10 &&
        cleanAdminDigits.length >= 10 &&
        safeCompare(cleanAdminDigits.slice(-10), expectedAdminDigits.slice(-10))) ||
      safeCompare(cleanAdminId, "sreesha");

    // Support exact password or trimmed / case-normalized match
    const isPasswordValid =
      safeCompare(cleanPassword, expected.password) ||
      safeCompare(cleanPassword.trim(), expected.password.trim()) ||
      safeCompare(cleanPassword.trim().toLowerCase(), expected.password.trim().toLowerCase());

    const isCodeValid = safeCompare(cleanSecurityCode, expected.securityCode.trim());

    const allValid = isIdValid && isPasswordValid && isCodeValid;

    if (!allValid) {
      const failStatus = recordFailedAttempt(clientKey);
      if (failStatus.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Too many failed login attempts. Account temporarily locked for security. Please try again in 15 minutes.",
            locked: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials. Please try again.",
          remainingAttempts: failStatus.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Success: Reset rate limiter and generate session token
    clearRateLimit(clientKey);
    const token = createSessionToken(expected.adminId);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
      admin: {
        id: expected.adminId,
        displayName: "Sreesha",
        role: "Super Admin / Owner",
      },
    });

    // 5. Set HTTP-only secure session cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin authentication error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
