const benefits = [
  "Fractional ownership starting at $500",
  "8-12% projected annual returns + profit share",
  "Smart contract transparency — see every dollar",
  "USDC on/off ramp — no crypto expertise needed",
  "Diversify across multiple deals and markets",
];

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-success"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function MockDashboard() {
  return (
    <div className="rounded-2xl border border-offwhite/10 bg-dark/80 p-6 shadow-2xl backdrop-blur-sm">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between border-b border-offwhite/10 pb-4">
        <div>
          <p className="text-sm text-offwhite/50">Portfolio Value</p>
          <p className="font-[var(--font-display)] text-2xl font-bold text-offwhite">
            $12,450<span className="text-sm text-success">.00</span>
          </p>
        </div>
        <div className="rounded-lg bg-success/10 px-3 py-1">
          <span className="text-sm font-semibold text-success">+11.2%</span>
        </div>
      </div>

      {/* Active Deals */}
      <div className="mt-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-offwhite/40">
          Active Deals
        </p>
        {[
          { name: "1423 Oak St Flip", status: "Building", progress: 65, amount: "$5,000" },
          { name: "Sunset Ave Duplex", status: "Funded", progress: 100, amount: "$4,200" },
          { name: "MLK Blvd Rehab", status: "Funding", progress: 40, amount: "$3,250" },
        ].map((deal) => (
          <div
            key={deal.name}
            className="flex items-center justify-between rounded-lg border border-offwhite/5 bg-charcoal/50 p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-offwhite">{deal.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-offwhite/10">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{ width: `${deal.progress}%` }}
                  />
                </div>
                <span className="text-xs text-offwhite/40">{deal.status}</span>
              </div>
            </div>
            <p className="ml-4 text-sm font-semibold text-gold">{deal.amount}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-charcoal/50 p-3">
          <p className="text-xs text-offwhite/40">Avg Return</p>
          <p className="font-[var(--font-display)] text-lg font-bold text-success">11.2%</p>
        </div>
        <div className="rounded-lg bg-charcoal/50 p-3">
          <p className="text-xs text-offwhite/40">$BRIX Balance</p>
          <p className="font-[var(--font-display)] text-lg font-bold text-gold">12,450</p>
        </div>
      </div>
    </div>
  );
}

export default function ForInvestors() {
  return (
    <section id="for-investors" className="bg-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blueprint/30 bg-blueprint/10 px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blueprint">
                For Investors
              </span>
            </div>
            <h2 className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl">
              Invest in Real Estate.{" "}
              <span className="text-gradient-gold">Without the Headaches.</span>
            </h2>
            <ul className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-base text-offwhite/70">{benefit}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="mt-8 inline-flex items-center rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-dark transition-all hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20"
            >
              View Active Deals
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>

          {/* Right Dashboard */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 rounded-3xl bg-gold/5 blur-2xl" />
            <MockDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
