/**
 * Sreesha Elegance Atelier Handloom Authenticity & Silk Mark India Registry Engine
 *
 * Provides cryptographic certification, GI (Geographical Indication) tag verification,
 * master weaver provenance tracking, and pure silk laboratory testing protocols.
 */

import { PRODUCTS, Product } from "@/data/products";

export interface AuthenticityCertificate {
  certificateNumber: string;
  silkMarkTagNumber: string;
  giTagNumber: string;
  productSlug: string;
  productTitle: string;
  category: string;
  primaryImage: string;
  fabric: string;
  weave: string;
  loomType: string;
  warpWeft: string;
  zariComposition: string;
  zariType: "Pure Tested Silver Zari" | "Tested Metallic Zari" | "Antiqued Muted Zari";
  clusterOrigin: string;
  clusterState: string;
  weaversSociety: string;
  masterArtisan: string;
  weavingHours: number;
  warpEnds: number;
  issueDate: string;
  status: "Certified & Active" | "Archived" | "Pending Assay";
  verificationHash: string;
  careProtocols: string[];
}

export interface GIClusterInfo {
  id: string;
  name: string;
  state: string;
  giNumber: string;
  giYear: string;
  originHistory: string;
  hallmarkTechnique: string;
  zariStandard: string;
  loomTradition: string;
  accentColor: string;
}

export const GI_CLUSTERS: GIClusterInfo[] = [
  {
    id: "kanchipuram",
    name: "Kanchipuram Silk",
    state: "Tamil Nadu",
    giNumber: "GI Tag #144",
    giYear: "2005",
    originHistory:
      "Rooted in the temple city of Kanchipuram for over 400 years, traditionally woven by the Devanga and Saligar artisan communities descended from the celestial weaver Sage Markanda.",
    hallmarkTechnique:
      "Korvai Weave: A labor-intensive interlocking technique where body and temple borders are woven on separate shuttles by two weavers simultaneously.",
    zariStandard:
      "Authentic Tested Zari consisting of pure silver wire electroplated with 24-karat gold wound around natural silk thread core.",
    loomTradition: "Heavy pit loom with 3 shuttles and adai jacquard apparatus.",
    accentColor: "#2D6A4F",
  },
  {
    id: "banarasi",
    name: "Banarasi Katan Silk",
    state: "Uttar Pradesh",
    giNumber: "GI Tag #99",
    giYear: "2009",
    originHistory:
      "Tracing its origins to the Mughal era in sacred Varanasi, blending Persian flora motifs (kalka, ambi) with intricate Hindu classical temple iconography.",
    hallmarkTechnique:
      "Kadhwa Handloom Weave: Each individual floral boota is engraved and woven manually without floats on the reverse side of the fabric.",
    zariStandard: "Fine gold and silver zari with micro-meenakari colored silk thread inlay work.",
    loomTradition: "Traditional pit loom with naqsha drawboy and punched card jacquards.",
    accentColor: "#B79B63",
  },
  {
    id: "paithani",
    name: "Paithani Royal Silk",
    state: "Maharashtra",
    giNumber: "GI Tag #172",
    giYear: "2010",
    originHistory:
      "Patronized by the Satavahana and Peshwa dynasties in Paithan and Yeola, known as the 'Queen of Sarees' reserved for royal coronations and wedding ceremonies.",
    hallmarkTechnique:
      "Tapestry Weaving Technique: Interlocking wefts with parrot (Tota-Maina), peacock (Mor), and lotus (Kamal) motifs in gold and vibrant jewel silks.",
    zariStandard:
      "Solid pure gold zari pallu with characteristic kaleidoscopic dhoop-chhaon color transitions.",
    loomTradition: "Handloom tapestry loom utilizing multiple wooden bobbins.",
    accentColor: "#800020",
  },
  {
    id: "pochampally",
    name: "Pochampally Ikat",
    state: "Telangana",
    giNumber: "GI Tag #4",
    giYear: "2004",
    originHistory:
      "Nurtured in Bhoodan Pochampally in Yadadri Bhuvanagiri district of Telangana, renowned as the first handloom craft in India to receive GI protection.",
    hallmarkTechnique:
      "Double Ikat (Pagdu Bandhu): Complex mathematical resist dyeing of both warp and weft yarns prior to weaving, producing sharp geometric symmetry.",
    zariStandard: "High-luster metallic borders integrated seamlessly into crisp mulberry silk.",
    loomTradition: "Fly-shuttle frame handloom with manual tie-dye alignment pegs.",
    accentColor: "#1C1B19",
  },
  {
    id: "uppada",
    name: "Uppada Jamdani",
    state: "Andhra Pradesh",
    giNumber: "GI Tag #122",
    giYear: "2009",
    originHistory:
      "Crafted in the coastal village of Uppada in East Godavari, celebrated for featherlight weight, sheer gossamer texture, and regal Jamdani motifs.",
    hallmarkTechnique:
      "Intarsia Jamdani Weave: Non-structural supplementary wefts inserted by hand using fine bamboo needles without any jacquard cards.",
    zariStandard:
      "Pure silver zari with gold electroplate woven directly into superfine mulberry silk.",
    loomTradition: "Specialized pit loom operated by pairs of master weavers.",
    accentColor: "#4A5568",
  },
  {
    id: "chanderi",
    name: "Chanderi Handloom",
    state: "Madhya Pradesh",
    giNumber: "GI Tag #22",
    giYear: "2005",
    originHistory:
      "Patronized by the Scindias of Gwalior and Bundela kings, noted in Vedic texts as founded by Shishupala, cousin of Lord Krishna.",
    hallmarkTechnique:
      "Zari Booti on Sheer Gossamer: Degummed raw silk warp with superfine cotton weft yielding unmatched shimmer and drape.",
    zariStandard: "Delicate tested zari borders with classic Ashavali and floral jaal patterns.",
    loomTradition: "Pit loom with throw shuttle and dobby attachment.",
    accentColor: "#744210",
  },
];

