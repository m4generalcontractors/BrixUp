import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://www.brixups.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  title: "BrixUp — Stack Brix. Build Wealth. Together.",
  description:
    "The first tokenized real estate marketplace where investors, builders, and dealmakers unite under smart contracts to develop property — and share the profits. Invest in real estate starting at $500 with $BRXU on Base L2.",
  keywords: [
    "real estate",
    "tokenized",
    "blockchain",
    "investment",
    "construction",
    "Base L2",
    "BRXU token",
    "crowdfunding",
  ],
  openGraph: {
    title: "BrixUp — Stack Brix. Build Wealth. Together.",
    description:
      "The first tokenized real estate marketplace. Invest in real estate starting at $500 with $BRXU.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "BrixUp — Stack Brix. Build Wealth. Together.",
    description:
      "The first tokenized real estate marketplace. Invest in real estate starting at $500 with $BRXU.",
  },
  other: {
    "base:app_id": "698ffca2e0d5d2cf831b5b70",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-[var(--brix-bg)] text-[var(--brix-fg)] antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
