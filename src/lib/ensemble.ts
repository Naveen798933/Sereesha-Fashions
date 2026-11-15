/**
 * Sreesha Elegance — "Complete the Nizam Look" Ensemble Pairing Engine
 *
 * Dynamically pairs handloom sarees and lehengas with coordinated masterji blouses,
 * zari dupattas, and handcrafted royal accessories with 1-click bundle privileges.
 */

import { Product } from "@/data/products";

export interface EnsembleComponent {
  id: string;
  title: string;
  role: "Base Ensemble" | "Bespoke Blouse" | "Heirloom Dupatta" | "Zari Potli & Belt";
  price: number;
  originalPrice?: number;
  image: string;
  fabric: string;
  description: string;
  availableSizes?: string[];
  productRef?: Product;
}

export interface EnsembleBundle {
  id: string;
  name: string;
  tagline: string;
  mainProduct: Product;
  components: EnsembleComponent[];
  bundleDiscountPercent: number; // e.g. 10%
  combinedOriginalPrice: number;
  bundlePrice: number;
  savingsAmount: number;
}

// Curated Atelier Accessory Catalog for Ensemble Pairing
export const ATELIER_ENSEMBLE_PIECES: Record<string, Omit<EnsembleComponent, "id">> = {
  brocade_blouse_emerald: {
    title: "Masterji Raw Silk Brocade Blouse (Gold Zari Embroidery)",
    role: "Bespoke Blouse",
    price: 3800,
    originalPrice: 4500,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    fabric: "Pure Raw Silk with Maggam Hand-Embroidery",
    description: "Princess cut with sweetheart neckline and elbow-length zari borders.",
    availableSizes: ["34 (XS)", "36 (S)", "38 (M)", "40 (L)", "42 (XL)", "Custom Fit"],
  },
  brocade_blouse_crimson: {
    title: "Bridal Crimson Zardozi Blouse Piece & Tailoring",
    role: "Bespoke Blouse",
    price: 4200,
    originalPrice: 5000,
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    fabric: "Pure Katan Silk with Antique Gold Zari",
    description: "Deep back with handmade silk latkans and padded lining.",
    availableSizes: ["34 (XS)", "36 (S)", "38 (M)", "40 (L)", "42 (XL)", "Custom Fit"],
  },
  organza_tissue_dupatta: {
    title: "Royal Nizam Metallic Tissue Dupatta with Kiran Lace",
    role: "Heirloom Dupatta",
    price: 6500,
    originalPrice: 7800,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    fabric: "Pure Metallic Tissue Organza with Scalloped Zari Border",
    description: "2.5-meter featherlight sheer veil to drape over head or shoulder.",
  },
  royal_potli_pearls: {
    title: "Handcrafted Zardozi Potli Bag with Freshwater Seed Pearls",
    role: "Zari Potli & Belt",
    price: 2400,
    originalPrice: 2900,
    image:
      "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=800&q=80",
    fabric: "Raw Silk with Golden Zardozi Bullion Wire & Pearl Drops",
    description: "Traditional Hyderabadi drawstring pouch with braided dori.",
  },
  embroidered_waist_belt: {
    title: "Atelier Handcrafted Zari Kamarbandh / Vaddanam Belt",
    role: "Zari Potli & Belt",
    price: 2200,
    originalPrice: 2600,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    fabric: "Velvet Backed Gold Zari Ribbon with Adjustable Hook Closure",
    description: "Cinched waistband to lock front pleats firmly in place.",
  },
};

/**
 * Generate a curated "Complete the Nizam Look" ensemble for any catalog product.
 */
