import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, POST } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      upsert: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  }),
}));

describe("Admin Abandoned Carts API", () => {
  it("rejects unauthorized GET requests with 401", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/abandoned-carts");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns abandoned carts and metrics with valid admin token", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/abandoned-carts", {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.carts)).toBe(true);
    expect(data.metrics).toBeDefined();
    expect(typeof data.metrics.potentialRevenue).toBe("number");
  });

  it("validates PATCH request parameters", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/abandoned-carts", {
      method: "PATCH",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: "ac-90214" }), // missing status
    });

    const res = await PATCH(req);
    expect(res.status).toBe(400);
  });

  it("updates cart status on valid PATCH request", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/abandoned-carts", {
      method: "PATCH",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: "ac-90214", status: "contacted" }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.status).toBe("contacted");
  });

  it("records abandoned cart from checkout via POST", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/abandoned-carts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Aarthi Reddy",
        phone: "9849988776",
        items: [
          {
            id: "saree-01",
            title: "Kanchipuram Silk",
            price: 18500,
            primaryImage: "/saree.jpg",
            size: "Standard",
            quantity: 1,
          },
        ],
        subtotal: 18500,
        total: 18500,
        dropoffStep: "contact_entered",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.cart.customerName).toBe("Aarthi Reddy");
  });
});
