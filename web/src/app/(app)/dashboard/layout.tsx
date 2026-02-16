import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | BrixUp",
  description: "View your portfolio, active deals, and returns",
  openGraph: { title: "Dashboard | BrixUp", url: "/dashboard" },
  alternates: { canonical: "/dashboard" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
