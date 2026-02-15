"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useBalance } from "@/lib/wallet/useBalance";

// ── Shared types ──

interface Investment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  deal_id?: string;
  deals?: {
    id?: string;
    address: string;
    city: string;
    state: string;
    type?: string;
    property_type?: string;
    funded_amount: number;
    total_capital_needed: number;
    projected_roi: number;
    status: string;
  };
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
}

const typeColors: Record<string, string> = {
  investment: "#2B4C7E",
  yield: "#2ECC71",
  staking_reward: "#D4A843",
  conversion: "#E8632B",
  received: "#2ECC71",
  send: "#E8632B",
};

// ── Sample data ──

const sampleInvestments: Investment[] = [
  { id: "1", amount: 15000, status: "confirmed", created_at: "2026-02-10", deal_id: "deal-001", deals: { id: "deal-001", address: "1847 Oakwood Dr", city: "Charlotte", state: "NC", property_type: "Flip", funded_amount: 190950, total_capital_needed: 285000, projected_roi: 22, status: "Active" } },
  { id: "2", amount: 20000, status: "confirmed", created_at: "2026-01-20", deal_id: "deal-002", deals: { id: "deal-002", address: "412 Magnolia Ln", city: "Raleigh", state: "NC", property_type: "New Build", funded_amount: 223600, total_capital_needed: 520000, projected_roi: 28, status: "Funding" } },
  { id: "3", amount: 12500, status: "confirmed", created_at: "2026-01-05", deal_id: "deal-003", deals: { id: "deal-003", address: "903 Pine Valley Rd", city: "Greenville", state: "SC", property_type: "Value-Add", funded_amount: 155750, total_capital_needed: 175000, projected_roi: 16, status: "Active" } },
];

const sampleTransactions: Transaction[] = [
  { id: "1", type: "investment", amount: 5000, description: "Investment in 1847 Oakwood Dr", status: "confirmed", created_at: "2026-02-12" },
  { id: "2", type: "staking_reward", amount: 42, description: "Staking reward", status: "confirmed", created_at: "2026-02-10" },
  { id: "3", type: "yield", amount: 312, description: "Yield payout - Pine Valley", status: "confirmed", created_at: "2026-02-05" },
  { id: "4", type: "investment", amount: 10000, description: "Investment in 412 Magnolia Ln", status: "confirmed", created_at: "2026-01-20" },
  { id: "5", type: "yield", amount: 275, description: "Yield payout - Oakwood Dr", status: "confirmed", created_at: "2026-01-15" },
];

const monthlyReturns = [
  { month: "Sep", amount: 820, max: 1400 },
  { month: "Oct", amount: 1050, max: 1400 },
  { month: "Nov", amount: 960, max: 1400 },
  { month: "Dec", amount: 1180, max: 1400 },
  { month: "Jan", amount: 1340, max: 1400 },
  { month: "Feb", amount: 587, max: 1400 },
];

// ── Role-specific greeting ──

const roleGreetings: Record<string, string> = {
  investor: "Your portfolio at a glance",
  builder: "Your projects and earnings",
  dealmaker: "Your deals and commissions",
};

const allocationColors: Record<string, string> = { Flip: "#E8632B", "New Build": "#2B4C7E", "Value-Add": "#2ECC71", Wholesale: "#D4A843", Other: "#4A4A5A" };

// ── Skeleton loader ──

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="h-4 w-20 rounded bg-white/10 mb-2" />
            <div className="h-8 w-28 rounded bg-white/10" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="h-5 w-32 rounded bg-white/10 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded bg-white/5" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <div className="h-5 w-40 rounded bg-white/10 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (<div key={i} className="h-10 rounded bg-white/5" />))}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <div className="h-5 w-32 rounded bg-white/10 mb-4" />
          <div className="flex items-end justify-between gap-3 h-48">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-white/5" style={{ height: `${30 + i * 10}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Simple wallet card (no wagmi/OnchainKit dependency) ──

