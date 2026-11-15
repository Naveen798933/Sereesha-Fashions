import { describe, it, expect } from "vitest";
import { DRAPE_STYLES, calculatePleats } from "./drapeGuide";

describe("Atelier Saree Drape Guide Engine", () => {
  it("provides comprehensive iconic drape styles", () => {
    expect(DRAPE_STYLES.length).toBeGreaterThanOrEqual(5);
    const nivi = DRAPE_STYLES.find((d) => d.id === "nivi_royal");
    expect(nivi).toBeDefined();
    expect(nivi?.originRegion).toContain("Andhra");
    expect(nivi?.steps.length).toBeGreaterThanOrEqual(4);
  });

  it("calculates pleats accurately for heavy Kanchipuram silk", () => {
    const result = calculatePleats("heavy_kanchipuram", 65);
    expect(result.recommendedPleatCount).toBe(7);
    expect(result.pleatWidthInches).toBe(5.5);
    expect(result.recommendedPetticoat).toContain("Shapewear");
  });

  it("adjusts pleat count for taller patrons on heavy silk", () => {
    const tallResult = calculatePleats("heavy_kanchipuram", 68);
    expect(tallResult.recommendedPleatCount).toBe(8);
  });

  it("calculates pleats accurately for lightweight organza", () => {
    const organzaResult = calculatePleats("light_organza", 64);
    expect(organzaResult.recommendedPleatCount).toBe(5);
    expect(organzaResult.pinCount).toBe(4);
    expect(organzaResult.proAdvice).toContain("Organza");
  });

  it("ensures each drape style has jewellery pairing and pro tips", () => {
    DRAPE_STYLES.forEach((style) => {
      expect(style.jewelleryPairing.length).toBeGreaterThan(0);
      expect(style.proTips.length).toBeGreaterThan(0);
      expect(style.recommendedCategoryLink).toBeDefined();
    });
  });
});
