import { describe, it, expect, beforeEach } from "vitest";
import { getEmailFrom, getAdminNotificationEmail } from "./client";
import { isEmailDuplicate, recordSentEmail } from "./idempotency";
import { renderOrderConfirmedEmail } from "./templates/orderConfirmed";
import { renderPaymentReceiptEmail } from "./templates/paymentReceipt";
import { renderShippingNotificationEmail } from "./templates/shipping";
import { renderDeliveryNotificationEmail } from "./templates/delivery";
import { renderCancellationEmail } from "./templates/cancellation";
import { renderWelcomeEmail } from "./templates/welcome";
import { renderAdminOrderAlertEmail } from "./templates/adminAlert";
import {
  sendOrderConfirmationEmail,
  sendPaymentReceiptEmail,
  sendShippingNotificationEmail,
  sendDeliveryNotificationEmail,
  sendCancellationNotificationEmail,
  sendWelcomeEmail,
  sendAdminOrderAlert,
} from "./index";

describe("Resend Email Service Configuration & Resolvers", () => {
  it("resolves default EMAIL_FROM with luxury display format", () => {
    const from = getEmailFrom();
    expect(from).toContain("Sreesha Elegance");
    expect(from).toContain("@");
  });

  it("resolves admin notification email recipient", () => {
    const adminEmail = getAdminNotificationEmail();
    expect(adminEmail).toContain("@");
  });
});

describe("Email Idempotency Guard", () => {
  const testKey = `test_order_${Date.now()}:confirmation`;

  beforeEach(() => {
    // Clean test key if set
  });

  it("returns null when email has not been sent previously", () => {
    expect(isEmailDuplicate(testKey)).toBeNull();
  });

  it("detects duplicates and suppresses redundant dispatches", () => {
    recordSentEmail(testKey, "msg_test_123");
    const existing = isEmailDuplicate(testKey);
    expect(existing).not.toBeNull();
    expect(existing?.id).toBe("msg_test_123");
  });
});

describe("Luxury HTML Email Templates", () => {
  const sampleOrder = {
    orderId: "SE-84920",
    customerName: "Priya Reddy",
    customerEmail: "priya.reddy@example.com",
    total: 18500,
    items: [
      {
        title: "Kanchipuram Pure Silk Saree — Emerald",
        size: "Standard 5.5m + Blouse",
        quantity: 1,
        price: 18500,
      },
    ],
    shippingAddress: {
      street: "Flat 402, Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pinCode: "500033",
    },
    trackingNumber: "BD893201948IN",
  };

  it("renders order confirmation template with brand styling", () => {
    const html = renderOrderConfirmedEmail(sampleOrder);
    expect(html).toContain("SREESHA ELEGANCE");
    expect(html).toContain("SE-84920");
    expect(html).toContain("Kanchipuram Pure Silk Saree");
    expect(html).toContain("#FAF7F2"); // Ivory Canvas
    expect(html).toContain("#1C1B19"); // Charcoal
    expect(html).toContain("#B79B63"); // Champagne Gold
    expect(html).toContain("Hyderabad, Telangana 500085");
  });

  it("renders verified payment receipt template with transaction details", () => {
    const html = renderPaymentReceiptEmail({
      orderId: "SE-84920",
      customerName: "Priya Reddy",
      customerEmail: "priya.reddy@example.com",
      paymentId: "pay_rzp_9849012345",
      paymentMethod: "upi",
      amount: 18500,
    });
    expect(html).toContain("Verified Payment Receipt");
    expect(html).toContain("pay_rzp_9849012345");
    expect(html).toContain("18,500");
    expect(html).toContain("UPI Instant Payment");
  });

  it("renders shipping notification with BlueDart tracking details", () => {
    const html = renderShippingNotificationEmail({
      orderId: "SE-84920",
      customerName: "Priya Reddy",
      customerEmail: "priya.reddy@example.com",
      carrier: "BlueDart Air Express",
      trackingNumber: "BD893201948IN",
      items: sampleOrder.items,
      shippingAddress: sampleOrder.shippingAddress,
    });
    expect(html).toContain("Order Dispatched");
    expect(html).toContain("BD893201948IN");
    expect(html).toContain("BlueDart Air Express");
  });

  it("renders delivery complete template with silk care instructions", () => {
    const html = renderDeliveryNotificationEmail({
      orderId: "SE-84920",
      customerName: "Priya Reddy",
      customerEmail: "priya.reddy@example.com",
      deliveredDate: "15 November 2026",
      carrier: "BlueDart Air Express",
      trackingNumber: "BD893201948IN",
      items: sampleOrder.items,
    });
    expect(html).toContain("Delivered with Elegance");
    expect(html).toContain("Muslin Storage");
    expect(html).toContain("Dry Clean Only");
  });

  it("renders cancellation notice with refund details", () => {
    const html = renderCancellationEmail({
      orderId: "SE-84920",
      customerName: "Priya Reddy",
      customerEmail: "priya.reddy@example.com",
      refundAmount: 18500,
      refundReference: "REF-998811",
      reason: "Client schedule conflict",
    });
    expect(html).toContain("Order Cancelled");
    expect(html).toContain("18,500");
    expect(html).toContain("5 - 7 Business Days");
    expect(html).toContain("REF-998811");
  });

  it("renders patron welcome email with WELCOME10 voucher", () => {
    const html = renderWelcomeEmail({
      customerName: "Ananya Sharma",
      customerEmail: "ananya@example.com",
    });
    expect(html).toContain("Welcome to Sreesha Elegance");
    expect(html).toContain("WELCOME10");
    expect(html).toContain("10% savings");
  });

  it("renders admin new order notification", () => {
    const html = renderAdminOrderAlertEmail({
      orderId: "SE-84920",
      customerName: "Priya Reddy",
      customerPhone: "9849012345",
      customerEmail: "priya.reddy@example.com",
      total: 18500,
      paymentMethod: "UPI",
      items: sampleOrder.items,
      shippingAddress: sampleOrder.shippingAddress,
    });
    expect(html).toContain("[NEW ORDER]");
    expect(html).toContain("SE-84920");
    expect(html).toContain("Priya Reddy");
    expect(html).toContain("9849012345");
  });
});

