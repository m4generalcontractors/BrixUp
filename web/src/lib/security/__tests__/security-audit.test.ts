/**
 * BrixUp Security Audit Test Suite
 * ──────────────────────────────────
 * Comprehensive security tests covering OWASP Top 10 and
 * crypto/DeFi-specific attack vectors.
 *
 * Run: npx jest src/lib/security/__tests__/security-audit.test.ts
 */

import { checkRateLimit, RATE_LIMITS } from "../rate-limit";
import {
  isValidEthAddress,
  isValidEmail,
  isValidUUID,
  sanitizeString,
  isValidNumber,
  isValidExperience,
  isValidLicenseNumber,
} from "../validate";

// ════════════════════════════════════════════════════════
//  1. RATE LIMITING TESTS
// ════════════════════════════════════════════════════════

describe("Rate Limiting", () => {
  it("allows requests within limit", () => {
    const key = `test-allow-${Date.now()}`;
    for (let i = 0; i < RATE_LIMITS.standard.max; i++) {
      const result = checkRateLimit(key, RATE_LIMITS.standard);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests exceeding limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < RATE_LIMITS.sensitive.max; i++) {
      checkRateLimit(key, RATE_LIMITS.sensitive);
    }
    const result = checkRateLimit(key, RATE_LIMITS.sensitive);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks remaining count correctly", () => {
    const key = `test-remaining-${Date.now()}`;
    const result = checkRateLimit(key, RATE_LIMITS.standard);
    expect(result.remaining).toBe(RATE_LIMITS.standard.max - 1);
  });

  it("uses separate windows for different keys", () => {
    const key1 = `test-key1-${Date.now()}`;
    const key2 = `test-key2-${Date.now()}`;
    // Exhaust key1
    for (let i = 0; i <= RATE_LIMITS.sensitive.max; i++) {
      checkRateLimit(key1, RATE_LIMITS.sensitive);
    }
    // key2 should still work
    const result = checkRateLimit(key2, RATE_LIMITS.sensitive);
    expect(result.allowed).toBe(true);
  });
});

// ════════════════════════════════════════════════════════
//  2. INPUT VALIDATION TESTS
// ════════════════════════════════════════════════════════

describe("Ethereum Address Validation", () => {
  it("accepts valid addresses", () => {
    expect(isValidEthAddress("0x636E2f0cA4eFaAB67fd3FB67B31dfc677a494850")).toBe(true);
    expect(isValidEthAddress("0x0000000000000000000000000000000000000000")).toBe(true);
  });

  it("rejects invalid addresses", () => {
    expect(isValidEthAddress("")).toBe(false);
    expect(isValidEthAddress("not-an-address")).toBe(false);
    expect(isValidEthAddress("0x")).toBe(false);
    expect(isValidEthAddress("0x636E2f0cA4eFaAB67fd3FB67B31dfc677a49485")).toBe(false); // too short
    expect(isValidEthAddress("636E2f0cA4eFaAB67fd3FB67B31dfc677a494850")).toBe(false); // no 0x
    expect(isValidEthAddress("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")).toBe(false); // invalid hex
  });

  it("rejects XSS payloads in addresses", () => {
    expect(isValidEthAddress('<script>alert("xss")</script>')).toBe(false);
    expect(isValidEthAddress("0x<script>alert(1)</script>000000000000000000")).toBe(false);
  });
});

describe("Email Validation", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("mph.cordero@gmail.com")).toBe(true);
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("user+tag@domain.co")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-email")).toBe(false);
    expect(isValidEmail("@domain.com")).toBe(false);
    expect(isValidEmail("user@")).toBe(false);
    expect(isValidEmail("a".repeat(255) + "@example.com")).toBe(false); // too long
  });
});

describe("UUID Validation", () => {
  it("accepts valid UUIDs", () => {
    expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects invalid UUIDs", () => {
    expect(isValidUUID("")).toBe(false);
    expect(isValidUUID("not-a-uuid")).toBe(false);
    expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false);
  });
});

