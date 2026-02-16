import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Identity Verification | BrixUp",
  description: "Complete KYC/AML verification to invest in deals",
  openGraph: { title: "Identity Verification | BrixUp", url: "/verify" },
  alternates: { canonical: "/verify" },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
