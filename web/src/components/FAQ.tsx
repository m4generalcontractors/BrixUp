"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is $BRXU?",
    answer:
      "$BRXU is the utility token powering the BrixUp marketplace. It is used for deal investment, contractor payments, staking rewards, and governance voting. Built as an ERC-20 token on Base (Ethereum L2 by Coinbase), it enables low-cost, fast transactions for real estate development.",
  },
  {
    question: "Do I need crypto experience?",
    answer:
      "No. Our embedded wallet experience means you can sign up with just an email. Fund your account with USDC via bank transfer, and start investing immediately. We handle the blockchain complexity so you can focus on real estate returns.",
  },
  {
    question: "How do contractors get paid?",
    answer:
      "Contractors are paid via a draw schedule in $BRXU, which is convertible to USDC at any time. Funds are released at each construction milestone, verified by on-site inspections and smart contract logic. Instant ACH transfers to your bank are available 24/7.",
  },
  {
    question: "Is this a security?",
    answer:
      "$BRXU is a utility token that provides access to platform features and services. Each real estate deal is structured as an SPV (Special Purpose Vehicle) LLC, with proper legal documentation and compliance. We work with securities attorneys to ensure full regulatory compliance.",
  },
  {
    question: "What's the minimum investment?",
    answer:
      "500 $BRXU (~$500 at launch price). This low minimum allows anyone to participate in real estate development deals that traditionally require $50,000+ to enter. Diversify across multiple properties and markets with small amounts.",
  },
  {
    question: "How are deals vetted?",
    answer:
      "Licensed General Contractors perform due diligence on every property, including full pro forma analysis, scope of work, and risk assessment. The BrixUp platform team reviews every listing before it goes live. Only deals meeting our quality standards are published.",
  },
  {
    question: "What blockchain is $BRXU on?",
    answer:
      "Base — the Ethereum L2 built by Coinbase. We chose Base for its low gas fees (typically under $0.01), fast transaction times (under 2 seconds), institutional-grade security, and growing ecosystem. It provides the reliability of Ethereum with the speed and cost efficiency needed for real estate transactions.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-charcoal py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 id="faq-heading" className="font-[var(--font-display)] text-3xl font-bold text-offwhite sm:text-4xl">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-offwhite/70">
            Everything you need to know about BrixUp and $BRXU.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border bg-dark/50 transition-all ${
                  isOpen ? "border-gold/30" : "border-offwhite/10 hover:border-offwhite/20"
                }`}
              >
                <button
                  id={buttonId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="pr-4 text-base font-medium text-offwhite">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 text-offwhite/60 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
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
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-relaxed text-offwhite/70">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