export function getEnsembleForProduct(product: Product): EnsembleBundle {
  const isRedCrimson =
    product.color.toLowerCase().includes("red") ||
    product.color.toLowerCase().includes("crimson") ||
    product.color.toLowerCase().includes("magenta") ||
    product.color.toLowerCase().includes("maroon");

  // 1. Base Component
  const baseComponent: EnsembleComponent = {
    id: `base-${product.id}`,
    title: product.title,
    role: "Base Ensemble",
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    image: product.primaryImage,
    fabric: product.fabric,
    description: `${product.details.origin} • ${product.weave}`,
    availableSizes: product.sizes,
    productRef: product,
  };

  // 2. Select Blouse Component
  const blouseTemplate = isRedCrimson
    ? ATELIER_ENSEMBLE_PIECES.brocade_blouse_crimson
    : ATELIER_ENSEMBLE_PIECES.brocade_blouse_emerald;

  const blouseComponent: EnsembleComponent = {
    ...blouseTemplate,
    id: `blouse-${product.id}`,
    // Mock product ref for cart storage
    productRef: {
      id: `SE-ACC-BL-${product.id}`,
      slug: `masterji-blouse-${product.slug}`,
      title: blouseTemplate.title,
      category: "contemporary",
      categoryLabel: "Bespoke Blouse",
      price: blouseTemplate.price,
      originalPrice: blouseTemplate.originalPrice,
      primaryImage: blouseTemplate.image,
      galleryImages: [blouseTemplate.image],
      rating: 5,
      reviewCount: 14,
      sizes: blouseTemplate.availableSizes || ["38 (M)"],
      fabric: blouseTemplate.fabric,
      weave: "Maggam Hand-Embroidery",
      color: "Gold / Coordinated",
      occasion: "Bridal",
      silkMarkCertified: true,
      blouseIncluded: false,
      shortDescription: blouseTemplate.description,
      description: blouseTemplate.description,
      details: {
        origin: "Hyderabad Atelier",
        washCare: "Dry Clean Only",
        dispatchTime: "Ships in 3-5 days",
        zariType: "Gold Zari",
      },
    },
  };

  // 3. Select Accessory / Dupatta Component
  const accessoryTemplate =
    product.category === "lehengas"
      ? ATELIER_ENSEMBLE_PIECES.royal_potli_pearls
      : ATELIER_ENSEMBLE_PIECES.organza_tissue_dupatta;

  const accessoryComponent: EnsembleComponent = {
    ...accessoryTemplate,
    id: `acc-${product.id}`,
    productRef: {
      id: `SE-ACC-DP-${product.id}`,
      slug: `ensemble-accessory-${product.slug}`,
      title: accessoryTemplate.title,
      category: "contemporary",
      categoryLabel: "Heirloom Accessory",
      price: accessoryTemplate.price,
      originalPrice: accessoryTemplate.originalPrice,
      primaryImage: accessoryTemplate.image,
      galleryImages: [accessoryTemplate.image],
      rating: 5,
      reviewCount: 9,
      sizes: ["Free Size"],
      fabric: accessoryTemplate.fabric,
      weave: "Zari Finished",
      color: "Champagne Gold",
      occasion: "Bridal / Festive",
      silkMarkCertified: false,
      blouseIncluded: false,
      shortDescription: accessoryTemplate.description,
      description: accessoryTemplate.description,
      details: {
        origin: "Hyderabad Atelier",
        washCare: "Dry Clean Only",
        dispatchTime: "Ships in 2-4 days",
        zariType: "Tested Zari",
      },
    },
  };

  const components = [baseComponent, blouseComponent, accessoryComponent];
  const combinedOriginalPrice = components.reduce((sum, c) => sum + c.price, 0);

  // 10% Bundle Privilege discount
  const bundleDiscountPercent = 10;
  const savingsAmount = Math.round((combinedOriginalPrice * bundleDiscountPercent) / 100);
  const bundlePrice = combinedOriginalPrice - savingsAmount;

  return {
    id: `bundle-${product.id}`,
    name: "Complete the Nizam Look",
    tagline: "Curated 3-Piece Atelier Bridal Ensemble",
    mainProduct: product,
    components,
    bundleDiscountPercent,
    combinedOriginalPrice,
    bundlePrice,
    savingsAmount,
  };
}