describe("Email Engine Dispatch Services", () => {
  it("handles order confirmation dispatch safely", async () => {
    const res = await sendOrderConfirmationEmail({
      orderId: `SE-TEST-${Date.now()}`,
      customerName: "Test Patron",
      customerEmail: "test.patron@example.com",
      total: 12500,
      items: [
        {
          title: "Banarasi Pure Georgette Saree",
          size: "Free",
          quantity: 1,
          price: 12500,
        },
      ],
      shippingAddress: {
        street: "Banjara Hills",
        city: "Hyderabad",
        state: "Telangana",
        pinCode: "500034",
      },
    });
    expect(res.success).toBe(true);
    expect(res.id).toBeDefined();
  });

  it("suppresses duplicate dispatch on consecutive calls with same idempotency key", async () => {
    const orderId = `SE-IDEMP-${Date.now()}`;
    const payload = {
      orderId,
      customerName: "Duplicate Test",
      customerEmail: "dup.test@example.com",
      total: 5000,
      items: [],
      shippingAddress: {
        street: "Test St",
        city: "Hyd",
        state: "TS",
        pinCode: "500001",
      },
    };

    const first = await sendOrderConfirmationEmail(payload);
    expect(first.success).toBe(true);

    const second = await sendOrderConfirmationEmail(payload);
    expect(second.success).toBe(true);
    expect(second.duplicate).toBe(true);
  });

  it("handles payment receipt dispatch safely", async () => {
    const res = await sendPaymentReceiptEmail({
      orderId: `SE-PAY-${Date.now()}`,
      customerName: "Paid Patron",
      customerEmail: "paid.patron@example.com",
      paymentId: "pay_test_123456",
      paymentMethod: "upi",
      amount: 15000,
    });
    expect(res.success).toBe(true);
  });

  it("handles shipping notification dispatch safely", async () => {
    const res = await sendShippingNotificationEmail({
      orderId: `SE-SHIP-${Date.now()}`,
      customerName: "Ship Patron",
      customerEmail: "ship.patron@example.com",
      carrier: "BlueDart Air Express",
      trackingNumber: "BD998877665IN",
      items: [],
      shippingAddress: {
        street: "Test St",
        city: "Hyd",
        state: "TS",
        pinCode: "500001",
      },
    });
    expect(res.success).toBe(true);
  });

  it("handles delivery notification dispatch safely", async () => {
    const res = await sendDeliveryNotificationEmail({
      orderId: `SE-DEL-${Date.now()}`,
      customerName: "Del Patron",
      customerEmail: "del.patron@example.com",
      deliveredDate: "Today",
      carrier: "BlueDart",
      trackingNumber: "BD123456IN",
      items: [],
    });
    expect(res.success).toBe(true);
  });

  it("handles cancellation notification dispatch safely", async () => {
    const res = await sendCancellationNotificationEmail({
      orderId: `SE-CAN-${Date.now()}`,
      customerName: "Cancel Patron",
      customerEmail: "cancel.patron@example.com",
      reason: "Requested by client",
    });
    expect(res.success).toBe(true);
  });

  it("handles welcome email dispatch safely", async () => {
    const res = await sendWelcomeEmail({
      customerName: "New Patron",
      customerEmail: "new.patron@example.com",
    });
    expect(res.success).toBe(true);
  });

  it("handles admin order alert dispatch safely", async () => {
    const res = await sendAdminOrderAlert({
      orderId: `SE-ALERT-${Date.now()}`,
      customerName: "Alert Patron",
      customerPhone: "9849012345",
      customerEmail: "alert.patron@example.com",
      total: 25000,
      paymentMethod: "UPI",
      items: [],
      shippingAddress: {
        street: "Test St",
        city: "Hyd",
        state: "TS",
        pinCode: "500001",
      },
    });
    expect(res.success).toBe(true);
  });
});
