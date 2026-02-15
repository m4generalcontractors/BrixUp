const features = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: "Sweat Equity",
    description:
      "Contribute your trade, earn profit participation. Your skills are your investment.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Get Paid in $BRIX",
    description:
      "Convert to USDC anytime, instant ACH transfer. Real money for real work.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Brix Score",
    description:
      "On-chain reputation that unlocks better deals. Build your track record on the blockchain.",
  },
];

export default function ForBuilders() {
  return (
    <section id="for-builders" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-safety-orange/30 bg-safety-orange/10 px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-safety-orange">
              For Builders
            </span>
          </div>
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            Your Skills. Your Equity.{" "}
            <span className="text-gradient-gold">Your Future.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Stop trading time for money. Start building ownership.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-offwhite/10 bg-dark/50 p-8 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
                {feature.icon}
              </div>
              <h3 className="mt-6 font-[var(--font-display)] text-xl font-semibold text-offwhite">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-offwhite/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/login?mode=signup"
            className="inline-flex items-center rounded-lg bg-safety-orange px-8 py-4 text-base font-semibold text-white transition-all hover:bg-safety-orange/90 hover:shadow-lg hover:shadow-safety-orange/20"
          >
            Join the Builder Army
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <p className="mt-4 text-sm text-offwhite/60">
            Licensed contractors in NC, SC &amp; FL welcome.
          </p>
        </div>
      </div>
    </section>
  );
}
