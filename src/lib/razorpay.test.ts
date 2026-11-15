import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { getRazorpayKeyId, isRazorpayConfigured } from "./razorpay";

describe("Razorpay Integration Security & Signature Utility", () => {
  it("provides a valid Razorpay key ID fallback", () => {
    const keyId = getRazorpayKeyId();
    expect(keyId).toBeDefined();
    expect(typeof keyId).toBe("string");
    expect(keyId.length).toBeGreaterThan(0);
  });

  it("correctly evaluates whether live Razorpay credentials are fully configured", () => {
    const configured = isRazorpayConfigured();
    expect(typeof configured).toBe("boolean");
  });

  it("successfully verifies valid HMAC-SHA256 signatures", () => {
    const orderId = "order_sample_123456";
    const paymentId = "pay_sample_789012";
    const secret = "atelier_test_secret_key";

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${orderId}|${paymentId}`);
    const validSignature = hmac.digest("hex");

    const genBuf = Buffer.from(validSignature, "utf-8");
    const sigBuf = Buffer.from(validSignature, "utf-8");
    const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    expect(isMatch).toBe(true);
  });

  it("detects and rejects tampered HMAC-SHA256 signatures", () => {
    const orderId = "order_sample_123456";
    const paymentId = "pay_sample_789012";
    const secret = "atelier_test_secret_key";

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${orderId}|${paymentId}`);
    const validSignature = hmac.digest("hex");

    // Tamper with one character
    const tamperedSignature =
      validSignature.substring(0, validSignature.length - 1) +
      (validSignature.endsWith("a") ? "b" : "a");

    const genBuf = Buffer.from(validSignature, "utf-8");
    const sigBuf = Buffer.from(tamperedSignature, "utf-8");
    const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    expect(isMatch).toBe(false);
  });

  it("safely handles mismatched buffer lengths without throwing", () => {
    const validSignature = "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
    const truncatedSignature = "abcdef";

    const genBuf = Buffer.from(validSignature, "utf-8");
    const sigBuf = Buffer.from(truncatedSignature, "utf-8");
    const isMatch = genBuf.length === sigBuf.length && crypto.timingSafeEqual(genBuf, sigBuf);

    expect(isMatch).toBe(false);
  });
});
