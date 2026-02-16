import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agreements | BrixUp",
  description: "View and sign legal documents",
  openGraph: { title: "Agreements | BrixUp", url: "/agreements" },
  alternates: { canonical: "/agreements" },
};

export default function AgreementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
