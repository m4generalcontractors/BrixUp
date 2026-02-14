export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark">
      {/* Brick pattern overlay */}
      <div className="brick-pattern absolute inset-0" />

      {/* Floating brick elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-brick absolute left-[10%] top-[20%] h-12 w-20 rounded-sm bg-gold/10" />
        <div className="animate-float-brick-slow absolute right-[15%] top-[30%] h-8 w-14 rounded-sm bg-blueprint/10" />
        <div className="animate-float-brick-reverse absolute left-[20%] bottom-[25%] h-10 w-16 rounded-sm bg-gold/8" />
        <div className="animate-float-brick absolute right-[25%] bottom-[35%] h-6 w-10 rounded-sm bg-safety-orange/8" />
        <div className="animate-float-brick-slow absolute left-[60%] top-[15%] h-14 w-24 rounded-sm bg-blueprint/6" />
        <div className="animate-float-brick-reverse absolute right-[40%] top-[60%] h-8 w-12 rounded-sm bg-gold/6" />
        <div className="animate-float-brick absolute left-[5%] top-[70%] h-10 w-18 rounded-sm bg-concrete/8" />
        <div className="animate-float-brick-slow absolute right-[8%] bottom-[15%] h-12 w-20 rounded-sm bg-gold/5" />
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
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-offwhite/60 sm:text-xl">
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
          <div className="animate-count-up">
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              $12M+
            </p>
            <p className="mt-1 text-sm text-offwhite/50">Deal Pipeline</p>
          </div>
          <div className="animate-count-up delay-200">
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              200+
            </p>
            <p className="mt-1 text-sm text-offwhite/50">Contractors</p>
          </div>
          <div className="animate-count-up delay-400">
            <p className="font-[var(--font-display)] text-3xl font-bold text-gold sm:text-4xl">
              3
            </p>
            <p className="mt-1 text-sm text-offwhite/50">State Licenses</p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent" />
    </section>
  );
}
