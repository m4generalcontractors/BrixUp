import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: "var(--brix-bg)" }}
    >
      {/* Logo */}
      <Link href="/" className="mb-12 flex items-center gap-3">
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

      {/* 404 */}
      <div className="text-center">
        <p
          className="text-8xl font-bold tracking-tight sm:text-9xl"
          style={{ color: "#D4A843" }}
        >
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-base text-white/50">
          This property isn&apos;t on the market. Let&apos;s get you back to building wealth.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
        >
          Back to Home
        </Link>
        <Link
          href="/marketplace"
          className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40"
        >
          Browse Deals
        </Link>
      </div>

      {/* Decorative brick pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(212,168,67,0.5) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(212,168,67,0.5) 1px, transparent 1px)
        `,
        backgroundSize: "60px 30px",
      }} />
    </div>
  );
}
