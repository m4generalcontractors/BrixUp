import type { Metadata } from "next";
import { getDealById } from "@/lib/deals-data";

export async function generateMetadata({ params }: { params: Promise<{ dealId: string }> }): Promise<Metadata> {
  const { dealId } = await params;
  const deal = getDealById(dealId);
  if (!deal) {
    return { title: "Deal Not Found | BrixUp" };
  }
  const title = `${deal.address} — ${deal.propertyType} | BrixUp`;
  return {
    title,
    description: deal.description,
    openGraph: { title, url: `/marketplace/${dealId}` },
    alternates: { canonical: `/marketplace/${dealId}` },
  };
}

export default function DealDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
