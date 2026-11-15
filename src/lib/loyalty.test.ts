import { describe, it, expect } from "vitest";
import { ALL_LOYALTY_TIERS, getPatronTier, getPatronTierById, getTierProgress } from "./loyalty";

describe("Atelier Patron Loyalty & Privilege Engine", () => {
  it("defines all 3 luxury tiers in sequential order", () => {
    expect(ALL_LOYALTY_TIERS.length).toBe(3);
    expect(ALL_LOYALTY_TIERS[0].id).toBe("heritage");
    expect(ALL_LOYALTY_TIERS[1].id).toBe("royal_weaver");
    expect(ALL_LOYALTY_TIERS[2].id).toBe("zari_crown");
  });

  describe("getPatronTier()", () => {
    it("assigns Heritage tier for 0 spend", () => {
      const tier = getPatronTier(0);
      expect(tier.id).toBe("heritage");
      expect(tier.name).toBe("Heritage Patron");
      expect(tier.couponCode).toBe("WELCOME10");
    });

    it("assigns Heritage tier for spend below 50,000", () => {
      const tier = getPatronTier(49999);
      expect(tier.id).toBe("heritage");
    });

    it("assigns Royal Weaver Club tier at exactly 50,000", () => {
      const tier = getPatronTier(50000);
      expect(tier.id).toBe("royal_weaver");
      expect(tier.name).toBe("Royal Weaver Club");
      expect(tier.couponCode).toBe("ROYAL15");
    });

    it("assigns Royal Weaver Club tier for spend between 50,000 and 149,999", () => {
      const tier = getPatronTier(120000);
      expect(tier.id).toBe("royal_weaver");
    });

    it("assigns Zari Crown Solitaire VIP tier at exactly 150,000", () => {
      const tier = getPatronTier(150000);
      expect(tier.id).toBe("zari_crown");
      expect(tier.name).toBe("Zari Crown Solitaire VIP");
      expect(tier.couponCode).toBe("ROYAL20");
    });

    it("assigns Zari Crown Solitaire VIP tier for spend over 150,000", () => {
      const tier = getPatronTier(350000);
      expect(tier.id).toBe("zari_crown");
    });

    it("safely handles negative or invalid inputs", () => {
      expect(getPatronTier(-500).id).toBe("heritage");
      expect(getPatronTier(NaN).id).toBe("heritage");
    });
  });

  describe("getTierProgress()", () => {
    it("calculates progress for Heritage tier towards Royal Weaver", () => {
      const res = getTierProgress(25000);
      expect(res.currentTier.id).toBe("heritage");
      expect(res.nextTier?.id).toBe("royal_weaver");
      expect(res.progressPercent).toBe(50);
      expect(res.amountNeeded).toBe(25000);
      expect(res.lifetimeSpend).toBe(25000);
    });

    it("calculates progress for Royal Weaver tier towards Zari Crown", () => {
      const res = getTierProgress(100000); // halfway between 50k and 150k
      expect(res.currentTier.id).toBe("royal_weaver");
      expect(res.nextTier?.id).toBe("zari_crown");
      expect(res.progressPercent).toBe(50);
      expect(res.amountNeeded).toBe(50000);
    });

    it("reports 100% progress and null nextTier for Zari Crown Solitaire VIP", () => {
      const res = getTierProgress(200000);
      expect(res.currentTier.id).toBe("zari_crown");
      expect(res.nextTier).toBeNull();
      expect(res.progressPercent).toBe(100);
      expect(res.amountNeeded).toBe(0);
    });
  });

  describe("getPatronTierById()", () => {
    it("finds tier by valid id", () => {
      expect(getPatronTierById("royal_weaver").name).toBe("Royal Weaver Club");
      expect(getPatronTierById("zari_crown").badge).toBe("Emerald Solitaire");
    });

    it("defaults to Heritage tier on unknown id", () => {
      // @ts-expect-error Testing fallback for unknown id
      expect(getPatronTierById("unknown_tier").id).toBe("heritage");
    });
  });
});
