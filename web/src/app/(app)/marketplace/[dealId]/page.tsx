"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import { useBrxuApprove, useInvestInDeal, parseBrxu } from "@/lib/contracts/hooks";
import { CONTRACTS_DEPLOYED } from "@/lib/contracts/config";
import { validate, createAmountSchema, parseAmount, sanitizeAmountInput } from "@/lib/validation";
import { useBalance } from "@/lib/wallet/useBalance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DealData {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  propertyType?: string;
  property_type?: string;
  status: string;
  askingPrice?: number;
  asking_price?: number;
  rehabBudget?: number;
  rehab_budget?: number;
  arv: number;
  totalCapitalNeeded?: number;
  total_capital_needed?: number;
  fundedAmount?: number;
  funded_amount?: number;
  projectedROI?: number;
  projected_roi?: number;
  projectedTimeline?: string;
  projected_timeline?: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt?: number;
  year_built?: number;
  lotSize?: string;
  lot_size?: string;
  description: string;
  investorCount?: number;
  investor_count?: number;
  minInvestment?: number;
  min_investment?: number;
  listedDate?: string;
  listed_date?: string;
  fundingDeadline?: string;
  funding_deadline?: string;
  estCompletion?: string;
  est_completion?: string;
  photos?: string[];
  imageUrl?: string;
  image_url?: string;
  dealmaker?: { name: string; brixScore: number } | null;
  gc?: { name: string; brixScore: number } | null;
  proForma?: {
    purchasePrice: number;
    closingCosts: number;
    rehabBudget: number;
    holdingCosts: number;
    totalCost: number;
    arv: number;
    sellingCosts: number;
    projectedProfit: number;
    roi: number;
  } | null;
  drawSchedule?: {
    milestone: string;
    amount: number;
    status: "Completed" | "In Progress" | "Pending";
    date: string;
  }[];
  tradesNeeded?: {
    trade: string;
    brixRate: number;
    timeline: string;
    filled: boolean;
  }[];
}

// Normalize deal fields (handles both camelCase from deals-data.ts and snake_case from Supabase)
function normalizeDeal(raw: DealData) {
  const askingPrice = raw.askingPrice ?? raw.asking_price ?? 0;
  const rehabBudget = raw.rehabBudget ?? raw.rehab_budget ?? 0;
  const totalCapital = raw.totalCapitalNeeded ?? raw.total_capital_needed ?? 0;
  const fundedAmt = raw.fundedAmount ?? raw.funded_amount ?? 0;
  const timeline = raw.projectedTimeline ?? raw.projected_timeline ?? "6 months";
  const photos = raw.photos ?? [];

  // Compute pro forma from deal data if not provided
  const closingBuy = Math.round(askingPrice * 0.03);
  const holdingCosts = Math.round(askingPrice * 0.06);
  const closingSell = Math.round(raw.arv * 0.06);
  const totalAllIn = askingPrice + rehabBudget + closingBuy + holdingCosts + closingSell;
  const projectedProfit = raw.arv - totalAllIn;

  const defaultProForma = {
    purchasePrice: askingPrice,
    closingCosts: closingBuy,
    rehabBudget,
    holdingCosts,
    totalCost: totalAllIn,
    arv: raw.arv,
    sellingCosts: closingSell,
    projectedProfit,
    roi: raw.projectedROI ?? raw.projected_roi ?? 0,
  };

  return {
    id: raw.id,
    address: raw.address,
    city: raw.city,
    state: raw.state,
    zip: raw.zip,
    type: raw.propertyType ?? raw.property_type ?? "Flip",
    status: raw.status,
    askingPrice,
    rehabBudget,
    arv: raw.arv,
    capitalNeeded: totalCapital,
    fundedAmount: fundedAmt,
    roi: raw.projectedROI ?? raw.projected_roi ?? 0,
    timeline,
    beds: raw.beds,
    baths: raw.baths,
    sqft: raw.sqft,
    yearBuilt: raw.yearBuilt ?? raw.year_built ?? 0,
    lotSize: raw.lotSize ?? raw.lot_size ?? "N/A",
    description: raw.description,
    investorCount: raw.investorCount ?? raw.investor_count ?? 0,
    minInvestment: raw.minInvestment ?? raw.min_investment ?? 500,
    listedDate: raw.listedDate ?? raw.listed_date ?? "",
    fundingDeadline: raw.fundingDeadline ?? raw.funding_deadline ?? "",
    estCompletion: raw.estCompletion ?? raw.est_completion ?? "",
    imageUrl: photos[0] ?? raw.imageUrl ?? raw.image_url ?? "",
    dealmaker: raw.dealmaker ?? null,
    gc: raw.gc ?? null,
    proForma: raw.proForma ?? defaultProForma,
    drawSchedule: raw.drawSchedule ?? [],
    tradesNeeded: raw.tradesNeeded ?? [],
  };
}

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
  Land: { bg: "#8B5CF6", text: "#FFFFFF" },
};

