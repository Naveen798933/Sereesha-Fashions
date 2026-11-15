import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}));

describe("Admin Customers API (GET /api/admin/customers)", () => {
  it("rejects unauthenticated requests with 401 Unauthorized", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/customers");
    const res = await GET(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Unauthorized");
  });

  it("allows access with valid administrative session token", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/customers", {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.customers)).toBe(true);
    expect(typeof data.total).toBe("number");
  });
});
