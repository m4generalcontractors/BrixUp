import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BrixUp — Stack Brix. Build Wealth. Together.",
  description:
    "The first tokenized real estate marketplace where investors, builders, and dealmakers unite under smart contracts to develop property — and share the profits. Invest in real estate starting at $500 with $BRIX on Base L2.",
  keywords: [
    "real estate",
    "tokenized",
    "blockchain",
    "investment",
    "construction",
    "Base L2",
    "BRIX token",
    "crowdfunding",
  ],
  openGraph: {
    title: "BrixUp — Stack Brix. Build Wealth. Together.",
    description:
      "The first tokenized real estate marketplace. Invest in real estate starting at $500 with $BRIX.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrixUp — Stack Brix. Build Wealth. Together.",
    description:
      "The first tokenized real estate marketplace. Invest in real estate starting at $500 with $BRIX.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} bg-dark text-offwhite antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
