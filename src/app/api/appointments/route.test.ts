import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "./route";

// Mock email engine
vi.mock("@/lib/email", () => ({
  sendAppointmentConfirmationEmail: vi
    .fn()
    .mockResolvedValue({ success: true, id: "sim_email_123" }),
  sendAdminAppointmentAlert: vi
    .fn()
    .mockResolvedValue({ success: true, id: "sim_admin_alert_123" }),
}));

// Mock Supabase server
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  }),
}));

describe("Appointments API (POST & GET /api/appointments)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects booking requests missing required fields with 400", async () => {
    const req = new Request("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Sowmya",
        // missing phone, email, etc.
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/all required appointment details/i);
  });

  it("rejects invalid email address with 400", async () => {
    const req = new Request("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Sowmya",
        customerPhone: "+91 98490 12345",
        customerEmail: "invalid-email-no-at-sign",
        serviceType: "bridal_trousseau",
        date: "Saturday, 21 November 2026",
        timeSlot: "11:00 AM - 12:30 PM",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/valid email/i);
  });

  it("successfully books an appointment and returns confirmation", async () => {
    const req = new Request("http://localhost:3000/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: "Ananya Rao",
        customerPhone: "+91 98490 99887",
        customerEmail: "ananya.rao@example.com",
        serviceType: "bridal_trousseau",
        mode: "in_store",
        date: "Saturday, 21 November 2026",
        timeSlot: "11:00 AM - 12:30 PM",
        city: "Hyderabad",
        occasionDate: "20 January 2027",
        notes: "Bridal silk muhurtham selection",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.appointment.customerName).toBe("Ananya Rao");
    expect(data.appointment.serviceTitle).toBe("Bridal Trousseau & Heirloom Silks");
    expect(data.appointment.status).toBe("Confirmed");
  });

  it("rejects unauthorized GET requests without admin token", async () => {
    const req = new Request("http://localhost:3000/api/appointments");
    const res = await GET(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/unauthorized/i);
  });
});
