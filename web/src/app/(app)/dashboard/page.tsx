"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import WalletWidget from "@/components/WalletWidget";
import { useAuth } from "@/lib/auth-context";

interface Investment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  deals?: {
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

const sampleInvestments: Investment[] = [
  { id: "1", amount: 15000, status: "confirmed", created_at: "2026-02-10", deals: { address: "1847 Oakwood Dr", city: "Charlotte", state: "NC", property_type: "Flip", funded_amount: 190950, total_capital_needed: 285000, projected_roi: 22, status: "Active" } },
  { id: "2", amount: 20000, status: "confirmed", created_at: "2026-01-20", deals: { address: "412 Magnolia Ln", city: "Raleigh", state: "NC", property_type: "New Build", funded_amount: 223600, total_capital_needed: 520000, projected_roi: 28, status: "Funding" } },
  { id: "3", amount: 12500, status: "confirmed", created_at: "2026-01-05", deals: { address: "903 Pine Valley Rd", city: "Greenville", state: "SC", property_type: "Value-Add", funded_amount: 155750, total_capital_needed: 175000, projected_roi: 16, status: "Active" } },
];

const sampleTransactions: Transaction[] = [
  { id: "1", type: "investment", amount: 5000, description: "Investment in 1847 Oakwood Dr", status: "confirmed", created_at: "2026-02-10" },
  { id: "2", type: "yield", amount: 312, description: "Yield payout - Pine Valley", status: "confirmed", created_at: "2026-02-05" },
  { id: "3", type: "staking_reward", amount: 125, description: "Staking reward", status: "confirmed", created_at: "2026-01-28" },
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

export default function DashboardPage() {
  const { profile } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments);
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [loading, setLoading] = useState(true);

  const displayName = profile?.full_name?.split(" ")[0] || "Investor";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const fetchData = useCallback(async () => {
    try {
      const [invRes, txRes] = await Promise.all([
        fetch("/api/investments"),
        fetch("/api/transactions?limit=10"),
      ]);
      if (invRes.ok) {
        const invData = await invRes.json();
        if (invData.length > 0) setInvestments(invData);
      }
      if (txRes.ok) {
        const txData = await txRes.json();
        if (txData.length > 0) setTransactions(txData);
      }
    } catch { /* Use sample data */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const activeDeals = investments.filter((inv) => inv.deals?.status !== "Completed").length;
  const avgRoi = investments.length > 0 ? (investments.reduce((sum, inv) => sum + (inv.deals?.projected_roi || 0), 0) / investments.length).toFixed(1) : "0";
  const brixBalance = totalInvested > 0 ? Math.round(totalInvested * 0.26) : 12500;

  const stats = [
    { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#D4A843" },
    { label: "Active Deals", value: String(activeDeals), icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", color: "#2B4C7E" },
    { label: "Avg ROI", value: `${avgRoi}%`, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", color: "#2ECC71" },
    { label: "$BRIX Balance", value: brixBalance.toLocaleString(), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#E8632B" },
  ];

  const typeMap: Record<string, number> = {};
  investments.forEach((inv) => { const t = inv.deals?.property_type || inv.deals?.type || "Other"; typeMap[t] = (typeMap[t] || 0) + inv.amount; });
  const allocationColors: Record<string, string> = { Flip: "#E8632B", "New Build": "#2B4C7E", "Value-Add": "#2ECC71", Wholesale: "#D4A843", Other: "#4A4A5A" };
  const allocations = Object.entries(typeMap).map(([type, amount]) => ({ label: type, amount, pct: totalInvested > 0 ? Math.round((amount / totalInvested) * 100) : 0, color: allocationColors[type] || "#4A4A5A" }));

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>{today}</p>
      </div>

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
        <div className="overflow-x-auto">
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
                    <td className="py-3"><Link href="/marketplace/deal-001" className="text-xs font-medium" style={{ color: "#D4A843" }}>View</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6"><WalletWidget brixBalance={brixBalance} usdcBalance={3200} stakedAmount={2000} /></div>

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
    </div>
  );
}
