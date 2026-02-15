/**
 * BrixUp Validation Schemas
 *
 * Zod schemas for all user inputs — amounts, addresses, forms.
 * Used across wallet modals, deal invest flow, and admin portal.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
//  Amount validation
// ---------------------------------------------------------------------------

/** Validates a numeric BRIX amount string. */
export const amountSchema = z
  .string()
  .min(1, "Amount is required")
  .refine((val) => {
    const num = parseFloat(val.replace(/,/g, ""));
    return !isNaN(num) && isFinite(num);
  }, "Please enter a valid number")
  .refine((val) => {
    const num = parseFloat(val.replace(/,/g, ""));
    return num > 0;
  }, "Amount must be greater than 0");

/** Creates a schema with balance and minimum checks. */
export function createAmountSchema(opts: {
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}) {
  let schema = amountSchema;

  if (opts.min !== undefined) {
    const minVal = opts.min;
    const label = opts.minLabel || `Minimum is ${minVal.toLocaleString()} BRIX`;
    schema = schema.refine((val) => {
      const num = parseFloat(val.replace(/,/g, ""));
      return num >= minVal;
    }, label);
  }

  if (opts.max !== undefined) {
    const maxVal = opts.max;
    const label = opts.maxLabel || `Insufficient balance (max ${maxVal.toLocaleString()} BRIX)`;
    schema = schema.refine((val) => {
      const num = parseFloat(val.replace(/,/g, ""));
      return num <= maxVal;
    }, label);
  }

  return schema;
}

/** Parse a validated amount string to number. */
export function parseAmount(val: string): number {
  return parseFloat(val.replace(/,/g, "")) || 0;
}

/** Simple imperative validation for amount inputs. */
export function validateAmount(
  value: string,
  balance: number,
  min: number = 1
): { valid: boolean; error: string | null } {
  const num = Number(value.replace(/,/g, ""));
  if (value.trim() === "" || isNaN(num))
    return { valid: false, error: "Please enter a valid number" };
  if (num <= 0)
    return { valid: false, error: "Amount must be greater than 0" };
  if (num < min)
    return { valid: false, error: `Minimum amount is ${min.toLocaleString()} BRIX` };
  if (num > balance)
    return { valid: false, error: `Insufficient balance (${balance.toLocaleString()} BRIX available)` };
  return { valid: true, error: null };
}

/** Strip non-numeric characters (keep digits + one decimal point). */
export function sanitizeAmountInput(value: string): string {
  // Allow digits, commas, and at most one decimal point
  const cleaned = value.replace(/[^0-9.,]/g, "");
  // Remove extra decimal points (keep only the first)
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
}

// ---------------------------------------------------------------------------
//  Ethereum address validation
// ---------------------------------------------------------------------------

export const ethAddressSchema = z
  .string()
  .min(1, "Wallet address is required")
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid Ethereum address (must be 0x + 40 hex characters)");

/** Address schema that also prevents sending to self. */
export function createAddressSchema(selfAddress?: string) {
  let schema = ethAddressSchema;
  if (selfAddress) {
    schema = schema.refine(
      (val) => val.toLowerCase() !== selfAddress.toLowerCase(),
      "Cannot send to your own address"
    );
  }
  return schema;
}

// ---------------------------------------------------------------------------
//  Email validation
// ---------------------------------------------------------------------------

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// ---------------------------------------------------------------------------
//  Investment validation
// ---------------------------------------------------------------------------

export const investmentSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  riskAcknowledged: z.boolean().refine((val) => val === true, "You must acknowledge the risk"),
});

/** Creates investment schema with deal-specific constraints. */
export function createInvestmentSchema(opts: {
  minInvestment: number;
  maxCapacity: number;
  balance: number;
}) {
  return z.object({
    amount: createAmountSchema({
      min: opts.minInvestment,
      max: Math.min(opts.maxCapacity, opts.balance),
      minLabel: `Minimum investment is ${opts.minInvestment.toLocaleString()} BRIX`,
      maxLabel: opts.balance < opts.minInvestment
        ? `Insufficient balance (you have ${opts.balance.toLocaleString()} BRIX)`
        : `Exceeds remaining capacity (${opts.maxCapacity.toLocaleString()} BRIX available)`,
    }),
    riskAcknowledged: z.boolean().refine((val) => val === true, "You must acknowledge the investment risk"),
  });
}

// ---------------------------------------------------------------------------
//  Admin - Deal creation
// ---------------------------------------------------------------------------

export const createDealSchema = z.object({
  address: z.string().min(3, "Property address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  capitalNeeded: z.string().refine((v) => parseFloat(v.replace(/,/g, "")) >= 10000, "Capital must be at least $10,000"),
  milestones: z.number().int().min(1, "At least 1 milestone required").max(20, "Maximum 20 milestones"),
  investorSplit: z.number().min(0).max(100, "Must be 0-100"),
  builderSplit: z.number().min(0).max(100, "Must be 0-100"),
  platformSplit: z.number().min(0).max(100, "Must be 0-100"),
  dealMakerSplit: z.number().min(0).max(100, "Must be 0-100"),
}).refine(
  (data) => data.investorSplit + data.builderSplit + data.platformSplit + data.dealMakerSplit === 100,
  { message: "Profit splits must sum to exactly 100%", path: ["investorSplit"] }
);

// ---------------------------------------------------------------------------
//  Validate helper
// ---------------------------------------------------------------------------

/** Validates a value against a Zod schema. Returns error message or null. */
export function validate<T>(schema: z.ZodType<T>, value: unknown): string | null {
  const result = schema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message || "Invalid input";
}
