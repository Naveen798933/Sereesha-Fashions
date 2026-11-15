/**
 * Sreesha Elegance — Atelier Bridal Trousseau Moodboard & Ceremony Palette Engine
 *
 * Supports multi-day Indian & South Indian royal bridal ceremonies,
 * ceremony-to-weave curation, progressive color harmony, and trousseau bundle privileges.
 */

import { PRODUCTS, Product } from "@/data/products";

export interface ColorSwatch {
  name: string;
  hex: string;
  meaning: string;
}

export interface WeddingCeremony {
  id: string;
  order: number;
  name: string;
  teluguName: string;
  timeOfDay: "Morning / Day" | "Twilight / Sunset" | "Evening / Gala";
  significance: string;
  drapeStyle: string;
  recommendedWeaves: string[];
  palette: ColorSwatch[];
  suggestedProductIds: string[];
}

export const WEDDING_CEREMONIES: WeddingCeremony[] = [
  {
    id: "pellikuthuru_haldi",
    order: 1,
    name: "Pellikuthuru & Haldi Snanam",
    teluguName: "పెళ్లికూతురు / మంగళస్నానం",
    timeOfDay: "Morning / Day",
    significance:
      "The sacred turmeric ceremony sanctifying the bride with floral baths, raw silk hues, and joyful family songs.",
    drapeStyle:
      "Bespoke Classic Pleated with Flowing Pallu for easy movement and floral mangalsutra adornment.",
    recommendedWeaves: ["Raw Silk", "Chanderi Brocade", "Kanchipuram Tissue", "Gadwal Silk"],
    palette: [
      {
        name: "Kalyana Pasupu (Auspicious Turmeric)",
        hex: "#E5A93B",
        meaning: "Purity & New Dawn",
      },
      { name: "Marigold Ochre", hex: "#D97706", meaning: "Joy & Fertility" },
      { name: "Raw Honey Gold", hex: "#CA8A04", meaning: "Sweet Beginnings" },
      { name: "Temple Sindoor Accent", hex: "#B91C1C", meaning: "Divine Blessings" },
    ],
    suggestedProductIds: ["saree-04", "saree-05", "saree-13", "kurti-04"],
  },
  {
    id: "mehendi_sangeet",
    order: 2,
    name: "Mehendi & Sangeet Soirée",
    teluguName: "మెహందీ & సంగీత్",
    timeOfDay: "Twilight / Sunset",
    significance:
      "An exhilarating evening of classical rhythm, intricate henna artwork, and shimmering jewels under celebratory chandeliers.",
    drapeStyle: "Contemporary Pre-Pleated or Flared Lehenga Silhouette for graceful dancing.",
    recommendedWeaves: [
      "Georgette Brocade",
      "Organza Silk",
      "Bespoke Silk Lehengas",
      "Banarasi Crepe",
    ],
    palette: [
      { name: "Mayil (Peacock Teal)", hex: "#0F766E", meaning: "Grace & Prosperity" },
      { name: "Kasturi Mint", hex: "#059669", meaning: "Rejuvenation & Fresh Love" },
      { name: "Champagne Zari", hex: "#B79B63", meaning: "Nizam Opulence" },
      { name: "Blush Gulab", hex: "#DB2777", meaning: "Romantic Bloom" },
    ],
    suggestedProductIds: ["lehenga-01", "lehenga-04", "saree-01", "saree-07"],
  },
  {
    id: "subha_muhurtham",
    order: 3,
    name: "Subha Muhurtham (The Royal Wedding)",
    teluguName: "శుభ ముహూర్తం",
    timeOfDay: "Morning / Day",
    significance:
      "The paramount auspicious moment when Jeelakarra-Bellam and Mangalsutra are tied amidst sacred Vedic chants.",
    drapeStyle:
      "Authentic South Indian Nivi Drape pinned with ancestral Kamarbandh / Vaddanam and dual-pallu pleats.",
    recommendedWeaves: [
      "Authentic Kanchipuram Korvai",
      "Pure Silver Tested Zari Silk",
      "Heavy Bridal Brocade",
    ],
    palette: [
      { name: "Sacred Kumkum Crimson", hex: "#991B1B", meaning: "Eternal Marital Bond" },
      { name: "Nizam Royal Sindoor", hex: "#7F1D1D", meaning: "Strength & Devotion" },
      { name: "24K Tested Gold Zari", hex: "#D4AF37", meaning: "Royal Sovereign Wealth" },
      { name: "Auspicious Coral Orange", hex: "#C2410C", meaning: "Sacred Agni Fire" },
    ],
    suggestedProductIds: ["saree-02", "saree-03", "saree-06", "saree-10"],
  },
  {
    id: "royal_reception",
    order: 4,
    name: "Royal Reception & Darbar Feast",
    teluguName: "రాయల్ రిసెప్షన్",
    timeOfDay: "Evening / Gala",
    significance:
      "A grand imperial gala receiving dignitaries and family with show-stopping high-luxury handlooms and diamond jewels.",
    drapeStyle: "Glamorous Open Floating Pallu or Structured Regal Gown Drape with sweeping train.",
    recommendedWeaves: [
      "Pure Paithani Silk",
      "Tissue Kanchipuram",
      "Embossed Velvet Lehenga",
      "Banarasi Jamawar",
    ],
    palette: [
      { name: "Nizam Royal Emerald", hex: "#1B4D3E", meaning: "Princely Prestige" },
      { name: "Midnight Jamawar Plum", hex: "#4A044E", meaning: "Sovereign Elegance" },
      { name: "Imperial Burgundy", hex: "#581C87", meaning: "Timeless Majesty" },
      { name: "Platinum Champagne Silver", hex: "#94A3B8", meaning: "Modern Starlight" },
    ],
    suggestedProductIds: ["saree-01", "saree-11", "lehenga-02", "lehenga-03"],
  },
  {
    id: "vratham_satyanarayana",
    order: 5,
    name: "Satyanarayana Vratham & Post-Wedding Pooja",
    teluguName: "శ్రీ సత్యనారాయణ వ్రతం / గృహప్రవేశం",
    timeOfDay: "Morning / Day",
    significance:
      "The divine invocation of Lord Satyanarayana and welcoming of Lakshmi into the newly established household.",
    drapeStyle:
      "Devotional Traditional Drape with pleated pallu secured cleanly for holy fire rituals.",
    recommendedWeaves: [
      "Gadwal Handloom",
      "Pochampally Ikat Silk",
      "Narayanpet Cotton-Silk",
      "Kanchipuram Border",
    ],
    palette: [
      { name: "Kamalam Lotus Pink", hex: "#BE185D", meaning: "Goddess Lakshmi Grace" },
      { name: "Veda Sandalwood Ivory", hex: "#FAF7F2", meaning: "Serenity & Truth" },
      { name: "Gangajalam Blue", hex: "#1D4ED8", meaning: "Spiritual Calm" },
      { name: "Haridra Yellow Border", hex: "#EAB308", meaning: "Prosperity" },
    ],
    suggestedProductIds: ["saree-08", "saree-09", "saree-14", "saree-17"],
  },
];

