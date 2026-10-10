import { describe, it, expect } from "vitest";
import {
  verifyAdminCredentials,
  DEFAULT_OWNER_ADMIN,
  normalizePhone,
  normalizeString,
  AdminRecord,
} from "./adminAuth";

describe("adminAuth module", () => {
  it("verifies DEFAULT_OWNER_ADMIN constants", () => {
    expect(DEFAULT_OWNER_ADMIN.name).toBe("sreesha");
    expect(DEFAULT_OWNER_ADMIN.phone).toBe("6281344628");
    expect(DEFAULT_OWNER_ADMIN.ownerId).toBe("8899");
    expect(DEFAULT_OWNER_ADMIN.isOwner).toBe(true);
  });

  it("normalizes phone numbers and strings correctly", () => {
    expect(normalizePhone("+91 62813 44628")).toBe("6281344628");
    expect(normalizePhone("06281344628")).toBe("6281344628");
    expect(normalizeString("  Sreesha  Reddy ")).toBe("sreesha reddy");
  });

  it("authenticates the default primary owner sreesha with 6281344628 and 8899", () => {
    const result = verifyAdminCredentials("sreesha", "6281344628", "8899");
    expect(result.success).toBe(true);
    expect(result.admin).toBeDefined();
    expect(result.admin?.isOwner).toBe(true);
    expect(result.admin?.displayName).toBe("Sreesha");
  });

  it("authenticates primary owner with case-insensitivity and phone formatting", () => {
    const result = verifyAdminCredentials("SREESHA", "+91 62813 44628", "8899");
    expect(result.success).toBe(true);
    expect(result.admin?.ownerId).toBe("8899");
  });

  it("rejects invalid PIN for owner", () => {
    const result = verifyAdminCredentials("sreesha", "6281344628", "0000");
    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid administrator credentials");
  });

  it("rejects incorrect phone number for owner", () => {
    const result = verifyAdminCredentials("sreesha", "9999999999", "8899");
    expect(result.success).toBe(false);
  });

  it("authenticates delegated staff members when present in staff list", () => {
    const customStaff: AdminRecord[] = [
      {
        id: "admin_staff_test_1",
        name: "priya varma",
        displayName: "Priya Varma",
        phone: "9849011223",
        ownerId: "5566",
        role: "Store Manager",
        status: "Active",
        isOwner: false,
        createdAt: new Date().toISOString(),
      },
    ];

    const result = verifyAdminCredentials("Priya Varma", "9849011223", "5566", customStaff);
    expect(result.success).toBe(true);
    expect(result.admin?.role).toBe("Store Manager");
    expect(result.admin?.isOwner).toBe(false);
  });
});
