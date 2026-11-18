import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST, DELETE } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  }),
}));

describe("Admin Categories API (/api/admin/categories)", () => {
  it("GET returns active categories list", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.categories)).toBe(true);
    expect(data.categories.length).toBeGreaterThanOrEqual(1);

    const sarees = data.categories.find((c: { slug: string }) => c.slug === "sarees");
    expect(sarees).toBeDefined();
    expect(sarees.name).toContain("Sarees");
  });

  it("POST rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Royal Silks", slug: "royal-silks" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Unauthorized");
  });

  it("POST allows authenticated admin to upsert a category", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest("http://127.0.0.1:3000/api/admin/categories", {
      method: "POST",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Festive Brocades",
        slug: "festive-brocades",
        description: "Opulent pure silk festive weaves",
        imageUrl: "https://images.unsplash.com/photo-test",
        subcategories: ["Banarasi", "Chanderi"],
        displayOrder: 5,
        isActive: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.category.name).toBe("Festive Brocades");
    expect(data.category.slug).toBe("festive-brocades");
  });

  it("DELETE rejects unauthenticated requests with 401", async () => {
    const req = new NextRequest(
      "http://127.0.0.1:3000/api/admin/categories?id=cat-festive-brocades",
      {
        method: "DELETE",
      }
    );

    const res = await DELETE(req);
    expect(res.status).toBe(401);
  });

  it("DELETE allows authenticated admin to delete a category", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const req = new NextRequest(
      "http://127.0.0.1:3000/api/admin/categories?id=cat-festive-brocades",
      {
        method: "DELETE",
        headers: {
          cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
        },
      }
    );

    const res = await DELETE(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
