import { describe, it, expect } from "vitest";
import {
  NRI_TIMEZONES,
  ATELIER_VIDEO_SLOTS,
  convertSlotToLocalTime,
  generateGoogleCalendarUrl,
} from "./videoShopping";

describe("NRI Video Shopping Engine", () => {
  it("provides comprehensive international NRI timezones", () => {
    expect(NRI_TIMEZONES.length).toBeGreaterThanOrEqual(8);
    const usEastern = NRI_TIMEZONES.find((t) => t.id === "us_eastern");
    expect(usEastern).toBeDefined();
    expect(usEastern?.country).toBe("United States");
    expect(usEastern?.currencySymbol).toBe("$");
  });

  it("provides curated atelier video slots", () => {
    expect(ATELIER_VIDEO_SLOTS.length).toBeGreaterThanOrEqual(5);
    const eveningSlot = ATELIER_VIDEO_SLOTS.find((s) => s.istStartHour === 21);
    expect(eveningSlot).toBeDefined();
    expect(eveningSlot?.recommendedTimezone).toContain("US");
  });

  it("accurately converts IST slot to US Pacific time", () => {
    // A fixed date: 2026-11-20
    const testDate = new Date(2026, 10, 20); // Nov 20, 2026
    const eveningSlot = ATELIER_VIDEO_SLOTS.find((s) => s.istStartHour === 21)!; // 9:00 PM IST

    const pacificResult = convertSlotToLocalTime(testDate, eveningSlot, "America/Los_Angeles");
    expect(pacificResult.localTimeString).toBeDefined();
    // 9:00 PM IST (21:00 IST) is 7:30 AM PST (same day) or 8:30 AM PDT
    expect(pacificResult.localTimeString).toMatch(/AM/);
  });

  it("accurately converts IST slot to London GMT/BST time", () => {
    const testDate = new Date(2026, 10, 20);
    const slot = ATELIER_VIDEO_SLOTS.find((s) => s.istStartHour === 16)!; // 4:30 PM IST (16:30 IST)

    const ukResult = convertSlotToLocalTime(testDate, slot, "Europe/London");
    expect(ukResult.localTimeString).toBeDefined();
    // 4:30 PM IST is 11:00 AM GMT (same day)
    expect(ukResult.localTimeString).toContain("11:00 AM");
  });

  it("accurately converts IST slot to Dubai GST time", () => {
    const testDate = new Date(2026, 10, 20);
    const slot = ATELIER_VIDEO_SLOTS.find((s) => s.istStartHour === 11)!; // 11:00 AM IST

    const uaeResult = convertSlotToLocalTime(testDate, slot, "Asia/Dubai");
    expect(uaeResult.localTimeString).toBeDefined();
    // 11:00 AM IST (UTC+5:30) is 9:30 AM GST (UTC+4)
    expect(uaeResult.localTimeString).toContain("9:30 AM");
  });

  it("generates valid Google Calendar URL", () => {
    const url = generateGoogleCalendarUrl({
      id: "SE-APT-9922",
      title: "Bridal Video Shopping",
      dateStr: "Friday, 20 November 2026",
      timeSlot: "8:30 AM – 10:00 AM PST",
      clientTimezone: "US Pacific (PST)",
      customerName: "Radhika Sharma",
    });

    expect(url).toContain("calendar.google.com");
    expect(url).toContain("SE-APT-9922");
    expect(url).toContain("Radhika%20Sharma");
  });
});
