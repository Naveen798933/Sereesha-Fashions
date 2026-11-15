/**
 * Sreesha Elegance Atelier Patron Loyalty & Privilege Tier Engine
 *
 * Tier 1: Heritage Patron (< ₹50,000 spend)
 * Tier 2: Royal Weaver Club (₹50,000 - ₹1,49,999 spend)
 * Tier 3: Zari Crown Solitaire VIP (₹1,50,000+ spend)
 */

export type LoyaltyTierId = "heritage" | "royal_weaver" | "zari_crown";

export interface LoyaltyTier {
  id: LoyaltyTierId;
  name: string;
  badge: string;
  subtitle: string;
  minSpend: number;
  maxSpend: number | null;
  discountPercentage: number;
  couponCode: string;
  accentColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  perks: string[];
}

export const ALL_LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: "heritage",
    name: "Heritage Patron",
    badge: "Bronze Privilege",
    subtitle: "Atelier Welcome Tier",
    minSpend: 0,
    maxSpend: 49999,
    discountPercentage: 10,
    couponCode: "WELCOME10",
    accentColor: "#8C867D",
    bgClass: "bg-stone-100",
    textClass: "text-stone-700",
    borderClass: "border-stone-300",
    perks: [
      "10% Atelier Welcome Privilege on First Handloom (Code: WELCOME10)",
      "Silk Mark Certified 100% Pure Mulberry Silk Guarantee",
      "Complimentary Insured Express Delivery across India",
      "Atelier Care & Pure Silk Preservation Guide with every order",
      "Seasonal festive lookbook previews & curated drops",
    ],
  },
  {
    id: "royal_weaver",
    name: "Royal Weaver Club",
    badge: "Gold Privilege",
    subtitle: "Connoisseur of Handloom Art",
    minSpend: 50000,
    maxSpend: 149999,
    discountPercentage: 15,
    couponCode: "ROYAL15",
    accentColor: "#B79B63",
    bgClass: "bg-[#F7F3EB]",
    textClass: "text-[#B79B63]",
    borderClass: "border-[#B79B63]",
    perks: [
      "All Heritage Patron Privileges Included",
      "15% Royal Privilege Savings on orders over ₹15,000 (Code: ROYAL15)",
      "Complimentary Masterji Custom Blouse Measurement & Tailoring (1 saree/year)",
      "Priority Dispatch during high festive rush (Diwali, Sankranti & Wedding seasons)",
      "1-on-1 Virtual Video Saree Walkthrough with Master Stylist",
      "Surprise handcrafted pure silk potli accessory included",
    ],
  },
  {
    id: "zari_crown",
    name: "Zari Crown Solitaire VIP",
    badge: "Emerald Solitaire",
    subtitle: "Couture & Heirloom Collector",
    minSpend: 150000,
    maxSpend: null,
    discountPercentage: 20,
    couponCode: "ROYAL20",
    accentColor: "#2D6A4F",
    bgClass: "bg-[#2D6A4F]/10",
    textClass: "text-[#2D6A4F]",
    borderClass: "border-[#2D6A4F]",
    perks: [
      "All Royal Weaver Club Privileges Included",
      "20% Solitaire Privilege Savings on orders over ₹40,000 (Code: ROYAL20)",
      "Complimentary Fall, Pico, and Silk Tasseling on ALL sarees for life",
      "Dedicated Personal Bridal Stylist direct WhatsApp VIP hotline",
      "First 48-Hour Exclusive Private Preview before rare bridal loom releases",
      "Private Atelier VIP Salon Suite booking with bespoke hospitality in Kukatpally",
      "Heirloom gold-stamped velvet storage chest with pure zari sarees",
    ],
  },
];

/**
 * Get tier by identifier
 */
export function getPatronTierById(id: LoyaltyTierId): LoyaltyTier {
  const found = ALL_LOYALTY_TIERS.find((t) => t.id === id);
  return found || ALL_LOYALTY_TIERS[0];
}

/**
 * Determine patron tier based on lifetime net spend in INR
 */
export function getPatronTier(spend: number): LoyaltyTier {
  const cleanSpend = Math.max(0, Number(spend) || 0);

  if (cleanSpend >= 150000) {
    return ALL_LOYALTY_TIERS[2]; // zari_crown
  }
  if (cleanSpend >= 50000) {
    return ALL_LOYALTY_TIERS[1]; // royal_weaver
  }
  return ALL_LOYALTY_TIERS[0]; // heritage
}

export interface TierProgressResult {
  currentTier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  progressPercent: number;
  amountNeeded: number;
  lifetimeSpend: number;
}

/**
 * Calculate progress percentage and remaining spend required to achieve the next tier
 */
export function getTierProgress(spend: number): TierProgressResult {
  const cleanSpend = Math.max(0, Number(spend) || 0);
  const currentTier = getPatronTier(cleanSpend);

  if (currentTier.id === "zari_crown") {
    return {
      currentTier,
      nextTier: null,
      progressPercent: 100,
      amountNeeded: 0,
      lifetimeSpend: cleanSpend,
    };
  }

  if (currentTier.id === "royal_weaver") {
    const nextTier = ALL_LOYALTY_TIERS[2];
    const threshold = nextTier.minSpend; // 150000
    const start = currentTier.minSpend; // 50000
    const span = threshold - start; // 100000
    const currentSpanSpend = cleanSpend - start;
    const progressPercent = Math.min(100, Math.max(0, Math.round((currentSpanSpend / span) * 100)));
    const amountNeeded = Math.max(0, threshold - cleanSpend);

    return {
      currentTier,
      nextTier,
      progressPercent,
      amountNeeded,
      lifetimeSpend: cleanSpend,
    };
  }

  // heritage tier
  const nextTier = ALL_LOYALTY_TIERS[1];
  const threshold = nextTier.minSpend; // 50000
  const progressPercent = Math.min(100, Math.max(0, Math.round((cleanSpend / threshold) * 100)));
  const amountNeeded = Math.max(0, threshold - cleanSpend);

  return {
    currentTier,
    nextTier,
    progressPercent,
    amountNeeded,
    lifetimeSpend: cleanSpend,
  };
}
