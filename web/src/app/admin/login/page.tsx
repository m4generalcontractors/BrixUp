"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function AdminLoginForm() {
  const router = useRouter();
  const { signIn, signOut, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If user arrived here while logged in as non-admin, show notice
  const isAlreadyLoggedIn = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Sign out any existing session first to avoid conflicts
    if (isAlreadyLoggedIn) {
      await signOut();
      // Brief pause to let Supabase clear the session
      await new Promise((r) => setTimeout(r, 300));
    }

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Verify admin/manager role via API before redirecting
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const profile = await res.json();
        const role = profile?.user_role;
        if (role === "admin" || role === "manager") {
          router.push("/admin/tokens");
          return;
        }
      }

      // Not yet admin — attempt first-admin bootstrap (only succeeds for
      // whitelisted emails when no admin exists yet)
      try {
        const bootstrapRes = await fetch("/api/admin/setup", { method: "POST" });
        if (bootstrapRes.ok) {
          router.push("/admin/tokens");
          return;
        }
      } catch {
        // Bootstrap failed — fall through to access denied
      }

      // Not an admin — sign them out and show error
      await signOut();
      setError("Access denied. This login is restricted to administrators.");
      setLoading(false);
    } catch {
      await signOut();
      setError("Unable to verify admin privileges. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--brix-bg)" }}
    >
      <div className="w-full max-w-md">
        {/* Admin Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "#E8632B" }}>
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--brix-fg-muted)" }}>
            BrixUp Administration — Authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-[var(--brix-border)] p-8"
          style={{ backgroundColor: "var(--brix-surface)" }}
        >
          {/* Security badge */}
          <div className="mb-6 flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "#E8632B10", borderLeft: "3px solid #E8632B" }}>
            <svg className="h-4 w-4 shrink-0" style={{ color: "#E8632B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-xs font-medium" style={{ color: "#E8632B" }}>
              Secure admin access — requires admin or manager role
            </span>
          </div>

          {isAlreadyLoggedIn && !error && (
            <div className="mb-4 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#D4A84330", backgroundColor: "#D4A84310", color: "#D4A843" }}>
              You are currently logged in as a regular user. Enter admin credentials below — your current session will be signed out automatically.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brixups.com"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[var(--brix-border)] py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "var(--brix-bg)", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full rounded-lg border border-[var(--brix-border)] py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "var(--brix-bg)", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Verifying...
                </span>
              ) : (
                "Sign In to Admin"
              )}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-3">
          <Link
            href="/login"
            className="block text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#D4A843" }}
          >
            Go to User Login
          </Link>
          <Link
            href="/"
            className="block text-xs transition-colors hover:opacity-80"
            style={{ color: "var(--brix-fg-muted)" }}
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--brix-bg)" }}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8632B]" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
