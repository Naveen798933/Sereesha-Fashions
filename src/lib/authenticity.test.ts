import { describe, it, expect } from "vitest";
import {
  verifyHandloomCertificate,
  generateCertificateForProduct,
  GI_CLUSTERS,
  SILK_TESTING_PROTOCOLS,
} from "./authenticity";
import { PRODUCTS } from "@/data/products";

describe("Atelier Handloom Authenticity Engine", () => {
  it("provides comprehensive GI clusters data", () => {
    expect(GI_CLUSTERS.length).toBeGreaterThanOrEqual(6);
    const kanchi = GI_CLUSTERS.find((c) => c.id === "kanchipuram");
    expect(kanchi).toBeDefined();
    expect(kanchi?.giNumber).toContain("144");
    expect(kanchi?.state).toBe("Tamil Nadu");
  });

  it("provides 4 pure silk scientific testing protocols", () => {
    expect(SILK_TESTING_PROTOCOLS.length).toBe(4);
    const flameTest = SILK_TESTING_PROTOCOLS.find((t) => t.id === "flame_ash");
    expect(flameTest).toBeDefined();
    expect(flameTest?.scientificPrinciple).toContain("Fibroin");
  });

  it("verifies direct registry certificates accurately", () => {
    const cert = verifyHandloomCertificate("SM-2024-8849");
    expect(cert).not.toBeNull();
    expect(cert?.certificateNumber).toBe("SM-2024-8849");
    expect(cert?.giTagNumber).toContain("Kanchipuram Silk");
    expect(cert?.status).toBe("Certified & Active");
  });

  it("verifies certificates by Silk Mark Tag Number", () => {
    const cert = verifyHandloomCertificate("SMOI-VNS-712318");
    expect(cert).not.toBeNull();
    expect(cert?.certificateNumber).toBe("SM-2024-7123");
    expect(cert?.clusterState).toBe("Uttar Pradesh");
  });

  it("generates authentic certificate for any catalog product by slug", () => {
    const cert = verifyHandloomCertificate("kanchipuram-pure-silk-saree-emerald");
    expect(cert).not.toBeNull();
    expect(cert?.productTitle).toContain("Kanchipuram");
    expect(cert?.zariType).toBe("Pure Tested Silver Zari");
    expect(cert?.weavingHours).toBeGreaterThan(0);
  });

  it("correctly identifies cluster technique for Banarasi products", () => {
    const banarasiProduct = PRODUCTS.find((p) => p.title.toLowerCase().includes("banarasi"));
    if (banarasiProduct) {
      const cert = generateCertificateForProduct(banarasiProduct);
      expect(cert.giTagNumber).toContain("Banarasi Brocade");
      expect(cert.loomType).toContain("Varanasi");
    }
  });

  it("returns null on invalid empty or nonsense queries", () => {
    expect(verifyHandloomCertificate("")).toBeNull();
    expect(verifyHandloomCertificate("xyz-not-found-123456789")).toBeNull();
  });
});
