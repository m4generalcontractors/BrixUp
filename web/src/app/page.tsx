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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
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
