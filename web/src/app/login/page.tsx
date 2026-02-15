"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("investor");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Read ?mode=signup from URL
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup") setMode("signup");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (mode === "login") {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } else {
      if (!fullName.trim()) {
        setError("Full name is required");
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, fullName, role);
      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setSuccess("Account created! Check your email to confirm, then log in.");
        setMode("login");
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0D0D1A" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              BU
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              Brix<span style={{ color: "#D4A843" }}>Up</span>
            </span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: "#4A4A5A" }}>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your BrixUp account"}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/10 p-8"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          {/* Toggle */}
          <div className="mb-6 flex rounded-lg overflow-hidden" style={{ backgroundColor: "#0D0D1A" }}>
            <button
              onClick={() => { setMode("login"); setError(null); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: mode === "login" ? "#D4A843" : "transparent",
                color: mode === "login" ? "#0D0D1A" : "#4A4A5A",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(null); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: mode === "signup" ? "#D4A843" : "transparent",
                color: mode === "signup" ? "#0D0D1A" : "#4A4A5A",
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div
              className="mb-4 rounded-lg border px-4 py-3 text-sm"
              style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Miguel H. Peña"
                    required
                    className="w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                    style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "investor", label: "Investor" },
                      { value: "builder", label: "Builder" },
                      { value: "dealmaker", label: "Dealmaker" },
                    ].map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setRole(r.value)}
                        className="rounded-lg border py-2 text-xs font-medium transition-colors"
                        style={{
                          borderColor: role === r.value ? "#D4A843" : "rgba(255,255,255,0.1)",
                          backgroundColor: role === r.value ? "#D4A84320" : "transparent",
                          color: role === r.value ? "#D4A843" : "#F8F6F0",
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                className="w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs" style={{ color: "#4A4A5A" }}>or</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Google Sign In */}
          <button
            onClick={async () => {
              setGoogleLoading(true);
              setError(null);
              const result = await signInWithGoogle();
              if (result.error) {
                setError(result.error);
                setGoogleLoading(false);
              }
            }}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {mode === "login" && (
            <p className="mt-4 text-center text-xs" style={{ color: "#4A4A5A" }}>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-medium"
                style={{ color: "#D4A843" }}
              >
                Sign up
              </button>
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#4A4A5A" }}>
          By continuing, you agree to the BrixUp{" "}
          <Link href="/terms" className="underline" style={{ color: "#D4A843" }}>Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline" style={{ color: "#D4A843" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#0D0D1A" }}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
