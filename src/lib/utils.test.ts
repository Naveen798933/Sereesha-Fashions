import { describe, it, expect } from "vitest";
import { cn, formatINR } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("px-4 py-2", "text-sm")).toBe("px-4 py-2 text-sm");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });
  });

  describe("formatINR", () => {
    it("formats rupees into Indian currency string", () => {
      const formatted = formatINR(24999);
      expect(formatted).toContain("24,999");
    });

    it("formats paise into rupees accurately", () => {
      const formatted = formatINR(2499900, true);
      expect(formatted).toContain("24,999");
    });
  });
});
