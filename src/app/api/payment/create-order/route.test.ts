import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: () => ({
    from: () => ({
      select: () => ({
        in: async () => ({ data: [], error: null }),
        eq: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    }),
  }),
}));

import { POST } from "./route";

describe("Payment Create-Order Endpoint (POST /api/payment/create-order)", () => {
  it("rejects invalid or negative order amounts with 400", async () => {
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: -500,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid order amount");
  });

  it("authoritatively computes total from catalog items and prevents client price tampering", async () => {
    // Saree-01 has a catalog price of ₹18,500.
    // Client attempts to tamper by sending amount: 1
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "saree-01",
            productId: "saree-01",
            quantity: 1,
            price: 1, // Attempted tamper: claiming it's ₹1
          },
        ],
        amount: 1, // Attempted tamper
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderId).toBeDefined();
    // Server computes ₹18,500 * 100 paise = 1,850,000 paise (shipping is free >= 2999)
    expect(data.amount).toBe(18500 * 100);
  });

  it("applies promotional coupon WELCOME10 authoritatively", async () => {
    // Kurti-01 is ₹11,500 (subtotal >= 2999, so shipping is ₹0).
    // WELCOME10 gives 10% off (₹1,150 off).
    // Total: ₹11,500 - ₹1,150 = ₹10,350 = 1,035,000 paise.
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "kurti-01",
            productId: "kurti-01",
            quantity: 1,
          },
        ],
        couponCode: "WELCOME10",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderId).toBeDefined();
    expect(data.amount).toBe(10350 * 100);
  });

  it("adds nominal ₹150 shipping fee when subtotal is below ₹2,999", async () => {
    // Item with non-catalog price of ₹2,000 (< 2999)
    // Server adds ₹150 shipping fee.
    // Total: ₹2,000 + ₹150 = ₹2,150 = 215,000 paise.
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "custom-acc-01",
            price: 2000,
            quantity: 1,
          },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderId).toBeDefined();
    expect(data.amount).toBe(2150 * 100);
  });

  it("accurately parses compound cart item id to lookup catalog price", async () => {
    // Compound ID from CartWishlistContext: "saree-01-Standard-none"
    // Should resolve to saree-01 (₹18,500)
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "saree-01-Standard-none",
            quantity: 1,
          },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderId).toBeDefined();
    expect(data.amount).toBe(18500 * 100);
  });

  it("validates ROYAL20 20% discount on high-tier orders >= ₹40,000", async () => {
    // Saree-03 is ₹32,000. Quantity 2 = ₹64,000.
    // ROYAL20 gives 20% off: ₹12,800 discount.
    // Total: ₹64,000 - ₹12,800 = ₹51,200 = 5,120,000 paise.
    const req = new Request("http://localhost:3000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          {
            id: "saree-03",
            productId: "saree-03",
            quantity: 2,
          },
        ],
        couponCode: "ROYAL20",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.orderId).toBeDefined();
    expect(data.amount).toBe(51200 * 100);
  });
});
