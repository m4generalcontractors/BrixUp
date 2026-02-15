/**
 * Input validation and sanitization utilities for API routes.
 */

/** Validate Ethereum address format (0x + 40 hex chars) */
export function isValidEthAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Validate UUID format */
export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Sanitize a string for safe storage — strip control chars, limit length */
export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== "string") return "";
  // Remove control characters (except newlines/tabs) and trim
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim()
    .slice(0, maxLength);
}

/** Return a safe error response — never expose internal details */
export function safeError(message: string = "An error occurred") {
  return { error: message };
}

/** Validate numeric range */
export function isValidNumber(val: unknown, min: number, max: number): val is number {
  return typeof val === "number" && !isNaN(val) && val >= min && val <= max;
}

/** Validate contractor experience (0-70 years) */
export function isValidExperience(years: number): boolean {
  return Number.isInteger(years) && years >= 0 && years <= 70;
}

/** Validate license number format — alphanumeric, dashes, max 30 chars */
export function isValidLicenseNumber(license: string): boolean {
  return /^[A-Za-z0-9\-]{1,30}$/.test(license);
}
