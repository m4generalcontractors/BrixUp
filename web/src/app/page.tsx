import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ForInvestors from "@/components/ForInvestors";
import ForBuilders from "@/components/ForBuilders";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Team from "@/components/Team";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BrixUp Technologies LLC",
    url: "https://www.brixups.com",
    logo: "https://www.brixups.com/logo.png",
    sameAs: [
      "https://x.com/BrixUpHQ",
      "https://discord.gg/brixup",
      "https://t.me/BrixUpHQ",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BrixUp",
    url: "https://www.brixups.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.brixups.com/marketplace?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-dark focus:font-semibold">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <ForInvestors />
        <ForBuilders />
        <Tokenomics />
        <Roadmap />
        <Team />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