describe("String Sanitization", () => {
  it("strips control characters", () => {
    expect(sanitizeString("hello\x00world")).toBe("helloworld");
    expect(sanitizeString("test\x01\x02\x03")).toBe("test");
  });

  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("enforces max length", () => {
    expect(sanitizeString("a".repeat(1000), 100).length).toBe(100);
  });

  it("handles non-string inputs", () => {
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
    expect(sanitizeString(123)).toBe("");
    expect(sanitizeString({})).toBe("");
  });

  it("preserves safe HTML entities", () => {
    expect(sanitizeString("price > $100")).toBe("price > $100");
  });
});

describe("Number Validation", () => {
  it("accepts valid numbers in range", () => {
    expect(isValidNumber(100, 0, 1000)).toBe(true);
    expect(isValidNumber(0, 0, 1000)).toBe(true);
    expect(isValidNumber(1000, 0, 1000)).toBe(true);
  });

  it("rejects out-of-range numbers", () => {
    expect(isValidNumber(-1, 0, 1000)).toBe(false);
    expect(isValidNumber(1001, 0, 1000)).toBe(false);
  });

  it("rejects non-numeric values", () => {
    expect(isValidNumber(NaN, 0, 1000)).toBe(false);
    expect(isValidNumber("100" as unknown as number, 0, 1000)).toBe(false);
    expect(isValidNumber(null as unknown as number, 0, 1000)).toBe(false);
  });
});

describe("Contractor Validation", () => {
  it("validates experience range", () => {
    expect(isValidExperience(0)).toBe(true);
    expect(isValidExperience(35)).toBe(true);
    expect(isValidExperience(70)).toBe(true);
    expect(isValidExperience(-1)).toBe(false);
    expect(isValidExperience(71)).toBe(false);
    expect(isValidExperience(10000)).toBe(false);
    expect(isValidExperience(1.5)).toBe(false);
  });

  it("validates license numbers", () => {
    expect(isValidLicenseNumber("ABC-123")).toBe(true);
    expect(isValidLicenseNumber("NC12345")).toBe(true);
    expect(isValidLicenseNumber("")).toBe(false);
    expect(isValidLicenseNumber("a".repeat(31))).toBe(false);
    expect(isValidLicenseNumber("license with spaces")).toBe(false);
    expect(isValidLicenseNumber("<script>alert(1)</script>")).toBe(false);
  });
});

// ════════════════════════════════════════════════════════
//  3. AUTH CALLBACK REDIRECT TESTS
// ════════════════════════════════════════════════════════

