import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet | BrixUp",
  description: "Manage your $BRXU tokens, stake, and track transactions",
  openGraph: { title: "Wallet | BrixUp", url: "/wallet" },
  alternates: { canonical: "/wallet" },
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
