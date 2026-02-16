import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | BrixUp",
  description: "Manage your account preferences",
  openGraph: { title: "Settings | BrixUp", url: "/settings" },
  alternates: { canonical: "/settings" },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
