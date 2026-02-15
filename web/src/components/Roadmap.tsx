const milestones = [
  {
    quarter: "Q1 2026",
    title: "Platform Development",
    description:
      "Smart contracts, MVP app, brand launch. Building the foundation for tokenized real estate.",
    items: ["Smart contract development", "MVP web application", "Brand identity & launch"],
    status: "active",
  },
  {
    quarter: "Q2 2026",
    title: "Beta Launch",
    description:
      "50 beta users, first 10 deals, contractor onboarding. Testing the marketplace with real transactions.",
    items: ["50 beta users onboarded", "First 10 deals listed", "Contractor onboarding portal"],
    status: "upcoming",
  },
  {
    quarter: "Q3 2026",
    title: "Public Launch",
    description:
      "Token pre-sale, investor onboarding, 10 metro areas. Opening the platform to the public.",
    items: ["$BRIX token pre-sale", "Investor onboarding flow", "10 metro area coverage"],
    status: "upcoming",
  },
  {
    quarter: "Q4 2026",
    title: "Scale",
    description:
      "100+ deals, secondary market, mobile app, strategic partnerships. Scaling the ecosystem.",
    items: ["100+ active deals", "Secondary market trading", "Mobile app launch", "Strategic partnerships"],
    status: "upcoming",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            <span className="text-gradient-gold">Roadmap</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Our path from concept to scale. Building block by block.
          </p>
        </div>

        {/* Single responsive timeline — renders each milestone once */}
        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-[20px] top-0 bottom-0 w-px bg-offwhite/10 md:left-1/2 md:-translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((milestone, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={milestone.quarter} className="relative">
                  {/* Dot */}
                  <div className="absolute left-[20px] top-6 -translate-x-1/2 z-10 md:left-1/2">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        milestone.status === "active"
                          ? "border-gold bg-gold shadow-lg shadow-gold/30"
                          : "border-offwhite/40 bg-dark"
                      }`}
                    />
                  </div>

                  {/* Card — mobile: always left-aligned with pl-12; desktop: alternating sides */}
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}>
                    <div
                      className={`rounded-2xl border bg-dark/50 p-6 transition-all hover:border-gold/30 ${
                        milestone.status === "active"
                          ? "border-gold/20 shadow-lg shadow-gold/5"
                          : "border-offwhite/10"
                      }`}
                    >
                      <div className={`flex items-center gap-3 ${isLeft ? "md:justify-end" : ""}`}>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            milestone.status === "active"
                              ? "bg-gold/20 text-gold"
                              : "bg-offwhite/10 text-offwhite/70"
                          }`}
                        >
                          {milestone.quarter}
                        </span>
                        {milestone.status === "active" && (
                          <span className="inline-flex items-center gap-1 text-xs text-success">
                            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                            In Progress
                          </span>
                        )}
                      </div>
                      <h3
                        className={`mt-3 font-[var(--font-display)] text-xl font-semibold text-offwhite ${
                          isLeft ? "md:text-right" : ""
                        }`}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm text-offwhite/70 ${isLeft ? "md:text-right" : ""}`}
                      >
                        {milestone.description}
                      </p>
                      <ul className={`mt-4 space-y-1.5 ${isLeft ? "md:text-right" : ""}`}>
                        {milestone.items.map((item) => (
                          <li
                            key={item}
                            className={`flex items-center gap-2 text-sm text-offwhite/70 ${
                              isLeft ? "md:justify-end" : ""
                            }`}
                          >
                            <span className={`h-1 w-1 shrink-0 rounded-full bg-gold/50 ${isLeft ? "md:order-1" : ""}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