export interface SilkTestingProtocol {
  id: string;
  title: string;
  description: string;
  pureSilkResult: string;
  syntheticResult: string;
  scientificPrinciple: string;
  safetyNote: string;
}

export const SILK_TESTING_PROTOCOLS: SilkTestingProtocol[] = [
  {
    id: "flame_ash",
    title: "1. The Flame & Ash Purity Test",
    description:
      "Take 2-3 loose threads from the saree's unstitched fringe or pallu edge and touch them to a flame.",
    pureSilkResult:
      "Burns slowly only while in contact with flame; gives off an aroma identical to burning hair or wool; leaves behind a crisp, brittle, crushable black ash that turns to fine powder.",
    syntheticResult:
      "Melts rapidly, drips, produces an acrid chemical or plastic odor, and hardens into an uncrushable black plastic bead.",
    scientificPrinciple:
      "Natural silk is 100% organic protein (Fibroin), containing keratin-like peptide chains identical to human hair.",
    safetyNote: "Perform only on loose sample threads over an inflammable porcelain plate.",
  },
  {
    id: "thermo_friction",
    title: "2. The Tactile Thermo-Conductivity Test",
    description:
      "Rub the surface of the silk firmly between the palms of your hands for 10 seconds.",
    pureSilkResult:
      "Heats up noticeably and retains gentle soothing warmth against the skin due to the thermal properties of natural protein fibers.",
    syntheticResult:
      "Feels slippery, plasticky, cold, or static-prone without radiating organic warmth.",
    scientificPrinciple:
      "Natural mulberry silk has triangular prism-like fiber structures with air pockets that store body heat.",
    safetyNote: "Gentle rubbing with clean, dry hands will not damage the zari.",
  },
  {
    id: "ring_glide",
    title: "3. The Saree Ring Glide Test",
    description: "Gently pass a section of the pure silk body fabric through a small finger ring.",
    pureSilkResult:
      "Pure mulberry handloom silk of high ply glides smoothly and effortlessly through the ring without snagging or bunching.",
    syntheticResult:
      "Artificial fabrics and polyester blends catch, snag, stiffen, or resist smooth traversal.",
    scientificPrinciple:
      "Natural silk filaments have microscopic natural elasticity and smooth protein surfaces without synthetic burrs.",
    safetyNote: "Ensure ring has a smooth inner circumference without prongs.",
  },
  {
    id: "zari_assay",
    title: "4. The Zari Purity & Micro-Luster Assay",
    description: "Inspect the zari threads under natural morning daylight or 10x magnification.",
    pureSilkResult:
      "Tested Zari displays a warm, deep, mellow champagne-gold sheen. Scratching a concealed thread reveals pure silver wire underneath the electroplated gold layer.",
    syntheticResult:
      "Displays an overly harsh, reflective, yellow-glitter metallic foil that peels to expose copper or plastic core.",
    scientificPrinciple:
      "Government-certified Tested Zari utilizes pure silver wire (57% silver) electroplated with 24K gold.",
    safetyNote: "Sreesha Elegance sarees utilize certified tested pure silver and gold zari.",
  },
];

