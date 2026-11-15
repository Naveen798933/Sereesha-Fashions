import { describe, it, expect } from "vitest";
import { POST } from "./route";
import crypto from "crypto";

describe("Payment Verification Endpoint (POST /api/payment/verify)", () => {
  it("rejects requests missing required signature parameters with 400", async () => {
    const req = new Request("http://localhost:3000/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: "order_123",
        // missing razorpay_payment_id and razorpay_signature
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.verified).toBe(false);
    expect(data.error).toContain("Missing required");
  });

  it("rejects cryptographic signature mismatches with 400", async () => {
    const req = new Request("http://localhost:3000/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: "order_live_9999",
        razorpay_payment_id: "pay_live_8888",
        razorpay_signature: "bad_signature_forged_by_client_1234567890abcdef",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.verified).toBe(false);
    expect(data.error).toContain("signature mismatch");
  });

  it("accepts mathematically valid HMAC-SHA256 signature with 200", async () => {
    const orderId = "order_live_abc123";
    const paymentId = "pay_live_xyz789";
    const secret = process.env.RAZORPAY_KEY_SECRET || "sreesha_mock_secret_key_2026";

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${orderId}|${paymentId}`);
    const validSignature = hmac.digest("hex");

    const req = new Request("http://localhost:3000/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.verified).toBe(true);
    expect(data.orderId).toBe(orderId);
    expect(data.paymentId).toBe(paymentId);
  });

  it("verifies simulated orders when live Razorpay secret is not present", async () => {
    const req = new Request("http://localhost:3000/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: "order_rzp_test_simulated_999",
        razorpay_payment_id: "pay_sim_12345",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.verified).toBe(true);
    expect(data.orderId).toBe("order_rzp_test_simulated_999");
  });
});
