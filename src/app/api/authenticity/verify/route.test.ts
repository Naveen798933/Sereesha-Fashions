import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

describe("Authenticity Verification API (GET /api/authenticity/verify)", () => {
  it("returns 400 when query parameter is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/authenticity/verify");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("Missing query");
  });

  it("returns 404 when certificate query is not found", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/authenticity/verify?query=INVALID-UNKNOWN-CERT-9999"
    );
    const res = await GET(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain("No certified handloom record");
  });

  it("verifies and returns certificate for valid certificate number", async () => {
    const req = new NextRequest("http://localhost:3000/api/authenticity/verify?cert=SM-2024-8849");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.verified).toBe(true);
    expect(data.certificate.certificateNumber).toBe("SM-2024-8849");
    expect(data.certificate.fabric).toContain("Mulberry Silk");
  });

  it("verifies and returns certificate when queried by product slug", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/authenticity/verify?slug=kanchipuram-pure-silk-saree-emerald"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.certificate.giTagNumber).toContain("Kanchipuram");
  });
});
