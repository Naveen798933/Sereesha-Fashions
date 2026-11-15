/**
 * Sreesha Elegance — Atelier Saree Drape Guide & Masterclass Engine
 *
 * Provides curated traditional and contemporary Indian saree draping styles,
 * interactive pleat calculators, pin placement protocols, and jewellery pairings.
 */

export interface DrapeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  proTip?: string;
}

export interface DrapeStyle {
  id: string;
  name: string;
  subName: string;
  originRegion: string;
  idealSareeTypes: string[];
  occasions: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeMinutes: number;
  pleatCount: string;
  pleatWidthInches: number;
  palluLengthFeet: string;
  image: string;
  jewelleryPairing: string[];
  description: string;
  steps: DrapeStep[];
  proTips: string[];
  recommendedCategoryLink: string;
}

export const DRAPE_STYLES: DrapeStyle[] = [
  {
    id: "nivi_royal",
    name: "Classic Nivi Drape (Muhurtham Royal)",
    subName: "The Sovereign Andhra & Telugu Bridal Drape",
    originRegion: "Andhra Pradesh & Telangana",
    idealSareeTypes: [
      "Kanchipuram Pure Silk (Korvai)",
      "Mysore Crepe Silk",
      "Pochampally Ikat",
      "Gadwal Silk",
    ],
    occasions: ["Wedding Muhurtham", "Temple Puja", "Seemantham", "Festive Celebrations"],
    difficulty: "Beginner",
    timeMinutes: 10,
    pleatCount: "7 to 9 Front Pleats",
    pleatWidthInches: 5,
    palluLengthFeet: "3.5 – 4.0 Feet (Reaching just below the knee)",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    jewelleryPairing: [
      "Vaddanam / Kamarbandh (Temple gold waist belt)",
      "Guttapusalu or Kasu Mala heritage necklace",
      "Kempu stone Jhumkas",
      "Maang Tikka & Vanki (Armlets)",
    ],
    description:
      "The undisputed queen of Indian drapes. Originating in Andhra Pradesh and popularized nationwide, the Nivi drape highlights the grand korvai temple border and allows the heavy zari pallu to cascade regally from the left shoulder.",
    steps: [
      {
        stepNumber: 1,
        title: "Tuck Foundation & Leveling",
        instruction:
          "Wearing your heels and petticoat/shapewear at the navel, tuck the plain inner end of the saree at the right waist. Sweep it cleanly around your back, returning to the navel, ensuring the bottom hem sits exactly 0.5 inches above the floor.",
        proTip:
          "Always wear your wedding footwear before beginning the first tuck to ensure perfect floor sweep.",
      },
      {
        stepNumber: 2,
        title: "Measure Pallu Length",
        instruction:
          "Take the opposite end of the saree (the ornate zari pallu) and drape it from right to left around your back. Pull it over your left shoulder, adjusting the length until the lowest tip reaches just behind your knee.",
        proTip:
          "For bridal Kanchipuram sarees, leave at least 3.5 to 4 feet of pallu so the grand thazhambu motif is fully visible.",
      },
      {
        stepNumber: 3,
        title: "Form the Front Pleats",
        instruction:
          "With the remaining fabric gathered at the front, use your thumb and little finger to measure 5-inch accordion pleats. Fold 7 to 9 crisp pleats from right to left, keeping them uniform and parallel.",
        proTip:
          "Give the pleats a gentle downward snap to settle the heavy silk weight before tucking.",
      },
      {
        stepNumber: 4,
        title: "Navel Tuck & Pin Alignment",
        instruction:
          "Gather all pleats together, align their top edges evenly, and tuck them firmly into the petticoat waistband directly aligned with your navel. Pin the inner layers securely with a safety pin.",
        proTip:
          "Use a small coin or card behind the pleats when inserting the pin to protect your fingers and saree fabric.",
      },
      {
        stepNumber: 5,
        title: "Accordion Shoulder Pleating",
        instruction:
          "Gather the pallu over your left shoulder into 4 to 6 neat accordion pleats following the zari border lines. Pin securely 2 inches behind the shoulder seam to prevent slipping forward.",
        proTip:
          "Never pin directly through pure silver zari wire; slide the pin through the inner border lining.",
      },
    ],
    proTips: [
      "For heavy Kanchipuram sarees, a mermaid-cut saree shapewear creates a slimmer, regal posture.",
      "Fasten a gold Vaddanam (waist belt) over the front pleats to lock the drape firmly for 12+ hours.",
    ],
    recommendedCategoryLink: "/women/sarees",
  },
  {
    id: "bengali_atpoure",
    name: "Bengali Atpoure Drape (Zamindari)",
    subName: "The Noble Aristocratic Box Drape",
    originRegion: "Bengal & Eastern India",
    idealSareeTypes: ["Banarasi Katan Silk", "Baluchari Brocade", "Jamdani Silk", "Tussar Silk"],
    occasions: ["Durga Puja", "Reception", "Sindoor Khela", "Milestone Anniversaries"],
    difficulty: "Intermediate",
    timeMinutes: 12,
    pleatCount: "2 Broad Box Pleats",
    pleatWidthInches: 10,
    palluLengthFeet: "5.0 Feet (Extended Double-Shoulder Traversal)",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    jewelleryPairing: [
      "Shakha, Pola & Loha bangles",
      "Tiered Gold Sitahar necklace",
      "Intricate Filigree Jhumkas",
      "Ornate Silver Key Bunch (Chabi Guchha)",
    ],
    description:
      "Traditionally worn by Bengali zamindar noblewomen, this majestic drape has no front accordion pleats. Instead, broad box pleats wrap around the hips while the long zari pallu is draped forward from under the right arm and over the right shoulder with an ornate silver key ring.",
    steps: [
      {
        stepNumber: 1,
        title: "Anticlockwise Base Tuck",
        instruction:
          "Begin at the right side of the waist, tuck the fabric, and make a complete anticlockwise turn around your body. Tuck firmly along the waistband.",
      },
      {
        stepNumber: 2,
        title: "The Broad Box Pleat",
        instruction:
          "Unlike Nivi pleats, fold the remaining front fabric into two wide box pleats (approx 10 inches each) facing outward, and tuck them into the left side of the waist.",
        proTip: "This creates a flat, slimming silhouette across the abdomen without bulk.",
      },
      {
        stepNumber: 3,
        title: "Left Shoulder Pallu Drape",
        instruction:
          "Take the long pallu, gather it loosely, and drape it over your left shoulder from front to back, letting it fall freely behind your back.",
      },
      {
        stepNumber: 4,
        title: "The Signature Right Shoulder Sweep",
        instruction:
          "Take the right corner tip of the pallu from behind your back, bring it forward underneath your right armpit, and throw it over your right shoulder.",
        proTip:
          "Weight the right pallu tip with an antique ornamental key bunch (Chabi Guchha) to keep it in place.",
      },
    ],
    proTips: [
      "Best showcased on rich Banarasi Katan sarees with heavy kalka jaal and red-and-gold borders.",
      "Pair with a puff-sleeve or elbow-length brocade blouse.",
    ],
    recommendedCategoryLink: "/women/sarees",
  },
  {
    id: "maharashtrian_nauvari",
    name: "Maharashtrian Nauvari Drape (Kashta)",
    subName: "The 9-Yard Peshwai Warrior Queen Drape",
    originRegion: "Maharashtra (Paithan & Yeola)",
    idealSareeTypes: ["Paithani Pure Silk (9 Yards / 8.2m)", "Irkal Silk", "Chanderi Silk 9-Yard"],
    occasions: ["Haldi Ceremony", "Mangalagaur", "Ganesh Utsav", "Traditional Marathi Weddings"],
    difficulty: "Advanced",
    timeMinutes: 15,
    pleatCount: "Dhoti-Style Center Pleats with Back Kashta",
    pleatWidthInches: 4,
    palluLengthFeet: "3.5 Feet",
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    jewelleryPairing: [
      "Traditional Maharashtrian Brahmani Nath (Pearl & ruby nose ring)",
      "Kolhapuri Saaj gold necklace",
      "Thushi choker",
      "Green glass chuda bangles",
    ],
    description:
      "The legendary 9-yard drape worn by Maratha warrior queens, allowing freedom of movement while riding horses. The fabric is drawn between the legs and tucked at the back (kashta), forming an elegant trouser-like dhoti silhouette with the peacock Paithani pallu draped across the chest.",
    steps: [
      {
        stepNumber: 1,
        title: "The Waist Tie (Ganth)",
        instruction:
          "Wrap the saree around your waist and tie a secure double knot at the center navel, dividing the fabric into equal left and right sections.",
      },
      {
        stepNumber: 2,
        title: "Forming the Front Pleats",
        instruction:
          "Take the front hanging portion, fold 8 to 10 neat pleats (4 inches wide), and tuck them into the center waist knot.",
      },
      {
        stepNumber: 3,
        title: "The Kashta Leg Pull-Through",
        instruction:
          "Take the center inner fold from between the pleats, pass it between your legs from front to back, and tuck the border firmly into the center-back waistband.",
        proTip:
          "Make 3 small pleats at the back before tucking to ensure the peacock border sits upright.",
      },
      {
        stepNumber: 4,
        title: "Chest Wrap & Left Shoulder Pin",
        instruction:
          "Take the remaining pallu, bring it across the bust from right to left, and drape over the left shoulder, letting the grand Paithani peacock motifs display prominently.",
      },
    ],
    proTips: [
      "Requires an authentic 9-yard (8.2 meter) Paithani silk saree.",
      "Wear tight cycling shorts or shapewear instead of a petticoat for seamless kashta tucking.",
    ],
    recommendedCategoryLink: "/women/sarees",
  },
  {
    id: "gujarati_seedha_pallu",
    name: "Gujarati / Rajasthani Seedha Pallu",
    subName: "The Front-Display Grand Zari Drape",
    originRegion: "Gujarat & Rajasthan",
    idealSareeTypes: [
      "Bandhani Pure Georgette & Silk",
      "Banarasi Brocade",
      "Patola Silk",
      "Gotapatti Tissue",
    ],
    occasions: ["Sangeet", "Mehendi", "Karwa Chauth", "Family Wedding Celebrations"],
    difficulty: "Beginner",
    timeMinutes: 8,
    pleatCount: "6 to 8 Left-Facing Pleats",
    pleatWidthInches: 5,
    palluLengthFeet: "3.5 Feet",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85",
    jewelleryPairing: [
      "Kundan or Polki Choker",
      "Borla Rajasthani Maang Tikka",
      "Haathphool (Hand ornaments)",
      "Layered Meenakari Bangles",
    ],
    description:
      "Instead of letting the pallu hang behind the left shoulder, the Seedha Pallu brings the entire ornate pallu over the right shoulder to hang spread across the front torso. It is the premier drape to display intricate bridal pallu hand-embroidery and zari motifs.",
    steps: [
      {
        stepNumber: 1,
        title: "Left-Facing Base Pleating",
        instruction:
          "Perform the basic floor tuck. Gather 6 to 8 front pleats and tuck them into the waistband, but orient them facing towards the left side.",
      },
      {
        stepNumber: 2,
        title: "Right Shoulder Forward Throw",
        instruction:
          "Take the pallu, wrap it from the left waist around the back, and throw it forward over the right shoulder so it hangs down the front of the body.",
      },
      {
        stepNumber: 3,
        title: "Torso Spread & Left Waist Pin",
        instruction:
          "Spread the front hanging pallu across your chest. Take the left corner of the pallu, pull it taut across the left waist, and pin it to the petticoat waistband.",
        proTip:
          "This forms a flattering V-taper across the front while keeping both hands completely free.",
      },
    ],
    proTips: [
      "Ideal for sarees with heavy front borders where traditional drapes would conceal the pallu behind your back.",
    ],
    recommendedCategoryLink: "/women/sarees",
  },
  {
    id: "contemporary_belted",
    name: "Contemporary Belted Drape (Cocktail Edit)",
    subName: "The Modern High-Fashion Silhouette",
    originRegion: "Contemporary Atelier Studio",
    idealSareeTypes: [
      "Pure Organza & Tissue Zari",
      "Satin Silk Crepe",
      "Lightweight Kanchipuram",
      "Chiffon with Zari Borders",
    ],
    occasions: ["Reception", "Cocktail Gala", "Sangeet Night", "Destination Weddings"],
    difficulty: "Beginner",
    timeMinutes: 6,
    pleatCount: "5 Slim Pleats",
    pleatWidthInches: 4,
    palluLengthFeet: "4.5 Feet (Dramatic Floor Glide)",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    jewelleryPairing: [
      "Polki Diamond or Emerald Choker",
      "Geometric Statement Ear Cuffs",
      "Embroidered Zari or Leather Belt",
      "Cocktail Solitaire Ring",
    ],
    description:
      "A sleek modern interpretation that merges high-fashion couture with handloom heritage. The waist is cinched with an ornate metallic or zardozi belt, locking the pallu into sharp vertical lines that elongate the frame.",
    steps: [
      {
        stepNumber: 1,
        title: "Mermaid Silhouette Base",
        instruction:
          "Wear a high-compression saree shapewear. Tuck the first wrap tightly to accentuate the natural waist and hip contours.",
      },
      {
        stepNumber: 2,
        title: "Skinny Front Pleating",
        instruction:
          "Fold 5 slim (4-inch) pleats and tuck directly into the center. Iron or press the pleats with your fingers so they fall like vertical knife pleats.",
      },
      {
        stepNumber: 3,
        title: "Narrow Accordion Pallu",
        instruction:
          "Fold the pallu into very narrow 2-inch accordion pleats. Pin tightly on the left shoulder, letting the tail cascade dramatically down past your knees.",
      },
      {
        stepNumber: 4,
        title: "The Waist Cincher Fastening",
        instruction:
          "Fasten an atelier zardozi or metallic belt around your natural high waist, securing both the front pleats and the descending pallu neatly against your body.",
        proTip: "Position the belt 1.5 inches above your navel to visually elongate your legs.",
      },
    ],
    proTips: [
      "Pair with our Pure Organza or Metallic Tissue Zari sarees for an ethereal, floating silhouette under evening chandeliers.",
    ],
    recommendedCategoryLink: "/contemporary",
  },
];