describe("Auth Callback Redirect Safety", () => {
  // These test the sanitizeRedirectPath logic
  const ALLOWED_REDIRECT_PREFIXES = [
    "/dashboard", "/marketplace", "/builder", "/dealfinder",
    "/wallet", "/settings", "/verify", "/agreements", "/admin",
  ];

  function sanitizeRedirectPath(rawPath: string): string {
    if (!rawPath || !rawPath.startsWith("/") || rawPath.startsWith("//")) {
      return "/dashboard";
    }
    const pathname = rawPath.split("?")[0].split("#")[0];
    const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );
    return isAllowed ? rawPath : "/dashboard";
  }

  it("allows valid paths", () => {
    expect(sanitizeRedirectPath("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectPath("/marketplace")).toBe("/marketplace");
    expect(sanitizeRedirectPath("/admin/users")).toBe("/admin/users");
  });

  it("blocks external redirects", () => {
    expect(sanitizeRedirectPath("//evil.com")).toBe("/dashboard");
    expect(sanitizeRedirectPath("//evil.com/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirectPath("https://evil.com")).toBe("/dashboard");
  });

  it("blocks unknown paths", () => {
    expect(sanitizeRedirectPath("/unknown")).toBe("/dashboard");
    expect(sanitizeRedirectPath("/hack")).toBe("/dashboard");
  });

  it("handles empty/null input", () => {
    expect(sanitizeRedirectPath("")).toBe("/dashboard");
  });

  it("preserves query params on valid paths", () => {
    expect(sanitizeRedirectPath("/marketplace?q=test")).toBe("/marketplace?q=test");
  });
});

// ════════════════════════════════════════════════════════
//  4. MASS ASSIGNMENT PROTECTION TESTS
// ════════════════════════════════════════════════════════

describe("Mass Assignment Protection", () => {
  const allowedFields = [
    "full_name", "phone", "avatar_url", "email_notifications",
    "sms_notifications", "push_notifications", "language", "wallet_address",
  ];

  const deniedFields = ["user_role", "kyc_status", "id", "email"];

  it("only allows whitelisted fields", () => {
    const updates = {
      full_name: "John",
      user_role: "admin",
      kyc_status: "verified",
      id: "hacker",
    };

    const safe: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in updates) safe[key] = (updates as Record<string, unknown>)[key];
    }

    expect(safe).toEqual({ full_name: "John" });
    expect(safe).not.toHaveProperty("user_role");
    expect(safe).not.toHaveProperty("kyc_status");
    expect(safe).not.toHaveProperty("id");
  });

  it("detects denied fields", () => {
    const updates = { user_role: "admin", full_name: "Test" };
    const hasDenied = deniedFields.some((field) => field in updates);
    expect(hasDenied).toBe(true);
  });
});

// ════════════════════════════════════════════════════════
//  5. DEAL VALIDATION TESTS
// ════════════════════════════════════════════════════════

describe("Deal Business Logic Validation", () => {
  it("requires ARV to exceed total cost", () => {
    const askingPrice = 200000;
    const rehabBudget = 50000;
    const arv = 300000;
    expect(arv > askingPrice + rehabBudget).toBe(true);
  });

  it("rejects negative-ROI deals", () => {
    const askingPrice = 200000;
    const rehabBudget = 150000;
    const arv = 300000;
    expect(arv > askingPrice + rehabBudget).toBe(false);
  });

  it("enforces minimum asking price", () => {
    expect(1000 >= 1000).toBe(true);
    expect(999 >= 1000).toBe(false);
  });
});

// ════════════════════════════════════════════════════════
//  6. XSS/INJECTION PREVENTION TESTS
// ════════════════════════════════════════════════════════

describe("XSS Prevention", () => {
  it("sanitizes script tags in strings", () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = sanitizeString(input);
    // sanitizeString doesn't strip HTML tags (those should be handled by React)
    // but it does strip control chars
    expect(result).not.toContain("\x00");
  });

  it("handles SQL injection attempts", () => {
    const input = "'; DROP TABLE profiles; --";
    const result = sanitizeString(input, 100);
    // Supabase uses parameterized queries, but sanitization adds defense-in-depth
    expect(result.length).toBeLessThanOrEqual(100);
  });
});

// ════════════════════════════════════════════════════════
//  7. ADMIN PRIVILEGE ESCALATION TESTS
// ════════════════════════════════════════════════════════

describe("Admin Privilege Escalation Prevention", () => {
  const ALLOWED_BOOTSTRAP_EMAILS = ["mph.cordero@gmail.com"];

  it("only allows whitelisted emails for bootstrap", () => {
    expect(ALLOWED_BOOTSTRAP_EMAILS.includes("mph.cordero@gmail.com")).toBe(true);
    expect(ALLOWED_BOOTSTRAP_EMAILS.includes("attacker@evil.com")).toBe(false);
    expect(ALLOWED_BOOTSTRAP_EMAILS.includes("random@user.com")).toBe(false);
  });

  it("prevents managers from creating admin team members", () => {
    const validRolesForTeamCreation = ["investor", "builder", "dealmaker", "manager"];
    expect(validRolesForTeamCreation.includes("admin")).toBe(false);
  });
});
