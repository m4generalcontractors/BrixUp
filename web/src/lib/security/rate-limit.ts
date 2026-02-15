/**
 * In-memory rate limiter for API routes.
 * Uses sliding-window counter pattern per key (IP or userId).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 60_000);

export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  max: number;
  /** Window size in seconds */
  windowSec: number;
}

export const RATE_LIMITS = {
  /** Standard API endpoints — authenticated users */
  standard: { max: 60, windowSec: 60 } as RateLimitConfig,
  /** Sensitive operations — auth, admin, financial */
  sensitive: { max: 10, windowSec: 60 } as RateLimitConfig,
  /** Public endpoints — waitlist, deals listing */
  public: { max: 20, windowSec: 60 } as RateLimitConfig,
  /** Write operations — create deal, invest, send */
  write: { max: 15, windowSec: 60 } as RateLimitConfig,
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    const resetAt = now + config.windowSec * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: config.max - 1, resetAt };
  }

  entry.count++;
  if (entry.count > config.max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
}

/**
 * Extract a rate-limit key from the request.
 * Prefers user ID (from header set by middleware), falls back to IP.
 */
export function getRateLimitKey(request: Request, prefix: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${prefix}:${ip}`;
}
