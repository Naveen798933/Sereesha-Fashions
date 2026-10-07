export interface Product {
  id: string;
  slug: string;
  title: string;
  category: "sarees" | "lehengas" | "kurtis" | "contemporary";
  categoryLabel: string;
  collection?: string;
  price: number; // in INR
  originalPrice?: number;
  primaryImage: string;
  galleryImages: string[];
  badge?: "NEW" | "BESTSELLER" | "SALE" | "LIMITED";
  rating: number;
  reviewCount: number;
  sizes: string[];
  fabric: string;
  weave: string;
  color: string;
  occasion: string;
  silkMarkCertified: boolean;
  blouseIncluded: boolean;
  shortDescription: string;
  description: string;
  details: {
    origin: string;
    zariType: string;
    sareeLength?: string;
    blouseLength?: string;
    washCare: string;
    dispatchTime: string;
  };
}

export const PRODUCTS: Product[] = [
  // ─── SAREES ──────────────────────────────────────────────────────────────────
  {
    id: "saree-01",
    slug: "kanchipuram-pure-silk-saree-emerald",
    title: "Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari",
    category: "sarees",
    categoryLabel: "Kanchipuram Silk",
    collection: "Royal Nizam Edit",
    price: 18500,
    originalPrice: 24000,
    primaryImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 38,
    sizes: [
      "Unstitched Blouse",
      "Stitched Blouse (34)",
      "Stitched Blouse (36)",
      "Stitched Blouse (38)",
      "Stitched Blouse (40)",
    ],
    fabric: "100% Pure Mulberry Silk",
    weave: "Korvai Handloom",
    color: "Emerald Green",
    occasion: "Bridal / Reception / Festive",
    silkMarkCertified: true,
    blouseIncluded: true,
    shortDescription:
      "Handwoven in temple town Kanchipuram using heritage Korvai techniques, adorned with intricate floral and peacock motifs in certified pure gold zari.",
    description:
      "A masterpiece of South Indian handloom heritage. This heirloom Kanchipuram saree boasts an opulent emerald green body paired with contrasting crimson borders laden with pure gold zari threadwork. Each border is interlocked using the ancient Korvai technique by master weavers.",
    details: {
      origin: "Kanchipuram, Tamil Nadu / Finished at Hyderabad Atelier",
      zariType: "Certified Pure Silver Electroplated Gold Zari",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meter matching unstitched blouse piece",
      washCare: "Strictly Dry Clean Only. Store in breathable muslin cotton cloth.",
      dispatchTime: "Ships in 24-48 hours. Bespoke blouse stitching takes 4-6 business days.",
    },
  },
  {
    id: "saree-02",
    slug: "banarasi-kadhwa-silk-ivory-rose",
    title: "Banarasi Kadhwa Brocade Saree — Ivory Cream & Rose Gold",
    category: "sarees",
    categoryLabel: "Banarasi Silk",
    collection: "Royal Nizam Edit",
    price: 14200,
    originalPrice: 17500,
    primaryImage:
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "LIMITED",
    rating: 4.8,
    reviewCount: 22,
    sizes: ["Unstitched Blouse", "Stitched Blouse (36)", "Stitched Blouse (38)"],
    fabric: "Katan Pure Silk",
    weave: "Handloom Kadhwa Technique",
    color: "Ivory Cream",
    occasion: "Sangeet / Festive / Cocktail",
    silkMarkCertified: true,
    blouseIncluded: true,
    shortDescription:
      "Opulent ivory Katan silk handcrafted with traditional Kadhwa bootis in subtle rose-gold zari, finished with scalloped border detailing.",
    description:
      "An epitome of Varanasi’s historic weaving mastery. The delicate Kadhwa technique leaves zero loose threads on the reverse, ensuring featherlight drape and majestic sheen. Perfect for morning pheras or intimate palace receptions.",
    details: {
      origin: "Varanasi, Uttar Pradesh",
      zariType: "Fine Rose Gold Tested Zari",
      sareeLength: "5.5 meters",
      blouseLength: "0.85 meter brocade blouse piece",
      washCare: "Dry Clean Only",
      dispatchTime: "Ships in 24 hours",
    },
  },
  {
    id: "saree-03",
    slug: "paithani-silk-saree-royal-purple",
    title: "Pure Paithani Silk Saree — Royal Purple & Peacock Pallu",
    category: "sarees",
    categoryLabel: "Paithani Silk",
    collection: "Heritage Weaves",
    price: 22000,
    originalPrice: 28000,
    primaryImage:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "NEW",
    rating: 5.0,
    reviewCount: 14,
    sizes: ["Unstitched Blouse", "Custom Tailored"],
    fabric: "Pure Mulberry Silk",
    weave: "Tapestry Handloom Weave",
    color: "Royal Purple",
    occasion: "Weddings / Festive Pheras",
    silkMarkCertified: true,
    blouseIncluded: true,
    shortDescription:
      "Handcrafted with iconic kaleidoscope peacock motifs (Mor Bangadi) on a shimmering royal purple pure silk drape.",
    description:
      "Preserving the royal tradition of Maharashtra and Deccan royalty. Featuring kaleidoscopic tapestry borders and an opulent golden pallu hand-embroidered with signature multi-colored peacock threads.",
    details: {
      origin: "Yeola, Maharashtra",
      zariType: "Pure Golden Zari",
      sareeLength: "5.5 meters",
      blouseLength: "0.8 meter matching silk blouse",
      washCare: "Dry Clean Only",
      dispatchTime: "Ships in 48 hours",
    },
  },

  // ─── LEHENGAS ────────────────────────────────────────────────────────────────
  {
    id: "lehenga-01",
    slug: "royal-nizam-bridal-lehenga-crimson",
    title: "Royal Nizam Bridal Lehenga — Crimson Velvet & Zardozi",
    category: "lehengas",
    categoryLabel: "Bridal Lehenga",
    collection: "Royal Nizam Edit",
    price: 65000,
    originalPrice: 82000,
    primaryImage:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "NEW",
    rating: 5.0,
    reviewCount: 19,
    sizes: ["Bespoke Made-to-Measure", "Size S (34)", "Size M (36)", "Size L (38)", "Size XL (40)"],
    fabric: "Micro Velvet & Organza Silk",
    weave: "Handcrafted Zardozi & Dabka",
    color: "Royal Crimson Red",
    occasion: "Bridal Vows / Wedding Night",
    silkMarkCertified: true,
    blouseIncluded: true,
    shortDescription:
      "Hand-embroidered by Hyderabad’s master karigars with antique zardozi, real seed pearls, and dabka work, accompanied by double organza dupattas.",
    description:
      "An ensemble fit for a queen. Handcrafted over 320 man-hours in our Banjara Hills atelier, this bridal lehenga features a flared 16-kali silhouette adorned with heritage Hyderabadi jali patterns, paired with a sweetheart neck blouse and double ceremonial dupattas.",
    details: {
      origin: "Handcrafted in Hyderabad, Telangana",
      zariType: "Antique Dull Gold & Zardozi Wire",
      washCare: "Specialist Luxury Dry Clean Only",
      dispatchTime: "Bespoke dispatch in 10-14 days. Express alterations available.",
    },
  },
  {
    id: "lehenga-02",
    slug: "champagne-mirrorwork-festive-lehenga",
    title: "Champagne Gold Mirrorwork Lehenga — Silk Georgette",
    category: "lehengas",
    categoryLabel: "Festive Lehenga",
    collection: "Contemporary Glamour",
    price: 38000,
    originalPrice: 45000,
    primaryImage:
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "BESTSELLER",
    rating: 4.9,
    reviewCount: 26,
    sizes: ["Size S (34)", "Size M (36)", "Size L (38)"],
    fabric: "Pure Viscose Silk Georgette",
    weave: "Cutdana & Real Mirrorwork",
    color: "Champagne Gold",
    occasion: "Sangeet / Cocktail / Reception",
    silkMarkCertified: false,
    blouseIncluded: true,
    shortDescription:
      "Twirl-ready champagne gold lehenga glittering with intricate glass mirrors, resham thread accents, and a scalloped dupatta.",
    description:
      "Crafted for modern brides and bridesmaid royalty. The mirrorwork catches the ambient night lights effortlessly while remaining lightweight and comfortable for hours of dancing.",
    details: {
      origin: "Hyderabad Atelier",
      zariType: "Silver Resham & Hand-cut Mirrors",
      washCare: "Dry Clean Only",
      dispatchTime: "Ships in 3-5 business days",
    },
  },

  // ─── KURTIS & SETS ───────────────────────────────────────────────────────────
  {
    id: "kurti-01",
    slug: "anarkali-suit-set-midnight-blue",
    title: "Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti",
    category: "kurtis",
    categoryLabel: "Designer Anarkali",
    collection: "Festive Prêt",
    price: 8900,
    originalPrice: 11500,
    primaryImage:
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "SALE",
    rating: 4.7,
    reviewCount: 42,
    sizes: ["XS (32)", "S (34)", "M (36)", "L (38)", "XL (40)", "XXL (42)"],
    fabric: "Handwoven Chanderi Silk",
    weave: "Handcrafted Gota Patti & Mukaish",
    color: "Midnight Blue",
    occasion: "Diwali / Festive Puja / Mehendi",
    silkMarkCertified: false,
    blouseIncluded: false,
    shortDescription:
      "A flowy 3-piece Chanderi silk Anarkali set featuring artisanal Rajasthani gota patti borders, churidar pants, and a tissue organza dupatta.",
    description:
      "Elegance in motion. Cut from breezy Chanderi silk with a comfortable mulmul lining, this Anarkali is adorned with hand-stitched gota patti ribbons along the neck and hemline.",
    details: {
      origin: "Banjara Hills Boutique Workshop",
      zariType: "Lappa Gota Lace",
      washCare: "Dry Clean Recommended or Gentle Handwash",
      dispatchTime: "Ships in 24 hours",
    },
  },
  {
    id: "kurti-02",
    slug: "chikankari-straight-kurta-set-powder-peach",
    title: "Lucknowi Mukaish Kurta Set — Powder Peach Modal Silk",
    category: "kurtis",
    categoryLabel: "Kurta & Palazzo Set",
    collection: "Boutique Daywear",
    price: 6400,
    originalPrice: 7800,
    primaryImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "NEW",
    rating: 4.9,
    reviewCount: 18,
    sizes: ["S (34)", "M (36)", "L (38)", "XL (40)"],
    fabric: "Pure Modal Silk",
    weave: "Authentic Hand-Chikankari",
    color: "Powder Peach",
    occasion: "Day Festive / Family Celebrations",
    silkMarkCertified: false,
    blouseIncluded: false,
    shortDescription:
      "Intricate hand-embroidered shadow work and mukaish metallic sequins on ultra-soft breathable modal silk with matching straight trousers.",
    description:
      "A soothing palette for daytime elegance. Hand-stitched by skilled women artisans with bakhiya, phanda, and keelkangan needlework, accompanied by a coordinating soft chanderi dupatta.",
    details: {
      origin: "Lucknow & Hyderabad Collaboration",
      zariType: "Mukaish Silver Dots",
      washCare: "Gentle Hand Wash with Mild Liquid Detergent",
      dispatchTime: "Ships in 24 hours",
    },
  },

  // ─── CONTEMPORARY ────────────────────────────────────────────────────────────
  {
    id: "contemporary-01",
    slug: "draped-saree-gown-emerald-velvet",
    title: "Ready-to-Wear Draped Saree Gown — Olive & Metallic Gold",
    category: "contemporary",
    categoryLabel: "Indo-Western Couture",
    collection: "Modern Nizam Edit",
    price: 24500,
    originalPrice: 29000,
    primaryImage:
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "BESTSELLER",
    rating: 4.8,
    reviewCount: 31,
    sizes: ["XS (32)", "S (34)", "M (36)", "L (38)"],
    fabric: "Stretch Satin Crepe & Organza",
    weave: "Pleated Draping & Cutdana Corset",
    color: "Olive Gold",
    occasion: "Sangeet / Red Carpet / Reception",
    silkMarkCertified: false,
    blouseIncluded: true,
    shortDescription:
      "Pre-stitched ready-to-wear draped saree with a structured pearl-encrusted corset bodice. Slip into royal elegance in under 60 seconds.",
    description:
      "No pins, no pleating stress. Designed for the globetrotting Indian woman who values heritage aesthetics without compromising modern convenience.",
    details: {
      origin: "Hyderabad Boutique Atelier",
      zariType: "Cutdana & Crystal Wire",
      washCare: "Dry Clean Only",
      dispatchTime: "Ships in 48 hours",
    },
  },
  {
    id: "contemporary-02",
    slug: "cape-jacket-sharara-set-garnet",
    title: "Embroidered Cape & Sharara Set — Garnet Rose Silk",
    category: "contemporary",
    categoryLabel: "Sharara & Cape Ensemble",
    collection: "Modern Nizam Edit",
    price: 19800,
    originalPrice: 23500,
    primaryImage:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    galleryImages: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85",
    ],
    badge: "NEW",
    rating: 4.9,
    reviewCount: 16,
    sizes: ["S (34)", "M (36)", "L (38)", "XL (40)"],
    fabric: "Raw Silk & Soft Tulle",
    weave: "Zari Resham & Pearl Embroidery",
    color: "Garnet Rose",
    occasion: "Cocktails / Destination Weddings",
    silkMarkCertified: false,
    blouseIncluded: true,
    shortDescription:
      "Flared tiered sharara pants paired with an embroidered bustier and a dramatic floor-sweeping sheer cape.",
    description:
      "Make an unforgettable entrance. The cape floats gracefully as you walk, embellished along the hemline with heritage Hyderabadi border embroidery.",
    details: {
      origin: "Hyderabad Atelier",
      zariType: "Rose Gold Zari Threads",
      washCare: "Dry Clean Only",
      dispatchTime: "Ships in 3 business days",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}
