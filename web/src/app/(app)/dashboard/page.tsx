"use client";

import Link from "next/link";
import WalletWidget from "@/components/WalletWidget";
import { useAuth } from "@/lib/auth-context";

const stats = [
  {
    label: "Total Invested",
    value: "$47,500",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "#D4A843",
  },
  {
    label: "Active Deals",
    value: "3",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    color: "#2B4C7E",
  },
  {
    label: "Avg ROI",
    value: "18.4%",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    color: "#2ECC71",
  },
  {
    label: "$BRIX Balance",
    value: "12,500",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    color: "#E8632B",
  },
];

const activeDeals = [
  {
    property: "1847 Oakwood Dr",
    location: "Charlotte, NC",
    invested: "$15,000",
    status: "In Progress",
    progress: 67,
    roi: "22%",
    type: "Flip",
  },
  {
    property: "412 Magnolia Ln",
    location: "Raleigh, NC",
    invested: "$20,000",
    status: "Funding",
    progress: 43,
    roi: "28%",
    type: "New Build",
  },
  {
    property: "903 Pine Valley Rd",
    location: "Greenville, SC",
    invested: "$12,500",
    status: "In Progress",
    progress: 89,
    roi: "16%",
    type: "Value-Add",
  },
];

const recentTransactions = [
  { date: "Feb 10, 2026", description: "Investment in 1847 Oakwood Dr", amount: "-$5,000", type: "Investment" },
  { date: "Feb 5, 2026", description: "Yield payout - Pine Valley", amount: "+$312", type: "Return" },
  { date: "Jan 28, 2026", description: "Staking reward", amount: "+$125", type: "Reward" },
  { date: "Jan 20, 2026", description: "Investment in 412 Magnolia Ln", amount: "-$10,000", type: "Investment" },
  { date: "Jan 15, 2026", description: "Yield payout - Oakwood Dr", amount: "+$275", type: "Return" },
];

const monthlyReturns = [
  { month: "Sep", amount: 820, max: 1400 },
  { month: "Oct", amount: 1050, max: 1400 },
  { month: "Nov", amount: 960, max: 1400 },
  { month: "Dec", amount: 1180, max: 1400 },
  { month: "Jan", amount: 1340, max: 1400 },
  { month: "Feb", amount: 587, max: 1400 },
];

const typeColors: Record<string, string> = {
  Investment: "#2B4C7E",
  Return: "#2ECC71",
  Reward: "#D4A843",
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const displayName = profile?.full_name?.split(" ")[0] || "Investor";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
          {today}
        </p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: stat.color + "20" }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: stat.color }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deals table */}
      <div
        className="mb-6 rounded-xl border border-white/10 p-5"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Active Deals</h2>
          <Link
            href="/marketplace"
            className="text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#D4A843" }}
          >
            View Marketplace
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Property", "Location", "Invested", "Status", "Progress", "ROI", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-xs font-medium"
                      style={{ color: "#4A4A5A" }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeDeals.map((deal) => (
                <tr key={deal.property} className="hover:bg-white/5 transition-colors">
                  <td className="py-3">
                    <div>
                      <p className="font-medium text-white">{deal.property}</p>
                      <p className="text-xs" style={{ color: "#4A4A5A" }}>
                        {deal.type}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 text-white/80">{deal.location}</td>
                  <td className="py-3 font-medium text-white">{deal.invested}</td>
                  <td className="py-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          deal.status === "In Progress" ? "#D4A84330" : "#2B4C7E30",
                        color: deal.status === "In Progress" ? "#D4A843" : "#2B4C7E",
                      }}
                    >
                      {deal.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 w-20 rounded-full"
                        style={{ backgroundColor: "#0D0D1A" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${deal.progress}%`,
                            backgroundColor: "#D4A843",
                          }}
                        />
                      </div>
                      <span className="text-xs text-white/60">{deal.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 font-semibold" style={{ color: "#2ECC71" }}>
                    {deal.roi}
                  </td>
                  <td className="py-3">
                    <Link
                      href="/marketplace/deal-001"
                      className="text-xs font-medium transition-colors hover:opacity-80"
                      style={{ color: "#D4A843" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Wallet Widget */}
      <div className="mb-6">
        <WalletWidget brixBalance={12500} usdcBalance={3200} stakedAmount={2000} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <div
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h2>
          <div className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: typeColors[tx.type] + "20",
                      color: typeColors[tx.type],
                    }}
                  >
                    {tx.type === "Investment" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">{tx.description}</p>
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>
                      {tx.date}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: tx.amount.startsWith("+") ? "#2ECC71" : "#E8632B",
                  }}
                >
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Tracker */}
        <div
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Yield Tracker</h2>
          <p className="mb-4 text-xs" style={{ color: "#4A4A5A" }}>
            Monthly returns over the last 6 months
          </p>
          <div className="flex items-end justify-between gap-3 h-48">
            {monthlyReturns.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-white">
                  ${m.amount}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(m.amount / m.max) * 100}%`,
                      backgroundColor: "#D4A843",
                      minHeight: "8px",
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: "#4A4A5A" }}>
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Allocation */}
      <div
        className="mt-6 rounded-xl border border-white/10 p-5"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        <h2 className="mb-4 text-lg font-semibold text-white">Portfolio Allocation</h2>
        <div className="space-y-4">
          {/* Stacked bar */}
          <div className="flex h-6 w-full overflow-hidden rounded-full">
            <div
              className="flex items-center justify-center text-xs font-semibold"
              style={{ width: "42%", backgroundColor: "#E8632B", color: "#FFFFFF" }}
            >
              42%
            </div>
            <div
              className="flex items-center justify-center text-xs font-semibold"
              style={{ width: "35%", backgroundColor: "#2B4C7E", color: "#FFFFFF" }}
            >
              35%
            </div>
            <div
              className="flex items-center justify-center text-xs font-semibold"
              style={{ width: "23%", backgroundColor: "#2ECC71", color: "#0D0D1A" }}
            >
              23%
            </div>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6">
            {[
              { label: "Flips", color: "#E8632B", pct: "42%", amount: "$20,000" },
              { label: "New Builds", color: "#2B4C7E", pct: "35%", amount: "$16,625" },
              { label: "Value-Add", color: "#2ECC71", pct: "23%", amount: "$10,875" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-white">{item.label}</span>
                <span className="text-xs" style={{ color: "#4A4A5A" }}>
                  {item.pct} ({item.amount})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
