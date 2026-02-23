/**
 * Audit logging for sensitive operations.
 * Logs to console in development; in production, integrate with
 * Sentry, Datadog, or a dedicated audit_logs table.
 */

export type AuditAction =
  | "admin.promote"
  | "admin.create_user"
  | "admin.update_role"
  | "admin.update_settings"
  | "user.login"
  | "user.signup"
  | "user.kyc_submit"
  | "user.invest"
  | "user.send"
  | "user.buy"
  | "user.stake"
  | "deal.create"
  | "deal.approve"
  | "contractor.register";

interface AuditEntry {
  action: AuditAction;
  userId: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  timestamp: string;
}

export function auditLog(entry: Omit<AuditEntry, "timestamp">) {
  const log: AuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  // Server-side only: log structured audit entries.
  // In production, replace with Sentry/Datadog/audit_logs table.
  if (typeof window === "undefined") {
    process.stdout.write(`[AUDIT] ${JSON.stringify(log)}\n`);
  }
}