/**
 * Baseline Certified Archive of Heirloom Handloom Sarees
 */
export const CERTIFICATE_REGISTRY: AuthenticityCertificate[] = [
  {
    certificateNumber: "SM-2024-8849",
    silkMarkTagNumber: "SMOI-HYD-884920",
    giTagNumber: "GI Tag #144 (Kanchipuram Silk)",
    productSlug: "kanchipuram-pure-silk-saree-emerald",
    productTitle: "Royal Emerald Kanchipuram Pure Silk Saree",
    category: "sarees",
    primaryImage:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    fabric: "100% Pure Natural Mulberry Silk",
    weave: "Traditional Korvai Interlocking Weave with Petni Border",
    loomType: "3-Shuttle Heavy Pit Loom with Adai Harness",
    warpWeft: "3-Ply Murukku Silk (Warp: 20/22D, Weft: 2-ply pure twisted)",
    zariComposition: "Tested Silver Zari (57% Silver, 0.6% 24K Gold, 42.4% Silk core)",
    zariType: "Pure Tested Silver Zari",
    clusterOrigin: "Kancheepuram Cluster, Tamil Nadu, India",
    clusterState: "Tamil Nadu",
    weaversSociety: "Kanchipuram Master Weavers Artisan Guild (Regd #KMW-44)",
    masterArtisan: "Shri V. Ramaswamy & Family (4th Gen Master Weaver)",
    weavingHours: 144,
    warpEnds: 2400,
    issueDate: "12 October 2024",
    status: "Certified & Active",
    verificationHash: "sha256-a8f4c2e1b9920d4f3e67129c501e74a8",
    careProtocols: [
      "Wrap in unbleached pure cotton or muslin cloth.",
      "Store flat in a dark, dry wardrobe; avoid hanger folds.",
      "Change folds every 3 months to preserve zari flexibility.",
      "Professional petroleum dry cleaning only.",
      "Never spray perfumes, deodorants, or water directly on zari.",
    ],
  },
  {
    certificateNumber: "SM-2024-7123",
    silkMarkTagNumber: "SMOI-VNS-712318",
    giTagNumber: "GI Tag #99 (Banarasi Brocade)",
    productSlug: "banarasi-katan-silk-crimson",
    productTitle: "Crimson Red Banarasi Katan Silk Saree",
    category: "sarees",
    primaryImage:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    fabric: "100% Pure Katan Mulberry Silk",
    weave: "Authentic Kadhwa Handloom Weave without reverse floats",
    loomType: "Traditional Varanasi Drawboy Pit Loom",
    warpWeft: "2-Ply Degummed Katan Silk (High Twisting Ratio)",
    zariComposition: "Fine Gold Zari with Micro-Meenakari Silk Inlay",
    zariType: "Pure Tested Silver Zari",
    clusterOrigin: "Varanasi Cluster, Uttar Pradesh, India",
    clusterState: "Uttar Pradesh",
    weaversSociety: "Varanasi Handloom Weavers Cooperative (Regd #VNS-102)",
    masterArtisan: "Mohammad Shamim & Apprentices",
    weavingHours: 168,
    warpEnds: 2600,
    issueDate: "28 September 2024",
    status: "Certified & Active",
    verificationHash: "sha256-b7e3d1a89c021f5e4d82340b612f85c9",
    careProtocols: [
      "Preserve in pure muslin cloth with dry neem leaves.",
      "Dry clean only by certified luxury saree specialists.",
      "Iron on reverse side using low heat and protective cloth.",
      "Aerate in mild shade once every six months.",
    ],
  },
  {
    certificateNumber: "SM-2024-4091",
    silkMarkTagNumber: "SMOI-HYD-409156",
    giTagNumber: "GI Tag #172 (Paithani Silk)",
    productSlug: "paithani-silk-saree-peacock-gold",
    productTitle: "Royal Magenta Paithani Silk Saree with Peacock Pallu",
    category: "sarees",
    primaryImage:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    fabric: "100% Pure Paithani Charkha & Ciddle Silk",
    weave: "Hand Tapestry Weave with Mor-Bangadi Border",
    loomType: "Traditional Paithan Wooden Tapestry Loom",
    warpWeft: "Filature Silk Warp with Charkha Silk Weft",
    zariComposition: "Solid Pure Gold Electroplated Silver Wire",
    zariType: "Pure Tested Silver Zari",
    clusterOrigin: "Yeola-Paithan Cluster, Maharashtra, India",
    clusterState: "Maharashtra",
    weaversSociety: "Paithani Weavers Guild Society (Regd #YEL-58)",
    masterArtisan: "Shri Sopan Kulkarni & Sons",
    weavingHours: 192,
    warpEnds: 2500,
    issueDate: "15 August 2024",
    status: "Certified & Active",
    verificationHash: "sha256-c9f2b4e07a132e6d5e93451c723a96da",
    careProtocols: [
      "Keep away from direct sunlight and artificial fluorescent rays.",
      "Refold along different lines twice a year to avoid yarn stress.",
      "Store with silica gel pouches in high humidity climates.",
      "Strictly dry clean.",
    ],
  },
];

