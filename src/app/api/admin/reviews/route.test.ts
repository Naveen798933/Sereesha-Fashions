import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PATCH, DELETE } from "./route";
import { POST as publicPOST } from "@/app/api/reviews/route";
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
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}));

describe("Admin Reviews API (/api/admin/reviews)", () => {
  it("GET rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/reviews");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("GET allows authenticated admin to fetch all reviews", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/reviews", {
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.reviews)).toBe(true);
    expect(data.reviews.length).toBeGreaterThanOrEqual(1);
  });

  it("PATCH allows admin to update review status", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/reviews", {
      method: "PATCH",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: "rev-1", status: "approved" }),
    });

    const res = await PATCH(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("status updated");
  });

  it("Public POST /api/reviews accepts patron reviews", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "saree-01",
        productTitle: "Kanchipuram Silk",
        author: "Meenakshi Sundaram",
        city: "Chennai",
        rating: 5,
        title: "Breathtaking handloom weave",
        comment: "The zari work is exceptional and silky smooth against the skin.",
      }),
    });

    const res = await publicPOST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.review.author).toBe("Meenakshi Sundaram");
  });

  it("DELETE allows admin to delete a review", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/reviews?id=rev-9999", {
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
