const hiringRoles = [
  { role: "CTO", label: "Now Hiring" },
  { role: "Head of Legal", label: "Now Hiring" },
  { role: "Head of Growth", label: "Now Hiring" },
];

export default function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="bg-dark py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 id="team-heading" className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl lg:text-5xl">
            Built by <span className="text-gradient-gold">Builders</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Real construction experience meets blockchain innovation.
          </p>
        </div>

        {/* Team Grid */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Founder Card */}
          <div className="rounded-2xl border border-gold/20 bg-charcoal/30 p-8 shadow-lg shadow-gold/5 sm:col-span-2 lg:col-span-1">
            {/* Avatar placeholder */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gold/10">
              <span className="font-[var(--font-display)] text-3xl font-bold text-gold">MHP</span>
            </div>
            <div className="mt-6 text-center">
              <h3 className="font-[var(--font-display)] text-xl font-semibold text-offwhite">
                Miguel H. Pe&ntilde;a
              </h3>
              <p className="mt-1 text-sm font-medium text-gold">Founder & CEO</p>
              <p className="mt-4 text-sm leading-relaxed text-offwhite/70">
                15+ years in construction. Licensed GC in NC, SC & FL. Built M4
                Development Holdings from the ground up. Now tokenizing the
                future of real estate.
              </p>
              {/* Social icons */}
              <div className="mt-4 flex justify-center gap-3">
                <a href="https://www.linkedin.com/in/miguelhpena/" target="_blank" rel="noopener noreferrer" className="text-offwhite/60 transition-colors hover:text-gold" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/BrixUpHQ" target="_blank" rel="noopener noreferrer" className="text-offwhite/60 transition-colors hover:text-gold" aria-label="Twitter / X">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Open Roles */}
          {hiringRoles.map((role) => (
            <a
              key={role.role}
              href="mailto:careers@brixups.com"
              className="flex flex-col items-center justify-center rounded-2xl border border-gold/10 border-dashed bg-charcoal/10 p-8 transition-colors hover:border-gold/30 hover:bg-charcoal/20"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gold/5">
                <svg className="h-10 w-10 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="mt-6 text-sm font-semibold text-gold/70">
                {role.label}
              </p>
              <p className="mt-1 text-sm text-offwhite/50">{role.role}</p>
            </a>
          ))}
        </div>

        {/* Join CTA */}
        <div className="mt-12 text-center">
          <a
            href="mailto:careers@brixups.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-light"
          >
            Join Our Team
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
