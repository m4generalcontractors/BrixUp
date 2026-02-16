import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deal Marketplace | BrixUp",
  description: "Browse vetted real estate investment deals",
  openGraph: { title: "Deal Marketplace | BrixUp", url: "/marketplace" },
  alternates: { canonical: "/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
