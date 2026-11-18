import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }),
}));

describe("Admin Coupons API (/api/admin/coupons)", () => {
  it("GET returns active coupons list", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.coupons)).toBe(true);
    expect(data.coupons.length).toBeGreaterThanOrEqual(1);

    const welcome = data.coupons.find((c: { code: string }) => c.code === "WELCOME10");
    expect(welcome).toBeDefined();
    expect(welcome.discount_value).toBe(10);
  });

  it("POST rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify({ code: "NEWYEAR20", discount_value: 20 }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("POST allows authenticated admin to upsert a coupon", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/coupons", {
      method: "POST",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: "TESTVIP30",
        discount_type: "percentage",
        discount_value: 30,
        min_order: 35000,
        active: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.coupon.code).toBe("TESTVIP30");
    expect(data.coupon.discount_value).toBe(30);
  });

  it("DELETE allows authenticated admin to remove a coupon", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/coupons?code=TESTVIP30", {
      method: "DELETE",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await DELETE(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
