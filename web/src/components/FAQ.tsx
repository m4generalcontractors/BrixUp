const faqs = [
  {
    question: "What is $BRIX?",
    answer:
      "$BRIX is the utility token powering the BrixUp marketplace. It is used for deal investment, contractor payments, staking rewards, and governance voting. Built as an ERC-20 token on Base (Ethereum L2 by Coinbase), it enables low-cost, fast transactions for real estate development.",
  },
  {
    question: "Do I need crypto experience?",
    answer:
      "No. Our embedded wallet experience means you can sign up with just an email. Fund your account with USDC via bank transfer, and start investing immediately. We handle the blockchain complexity so you can focus on real estate returns.",
  },
  {
    question: "How do contractors get paid?",
    answer:
      "Contractors are paid via a draw schedule in $BRIX, which is convertible to USDC at any time. Funds are released at each construction milestone, verified by on-site inspections and smart contract logic. Instant ACH transfers to your bank are available 24/7.",
  },
  {
    question: "Is this a security?",
    answer:
      "$BRIX is a utility token that provides access to platform features and services. Each real estate deal is structured as an SPV (Special Purpose Vehicle) LLC, with proper legal documentation and compliance. We work with securities attorneys to ensure full regulatory compliance.",
  },
  {
    question: "What's the minimum investment?",
    answer:
      "500 $BRIX (~$500 at launch price). This low minimum allows anyone to participate in real estate development deals that traditionally require $50,000+ to enter. Diversify across multiple properties and markets with small amounts.",
  },
  {
    question: "How are deals vetted?",
    answer:
      "Licensed General Contractors perform due diligence on every property, including full pro forma analysis, scope of work, and risk assessment. The BrixUp platform team reviews every listing before it goes live. Only deals meeting our quality standards are published.",
  },
  {
    question: "What blockchain is $BRIX on?",
    answer:
      "Base — the Ethereum L2 built by Coinbase. We chose Base for its low gas fees (typically under $0.01), fast transaction times (under 2 seconds), institutional-grade security, and growing ecosystem. It provides the reliability of Ethereum with the speed and cost efficiency needed for real estate transactions.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/50">
            Everything you need to know about BrixUp and $BRIX.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-offwhite/10 bg-dark/50 transition-all hover:border-offwhite/20"
            >
              <summary className="flex items-center justify-between p-6">
                <span className="pr-4 text-base font-medium text-offwhite">
                  {faq.question}
                </span>
                <span className="faq-chevron shrink-0 text-offwhite/40">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-sm leading-relaxed text-offwhite/50">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
