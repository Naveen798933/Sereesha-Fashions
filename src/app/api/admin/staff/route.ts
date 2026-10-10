import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AdminRecord, DEFAULT_OWNER_ADMIN, normalizePhone, normalizeString } from "@/lib/adminAuth";

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

// GET: Retrieve all active admin records
export async function GET() {
  const admins = loadAdmins();
  return NextResponse.json({
    success: true,
    admins,
    count: admins.length,
  });
}

// POST: Add new staff admin access OR verify admin credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Verify Admin Login Credentials
    if (action === "verify_login") {
      const { name, phone, ownerId } = body;
      const cleanName = normalizeString(name || "");
      const cleanPhone = normalizePhone(phone || "");
      const cleanOwnerId = (ownerId || "").trim();

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
            { success: false, error: "This staff account has been suspended" },
            { status: 403 }
          );
        }
        return NextResponse.json({
          success: true,
          admin: matched,
          message: `Authenticated as ${matched.displayName} (${matched.role})`,
        });
      }

      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid admin credentials. Please verify your Name, registered Mobile, and Owner ID.",
        },
        { status: 401 }
      );
    }

    // Action 2: Add New Staff Admin Member
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
      admin: newAdmin,
      admins: updatedList,
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
      admins: filtered,
    });
  } catch (error) {
    console.error("Staff deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to revoke staff access" },
      { status: 500 }
    );
  }
}
