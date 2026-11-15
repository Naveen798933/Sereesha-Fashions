import { describe, it, expect } from "vitest";
import {
  GIFT_CARD_THEMES,
  GIFT_CARD_DENOMINATIONS,
  generateGiftCardCode,
  createGiftCardRecord,
} from "./giftCards";

describe("Atelier Digital Gift Card Engine", () => {
  it("provides luxury occasion themes", () => {
    expect(GIFT_CARD_THEMES.length).toBeGreaterThanOrEqual(4);
    const wedding = GIFT_CARD_THEMES.find((t) => t.id === "subha_muhurtham");
    expect(wedding).toBeDefined();
    expect(wedding?.badgeText).toContain("WEDDING");
  });

  it("provides standard luxury denominations", () => {
    expect(GIFT_CARD_DENOMINATIONS).toContain(5000);
    expect(GIFT_CARD_DENOMINATIONS).toContain(25000);
    expect(GIFT_CARD_DENOMINATIONS).toContain(100000);
  });

  it("generates formatted gift card codes", () => {
    const code = generateGiftCardCode();
    expect(code).toMatch(/^SE-PRIV-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("creates active gift card record with 1 year validity", () => {
    const record = createGiftCardRecord({
      amount: 25000,
      themeId: "subha_muhurtham",
      recipientName: "Sreeja Reddy",
      recipientEmail: "sreeja@example.com",
      senderName: "Naveen Kota",
      senderEmail: "naveen@example.com",
      message: "Congratulations on your wedding!",
    });

    expect(record.status).toBe("Active");
    expect(record.amount).toBe(25000);
    expect(record.balance).toBe(25000);
    expect(record.code).toContain("SE-PRIV-");
    expect(record.recipientEmail).toBe("sreeja@example.com");

    const createdYear = new Date(record.createdAt).getFullYear();
    const expiryYear = new Date(record.expiresAt).getFullYear();
    expect(expiryYear - createdYear).toBe(1);
  });
});
