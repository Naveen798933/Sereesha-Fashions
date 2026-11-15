import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ error: null }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: null }),
          }),
          eq: async () => ({ error: null }),
        }),
      }),
    }),
  }),
}));

import { POST } from "./route";
import crypto from "crypto";

describe("Razorpay Webhook Endpoint (POST /api/payment/webhook)", () => {
  it("rejects webhook requests missing x-razorpay-signature with 400", async () => {
    const payload = JSON.stringify({ event: "payment.captured" });
    const req = new Request("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Missing x-razorpay-signature");
  });

  it("rejects invalid webhook signatures with 400", async () => {
    const payload = JSON.stringify({ event: "payment.captured" });
    const req = new Request("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "forged_webhook_signature_1234567890abcdef",
      },
      body: payload,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid webhook signature");
  });

  it("accepts valid webhook signature and processes event", async () => {
    const secret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "sreesha_mock_secret_key_2026";

    const payloadObj = {
      event: "payment.captured",
      id: `evt_test_${Date.now()}`,
      payload: {
        payment: {
          entity: {
            id: `pay_test_${Date.now()}`,
            order_id: "order_sample_test",
            amount: 500000,
          },
        },
      },
    };
    const rawBody = JSON.stringify(payloadObj);

    const validSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    const req = new Request("http://localhost:3000/api/payment/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validSignature,
      },
      body: rawBody,
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("success");
    expect(data.event).toBe("payment.captured");
  });
});
