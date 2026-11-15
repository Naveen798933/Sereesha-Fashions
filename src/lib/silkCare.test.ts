import { describe, it, expect } from "vitest";
import { SILK_CARE_PILLARS, calculateFoldSchedule, ATELIER_RESTORATION_SERVICES } from "./silkCare";

describe("Atelier Silk Care & Archival Preservation Engine", () => {
  it("provides 5 foundational silk care pillars", () => {
    expect(SILK_CARE_PILLARS.length).toBe(5);
    const muslin = SILK_CARE_PILLARS.find((p) => p.id === "muslin_storage");
    expect(muslin).toBeDefined();
    expect(muslin?.pillarNumber).toBe(1);
    expect(muslin?.importance).toBe("CRITICAL");
    expect(muslin?.dos.length).toBeGreaterThanOrEqual(2);
    expect(muslin?.donts.length).toBeGreaterThanOrEqual(2);
    expect(muslin?.scientificReason).toBeTruthy();
  });

  it("calculates 4-quarter rolling fold rotation schedule", () => {
    const baseDate = new Date("2026-01-01T00:00:00.000Z");
    const milestones = calculateFoldSchedule(baseDate);

    expect(milestones.length).toBe(4);
    expect(milestones[0].daysAfterPurchase).toBe(90);
    expect(milestones[1].daysAfterPurchase).toBe(180);
    expect(milestones[2].daysAfterPurchase).toBe(270);
    expect(milestones[3].daysAfterPurchase).toBe(360);

    expect(milestones[0].actionTitle).toContain("Quarter 1");
    expect(milestones[0].instructions).toContain("Aerate");
    expect(milestones[0].scheduledDate).toBeTruthy();
  });

  it("provides certified atelier restoration services", () => {
    expect(ATELIER_RESTORATION_SERVICES.length).toBeGreaterThanOrEqual(3);
    const zariPolish = ATELIER_RESTORATION_SERVICES.find((s) => s.id === "zari_polish");
    expect(zariPolish).toBeDefined();
    expect(zariPolish?.turnaroundTime).toBeTruthy();
    expect(zariPolish?.recommendedFor).toContain("Heirloom");
  });
});
