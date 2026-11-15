/**
 * Sreesha Elegance — Atelier Silk Care, Heirloom Restoration & Preservation Engine
 *
 * Provides archival preservation guidelines, automated fold-change schedule calculators,
 * zari tarnish mitigation protocols, and atelier restoration services.
 */

export interface CareRule {
  id: string;
  pillarNumber: number;
  title: string;
  subtitle: string;
  importance: "CRITICAL" | "ESSENTIAL" | "RECOMMENDED";
  description: string;
  dos: string[];
  donts: string[];
  scientificReason: string;
}

export const SILK_CARE_PILLARS: CareRule[] = [
  {
    id: "muslin_storage",
    pillarNumber: 1,
    title: "The Muslin Cloth Protocol",
    subtitle: "Breathable Natural Fiber Shielding",
    importance: "CRITICAL",
    description:
      "Never store pure silk handloom sarees in plastic, polythene bags, or synthetic covers. Plastic traps ambient micro-humidity and releases acidic plasticizer off-gases that oxidize pure silver zari threads, turning them black or brittle.",
    dos: [
      "Wrap each saree individually in unbleached pure cotton or mulmul muslin cloth.",
      "Store flat in a dark, dry wooden chest or dark wardrobe shelf.",
      "Place breathable desiccant pouches or dry neem leaves nearby in humid climates.",
    ],
    donts: [
      "Never store inside airtight plastic covers or dry-cleaner bags.",
      "Never use chemical naphthalene mothballs directly touching the silk.",
      "Never stack more than 3 heavy Kanchipuram sarees on top of each other.",
    ],
    scientificReason:
      "Mulberry silk is natural protein (fibroin) that requires air circulation to maintain its natural 11% moisture balance without rotting.",
  },
  {
    id: "fold_rotation",
    pillarNumber: 2,
    title: "The 90-Day Fold Rotation Matrix",
    subtitle: "Crease Stress Relief & Yarn Memory Reset",
    importance: "CRITICAL",
    description:
      "Natural silk filaments have memory. If left folded along the exact same creases for more than 4 to 6 months under heavy zari weight, the warp threads under compression weaken and split, causing irreparable tears along the fold line.",
    dos: [
      "Unfold the saree completely once every 90 days on a clean, soft surface.",
      "Aerate for 30 minutes in a cool, well-ventilated room out of direct sunlight.",
      "Refold along opposite or alternate lines to redistribute yarn tension.",
    ],
    donts: [
      "Never leave a bridal saree untouched in storage for more than 6 months.",
      "Never hang heavy sarees on thin wire hangers, which permanently stretches the shoulder.",
      "Never apply heavy pressure or books on top of stored sarees.",
    ],
    scientificReason:
      "Rotating the fold lines relieves localized yarn strain and redistributes the pressure of the heavy metal zari wire.",
  },
  {
    id: "zari_tarnish",
    pillarNumber: 3,
    title: "Zari Protection & Tarnish Mitigation",
    subtitle: "Preserving Pure 24K Gold & Silver Sheen",
    importance: "ESSENTIAL",
    description:
      "Sreesha Elegance sarees utilize Tested Zari containing genuine silver wire electroplated with 24K gold. Silver naturally reacts to airborne sulphur, perfumes, body deodorants, alcohol, and perspiration, which form dark silver sulphide.",
    dos: [
      "Allow perfumes, makeup, and hairspray to dry completely before draping your saree.",
      "Tuck dried neem leaves, cloves, or silica gel in the corners of the wardrobe.",
      "Gently pat the zari with a clean, dry microfiber cloth after wearing to remove moisture.",
    ],
    donts: [
      "Never spray perfumes, attar, or deodorants directly onto zari borders or pallu.",
      "Never expose pure zari to artificial direct halogen or fluorescent spotlight heat for long periods.",
      "Never use liquid metal polish or abrasive cleaners on tarnished handloom zari.",
    ],
    scientificReason:
      "Silver reacts with traces of hydrogen sulphide gas in the atmosphere: 2Ag + H2S -> Ag2S (dark tarnish). Proper shielding halts this chemical reaction.",
  },
  {
    id: "dry_clean_wash",
    pillarNumber: 4,
    title: "Specialized Hydrocarbon Dry Cleaning Only",
    subtitle: "Protecting Natural Dyes & Luster",
    importance: "CRITICAL",
    description:
      "Pure handloom silk colored with natural and reactive dyes must never be immersed in water or treated with household detergents. Water swells the silk protein filaments, stripping their natural sheen and causing heavy zari puckering.",
    dos: [
      "Entrust your saree only to certified luxury dry cleaners specializing in heirloom sarees.",
      "Instruct the dry cleaner to use hydrocarbon petroleum solvent, not harsh perchloroethylene.",
      "Spot-clean localized spills immediately by gently dabbing (not rubbing) with plain cold water on a cotton swab.",
    ],
    donts: [
      "Never machine wash, hand wash, or soak an authentic silk saree.",
      "Never use bleaching agents, fabric softeners, or alkaline soap nuts.",
      "Never wring, twist, or tumble-dry silk under any circumstances.",
    ],
    scientificReason:
      "Water immersion causes anisotropic fiber swelling (radial swelling without longitudinal expansion), causing irreversible wavy puckering along zari borders.",
  },
  {
    id: "reverse_pressing",
    pillarNumber: 5,
    title: "Reverse Steam Pressing Protocol",
    subtitle: "Flawless Drape Without Scorch Marks",
    importance: "ESSENTIAL",
    description:
      "Direct heat from a hot iron will scorch pure silk filaments and melt the delicate silk core of tested zari threads, leaving unsightly shine marks or brittle patches.",
    dos: [
      "Always iron on the reverse (underside) of the saree.",
      "Place a clean, dry, lint-free white cotton pressing cloth between the iron and the saree.",
      "Set the iron to the dedicated 'Silk' setting (low to medium heat) with gentle steam.",
    ],
    donts: [
      "Never touch the bare iron plate directly to pure gold or silver zari threads.",
      "Never use high cotton or linen heat settings on delicate handlooms.",
      "Never spray water droplets directly while ironing, which creates permanent water spots.",
    ],
    scientificReason:
      "Silk fibroin decomposes at temperatures above 140°C. A cotton buffer prevents thermal degradation of both natural silk and metallic electroplating.",
  },
];