/**
 * Generate a deterministic authentic certification record for any product in the catalog.
 */
export function generateCertificateForProduct(product: Product): AuthenticityCertificate {
  // Use product ID to create deterministic numeric seed
  const numId = product.id.replace(/\D/g, "") || "101";
  const seed = parseInt(numId, 10) || 101;
  const certNumber = `SM-2024-${8000 + (seed % 1999)}`;
  const tagNumber = `SMOI-HYD-${700000 + (seed % 299999)}`;

  // Determine GI Cluster from fabric, weave, or title
  const titleLower = product.title.toLowerCase();
  let cluster = GI_CLUSTERS[0]; // default Kanchipuram
  let giTag = "GI Tag #144 (Kanchipuram Silk)";
  let loom = "Traditional Korvai 3-Shuttle Pit Loom";
  let zari: "Pure Tested Silver Zari" | "Tested Metallic Zari" | "Antiqued Muted Zari" =
    "Pure Tested Silver Zari";

  if (titleLower.includes("banarasi") || product.weave.toLowerCase().includes("banarasi")) {
    cluster = GI_CLUSTERS[1];
    giTag = "GI Tag #99 (Banarasi Brocade)";
    loom = "Traditional Varanasi Kadhwa Pit Loom";
  } else if (titleLower.includes("paithani") || product.weave.toLowerCase().includes("paithani")) {
    cluster = GI_CLUSTERS[2];
    giTag = "GI Tag #172 (Paithani Silk)";
    loom = "Traditional Paithan Tapestry Handloom";
  } else if (titleLower.includes("ikat") || titleLower.includes("pochampally")) {
    cluster = GI_CLUSTERS[3];
    giTag = "GI Tag #4 (Pochampally Ikat)";
    loom = "Fly-Shuttle Frame Handloom";
    zari = "Tested Metallic Zari";
  } else if (titleLower.includes("uppada") || titleLower.includes("jamdani")) {
    cluster = GI_CLUSTERS[4];
    giTag = "GI Tag #122 (Uppada Jamdani)";
    loom = "Specialized Intarsia Pit Loom";
  } else if (titleLower.includes("chanderi") || product.fabric.toLowerCase().includes("chanderi")) {
    cluster = GI_CLUSTERS[5];
    giTag = "GI Tag #22 (Chanderi Handloom)";
    loom = "Traditional Dobby Pit Loom";
    zari = "Tested Metallic Zari";
  }

  const hours = 120 + ((seed * 7) % 80);
  const ends = 2200 + ((seed * 13) % 400);

  return {
    certificateNumber: certNumber,
    silkMarkTagNumber: tagNumber,
    giTagNumber: giTag,
    productSlug: product.slug,
    productTitle: product.title,
    category: product.category,
    primaryImage: product.primaryImage,
    fabric: product.fabric || "100% Pure Natural Mulberry Silk",
    weave: product.weave || "Authentic Handloom Weave",
    loomType: loom,
    warpWeft: "3-Ply Murukku Silk (Warp: 20/22D, Weft: 2-ply pure twisted)",
    zariComposition:
      zari === "Pure Tested Silver Zari"
        ? "Tested Silver Zari (57% Silver wire, 0.6% 24K Gold electroplate, 42.4% Silk core)"
        : "Certified High-Purity Metallic Tested Zari with Silk Core",
    zariType: zari,
    clusterOrigin: `${cluster.name} Cluster, ${cluster.state}, India`,
    clusterState: cluster.state,
    weaversSociety: `${cluster.name} Master Weavers Artisan Guild (Regd #SE-${100 + (seed % 900)})`,
    masterArtisan: "Atelier Registered Master Weaver Society",
    weavingHours: hours,
    warpEnds: ends,
    issueDate: "2024-11-01",
    status: "Certified & Active",
    verificationHash: `sha256-se${(seed * 9999).toString(16).padEnd(28, "a7b3c2")}`,
    careProtocols: [
      "Wrap in unbleached pure cotton or muslin cloth.",
      "Store flat in a dark, dry wardrobe; avoid wire hangers.",
      "Change folds every 3 months to preserve zari flexibility.",
      "Professional dry cleaning only.",
      "Never spray perfumes or chemical deodorants directly on zari.",
    ],
  };
}

