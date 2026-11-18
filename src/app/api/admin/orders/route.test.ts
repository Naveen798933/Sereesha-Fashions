import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }),
}));

vi.mock("@/lib/email", () => ({
  sendShippingNotificationEmail: vi.fn().mockResolvedValue({ success: true, id: "sim_ship_123" }),
  sendDeliveryNotificationEmail: vi.fn().mockResolvedValue({ success: true, id: "sim_del_123" }),
}));

describe("Admin Orders API (/api/admin/orders)", () => {
  it("GET rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/orders");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("GET allows authenticated admin to fetch orders", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/orders", {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.orders)).toBe(true);
    expect(data.orders.length).toBeGreaterThanOrEqual(1);

    const first = data.orders[0];
    expect(first).toHaveProperty("total");
    expect(first).toHaveProperty("customer");
  });

  it("PATCH allows admin to update tracking details", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/orders", {
      method: "PATCH",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: "SE-84920",
        carrier: "BlueDart Air Express",
        trackingNumber: "BD998877665IN",
        status: "Dispatched via BlueDart Express",
      }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.order.trackingNumber).toBe("BD998877665IN");
  });
});
