import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AdminRecord, DEFAULT_OWNER_ADMIN, normalizePhone, normalizeString } from "@/lib/adminAuth";
import {
  createSessionToken,
  ADMIN_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/serverAdminAuth";

const adminsFilePath = path.join(process.cwd(), "src", "data", "admins.json");

let memoryAdmins: AdminRecord[] = [DEFAULT_OWNER_ADMIN];

function loadAdmins(): AdminRecord[] {
  try {
    if (fs.existsSync(adminsFilePath)) {
      const data = fs.readFileSync(adminsFilePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryAdmins = parsed;
        return parsed;
      }
    }
  } catch {
    // Return in-memory fallback
  }
  return memoryAdmins;
}

function sanitizeAdmin(
  admin: AdminRecord
): Omit<AdminRecord, "ownerId"> & { hasPasscode: boolean } {
  const { ownerId, ...safe } = admin;
  return {
    ...safe,
    hasPasscode: Boolean(ownerId && ownerId.length >= 4),
  };
}

// POST: Verify staff/admin login credentials and set secure session cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, ownerId } = body;

    const cleanName = normalizeString(name || "");
    const cleanPhone = normalizePhone(phone || "");
    const cleanOwnerId = (ownerId || "").trim();

    if (!cleanName || !cleanPhone || !cleanOwnerId) {
      return NextResponse.json(
        { success: false, error: "Please provide Name, Mobile Number, and Passcode." },
        { status: 400 }
      );
    }

    const admins = loadAdmins();
    const matched = admins.find((admin) => {
      const adminName = normalizeString(admin.name);
      const adminPhone = normalizePhone(admin.phone);
      const adminPin = admin.ownerId.trim();

      const nameMatch =
        adminName === cleanName || cleanName.includes(adminName) || adminName.includes(cleanName);
      const phoneMatch = adminPhone === cleanPhone;
      const pinMatch = adminPin === cleanOwnerId;

      return nameMatch && phoneMatch && pinMatch;
    });

    if (matched) {
      if (matched.status === "Suspended") {
        return NextResponse.json(
          { success: false, error: "This staff account has been suspended. Contact the owner." },
          { status: 403 }
        );
      }

      const response = NextResponse.json({
        success: true,
        admin: sanitizeAdmin(matched),
        message: `Authenticated as ${matched.displayName} (${matched.role})`,
      });

      // Set HTTP-only secure session cookie
      const token = createSessionToken(matched.id);
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
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Invalid admin credentials. Please verify your Name, registered Mobile, and Owner ID.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Staff login error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during staff login." },
      { status: 500 }
    );
  }
}
