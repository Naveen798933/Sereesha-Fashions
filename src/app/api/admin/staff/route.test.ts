import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

describe("Admin Staff API (/api/admin/staff)", () => {
  const validToken = createSessionToken("sreesha", "Super Admin / Owner");

  describe("GET /api/admin/staff", () => {
    it("rejects unauthenticated requests with 401 Unauthorized", async () => {
      const req = new NextRequest("http://127.0.0.1:3000/api/admin/staff");
      const res = await GET(req);
      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data.success).toBe(false);
      expect(data.error).toContain("Unauthorized");
    });

    it("returns sanitized staff records without leaking passcodes", async () => {
      const req = new NextRequest("http://127.0.0.1:3000/api/admin/staff", {
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        },
      });

      const res = await GET(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.admins)).toBe(true);
      expect(data.admins.length).toBeGreaterThan(0);

      // Verify passcodes are stripped
      for (const admin of data.admins) {
        expect(admin.ownerId).toBeUndefined();
        expect(typeof admin.hasPasscode).toBe("boolean");
      }
    });
  });

  describe("POST /api/admin/staff", () => {
    it("rejects unauthenticated staff creation with 401 Unauthorized", async () => {
      const req = new NextRequest("http://127.0.0.1:3000/api/admin/staff", {
        method: "POST",
        body: JSON.stringify({
          name: "Rogue Admin",
          phone: "9988776655",
          ownerId: "9999",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/admin/staff", () => {
    it("rejects unauthenticated staff deletion with 401 Unauthorized", async () => {
      const req = new NextRequest("http://127.0.0.1:3000/api/admin/staff?id=admin_staff_test", {
        method: "DELETE",
      });

      const res = await DELETE(req);
      expect(res.status).toBe(401);
    });

    it("prevents revoking primary owner account with 403 Forbidden", async () => {
      const req = new NextRequest("http://127.0.0.1:3000/api/admin/staff?id=admin_owner_primary", {
        method: "DELETE",
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        },
      });

      const res = await DELETE(req);
      expect(res.status).toBe(403);
      const data = await res.json();
      expect(data.error).toContain("Primary Owner");
    });
  });
});
