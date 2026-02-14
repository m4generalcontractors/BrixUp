"use client";

import { useState, type FormEvent } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-dark to-gold" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="brick-pattern h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-display)] text-3xl font-bold text-dark sm:text-4xl lg:text-5xl">
          Ready to Build Wealth Together?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-dark/70">
          Join the waitlist for early access to the BrixUp platform and $BRIX token pre-sale.
        </p>

        {/* Email Form */}
        {submitted ? (
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-dark/10 p-6">
            <div className="flex items-center justify-center gap-2">
              <svg className="h-6 w-6 text-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-base font-semibold text-dark">
                You&apos;re on the list!
              </span>
            </div>
            <p className="mt-2 text-sm text-dark/60">
              We&apos;ll be in touch with early access details soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-dark/20 bg-dark/10 px-4 py-3 text-dark placeholder:text-dark/40 focus:border-dark/40 focus:outline-none focus:ring-2 focus:ring-dark/20"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-dark px-6 py-3 font-semibold text-gold transition-all hover:bg-dark/90 hover:shadow-lg disabled:opacity-70"
              >
                {submitting ? "Joining..." : "Join Waitlist"}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </form>
        )}

        <p className="mt-6 text-sm text-dark/50">
          Join 2,000+ builders and investors on the waitlist
        </p>
      </div>
    </section>
  );
}
