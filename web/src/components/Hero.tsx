export default function Hero() {
  return (
    <section aria-label="Hero" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark">
      {/* Blueprint grid background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(43, 76, 126, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(43, 76, 126, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }} />

      {/* Brick pattern overlay */}
      <div className="brick-pattern absolute inset-0" />

      {/* Building silhouette skyline — bottom */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1]">
        <svg viewBox="0 0 1440 320" className="w-full h-[140px] sm:h-[200px] lg:h-[280px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skyline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" stopOpacity="0" />
              <stop offset="60%" stopColor="#1A1A2E" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0D0D1A" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Distant buildings */}
          <rect x="60" y="180" width="50" height="140" fill="rgba(43,76,126,0.08)" rx="2" />
          <rect x="120" y="140" width="40" height="180" fill="rgba(43,76,126,0.06)" rx="2" />
          <rect x="170" y="160" width="60" height="160" fill="rgba(43,76,126,0.07)" rx="2" />
          <rect x="280" y="120" width="45" height="200" fill="rgba(212,168,67,0.05)" rx="2" />
          <rect x="340" y="150" width="55" height="170" fill="rgba(43,76,126,0.06)" rx="2" />
          <rect x="460" y="100" width="50" height="220" fill="rgba(43,76,126,0.08)" rx="2" />
          <rect x="520" y="130" width="35" height="190" fill="rgba(212,168,67,0.04)" rx="2" />
          <rect x="620" y="110" width="60" height="210" fill="rgba(43,76,126,0.07)" rx="2" />
          <rect x="700" y="150" width="40" height="170" fill="rgba(43,76,126,0.05)" rx="2" />
          <rect x="800" y="90" width="55" height="230" fill="rgba(212,168,67,0.06)" rx="2" />
          <rect x="870" y="140" width="45" height="180" fill="rgba(43,76,126,0.07)" rx="2" />
          <rect x="970" y="120" width="50" height="200" fill="rgba(43,76,126,0.06)" rx="2" />
          <rect x="1040" y="160" width="65" height="160" fill="rgba(43,76,126,0.08)" rx="2" />
          <rect x="1150" y="100" width="40" height="220" fill="rgba(212,168,67,0.05)" rx="2" />
          <rect x="1210" y="140" width="55" height="180" fill="rgba(43,76,126,0.06)" rx="2" />
          <rect x="1300" y="170" width="50" height="150" fill="rgba(43,76,126,0.07)" rx="2" />
          <rect x="1370" y="130" width="40" height="190" fill="rgba(212,168,67,0.04)" rx="2" />
          {/* Building windows — tiny dots of light */}
          {[60,120,280,460,620,800,970,1150].map((x) =>
            [0,1,2,3,4].map((row) =>
              [0,1].map((col) => (
                <rect key={`${x}-${row}-${col}`} x={x + 8 + col * 20} y={200 + row * 22} width="4" height="4" rx="0.5" fill="rgba(212,168,67,0.12)" />
              ))
            )
          )}
          <rect y="280" width="1440" height="40" fill="url(#skyline-grad)" />
        </svg>
      </div>

      {/* Radial gold glow — center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full" style={{
        background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)",
      }} />

      {/* Floating brick elements - hidden on very small screens */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="animate-float-brick absolute left-[10%] top-[20%] h-12 w-20 rounded-sm bg-gold/10" />
        <div className="animate-float-brick-slow absolute right-[15%] top-[30%] h-8 w-14 rounded-sm bg-blueprint/10" />
        <div className="animate-float-brick-reverse absolute left-[20%] bottom-[25%] h-10 w-16 rounded-sm bg-gold/8" />
        <div className="animate-float-brick absolute right-[25%] bottom-[35%] h-6 w-10 rounded-sm bg-safety-orange/8" />
        <div className="animate-float-brick-slow absolute left-[60%] top-[15%] h-14 w-24 rounded-sm bg-blueprint/6" />
        <div className="animate-float-brick-reverse absolute right-[40%] top-[60%] h-8 w-12 rounded-sm bg-gold/6" />
        <div className="animate-float-brick absolute left-[5%] top-[70%] h-10 w-18 rounded-sm bg-concrete/8" />
        <div className="animate-float-brick-slow absolute right-[8%] bottom-[15%] h-12 w-20 rounded-sm bg-gold/5" />
        {/* Additional real estate elements */}
        <div className="animate-float-brick absolute left-[45%] top-[10%] h-6 w-6 rotate-45 border border-gold/10" />
        <div className="animate-float-brick-slow absolute left-[75%] top-[45%] h-8 w-8 rotate-12 border border-blueprint/10" />
        <div className="animate-float-brick-reverse absolute left-[30%] top-[75%] h-5 w-5 rotate-45 border border-gold/8" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-transparent to-dark" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-medium text-gold">Building on Base L2</span>
        </div>

        {/* Headline */}
        <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="text-offwhite">Stack Brix. </span>
          <span className="text-gradient-gold">Build Wealth.</span>
          <br />
          <span className="text-offwhite">Together.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-offwhite/80 sm:text-xl">
          The first tokenized real estate marketplace where investors, builders,
          and dealmakers unite under smart contracts to develop property — and
          share the profits.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#for-investors"
            className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/25 sm:w-auto"
          >
            Start Investing
          </a>
          <a
            href="#for-builders"
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-offwhite/20 px-8 py-4 text-base font-semibold text-offwhite transition-all hover:border-gold hover:text-gold sm:w-auto"
          >
            Join as Builder
          </a>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              $12M+
            </p>
            <p className="mt-1 text-sm text-offwhite/70">Deal Pipeline</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              200+
            </p>
            <p className="mt-1 text-sm text-offwhite/70">Contractors</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              $500
            </p>
            <p className="mt-1 text-sm text-offwhite/70">Min Investment</p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />
    </section>
  );
}
