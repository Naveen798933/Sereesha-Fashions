import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: {
              id: "cust_9876543210",
              name: "Sreeja Varma",
              phone: "9876543210",
              role: "customer",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      }),
    }),
  }),
}));

describe("Customer Phone Auth API (POST /api/auth/phone)", () => {
  it("rejects missing phone number with 400", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/auth/phone", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("10-digit mobile number");
  });

  it("rejects invalid/short phone numbers with 400", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/auth/phone", {
      method: "POST",
      body: JSON.stringify({ phone: "123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("handles customer signup with name successfully", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/auth/phone", {
      method: "POST",
      body: JSON.stringify({
        phone: "9876543210",
        name: "Sreeja Varma",
        action: "signup",
        email: "sreeja.varma@example.com",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.customer.name).toBe("Sreeja Varma");
  });
});
