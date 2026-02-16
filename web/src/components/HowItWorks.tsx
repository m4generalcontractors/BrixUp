const steps = [
  {
    number: "01",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    title: "Find a Deal",
    description:
      "Wholesalers & agents list vetted properties with full pro forma analysis.",
  },
  {
    number: "02",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Fund with $BRXU",
    description:
      "Investors crowdfund the deal. Min $500 entry. Smart contract escrow.",
  },
  {
    number: "03",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1H21M3 21h18" />
      </svg>
    ),
    title: "Build Together",
    description:
      "Licensed GCs & subs execute the project. Draw schedule releases funds at each milestone.",
  },
  {
    number: "04",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: "Share Profits",
    description:
      "Upon sale, smart contract distributes: principal + interest + profit shares automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 id="how-it-works-heading" className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            How <span className="text-gradient-gold">BrixUp</span> Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            From deal discovery to profit distribution — all on-chain, all transparent.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Connecting line (desktop) */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] hidden h-0.5 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 md:block" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Step number circle */}
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl border border-gold/20 bg-dark/80" />
                <div className="relative flex flex-col items-center">
                  <div className="text-gold">{step.icon}</div>
                </div>
              </div>

              {/* Step number badge */}
              <div className="mx-auto -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-dark">
                {i + 1}
              </div>

              {/* Content */}
              <h3 className="mt-4 font-[var(--font-display)] text-lg font-semibold text-offwhite">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-offwhite/70">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
