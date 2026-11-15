import { describe, it, expect } from "vitest";
import { getEnsembleForProduct, ATELIER_ENSEMBLE_PIECES } from "./ensemble";
import { PRODUCTS } from "@/data/products";

describe("Complete the Nizam Look Ensemble Engine", () => {
  it("provides curated atelier ensemble pieces", () => {
    expect(ATELIER_ENSEMBLE_PIECES.brocade_blouse_emerald).toBeDefined();
    expect(ATELIER_ENSEMBLE_PIECES.organza_tissue_dupatta).toBeDefined();
    expect(ATELIER_ENSEMBLE_PIECES.royal_potli_pearls).toBeDefined();
  });

  it("generates a 3-piece coordinated ensemble for a silk saree", () => {
    const product = PRODUCTS[0];
    const bundle = getEnsembleForProduct(product);

    expect(bundle.components.length).toBe(3);
    expect(bundle.components[0].role).toBe("Base Ensemble");
    expect(bundle.components[1].role).toBe("Bespoke Blouse");
    expect(bundle.components[2].role).toBe("Heirloom Dupatta");
    expect(bundle.bundleDiscountPercent).toBe(10);
  });

  it("calculates accurate bundle pricing and savings", () => {
    const product = PRODUCTS[0];
    const bundle = getEnsembleForProduct(product);

    const totalRaw = bundle.components.reduce((sum, c) => sum + c.price, 0);
    expect(bundle.combinedOriginalPrice).toBe(totalRaw);

    const expectedSavings = Math.round(totalRaw * 0.1);
    expect(bundle.savingsAmount).toBe(expectedSavings);
    expect(bundle.bundlePrice).toBe(totalRaw - expectedSavings);
  });

  it("selects potli accessory for lehenga products", () => {
    const lehenga = PRODUCTS.find((p) => p.category === "lehengas");
    if (lehenga) {
      const bundle = getEnsembleForProduct(lehenga);
      expect(bundle.components[2].title).toContain("Potli");
    }
  });

  it("selects crimson blouse for red/maroon sarees", () => {
    const crimsonSaree = PRODUCTS.find(
      (p) => p.color.toLowerCase().includes("red") || p.title.toLowerCase().includes("crimson")
    );
    if (crimsonSaree) {
      const bundle = getEnsembleForProduct(crimsonSaree);
      expect(bundle.components[1].title).toContain("Crimson");
    }
  });
});
