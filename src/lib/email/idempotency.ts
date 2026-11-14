/**
 * Sreesha Elegance — Email Idempotency & Webhook Deduplication Guard
 * Prevents duplicate email dispatches during network retries or webhook replays.
 */

interface SentEmailRecord {
  id: string;
  timestamp: number;
}

const sentCache = new Map<string, SentEmailRecord>();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes window

export function isEmailDuplicate(
  key: string,
  ttlMs: number = DEFAULT_TTL_MS
): SentEmailRecord | null {
  const existing = sentCache.get(key);
  if (!existing) return null;

  if (Date.now() - existing.timestamp > ttlMs) {
    sentCache.delete(key);
    return null;
  }

  return existing;
}

export function recordSentEmail(key: string, id: string): void {
  sentCache.set(key, { id, timestamp: Date.now() });

  // Clean up stale entries periodically
  if (sentCache.size > 2000) {
    const now = Date.now();
    for (const [k, rec] of sentCache.entries()) {
      if (now - rec.timestamp > DEFAULT_TTL_MS) {
        sentCache.delete(k);
      }
    }
  }
}
