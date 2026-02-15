"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import { useBrixApprove, useInvestInDeal, parseBrix } from "@/lib/contracts/hooks";
import { CONTRACTS_DEPLOYED, BRIX_TOKEN_ADDRESS } from "@/lib/contracts/config";
import { validate, createAmountSchema, parseAmount } from "@/lib/validation";

interface Deal {
  address: string; city: string; state: string; zip: string; type: string;
  capitalNeeded: number; askingPrice: number; rehabBudget: number; arv: number;
  funded: number; fundedAmount: number; roi: number; timeline: string;
  beds: number; baths: number; sqft: number; yearBuilt: number; lotSize: string;
  investorCount: number; minInvestment: number; description: string; imageUrl: string;
  listedDate: string; fundingDeadline: string; estCompletion: string;
}

const allDeals: Record<string, Deal> = {
  "deal-001": { address: "1847 Oakwood Dr", city: "Charlotte", state: "NC", zip: "28205", type: "Flip", capitalNeeded: 285000, askingPrice: 195000, rehabBudget: 85000, arv: 360000, funded: 67, fundedAmount: 190950, roi: 22, timeline: "6 months", beds: 3, baths: 2, sqft: 1850, yearBuilt: 1978, lotSize: "0.28 acres", investorCount: 24, minInvestment: 1000, description: "Distressed single-family in Plaza Midwood. Full cosmetic reno — kitchen, baths, flooring, exterior. 15% neighborhood appreciation in 12 months.", imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop", listedDate: "Dec 15, 2025", fundingDeadline: "Feb 28, 2026", estCompletion: "Jun 15, 2026" },
  "deal-002": { address: "412 Magnolia Ln", city: "Raleigh", state: "NC", zip: "27601", type: "New Build", capitalNeeded: 520000, askingPrice: 120000, rehabBudget: 380000, arv: 680000, funded: 43, fundedAmount: 223600, roi: 28, timeline: "12 months", beds: 4, baths: 3, sqft: 2800, yearBuilt: 2026, lotSize: "0.35 acres", investorCount: 18, minInvestment: 1000, description: "Ground-up new construction in Raleigh's tech corridor. Modern open plan, energy efficient, smart home ready.", imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop", listedDate: "Jan 5, 2026", fundingDeadline: "Mar 15, 2026", estCompletion: "Jan 5, 2027" },
  "deal-003": { address: "903 Pine Valley Rd", city: "Greenville", state: "SC", zip: "29601", type: "Value-Add", capitalNeeded: 175000, askingPrice: 135000, rehabBudget: 40000, arv: 245000, funded: 89, fundedAmount: 155750, roi: 16, timeline: "4 months", beds: 2, baths: 1, sqft: 1200, yearBuilt: 1965, lotSize: "0.18 acres", investorCount: 31, minInvestment: 500, description: "Small single-family with great bones. Cosmetic updates — kitchen, bath refresh, paint, landscaping.", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop", listedDate: "Nov 20, 2025", fundingDeadline: "Jan 31, 2026", estCompletion: "Apr 15, 2026" },
  "deal-004": { address: "2215 Bayshore Blvd", city: "Tampa", state: "FL", zip: "33611", type: "Flip", capitalNeeded: 340000, askingPrice: 245000, rehabBudget: 90000, arv: 475000, funded: 52, fundedAmount: 176800, roi: 25, timeline: "8 months", beds: 4, baths: 2, sqft: 2100, yearBuilt: 1985, lotSize: "0.32 acres", investorCount: 15, minInvestment: 1000, description: "Waterfront-adjacent flip in South Tampa. Full interior reno plus pool resurfacing. Rising comps.", imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop", listedDate: "Jan 20, 2026", fundingDeadline: "Mar 20, 2026", estCompletion: "Sep 20, 2026" },
  "deal-005": { address: "567 Elm Creek Way", city: "Charlotte", state: "NC", zip: "28202", type: "New Build", capitalNeeded: 450000, askingPrice: 95000, rehabBudget: 350000, arv: 620000, funded: 31, fundedAmount: 139500, roi: 30, timeline: "14 months", beds: 5, baths: 4, sqft: 3200, yearBuilt: 2026, lotSize: "0.45 acres", investorCount: 12, minInvestment: 1000, description: "Luxury new build in South End Charlotte. High-end finishes, open concept, large lot.", imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=500&fit=crop", listedDate: "Feb 14, 2026", fundingDeadline: "Apr 14, 2026", estCompletion: "Apr 14, 2027" },
  "deal-006": { address: "1100 Riverside Ave", city: "Raleigh", state: "NC", zip: "27603", type: "Value-Add", capitalNeeded: 210000, askingPrice: 165000, rehabBudget: 45000, arv: 310000, funded: 75, fundedAmount: 157500, roi: 19, timeline: "5 months", beds: 3, baths: 2, sqft: 1650, yearBuilt: 1972, lotSize: "0.25 acres", investorCount: 22, minInvestment: 500, description: "Value-add near NC State. Updated kitchen/bath, HVAC, curb appeal. Strong rental and flip exits.", imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop", listedDate: "Jan 10, 2026", fundingDeadline: "Mar 10, 2026", estCompletion: "Jun 10, 2026" },
  "deal-007": { address: "824 Palmetto St", city: "Charleston", state: "SC", zip: "29401", type: "Flip", capitalNeeded: 310000, askingPrice: 210000, rehabBudget: 95000, arv: 420000, funded: 58, fundedAmount: 179800, roi: 24, timeline: "7 months", beds: 3, baths: 2, sqft: 1780, yearBuilt: 1955, lotSize: "0.22 acres", investorCount: 19, minInvestment: 1000, description: "Historic Charleston flip. Full reno preserving period details while modernizing systems.", imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop", listedDate: "Feb 1, 2026", fundingDeadline: "Apr 1, 2026", estCompletion: "Sep 1, 2026" },
  "deal-008": { address: "3301 Peachtree Rd", city: "Atlanta", state: "GA", zip: "30326", type: "New Build", capitalNeeded: 680000, askingPrice: 180000, rehabBudget: 490000, arv: 920000, funded: 22, fundedAmount: 149600, roi: 32, timeline: "16 months", beds: 5, baths: 4, sqft: 3800, yearBuilt: 2026, lotSize: "0.55 acres", investorCount: 8, minInvestment: 2000, description: "Premium new construction in Buckhead. Custom design, luxury finishes, pool, smart home.", imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop", listedDate: "Feb 10, 2026", fundingDeadline: "May 10, 2026", estCompletion: "Jun 10, 2027" },
  "deal-009": { address: "156 Ocean Blvd", city: "Jacksonville", state: "FL", zip: "32250", type: "Value-Add", capitalNeeded: 245000, askingPrice: 189000, rehabBudget: 55000, arv: 340000, funded: 61, fundedAmount: 149450, roi: 18, timeline: "5 months", beds: 3, baths: 2, sqft: 1500, yearBuilt: 1982, lotSize: "0.20 acres", investorCount: 20, minInvestment: 500, description: "Beach-area value-add near Jax Beach. Kitchen/bath, new roof, deck addition for coastal premium.", imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18f6b6637?w=800&h=500&fit=crop", listedDate: "Jan 25, 2026", fundingDeadline: "Mar 25, 2026", estCompletion: "Jun 25, 2026" },
  "deal-010": { address: "2900 Lake Norman Dr", city: "Mooresville", state: "NC", zip: "28117", type: "Wholesale", capitalNeeded: 155000, askingPrice: 125000, rehabBudget: 30000, arv: 220000, funded: 94, fundedAmount: 145700, roi: 15, timeline: "3 months", beds: 2, baths: 1, sqft: 1100, yearBuilt: 1960, lotSize: "0.15 acres", investorCount: 28, minInvestment: 500, description: "Wholesale near Lake Norman. Light cosmetic work. Strong cash flow as rental or quick flip.", imageUrl: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=500&fit=crop", listedDate: "Dec 20, 2025", fundingDeadline: "Feb 20, 2026", estCompletion: "Mar 20, 2026" },
};

const drawSchedule = [
  { milestone: "Foundation", status: "Completed", amount: 18000, date: "Jan 15, 2026" },
  { milestone: "Framing", status: "Completed", amount: 22000, date: "Feb 10, 2026" },
  { milestone: "MEP (Mechanical, Electrical, Plumbing)", status: "In Progress", amount: 20000, date: "Mar 5, 2026" },
  { milestone: "Finishes", status: "Pending", amount: 17000, date: "Apr 1, 2026" },
  { milestone: "Certificate of Occupancy", status: "Pending", amount: 8000, date: "Apr 20, 2026" },
];

const documents = [
  { name: "Inspection Report", type: "PDF", size: "2.4 MB", slug: "inspection-report" },
  { name: "Title Search", type: "PDF", size: "1.1 MB", slug: "title-search" },
  { name: "Scope of Work", type: "PDF", size: "3.8 MB", slug: "scope-of-work" },
  { name: "Insurance Certificate", type: "PDF", size: "890 KB", slug: "insurance-certificate" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "#2ECC71", text: "#0D0D1A" },
  "In Progress": { bg: "#D4A843", text: "#0D0D1A" },
  Pending: { bg: "#4A4A5A", text: "#F8F6F0" },
};

const typeBadgeColors: Record<string, { bg: string; text: string }> = {
  Flip: { bg: "#E8632B", text: "#FFFFFF" },
  "New Build": { bg: "#2B4C7E", text: "#FFFFFF" },
  "Value-Add": { bg: "#2ECC71", text: "#0D0D1A" },
  Wholesale: { bg: "#D4A843", text: "#0D0D1A" },
};

export default function DealDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = use(params);
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const [investAmount, setInvestAmount] = useState("5000");
  const [investing, setInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [investError, setInvestError] = useState<string | null>(null);

  // Contract hooks for on-chain invest flow
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useBrixApprove();
  const { invest: contractInvest, isPending: isInvesting, isConfirming, isSuccess: investTxSuccess } = useInvestInDeal();

  const deal = allDeals[dealId];
  const [currentFunded, setCurrentFunded] = useState(deal?.fundedAmount || 0);
  const [currentInvestors, setCurrentInvestors] = useState(deal?.investorCount || 0);

  useEffect(() => { if (deal) { setCurrentFunded(deal.fundedAmount); setCurrentInvestors(deal.investorCount); } }, [deal]);

  if (!deal) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-semibold text-white mb-2">Deal not found</p><Link href="/marketplace" className="text-sm font-medium" style={{ color: "#D4A843" }}>Back to Marketplace</Link></div>;

  const fundedPct = Math.round((currentFunded / deal.capitalNeeded) * 100);
  const badge = typeBadgeColors[deal.type] || { bg: "#D4A843", text: "#0D0D1A" };
  const closingBuy = Math.round(deal.askingPrice * 0.03);
  const holdingCosts = Math.round(deal.askingPrice * 0.06);
  const closingSell = Math.round(deal.arv * 0.06);
  const totalAllIn = deal.askingPrice + deal.rehabBudget + closingBuy + holdingCosts + closingSell;
  const projectedProfit = deal.arv - totalAllIn;

  // Watch for on-chain invest tx success
  useEffect(() => {
    if (investTxSuccess) {
      const amount = parseAmount(investAmount);
      setInvestSuccess(true);
      setCurrentFunded((prev) => prev + amount);
      setCurrentInvestors((prev) => prev + 1);
      setInvesting(false);
      setTimeout(() => setInvestSuccess(false), 5000);
    }
  }, [investTxSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInvest = async () => {
    if (!user) return;
    const amount = parseAmount(investAmount);

    // Validate amount
    const remaining = deal.capitalNeeded - currentFunded;
    const amountError = validate(createAmountSchema({ min: deal.minInvestment, max: remaining, minLabel: `Minimum investment is $${deal.minInvestment.toLocaleString()}`, maxLabel: `Maximum investment is $${remaining.toLocaleString()} (remaining capacity)` }), amount);
    if (amountError) { setInvestError(amountError); return; }

    setInvesting(true); setInvestError(null); setInvestSuccess(false);

    // On-chain path: approve + investInDeal when contracts are deployed and wallet connected
    if (CONTRACTS_DEPLOYED && isConnected && address) {
      try {
        const amountWei = parseBrix(String(amount));
        // The deal would have an on-chain address from the factory.
        // For now, we use the API path as fallback until deals are deployed on-chain.
        // When a dealContractAddress is available, uncomment the on-chain flow:
        // approve(dealContractAddress, amountWei);
        // Then after approval: contractInvest(dealContractAddress, amountWei);

        // API path (works alongside on-chain for record-keeping)
        const res = await fetch("/api/investments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deal_id: dealId, amount }) });
        if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Investment failed"); }
        setInvestSuccess(true);
        setCurrentFunded((prev) => prev + amount);
        setCurrentInvestors((prev) => prev + 1);
        setTimeout(() => setInvestSuccess(false), 5000);
      } catch (err) { setInvestError(err instanceof Error ? err.message : "Investment failed."); } finally { setInvesting(false); }
      return;
    }

    // Fallback: API-only path
    try {
      const res = await fetch("/api/investments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deal_id: dealId, amount }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Investment failed"); }
      setInvestSuccess(true);
      setCurrentFunded((prev) => prev + amount);
      setCurrentInvestors((prev) => prev + 1);
      setTimeout(() => setInvestSuccess(false), 5000);
    } catch (err) { setInvestError(err instanceof Error ? err.message : "Investment failed."); } finally { setInvesting(false); }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: "#4A4A5A" }}><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link><span>/</span><span className="text-white">{deal.address}</span></div>

      <div className="mb-6 overflow-hidden rounded-xl border border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="relative h-56 sm:h-72"><img src={deal.imageUrl} alt={deal.address} className="h-full w-full object-cover" /><div className="absolute bottom-4 left-4 flex items-center gap-2"><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: badge.bg, color: badge.text }}>{deal.type}</span><span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>Active</span></div></div>
        <div className="p-4 sm:p-6"><h1 className="text-2xl font-bold text-white">{deal.address}</h1><p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>{deal.city}, {deal.state} {deal.zip}</p></div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6 lg:max-w-[66%]">
          <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Property Overview</h2>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: "#F8F6F0" }}>{deal.description}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[{ label: "Beds", value: String(deal.beds) }, { label: "Baths", value: String(deal.baths) }, { label: "Sq Ft", value: deal.sqft.toLocaleString() }, { label: "Year Built", value: String(deal.yearBuilt) }, { label: "Lot Size", value: deal.lotSize }, { label: "Parking", value: "2-car garage" }, { label: "Foundation", value: "Slab" }, { label: "Zoning", value: "R-3" }].map((item) => (<div key={item.label}><p className="text-xs" style={{ color: "#4A4A5A" }}>{item.label}</p><p className="text-sm font-medium text-white">{item.value}</p></div>))}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Pro Forma Analysis</h2>
            <table className="w-full text-sm"><tbody className="divide-y divide-white/10">
              {[{ label: "Purchase Price", value: `$${deal.askingPrice.toLocaleString()}`, h: false }, { label: "Rehab Budget", value: `$${deal.rehabBudget.toLocaleString()}`, h: false }, { label: "Closing Costs (Buy)", value: `$${closingBuy.toLocaleString()}`, h: false }, { label: `Holding Costs (${deal.timeline})`, value: `$${holdingCosts.toLocaleString()}`, h: false }, { label: "Closing Costs (Sell)", value: `$${closingSell.toLocaleString()}`, h: false }, { label: "Total Cost", value: `$${totalAllIn.toLocaleString()}`, h: true }, { label: "After Repair Value (ARV)", value: `$${deal.arv.toLocaleString()}`, h: false }, { label: "Projected Profit", value: `$${projectedProfit.toLocaleString()}`, h: true }, { label: "Return on Investment", value: `${deal.roi}%`, h: true }].map((row) => (<tr key={row.label}><td className="py-3 text-left" style={{ color: row.h ? "#F8F6F0" : "#4A4A5A" }}>{row.label}</td><td className="py-3 text-right font-semibold" style={{ color: row.h ? "#D4A843" : "#F8F6F0" }}>{row.value}</td></tr>))}
            </tbody></table>
          </section>

          <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Draw Schedule</h2>
            <div className="space-y-4">
              {drawSchedule.map((draw, i) => { const colors = statusColors[draw.status]; const isC = draw.status === "Completed"; const isIP = draw.status === "In Progress"; return (
                <div key={draw.milestone} className="relative flex gap-4">
                  <div className="flex flex-col items-center"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>{isC ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : i + 1}</div>{i < drawSchedule.length - 1 && <div className="w-0.5 flex-1 min-h-[24px]" style={{ backgroundColor: isC ? "#2ECC71" : "rgba(255,255,255,0.1)" }} />}</div>
                  <div className="flex-1 pb-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-medium text-white">{draw.milestone}</p><p className="text-xs" style={{ color: "#4A4A5A" }}>{draw.date}</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold text-white">${draw.amount.toLocaleString()}</span><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>{draw.status}</span></div></div>{isIP && <div className="mt-2"><div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full w-3/5 rounded-full" style={{ backgroundColor: "#D4A843" }} /></div></div>}</div>
                </div>); })}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Deal Documents</h2>
            <div className="space-y-2">{documents.map((doc) => (
              <button
                key={doc.name}
                onClick={() => {
                  // Generate a placeholder PDF download blob
                  const content = `BrixUp Deal Document\n\n${doc.name}\nDeal: ${deal.address}, ${deal.city}, ${deal.state}\nType: ${doc.type}\nGenerated: ${new Date().toLocaleDateString()}\n\nThis document is a placeholder. Full documents will be available when the deal is finalized.`;
                  const blob = new Blob([content], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${doc.slug}-${dealId}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-white/5 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" style={{ color: "#E8632B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <div><p className="text-sm font-medium text-white">{doc.name}</p><p className="text-xs" style={{ color: "#4A4A5A" }}>{doc.type} - {doc.size}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: "#D4A843" }}>Download</span>
                  <svg className="w-4 h-4" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
              </button>
            ))}</div>
          </section>
        </div>

        <div className="w-full space-y-6 lg:w-[340px] lg:shrink-0">
          <div className="rounded-xl border border-white/10 p-5 lg:sticky lg:top-4" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="text-base font-semibold text-white mb-4">Invest in this Deal</h3>
            <div className="mb-4"><div className="flex items-center justify-between mb-1.5"><span className="text-xs" style={{ color: "#4A4A5A" }}>Funding Progress</span><span className="text-xs font-semibold" style={{ color: "#D4A843" }}>{fundedPct}%</span></div><div className="h-3 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full rounded-full" style={{ width: `${Math.min(fundedPct, 100)}%`, backgroundColor: "#D4A843" }} /></div><div className="mt-2 flex items-center justify-between"><span className="text-sm font-semibold" style={{ color: "#D4A843" }}>${currentFunded.toLocaleString()} raised</span><span className="text-sm" style={{ color: "#4A4A5A" }}>of ${deal.capitalNeeded.toLocaleString()}</span></div></div>
            <div className="space-y-3 mb-5 border-t border-white/10 pt-4">{[{ label: "Investors", value: String(currentInvestors) }, { label: "Min Investment", value: `$${deal.minInvestment.toLocaleString()}` }, { label: "Projected Return", value: `${deal.roi}% ROI` }, { label: "Timeline", value: deal.timeline }].map((s) => (<div key={s.label} className="flex items-center justify-between"><span className="text-sm" style={{ color: "#4A4A5A" }}>{s.label}</span><span className="text-sm font-semibold text-white">{s.value}</span></div>))}</div>
            <div className="space-y-3">
              <div><label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Amount ($BRIX)</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#D4A843" }}>$BRIX</span><input type="text" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} className="w-full rounded-lg border border-white/10 py-2.5 pl-16 pr-4 text-sm text-white text-right focus:outline-none focus:ring-1" style={{ backgroundColor: "#0D0D1A" }} /></div></div>
              {investSuccess && <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>Investment submitted successfully!</div>}
              {investError && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{investError}</div>}
              <button onClick={handleInvest} disabled={investing || isApproving || isInvesting || isConfirming || !investAmount} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>{isApproving ? "Approving..." : isInvesting ? "Submitting..." : isConfirming ? "Confirming..." : investing ? "Processing..." : "Invest $BRIX"}</button>
              <p className="text-center text-xs" style={{ color: "#4A4A5A" }}>By investing, you agree to the Terms & Conditions</p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="text-base font-semibold text-white mb-4">Deal Team</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}>MR</div><div className="flex-1"><p className="text-sm font-medium text-white">Marcus Reynolds</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Dealmaker</p></div><div className="text-right"><p className="text-sm font-semibold" style={{ color: "#D4A843" }}>892</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Brix Score</p></div></div>
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "#E8632B", color: "#F8F6F0" }}>TJ</div><div className="flex-1"><p className="text-sm font-medium text-white">Tony Jackson</p><p className="text-xs" style={{ color: "#4A4A5A" }}>General Contractor</p></div><div className="text-right"><p className="text-sm font-semibold" style={{ color: "#D4A843" }}>847</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Brix Score</p></div></div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="text-base font-semibold text-white mb-4">Key Dates</h3>
            <div className="space-y-3">{[{ label: "Listed", value: deal.listedDate, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, { label: "Funding Deadline", value: deal.fundingDeadline, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, { label: "Est. Completion", value: deal.estCompletion, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }].map((d) => (<div key={d.label} className="flex items-center gap-3"><svg className="w-4 h-4 shrink-0" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d.icon} /></svg><div className="flex-1"><p className="text-xs" style={{ color: "#4A4A5A" }}>{d.label}</p><p className="text-sm font-medium text-white">{d.value}</p></div></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
