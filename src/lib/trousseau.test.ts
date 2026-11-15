import { describe, it, expect } from "vitest";
import {
  WEDDING_CEREMONIES,
  calculateTrousseauPrivilege,
  getAvailableProductsForCeremony,
  getProductForCeremony,
} from "./trousseau";
import { PRODUCTS } from "@/data/products";

describe("Atelier Bridal Trousseau Moodboard Engine", () => {
  it("provides 5 royal wedding ceremonies in ceremonial chronological sequence", () => {
    expect(WEDDING_CEREMONIES.length).toBe(5);

    const haldi = WEDDING_CEREMONIES[0];
    expect(haldi.id).toBe("pellikuthuru_haldi");
    expect(haldi.order).toBe(1);
    expect(haldi.teluguName).toContain("పెళ్లికూతురు");
    expect(haldi.palette.length).toBeGreaterThanOrEqual(3);

    const muhurtham = WEDDING_CEREMONIES.find((c) => c.id === "subha_muhurtham");
    expect(muhurtham).toBeDefined();
    expect(muhurtham?.order).toBe(3);
    expect(muhurtham?.drapeStyle).toContain("Nivi");
  });

  it("calculates tiered trousseau privileges accurately", () => {
    const p1 = PRODUCTS[0];
    const p2 = PRODUCTS[1];
    const p3 = PRODUCTS[2];
    const p4 = PRODUCTS[3];
    const p5 = PRODUCTS[4];

    // Single item
    const priv1 = calculateTrousseauPrivilege([p1]);
    expect(priv1.discountPercentage).toBe(0);
    expect(priv1.discountAmount).toBe(0);
    expect(priv1.finalTotal).toBe(p1.price);

    // 2 items: 5%
    const priv2 = calculateTrousseauPrivilege([p1, p2]);
    expect(priv2.discountPercentage).toBe(5);
    expect(priv2.couponCode).toBe("TROUSSEAU5");

    // 3 items: 12% Trousseau Luxe
    const priv3 = calculateTrousseauPrivilege([p1, p2, p3]);
    expect(priv3.discountPercentage).toBe(12);
    expect(priv3.couponCode).toBe("TROUSSEAU12");
    expect(priv3.privilegeTier).toContain("12%");
    expect(priv3.complimentaryGifts.length).toBeGreaterThan(0);

    // 5 items: 15% Royal Grand Trousseau
    const priv5 = calculateTrousseauPrivilege([p1, p2, p3, p4, p5]);
    expect(priv5.discountPercentage).toBe(15);
    expect(priv5.couponCode).toBe("ROYALTROUSSEAU15");
    expect(priv5.privilegeTier).toContain("Royal Nizam");
    expect(priv5.complimentaryGifts.some((g) => g.includes("Muslin Storage Trunk"))).toBe(true);
  });

  it("resolves products and alternatives for a given ceremony", () => {
    const muhurtham = WEDDING_CEREMONIES.find((c) => c.id === "subha_muhurtham")!;
    const available = getAvailableProductsForCeremony(muhurtham);

    expect(available.length).toBeGreaterThan(0);
    expect(available[0].id).toBeTruthy();

    const specific = getProductForCeremony(available[0].id);
    expect(specific).toBeDefined();
    expect(specific?.title).toBeTruthy();
  });
});