export interface FoldMilestone {
  cycle: number;
  daysAfterPurchase: number;
  scheduledDate: string;
  actionTitle: string;
  instructions: string;
}

/**
 * Calculate the rolling 4-quarterly 90-day fold rotation schedule for an heirloom saree.
 */
export function calculateFoldSchedule(purchaseDate: Date): FoldMilestone[] {
  const milestones: FoldMilestone[] = [];
  const intervals = [90, 180, 270, 360];

  const actions = [
    {
      title: "Quarter 1: The Lateral Flip",
      instructions:
        "Unfold saree completely. Aerate for 30 minutes in a shaded room. Change the lengthwise horizontal fold from the middle to a thirds-fold.",
    },
    {
      title: "Quarter 2: The Inverted Crease Shift",
      instructions:
        "Refold with the inner border facing outward and the outer pallu tucked safely inside the muslin wrap to balance weight pressure.",
    },
    {
      title: "Quarter 3: Pallu Aeration & Desiccant Check",
      instructions:
        "Gently inspect zari pallu for any signs of humidity or tarnish. Replace dried neem leaves or silica gel pouches with fresh ones.",
    },
    {
      title: "Quarter 4: Annual Archival Assessment",
      instructions:
        "Full heirloom inspection. If worn during the year, send for hydrocarbon dry clean; otherwise, refold across alternate diagonal lines.",
    },
  ];

  intervals.forEach((days, idx) => {
    const target = new Date(purchaseDate);
    target.setDate(target.getDate() + days);
    milestones.push({
      cycle: idx + 1,
      daysAfterPurchase: days,
      scheduledDate: target.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      actionTitle: actions[idx].title,
      instructions: actions[idx].instructions,
    });
  });

  return milestones;
}

export interface RestorationService {
  id: string;
  name: string;
  turnaroundTime: string;
  description: string;
  recommendedFor: string;
}

export const ATELIER_RESTORATION_SERVICES: RestorationService[] = [
  {
    id: "zari_polish",
    name: "Tarnished Zari Re-Luster & Micro-Assay Polish",
    turnaroundTime: "5–7 Days",
    description:
      "Specialized non-abrasive chemical-free restoration performed by our master weavers to lift surface tarnish and revive the mellow champagne sheen of tested silver zari.",
    recommendedFor:
      "Heirloom sarees older than 5 years with minor oxidation on the pallu or borders.",
  },
  {
    id: "fall_pico_refinish",
    name: "Fall, Pico & Handloom Fringe Re-Weaving",
    turnaroundTime: "2–3 Days",
    description:
      "Replacement of worn cotton fall with color-matched pure malmal lining, delicate edge-pico hand finish, and re-twisting of traditional tassel fringes.",
    recommendedFor: "Sarees with frayed edge tassels or loosened bottom falls.",
  },
  {
    id: "steam_decreasing",
    name: "Atelier Gentle Steam & De-Creasing Finish",
    turnaroundTime: "2–4 Days",
    description:
      "Gentle tension-controlled steam de-creasing using Italian textile presses to eliminate storage fold lines without damaging delicate silk fibers.",
    recommendedFor: "Sarees stored in boxes for weddings and celebrations.",
  },
  {
    id: "muslin_archival_kit",
    name: "Signature Archival Muslin Storage Kit",
    turnaroundTime: "Instant Dispatch",
    description:
      "Includes 2 unbleached 100% pure organic cotton muslin saree pouches, organic neem leaf sachets, and an embossed gold-stamped luxury storage hardbox.",
    recommendedFor: "Preserving bridal trousseau investments for future generations.",
  },
];
