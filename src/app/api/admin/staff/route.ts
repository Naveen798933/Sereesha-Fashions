import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AdminRecord, DEFAULT_OWNER_ADMIN, normalizePhone } from "@/lib/adminAuth";

const adminsFilePath = path.join(process.cwd(), "src", "data", "admins.json");

// In-memory cache for serverless environments
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

function saveAdmins(admins: AdminRecord[]): boolean {
  memoryAdmins = admins;
  try {
    const dir = path.dirname(adminsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(adminsFilePath, JSON.stringify(admins, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Could not write admins.json (expected in read-only serverless):", err);
    return false;
  }
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

// GET: Retrieve all active admin records (Sanitized, secrets never returned)
export async function GET() {
  const admins = loadAdmins();
  return NextResponse.json({
    success: true,
    admins: admins.map(sanitizeAdmin),
    count: admins.length,
  });
}

// POST: Add new staff admin member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Guard: reject legacy verify_login calls — login is handled by /api/admin/auth/staff-login
    if (action === "verify_login") {
      return NextResponse.json(
        {
          success: false,
          error: "Login endpoint moved. Use POST /api/admin/auth/staff-login instead.",
        },
        { status: 410 }
      );
    }

    // Add New Staff Admin Member
    const { name, phone, ownerId, role = "Store Manager" } = body;

    const cleanName = (name || "").trim();
    const cleanPhone = normalizePhone(phone || "");
    const cleanOwnerId = (ownerId || "").trim();

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid staff name" },
        { status: 400 }
      );
    }

    if (!cleanPhone || cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    if (!cleanOwnerId || cleanOwnerId.length < 4) {
      return NextResponse.json(
        { success: false, error: "Passcode / Owner ID must be at least 4 digits" },
        { status: 400 }
      );
    }

    const currentAdmins = loadAdmins();

    // Check duplicate phone or ID
    if (currentAdmins.some((a) => normalizePhone(a.phone) === cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "An administrator with this phone number already exists" },
        { status: 409 }
      );
    }

    const newAdmin: AdminRecord = {
      id: `admin_staff_${Date.now()}`,
      name: cleanName.toLowerCase(),
      displayName: cleanName,
      phone: cleanPhone,
      ownerId: cleanOwnerId,
      role: role.trim(),
      status: "Active",
      isOwner: false,
      createdAt: new Date().toISOString(),
    };

    const updatedList = [...currentAdmins, newAdmin];
    saveAdmins(updatedList);

    return NextResponse.json({
      success: true,
      admin: sanitizeAdmin(newAdmin),
      admins: updatedList.map(sanitizeAdmin),
      message: `Staff access granted to ${cleanName} (${role})`,
    });
  } catch (error) {
    console.error("Staff access error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process staff request" },
      { status: 500 }
    );
  }
}

// DELETE: Revoke staff access
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Staff ID is required" }, { status: 400 });
    }

    const currentAdmins = loadAdmins();
    const target = currentAdmins.find((a) => a.id === id);

    if (!target) {
      return NextResponse.json(
        { success: false, error: "Staff member not found" },
        { status: 404 }
      );
    }

    if (target.isOwner || normalizePhone(target.phone) === DEFAULT_OWNER_ADMIN.phone) {
      return NextResponse.json(
        { success: false, error: "Primary Owner account cannot be deleted or revoked" },
        { status: 403 }
      );
    }

    const filtered = currentAdmins.filter((a) => a.id !== id);
    saveAdmins(filtered);

    return NextResponse.json({
      success: true,
      message: `Revoked admin access for ${target.displayName}`,
      admins: filtered.map(sanitizeAdmin),
    });
  } catch (error) {
    console.error("Staff deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revoke staff access" },
      { status: 500 }
    );
  }
}
