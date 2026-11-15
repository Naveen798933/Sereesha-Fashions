/**
 * Sreesha Elegance — Atelier Digital Gift Card & Privé Voucher Engine
 *
 * Provides luxury occasion-themed gift cards, code generation, balance tracking,
 * and delivery scheduling for weddings, anniversaries, and festive gifting.
 */

export interface GiftCardTheme {
  id: string;
  name: string;
  subName: string;
  bgGradient: string;
  borderColor: string;
  badgeText: string;
  defaultMessage: string;
}

export const GIFT_CARD_THEMES: GiftCardTheme[] = [
  {
    id: "subha_muhurtham",
    name: "Subha Muhurtham",
    subName: "Bridal Trousseau & Wedding Blessings",
    bgGradient: "from-[#2A1810] via-[#1C1B19] to-[#3D2314]",
    borderColor: "#B79B63",
    badgeText: "✦ A WEDDING BLESSING",
    defaultMessage:
      "Wishing you a lifetime of joy, love, and timeless elegance as you embark on this beautiful new journey together.",
  },
  {
    id: "festive_splendor",
    name: "Festive Splendor",
    subName: "Deepavali, Sankranti & Celebrations",
    bgGradient: "from-[#1A261E] via-[#1C1B19] to-[#2D4536]",
    borderColor: "#B79B63",
    badgeText: "✦ FESTIVE AUSPICIOUSNESS",
    defaultMessage:
      "May this festive season illuminate your life with grace, prosperity, and the radiant sheen of pure handloom silk.",
  },
  {
    id: "nizam_heirloom",
    name: "The Royal Nizam Edit",
    subName: "Heritage & Milestone Celebrations",
    bgGradient: "from-[#1C1B19] via-[#2E2820] to-[#1C1B19]",
    borderColor: "#D8C7A5",
    badgeText: "✦ IMPERIAL ATELIER PRIVÉ",
    defaultMessage:
      "Celebrate your milestone with a piece of living royal history from our Kukatpally handloom atelier.",
  },
  {
    id: "gift_of_elegance",
    name: "The Gift of Elegance",
    subName: "Boutique Choice & Privé Card",
    bgGradient: "from-[#1C1B19] via-[#242220] to-[#151413]",
    borderColor: "#B79B63",
    badgeText: "✦ WEAR YOUR ELEGANCE",
    defaultMessage:
      "Presented with love to choose an heirloom saree, lehenga, or bespoke ensemble that truly speaks to your heart.",
  },
];

export const GIFT_CARD_DENOMINATIONS = [5000, 10000, 25000, 50000, 100000];

export interface GiftCardRecord {
  id: string;
  code: string;
  amount: number;
  balance: number;
  themeId: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message: string;
  deliveryDate?: string;
  createdAt: string;
  expiresAt: string;
  status: "Active" | "Redeemed" | "Expired";
}

/**
 * Generate a unique collision-resistant gift card redemption code.
 */
export function generateGiftCardCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part1 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const part2 = Array.from(
    { length: 4 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `SE-PRIV-${part1}-${part2}`;
}

/**
 * Create a mock gift card instance with 1-year validity.
 */
export function createGiftCardRecord(params: {
  amount: number;
  themeId: string;
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  deliveryDate?: string;
}): GiftCardRecord {
  const code = generateGiftCardCode();
  const id = `GC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const created = new Date();
  const expiry = new Date(created);
  expiry.setFullYear(created.getFullYear() + 1);

  const theme = GIFT_CARD_THEMES.find((t) => t.id === params.themeId) || GIFT_CARD_THEMES[0];

  return {
    id,
    code,
    amount: params.amount,
    balance: params.amount,
    themeId: theme.id,
    recipientName: params.recipientName.trim(),
    recipientEmail: params.recipientEmail.trim().toLowerCase(),
    senderName: params.senderName.trim(),
    senderEmail: params.senderEmail.trim().toLowerCase(),
    message: params.message?.trim() || theme.defaultMessage,
    deliveryDate: params.deliveryDate || new Date().toISOString().split("T")[0],
    createdAt: created.toISOString(),
    expiresAt: expiry.toISOString(),
    status: "Active",
  };
}