function DashboardWalletCard({ brixBalance, usdcBalance, stakedAmount = 0 }: { brixBalance: number; usdcBalance: number; stakedAmount?: number }) {
  return (
    <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60">My Wallet</h3>
        <Link href="/wallet" className="text-xs font-medium hover:underline" style={{ color: "#D4A843" }}>Full Wallet →</Link>
      </div>
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{brixBalance.toLocaleString()}</span>
          <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>$BRIX</span>
        </div>
        <p className="mt-0.5 text-xs text-white/40">≈ ${brixBalance.toLocaleString()} USD</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#0D0D1A" }}>
          <span className="text-xs text-white/50">USDC Balance</span>
          <span className="text-sm font-semibold text-white">${usdcBalance.toLocaleString()}</span>
        </div>
        {stakedAmount > 0 && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#0D0D1A" }}>
            <span className="text-xs text-white/50">Staked $BRIX</span>
            <span className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{stakedAmount.toLocaleString()}</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <Link href="/wallet" className="block w-full rounded-lg py-2.5 text-center text-xs font-semibold transition-colors hover:opacity-80" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
          Open Wallet
        </Link>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  INVESTOR DASHBOARD — memoized
// ════════════════════════════════════════════════════════

const InvestorDashboard = memo(function InvestorDashboard({ investments, transactions, brixBalance, stakedBalance = 2000 }: { investments: Investment[]; transactions: Transaction[]; brixBalance: number; stakedBalance?: number }) {
  // Memoize expensive computations
  const totalInvested = useMemo(() => investments.reduce((sum, inv) => sum + inv.amount, 0), [investments]);
  const activeDeals = useMemo(() => investments.filter((inv) => inv.deals?.status !== "Completed").length, [investments]);
  const avgRoi = useMemo(() => investments.length > 0 ? (investments.reduce((sum, inv) => sum + (inv.deals?.projected_roi || 0), 0) / investments.length).toFixed(1) : "0", [investments]);

  const stats = useMemo(() => [
    { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#D4A843" },
    { label: "Active Deals", value: String(activeDeals), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#2B4C7E" },
    { label: "Avg ROI", value: `${avgRoi}%`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "#2ECC71" },
    { label: "$BRIX Balance", value: brixBalance.toLocaleString(), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#E8632B" },
  ], [totalInvested, activeDeals, avgRoi, brixBalance]);

  const allocations = useMemo(() => {
    const typeMap: Record<string, number> = {};
    investments.forEach((inv) => { const t = inv.deals?.property_type || inv.deals?.type || "Other"; typeMap[t] = (typeMap[t] || 0) + inv.amount; });
    return Object.entries(typeMap).map(([type, amount]) => ({ label: type, amount, pct: totalInvested > 0 ? Math.round((amount / totalInvested) * 100) : 0, color: allocationColors[type] || "#4A4A5A" }));
  }, [investments, totalInvested]);

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + "20" }}>
                <svg className="w-5 h-5" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Active Deals</h2>
          <Link href="/marketplace" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: "#D4A843" }}>View Marketplace</Link>
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-white/10">{["Property", "Location", "Invested", "Status", "Progress", "ROI", "Action"].map((h) => (<th key={h} className="pb-3 text-left text-xs font-medium" style={{ color: "#4A4A5A" }}>{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {investments.map((inv) => {
                const deal = inv.deals;
                if (!deal) return null;
                const progress = deal.total_capital_needed > 0 ? Math.round((deal.funded_amount / deal.total_capital_needed) * 100) : 0;
                return (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3"><div><p className="font-medium text-white">{deal.address}</p><p className="text-xs" style={{ color: "#4A4A5A" }}>{deal.property_type || deal.type}</p></div></td>
                    <td className="py-3 text-white/80">{deal.city}, {deal.state}</td>
                    <td className="py-3 font-medium text-white">${inv.amount.toLocaleString()}</td>
                    <td className="py-3"><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: deal.status === "Active" ? "#D4A84330" : "#2B4C7E30", color: deal.status === "Active" ? "#D4A843" : "#2B4C7E" }}>{deal.status}</span></td>
                    <td className="py-3"><div className="flex items-center gap-2"><div className="h-1.5 w-20 rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "#D4A843" }} /></div><span className="text-xs text-white/60">{progress}%</span></div></td>
                    <td className="py-3 font-semibold" style={{ color: "#2ECC71" }}>{deal.projected_roi}%</td>
                    <td className="py-3"><Link href={`/marketplace/${inv.deals?.id || inv.deal_id || "deal-001"}`} className="text-xs font-medium" style={{ color: "#D4A843" }}>View</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Mobile card layout */}
        <div className="md:hidden space-y-3">
          {investments.map((inv) => {
            const deal = inv.deals;
            if (!deal) return null;
            const progress = deal.total_capital_needed > 0 ? Math.round((deal.funded_amount / deal.total_capital_needed) * 100) : 0;
            return (
              <Link key={inv.id} href={`/marketplace/${inv.deals?.id || inv.deal_id || "deal-001"}`} className="block rounded-lg border border-white/5 p-3 transition-colors active:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-white">{deal.address}</p>
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>{deal.city}, {deal.state}</p>
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ backgroundColor: deal.status === "Active" ? "#D4A84330" : "#2B4C7E30", color: deal.status === "Active" ? "#D4A843" : "#2B4C7E" }}>{deal.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">${inv.amount.toLocaleString()}</span>
                    <span className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{deal.projected_roi}% ROI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "#D4A843" }} /></div>
                    <span className="text-xs text-white/60">{progress}%</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mb-6"><DashboardWalletCard brixBalance={brixBalance} usdcBalance={3200} stakedAmount={stakedBalance} /></div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h2>
          <div className="space-y-3">
            {transactions.map((tx) => {
              const isPositive = ["yield", "staking_reward", "received"].includes(tx.type);
              const color = typeColors[tx.type] || "#4A4A5A";
              return (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: color + "20", color }}>
                      {isPositive ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>}
                    </div>
                    <div><p className="text-sm text-white">{tx.description}</p><p className="text-xs" style={{ color: "#4A4A5A" }}>{new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></div>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: isPositive ? "#2ECC71" : "#E8632B" }}>{isPositive ? "+" : "-"}${tx.amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Yield Tracker</h2>
          <p className="mb-4 text-xs" style={{ color: "#4A4A5A" }}>Monthly returns over the last 6 months</p>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthlyReturns.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-white">${m.amount}</span>
                <div className="w-full flex-1 flex items-end"><div className="w-full rounded-t-md" style={{ height: `${(m.amount / m.max) * 100}%`, backgroundColor: "#D4A843", minHeight: "8px" }} /></div>
                <span className="text-xs" style={{ color: "#4A4A5A" }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <h2 className="mb-4 text-lg font-semibold text-white">Portfolio Allocation</h2>
        <div className="space-y-4">
          <div className="flex h-6 w-full overflow-hidden rounded-full">
            {allocations.map((a) => (<div key={a.label} className="flex items-center justify-center text-xs font-semibold" style={{ width: `${a.pct}%`, backgroundColor: a.color, color: a.label === "Value-Add" ? "#0D0D1A" : "#FFFFFF" }}>{a.pct > 10 ? `${a.pct}%` : ""}</div>))}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {allocations.map((item) => (<div key={item.label} className="flex items-center gap-2"><div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm text-white">{item.label}</span><span className="text-xs" style={{ color: "#4A4A5A" }}>{item.pct}% (${item.amount.toLocaleString()})</span></div>))}
          </div>
        </div>
      </div>
    </>
  );
});

// ════════════════════════════════════════════════════════
//  BUILDER DASHBOARD — memoized
// ════════════════════════════════════════════════════════

const builderStats = [
  { label: "Brix Score", value: "863", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "#D4A843" },
  { label: "Active Projects", value: "2", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "#2B4C7E" },
  { label: "$BRIX Earned", value: "8,800", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#2ECC71" },
  { label: "Sweat Equity", value: "$26,400", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#E8632B" },
];

const builderProjects = [
  { address: "1847 Oakwood Dr", city: "Charlotte, NC", trade: "Electrical", milestone: "MEP Rough-In", progress: 60, nextDraw: "$3,200", due: "Mar 5, 2026" },
  { address: "903 Pine Valley Rd", city: "Greenville, SC", trade: "Plumbing", milestone: "Finishes", progress: 35, nextDraw: "$2,100", due: "Mar 20, 2026" },
];

const BuilderDashboard = memo(function BuilderDashboard() {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {builderStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + "20" }}>
                <svg className="w-5 h-5" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Current Projects</h2>
          <Link href="/builder" className="text-sm font-medium hover:opacity-80" style={{ color: "#D4A843" }}>View All</Link>
        </div>
        <div className="space-y-4">
          {builderProjects.map((p) => (
            <div key={p.address} className="flex flex-col gap-3 rounded-lg border border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{p.address}</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>{p.city} &middot; {p.trade}</p>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{p.milestone}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: "#D4A843" }} /></div>
                    <span className="text-xs" style={{ color: "#D4A843" }}>{p.progress}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Next Draw</p>
                  <p className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{p.nextDraw}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6"><DashboardWalletCard brixBalance={8800} usdcBalance={1500} stakedAmount={0} /></div>
    </>
  );
});

// ════════════════════════════════════════════════════════
//  DEALMAKER DASHBOARD — memoized
// ════════════════════════════════════════════════════════

const dealmakerStats = [
  { label: "Deals Listed", value: "3", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#2B4C7E" },
  { label: "Deals Funded", value: "1", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", color: "#2ECC71" },
  { label: "Total Commission", value: "$8,550", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#D4A843" },
  { label: "Referrals", value: "18", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "#E8632B" },
];

const dealmakerDeals = [
  { address: "3421 Blanche St", city: "Charlotte, NC", status: "Funded", capital: "$285,000", commission: "$8,550" },
  { address: "782 Eastway Dr", city: "Charlotte, NC", status: "Funding", capital: "$195,000", commission: "$5,850" },
  { address: "1509 Parkwood Ave", city: "Raleigh, NC", status: "Under Review", capital: "$340,000", commission: "$10,200" },
];

const DealmakerDashboard = memo(function DealmakerDashboard() {
  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dealmakerStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + "20" }}>
                <svg className="w-5 h-5" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Deals</h2>
          <Link href="/dealfinder" className="text-sm font-medium hover:opacity-80" style={{ color: "#D4A843" }}>View All</Link>
        </div>
        <div className="space-y-3">
          {dealmakerDeals.map((d) => {
            const sColor = d.status === "Funded" ? "#2ECC71" : d.status === "Funding" ? "#D4A843" : "#E8632B";
            return (
              <div key={d.address} className="flex flex-col gap-3 rounded-lg border border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{d.address}</p>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${sColor}20`, color: sColor }}>{d.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{d.city}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Capital</p>
                    <p className="text-sm font-semibold text-white">{d.capital}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Commission</p>
                    <p className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{d.commission}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6"><DashboardWalletCard brixBalance={24500} usdcBalance={8200} stakedAmount={5000} /></div>
    </>
  );
});

// ════════════════════════════════════════════════════════
//  MAIN DASHBOARD PAGE
// ════════════════════════════════════════════════════════

export default function DashboardPage() {
  const { profile } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [loading, setLoading] = useState(true);

  const userRole = profile?.user_role || "investor";
  const displayName = profile?.full_name?.split(" ")[0] || (userRole === "builder" ? "Builder" : userRole === "dealmaker" ? "Deal Finder" : "Investor");
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    try {
      const [invRes, txRes] = await Promise.all([
        fetch("/api/investments", { signal: controller.signal }),
        fetch("/api/transactions?limit=10", { signal: controller.signal }),
      ]);
      if (invRes.ok) {
        const invData = await invRes.json();
        // Only replace sample data when API returns complete data with deals info
        if (Array.isArray(invData) && invData.length >= sampleInvestments.length && invData[0]?.deals) {
          setInvestments(invData);
        }
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        // Only replace sample transactions when API returns at least as many
        if (Array.isArray(txData) && txData.length >= sampleTransactions.length) {
          // Deduplicate by id, then by description+date+amount to prevent repeated entries
          const seen = new Set<string>();
          const deduped = txData.filter((tx: Transaction) => {
            const key = tx.id || `${tx.description}-${tx.created_at}-${tx.amount}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setTransactions(deduped.slice(0, 10));
        }
      }
    } catch { /* Use sample data on error */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Use shared balance hook — single source of truth across header, wallet, and dashboard
  const balanceData = useBalance();
  const brixBalance = balanceData.availableBalance;

  if (loading) return <DashboardSkeleton />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>{roleGreetings[userRole] || today}</p>
      </div>

      {userRole === "builder" && <BuilderDashboard />}
      {userRole === "dealmaker" && <DealmakerDashboard />}
      {(userRole === "investor" || (userRole !== "builder" && userRole !== "dealmaker")) && (
        <InvestorDashboard investments={investments} transactions={transactions} brixBalance={brixBalance} stakedBalance={balanceData.stakedBalance} />
      )}
    </div>
  );
}
