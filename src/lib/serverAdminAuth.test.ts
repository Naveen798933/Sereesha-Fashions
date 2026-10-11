import { describe, it, expect, beforeEach } from "vitest";
import {
  safeCompare,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createSessionToken,
  verifySessionToken,
  getExpectedAdminCredentials,
} from "./serverAdminAuth";

describe("Three-Level Admin Authentication System", () => {
  const testClient = "test-ip-127.0.0.1";

  beforeEach(() => {
    clearRateLimit(testClient);
  });

  describe("Timing-safe comparison (safeCompare)", () => {
    it("returns true for identical strings", () => {
      expect(safeCompare("sreesha", "sreesha")).toBe(true);
      expect(safeCompare("Sreesha@Atelier2026", "Sreesha@Atelier2026")).toBe(true);
      expect(safeCompare("8899", "8899")).toBe(true);
    });

    it("returns false for non-matching strings of same length", () => {
      expect(safeCompare("8899", "8898")).toBe(false);
      expect(safeCompare("admin1", "admin2")).toBe(false);
    });

    it("returns false for strings of different length", () => {
      expect(safeCompare("short", "longer_string")).toBe(false);
      expect(safeCompare("8899", "889")).toBe(false);
    });
  });

  describe("Rate-limiting & Abuse Protection", () => {
    it("starts with maximum allowed attempts", () => {
      const status = checkRateLimit(testClient);
      expect(status.isLocked).toBe(false);
      expect(status.remainingAttempts).toBe(5);
    });

    it("decrements remaining attempts on failure", () => {
      const fail1 = recordFailedAttempt(testClient);
      expect(fail1.remainingAttempts).toBe(4);
      expect(fail1.isLocked).toBe(false);

      const fail2 = recordFailedAttempt(testClient);
      expect(fail2.remainingAttempts).toBe(3);
    });

    it("locks out client after 5 consecutive failures", () => {
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt(testClient);
      }
      const fifth = recordFailedAttempt(testClient);
      expect(fifth.isLocked).toBe(true);
      expect(fifth.remainingAttempts).toBe(0);

      // Verify that subsequent check reports locked
      const check = checkRateLimit(testClient);
      expect(check.isLocked).toBe(true);
    });

    it("resets rate limit on successful authentication", () => {
      recordFailedAttempt(testClient);
      recordFailedAttempt(testClient);
      clearRateLimit(testClient);

      const status = checkRateLimit(testClient);
      expect(status.isLocked).toBe(false);
      expect(status.remainingAttempts).toBe(5);
    });
  });

  describe("Cryptographic Session Tokens", () => {
    it("generates and verifies a valid signed session token", () => {
      const token = createSessionToken("sreesha", "Super Admin / Owner");
      expect(token).toBeDefined();
      expect(token).toContain(".");

      const session = verifySessionToken(token);
      expect(session).not.toBeNull();
      expect(session?.adminId).toBe("sreesha");
      expect(session?.role).toBe("Super Admin / Owner");
    });

    it("rejects tampered token signature", () => {
      const token = createSessionToken("sreesha");
      const [payload, sig] = token.split(".");
      const forgedSig = sig.slice(0, -4) + "XXXX";
      const tampered = `${payload}.${forgedSig}`;

      expect(verifySessionToken(tampered)).toBeNull();
    });

    it("rejects malformed token strings", () => {
      expect(verifySessionToken("")).toBeNull();
      expect(verifySessionToken("invalid-token-without-dot")).toBeNull();
      expect(verifySessionToken("foo.bar.baz")).toBeNull();
    });
  });

  describe("Three-Level Credential Verification Logic", () => {
    const expected = getExpectedAdminCredentials();

    it("succeeds when all 3 credentials match exactly", () => {
      const isIdValid = safeCompare("sreesha", expected.adminId.toLowerCase());
      const isPasswordValid = safeCompare("Sreesha@Atelier2026", expected.password);
      const isCodeValid = safeCompare("8899", expected.securityCode);

      expect(isIdValid && isPasswordValid && isCodeValid).toBe(true);
    });

    it("fails when Level 1 (Admin ID) is incorrect", () => {
      const isIdValid = safeCompare("wrong_admin", expected.adminId.toLowerCase());
      const isPasswordValid = safeCompare("Sreesha@Atelier2026", expected.password);
      const isCodeValid = safeCompare("8899", expected.securityCode);

      expect(isIdValid && isPasswordValid && isCodeValid).toBe(false);
    });

    it("fails when Level 2 (Password) is incorrect", () => {
      const isIdValid = safeCompare("sreesha", expected.adminId.toLowerCase());
      const isPasswordValid = safeCompare("WrongPassword123", expected.password);
      const isCodeValid = safeCompare("8899", expected.securityCode);

      expect(isIdValid && isPasswordValid && isCodeValid).toBe(false);
    });

    it("fails when Level 3 (Security Code) is incorrect", () => {
      const isIdValid = safeCompare("sreesha", expected.adminId.toLowerCase());
      const isPasswordValid = safeCompare("Sreesha@Atelier2026", expected.password);
      const isCodeValid = safeCompare("1234", expected.securityCode);

      expect(isIdValid && isPasswordValid && isCodeValid).toBe(false);
    });
  });
});