export interface TrousseauItemSelection {
  ceremonyId: string;
  productId: string;
  customNotes?: string;
}

export interface TrousseauPrivilege {
  ceremoniesCount: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  finalTotal: number;
  couponCode: string;
  privilegeTier: "Standard" | "Trousseau Luxe (12%)" | "Royal Nizam Grand Trousseau (15%)";
  complimentaryGifts: string[];
}

/**
 * Calculates progressive multi-ceremony trousseau bundle privileges.
 * 3+ ceremonies: 12% privilege.
 * 5 full rituals: 15% royal grand trousseau privilege + archival kit.
 */
export function calculateTrousseauPrivilege(selectedProducts: Product[]): TrousseauPrivilege {
  const count = selectedProducts.length;
  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  let discountPercentage = 0;
  let couponCode = "";
  let privilegeTier: TrousseauPrivilege["privilegeTier"] = "Standard";
  const complimentaryGifts: string[] = [];

  if (count >= 5) {
    discountPercentage = 15;
    couponCode = "ROYALTROUSSEAU15";
    privilegeTier = "Royal Nizam Grand Trousseau (15%)";
    complimentaryGifts.push(
      "Complimentary Atelier Heirloom Muslin Storage Trunk (Worth ₹4,500)",
      "Dedicated Sreesha Master Stylist for in-person wedding day drape support",
      "Complimentary Hydrocarbon Dry Cleaning Voucher for Muhurtham Saree"
    );
  } else if (count >= 3) {
    discountPercentage = 12;
    couponCode = "TROUSSEAU12";
    privilegeTier = "Trousseau Luxe (12%)";
    complimentaryGifts.push(
      "Complimentary Unbleached Muslin Saree Storage Pouch for each piece",
      "Priority Kukatpally Atelier Blouse Tailoring Consultation"
    );
  } else if (count >= 2) {
    discountPercentage = 5;
    couponCode = "TROUSSEAU5";
    privilegeTier = "Standard";
    complimentaryGifts.push("Signature Sreesha Elegance Scented Wardrobe Sachet");
  }

  const discountAmount = Math.round((subtotal * discountPercentage) / 100);
  const finalTotal = subtotal - discountAmount;

  return {
    ceremoniesCount: count,
    subtotal,
    discountPercentage,
    discountAmount,
    finalTotal,
    couponCode,
    privilegeTier,
    complimentaryGifts,
  };
}

/**
 * Helper to fetch full Product object by ID with fallback.
 */
export function getProductForCeremony(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

/**
 * Returns all potential candidate products suitable for a specific ceremony.
 */
export function getAvailableProductsForCeremony(ceremony: WeddingCeremony): Product[] {
  // Primary: items explicitly listed in suggestedProductIds
  const suggested = PRODUCTS.filter((p) => ceremony.suggestedProductIds.includes(p.id));

  // Secondary: items matching weave or occasion
  const related = PRODUCTS.filter(
    (p) =>
      !ceremony.suggestedProductIds.includes(p.id) &&
      (ceremony.recommendedWeaves.some((w) => p.weave.toLowerCase().includes(w.toLowerCase())) ||
        (p.occasion && p.occasion.toLowerCase().includes("bridal")) ||
        (p.occasion && p.occasion.toLowerCase().includes("wedding")))
  );

  return [...suggested, ...related].slice(0, 10);
}
