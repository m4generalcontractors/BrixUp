const allocations = [
  { label: "Platform Treasury", pct: 40, color: "bg-charcoal", textColor: "text-offwhite" },
  { label: "Community Rewards", pct: 20, color: "bg-gold", textColor: "text-dark" },
  { label: "Team & Advisors", pct: 15, color: "bg-blueprint", textColor: "text-offwhite" },
  { label: "Liquidity Pool", pct: 10, color: "bg-success", textColor: "text-dark" },
  { label: "Marketing", pct: 10, color: "bg-safety-orange", textColor: "text-white" },
  { label: "Pre-sale", pct: 5, color: "bg-concrete", textColor: "text-offwhite" },
];

const utilities = [
  { icon: "🏠", label: "Deal Investment" },
  { icon: "🔨", label: "Contractor Payment" },
  { icon: "📈", label: "Staking Rewards" },
  { icon: "🗳️", label: "Governance Voting" },
];

const metrics = [
  { value: "0.5%", label: "Transaction Fee" },
  { value: "2-3%", label: "Origination" },
  { value: "$BRXU/USDC", label: "Trading Pair" },
];

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="bg-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            The <span className="text-gradient-gold">$BRXU</span> Token
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/90">
            ERC-20 on Base L2 &middot; 1B Total Supply
          </p>
        </div>

        {/* Allocation Bar */}
        <div className="mt-16">
          <h3 className="mb-6 text-center font-[var(--font-display)] text-lg font-semibold text-offwhite/90">
            Token Allocation
          </h3>

          {/* Stacked bar */}
          <div className="flex h-12 overflow-hidden rounded-xl sm:h-14">
            {allocations.map((alloc) => (
              <div
                key={alloc.label}
                className={`${alloc.color} flex items-center justify-center transition-all hover:opacity-90`}
                style={{ width: `${alloc.pct}%` }}
                title={`${alloc.label}: ${alloc.pct}%`}
              >
                <span className={`${alloc.textColor} text-xs font-bold sm:text-sm ${alloc.pct < 10 ? "hidden sm:inline" : ""}`}>
                  {alloc.pct}%
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3">
            {allocations.map((alloc) => (
              <div key={alloc.label} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-sm ${alloc.color}`} />
                <span className="text-sm text-offwhite/80">
                  {alloc.label} ({alloc.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Utility + Metrics */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Token Utility */}
          <div className="rounded-2xl border border-offwhite/10 bg-charcoal/30 p-8">
            <h3 className="font-[var(--font-display)] text-xl font-semibold text-offwhite">
              Token Utility
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {utilities.map((util) => (
                <div
                  key={util.label}
                  className="flex items-center gap-3 rounded-xl border border-offwhite/5 bg-dark/50 p-4"
                >
                  <span className="text-2xl">{util.icon}</span>
                  <span className="text-sm font-medium text-offwhite/90">
                    {util.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="rounded-2xl border border-offwhite/10 bg-charcoal/30 p-8">
            <h3 className="font-[var(--font-display)] text-xl font-semibold text-offwhite">
              Key Metrics
            </h3>
            <div className="mt-6 space-y-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between rounded-xl border border-offwhite/5 bg-dark/50 p-4"
                >
                  <span className="text-sm text-offwhite/90">{metric.label}</span>
                  <span className="font-[var(--font-display)] text-lg font-bold text-gold">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