const documents = [
  { name: "Inspection Report", type: "PDF", size: "2.4 MB", slug: "inspection-report" },
  { name: "Title Search", type: "PDF", size: "1.1 MB", slug: "title-search" },
  { name: "Scope of Work", type: "PDF", size: "3.8 MB", slug: "scope-of-work" },
  { name: "Insurance Certificate", type: "PDF", size: "890 KB", slug: "insurance-certificate" },
];

export default function DealDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = use(params);
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const [investAmount, setInvestAmount] = useState("5000");
  const [investing, setInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [investError, setInvestError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deal, setDeal] = useState<ReturnType<typeof normalizeDeal> | null>(null);

  const balanceData = useBalance();
  const userBalance = balanceData.availableBalance;

  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useBrxuApprove();
  const { invest: contractInvest, isPending: isInvesting, isConfirming, isSuccess: investTxSuccess } = useInvestInDeal();

  const [currentFunded, setCurrentFunded] = useState(0);
  const [currentInvestors, setCurrentInvestors] = useState(0);

  // Fetch deal data from API
  useEffect(() => {
    let cancelled = false;
    async function fetchDeal() {
      try {
        const res = await fetch("/api/deals");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const found = data.find((d: DealData) => d.id === dealId);
            if (!cancelled && found) {
              const normalized = normalizeDeal(found);
              setDeal(normalized);
              setCurrentFunded(normalized.fundedAmount);
              setCurrentInvestors(normalized.investorCount);
            }
          }
        }
      } catch {
        // API unavailable
      }
      if (!cancelled) setLoading(false);
    }
    fetchDeal();
    return () => { cancelled = true; };
  }, [dealId]);

  // Real-time validation on invest amount change
  useEffect(() => {
    if (!investAmount || !deal) { setInvestError(null); return; }
    const amt = parseAmount(investAmount);
    if (amt < deal.minInvestment) { setInvestError(`Minimum investment is ${deal.minInvestment.toLocaleString()} BRXU`); return; }
    if (amt > userBalance) { setInvestError(`Insufficient balance (${Math.floor(userBalance).toLocaleString()} BRXU available)`); return; }
    setInvestError(null);
  }, [investAmount, deal, userBalance]);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
        <p className="mt-4 text-sm" style={{ color: "var(--brix-fg-muted)" }}>Loading deal...</p>
      </div>
    );
  }

  if (!deal) return <div className="flex flex-col items-center justify-center py-20"><p className="text-lg font-semibold text-white mb-2">Deal not found</p><Link href="/marketplace" className="text-sm font-medium" style={{ color: "#D4A843" }}>Back to Marketplace</Link></div>;

  const fundedPct = deal.capitalNeeded > 0 ? Math.round((currentFunded / deal.capitalNeeded) * 100) : 0;
  const badge = typeBadgeColors[deal.type] || { bg: "#D4A843", text: "#0D0D1A" };
  const pf = deal.proForma;

  const handleInvest = async () => {
    if (!user) return;
    const amount = parseAmount(investAmount);
    const remaining = deal.capitalNeeded - currentFunded;
    const amountError = validate(createAmountSchema({ min: deal.minInvestment, max: remaining, minLabel: `Minimum investment is $${deal.minInvestment.toLocaleString()}`, maxLabel: `Maximum investment is $${remaining.toLocaleString()} (remaining capacity)` }), amount);
    if (amountError) { setInvestError(amountError); return; }
    setInvesting(true); setInvestError(null); setInvestSuccess(false);

    if (CONTRACTS_DEPLOYED && isConnected && address) {
      try {
        const res = await fetch("/api/investments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deal_id: dealId, amount }) });
        if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Investment failed"); }
        setInvestSuccess(true);
        setCurrentFunded((prev) => prev + amount);
        setCurrentInvestors((prev) => prev + 1);
        setTimeout(() => setInvestSuccess(false), 5000);
      } catch (err) { setInvestError(err instanceof Error ? err.message : "Investment failed."); } finally { setInvesting(false); }
      return;
    }

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
      <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: "var(--brix-fg-muted)" }}><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link><span>/</span><span className="text-white">{deal.address}</span></div>

      <div className="mb-6 overflow-hidden rounded-xl border border-[var(--brix-border)]" style={{ backgroundColor: "var(--brix-surface)" }}>
        <div className="relative h-56 sm:h-72">
          {deal.imageUrl ? (
            <img src={deal.imageUrl} alt={deal.address} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${badge.bg}33 0%, #1A1A2E 100%)` }}>
              <svg className="w-20 h-20 text-white/10" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: badge.bg, color: badge.text }}>{deal.type}</span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: deal.status === "Completed" ? "#2ECC71" : deal.status === "Active" ? "#2ECC71" : "#D4A843", color: "#0D0D1A" }}>{deal.status}</span>
          </div>
        </div>
        <div className="p-4 sm:p-6"><h1 className="text-2xl font-bold text-white">{deal.address}</h1><p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>{deal.city}, {deal.state} {deal.zip}</p></div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6 lg:max-w-[66%]">
          {/* Property Overview */}
          <section className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Property Overview</h2>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: "#F8F6F0" }}>{deal.description}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[{ label: "Beds", value: String(deal.beds) }, { label: "Baths", value: String(deal.baths) }, { label: "Sq Ft", value: deal.sqft.toLocaleString() }, { label: "Year Built", value: String(deal.yearBuilt) }, { label: "Lot Size", value: deal.lotSize }, { label: "Parking", value: "2-car garage" }, { label: "Foundation", value: "Slab" }, { label: "Zoning", value: "R-3" }].map((item) => (<div key={item.label}><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{item.label}</p><p className="text-sm font-medium text-white">{item.value}</p></div>))}
            </div>
          </section>

          {/* Pro Forma Analysis — from real deal data */}
          <section className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Pro Forma Analysis</h2>
            <table className="w-full text-sm"><tbody className="divide-y divide-white/10">
              {[
                { label: "Purchase Price", value: `$${pf.purchasePrice.toLocaleString()}`, h: false },
                { label: "Rehab Budget", value: `$${pf.rehabBudget.toLocaleString()}`, h: false },
                { label: "Closing Costs (Buy)", value: `$${pf.closingCosts.toLocaleString()}`, h: false },
                { label: `Holding Costs (${deal.timeline})`, value: `$${pf.holdingCosts.toLocaleString()}`, h: false },
                { label: "Closing Costs (Sell)", value: `$${pf.sellingCosts.toLocaleString()}`, h: false },
                { label: "Total Cost", value: `$${pf.totalCost.toLocaleString()}`, h: true },
                { label: "After Repair Value (ARV)", value: `$${pf.arv.toLocaleString()}`, h: false },
                { label: "Projected Profit", value: `$${pf.projectedProfit.toLocaleString()}`, h: true },
                { label: "Return on Investment", value: `${pf.roi}%`, h: true },
              ].map((row) => (<tr key={row.label}><td className="py-3 text-left" style={{ color: row.h ? "#F8F6F0" : "#4A4A5A" }}>{row.label}</td><td className="py-3 text-right font-semibold" style={{ color: row.h ? "#D4A843" : "#F8F6F0" }}>{row.value}</td></tr>))}
            </tbody></table>
          </section>

          {/* Draw Schedule — unique per deal from API */}
          {deal.drawSchedule.length > 0 && (
            <section className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Draw Schedule</h2>
              <div className="space-y-4">
                {deal.drawSchedule.map((draw, i) => { const colors = statusColors[draw.status] || statusColors.Pending; const isC = draw.status === "Completed"; const isIP = draw.status === "In Progress"; return (
                  <div key={draw.milestone} className="relative flex gap-4">
                    <div className="flex flex-col items-center"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: colors.bg, color: colors.text }}>{isC ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : i + 1}</div>{i < deal.drawSchedule.length - 1 && <div className="w-0.5 flex-1 min-h-[24px]" style={{ backgroundColor: isC ? "#2ECC71" : "rgba(255,255,255,0.1)" }} />}</div>
                    <div className="flex-1 pb-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-medium text-white">{draw.milestone}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{draw.date}</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold text-white">${draw.amount.toLocaleString()}</span><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: colors.bg, color: colors.text }}>{draw.status}</span></div></div>{isIP && <div className="mt-2"><div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "var(--brix-bg)" }}><div className="h-full w-3/5 rounded-full" style={{ backgroundColor: "#D4A843" }} /></div></div>}</div>
                  </div>); })}
              </div>
            </section>
          )}

          {/* Trades Needed — for builder matching */}
          {deal.tradesNeeded.length > 0 && (
            <section className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Trades Needed</h2>
              <div className="space-y-3">
                {deal.tradesNeeded.map((trade) => (
                  <div key={trade.trade} className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{trade.trade}</p>
                      <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{trade.timeline}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>{trade.brixRate.toLocaleString()} BRXU</span>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: trade.filled ? "#2ECC7130" : "#E8632B30", color: trade.filled ? "#2ECC71" : "#E8632B" }}>{trade.filled ? "Filled" : "Open"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Deal Documents */}
          <section className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Deal Documents</h2>
            <div className="space-y-2">{documents.map((doc) => (
              <button
                key={doc.name}
                aria-label={`Download ${doc.name}`}
                onClick={() => {
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
                  <div><p className="text-sm font-medium text-white">{doc.name}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{doc.type} - {doc.size}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: "#D4A843" }}>Download</span>
                  <svg className="w-4 h-4" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </div>
              </button>
            ))}</div>
          </section>
        </div>

        {/* Right sidebar */}
        <div className="w-full space-y-6 lg:w-[340px] lg:shrink-0">
          {/* Investment card */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5 lg:sticky lg:top-4" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="text-base font-semibold text-white mb-4">Invest in this Deal</h3>
            <div className="mb-4"><div className="flex items-center justify-between mb-1.5"><span className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Funding Progress</span><span className="text-xs font-semibold" style={{ color: "#D4A843" }}>{fundedPct}%</span></div><div className="h-3 w-full rounded-full" style={{ backgroundColor: "var(--brix-bg)" }}><div className="h-full rounded-full" style={{ width: `${Math.min(fundedPct, 100)}%`, backgroundColor: "#D4A843" }} /></div><div className="mt-2 flex items-center justify-between"><span className="text-sm font-semibold" style={{ color: "#D4A843" }}>${currentFunded.toLocaleString()} raised</span><span className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>of ${deal.capitalNeeded.toLocaleString()}</span></div></div>
            <div className="space-y-3 mb-5 border-t border-[var(--brix-border)] pt-4">{[{ label: "Investors", value: String(currentInvestors) }, { label: "Min Investment", value: `$${deal.minInvestment.toLocaleString()}` }, { label: "Projected Return", value: `${deal.roi}% ROI` }, { label: "Timeline", value: deal.timeline }].map((s) => (<div key={s.label} className="flex items-center justify-between"><span className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>{s.label}</span><span className="text-sm font-semibold text-white">{s.value}</span></div>))}</div>
            <div className="space-y-3">
              <div><label htmlFor="invest-amount" className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Amount ($BRXU)</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#D4A843" }}>$BRXU</span><input id="invest-amount" type="text" inputMode="decimal" value={investAmount} onChange={(e) => { setInvestAmount(sanitizeAmountInput(e.target.value)); setInvestError(null); }} className="w-full rounded-lg border py-2.5 pl-16 pr-4 text-sm text-white text-right focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)", borderColor: investError ? "#E8632B" : "rgba(255,255,255,0.1)" }} /></div></div>
              {investSuccess && <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>Investment submitted successfully!</div>}
              {investError && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">{investError}</div>}
              <button onClick={handleInvest} disabled={investing || isApproving || isInvesting || isConfirming || !investAmount || !!investError} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>{isApproving ? "Approving..." : isInvesting ? "Submitting..." : isConfirming ? "Confirming..." : investing ? "Processing..." : "Invest $BRXU"}</button>
              <p className="text-center text-xs" style={{ color: "var(--brix-fg-muted)" }}>By investing, you agree to the Terms & Conditions</p>
            </div>
          </div>

          {/* Deal Team — real data from API */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="text-base font-semibold text-white mb-4">Deal Team</h3>
            <div className="space-y-4">
              {deal.dealmaker && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}>
                    {deal.dealmaker.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1"><p className="text-sm font-medium text-white">{deal.dealmaker.name}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Dealmaker</p></div>
                  <div className="text-right"><p className="text-sm font-semibold" style={{ color: "#D4A843" }}>{deal.dealmaker.brixScore}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Brix Score</p></div>
                </div>
              )}
              {deal.gc ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "#E8632B", color: "#F8F6F0" }}>
                    {deal.gc.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1"><p className="text-sm font-medium text-white">{deal.gc.name}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>General Contractor</p></div>
                  <div className="text-right"><p className="text-sm font-semibold" style={{ color: "#D4A843" }}>{deal.gc.brixScore}</p><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Brix Score</p></div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg border border-dashed border-[#E8632B40] p-3" style={{ backgroundColor: "#E8632B08" }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "#E8632B20", color: "#E8632B" }}>GC</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "#E8632B" }}>GC Needed</p>
                    <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>This deal needs a general contractor</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Dates */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="text-base font-semibold text-white mb-4">Key Dates</h3>
            <div className="space-y-3">{[{ label: "Listed", value: deal.listedDate, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, { label: "Funding Deadline", value: deal.fundingDeadline, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }, { label: "Est. Completion", value: deal.estCompletion, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }].map((d) => (<div key={d.label} className="flex items-center gap-3"><svg className="w-4 h-4 shrink-0" style={{ color: "var(--brix-fg-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d.icon} /></svg><div className="flex-1"><p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{d.label}</p><p className="text-sm font-medium text-white">{d.value || "TBD"}</p></div></div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