export interface PleatCalculationResult {
  recommendedPleatCount: number;
  pleatWidthInches: number;
  recommendedPetticoat: string;
  pinCount: number;
  heelAllowanceInches: number;
  proAdvice: string;
}

/**
 * Interactive Pleat Calculator: Determines optimal pleat count and width
 * based on fabric weight, patron height, and desired silhouette.
 */
export function calculatePleats(
  fabricType:
    "heavy_kanchipuram" | "banarasi_katan" | "light_organza" | "fluid_satin" | "paithani_heavy",
  heightInches: number // e.g. 64 (5'4")
): PleatCalculationResult {
  switch (fabricType) {
    case "heavy_kanchipuram":
      return {
        recommendedPleatCount: heightInches >= 66 ? 8 : 7,
        pleatWidthInches: 5.5,
        recommendedPetticoat: "Mermaid-Cut Cotton-Lycra Saree Shapewear (Locks heavy weight)",
        pinCount: 3,
        heelAllowanceInches: 2.5,
        proAdvice:
          "Heavy 3-ply silk requires wider pleats (5.5 inches) so the zari borders lie flat without ballooning.",
      };
    case "banarasi_katan":
      return {
        recommendedPleatCount: 7,
        pleatWidthInches: 5.0,
        recommendedPetticoat: "Structured Pure Cotton Satin Petticoat with Sturdy Drawstring",
        pinCount: 3,
        heelAllowanceInches: 2.0,
        proAdvice:
          "Banarasi kadhwa weave has substantial body; finger-press each pleat firmly before tucking.",
      };
    case "light_organza":
      return {
        recommendedPleatCount: heightInches >= 65 ? 6 : 5,
        pleatWidthInches: 4.5,
        recommendedPetticoat: "Shimmer Satin or Silk-Blend Saree Shapewear (Matches sheer luster)",
        pinCount: 4,
        heelAllowanceInches: 3.0,
        proAdvice:
          "Organza tends to bounce; use safety pin anchors with pearl caps to avoid puncturing gossamer yarns.",
      };
    case "fluid_satin":
      return {
        recommendedPleatCount: 8,
        pleatWidthInches: 4.0,
        recommendedPetticoat: "High-Waist Microfiber Shapewear",
        pinCount: 2,
        heelAllowanceInches: 2.5,
        proAdvice:
          "Fluid silks glide smoothly; ensure the inner waistband tuck is pinned securely to prevent sagging.",
      };
    case "paithani_heavy":
    default:
      return {
        recommendedPleatCount: 8,
        pleatWidthInches: 5.0,
        recommendedPetticoat: "Heavy Cotton Petticoat with Double Stitching",
        pinCount: 3,
        heelAllowanceInches: 2.5,
        proAdvice:
          "Give the dhoop-chhaon body generous pleats to showcase the dual-tone light play when walking.",
      };
  }
}
