import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/serverAdminAuth";

vi.mock("@/lib/supabase/server", () => ({
  createServerAdminClient: vi.fn().mockReturnValue({
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: "test.jpg" }, error: null }),
        getPublicUrl: vi
          .fn()
          .mockReturnValue({ data: { publicUrl: "https://test.supabase.co/test.jpg" } }),
      }),
    },
  }),
}));

describe("Admin Media Upload API (/api/admin/upload)", () => {
  it("rejects unauthenticated upload requests with 401", async () => {
    const formData = new FormData();
    formData.append("file", new Blob(["mock-image-content"], { type: "image/jpeg" }), "saree.jpg");

    const req = new NextRequest("http://127.0.0.1:3000/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("rejects upload requests missing a file with 400", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const formData = new FormData();

    const req = new NextRequest("http://127.0.0.1:3000/api/admin/upload", {
      method: "POST",
      headers: {
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      },
      body: formData,
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/no file/i);
  });

  it("successfully uploads image file and returns public URL", async () => {
    const validToken = createSessionToken("sreesha", "Super Admin / Owner");
    const mockFile = {
      name: "kanchipuram.jpg",
      size: 1024,
      type: "image/jpeg",
      arrayBuffer: async () => Buffer.from("fake-binary-image-data"),
    };
    const mockFormData = {
      get: (key: string) => (key === "file" ? mockFile : null),
    };

    const req = {
      formData: async () => mockFormData,
      headers: new Headers({
        cookie: `${ADMIN_COOKIE_NAME}=${validToken}`,
      }),
      cookies: {
        get: (name: string) => (name === ADMIN_COOKIE_NAME ? { value: validToken } : undefined),
      },
    } as unknown as NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.url).toBeTruthy();
    expect(data.fileName).toMatch(/atelier_\d+_[a-f0-9]+\.jpg/);
  });
});