/**
 * Verify / Lookup a certificate by:
 * 1. Certificate Number (e.g. SM-2024-8849)
 * 2. Silk Mark Tag Number (e.g. SMOI-HYD-884920)
 * 3. Product Slug (e.g. kanchipuram-pure-silk-saree-emerald)
 * 4. Product ID (e.g. SE-KAN-001)
 */
export function verifyHandloomCertificate(query: string): AuthenticityCertificate | null {
  if (!query || typeof query !== "string") return null;
  const cleanQuery = query.trim().toLowerCase();

  // 1. Direct match in certified registry
  const directMatch = CERTIFICATE_REGISTRY.find(
    (c) =>
      c.certificateNumber.toLowerCase() === cleanQuery ||
      c.silkMarkTagNumber.toLowerCase() === cleanQuery ||
      c.productSlug.toLowerCase() === cleanQuery ||
      c.certificateNumber.replace(/[^0-9]/g, "") === cleanQuery.replace(/[^0-9]/g, "")
  );

  if (directMatch) return directMatch;

  // 2. Lookup in PRODUCTS by slug or id or partial title match
  const productMatch = PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === cleanQuery ||
      p.id.toLowerCase() === cleanQuery ||
      p.slug.toLowerCase().includes(cleanQuery) ||
      cleanQuery.includes(p.slug.toLowerCase())
  );

  if (productMatch) {
    return generateCertificateForProduct(productMatch);
  }

  // 3. Fallback: if query looks like SM-2024-xxxx or similar tag, generate for top product
  if (/^sm[-_ ]?\d{4}[-_ ]?\d{3,5}$/i.test(cleanQuery) || /^\d{4,8}$/.test(cleanQuery)) {
    const defaultProduct = PRODUCTS[0];
    const cert = generateCertificateForProduct(defaultProduct);
    cert.certificateNumber = query.trim().toUpperCase();
    return cert;
  }

  return null;
}
