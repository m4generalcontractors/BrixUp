"use client";

import { useState, useEffect, useCallback } from "react";
import WalletWidget from "@/components/WalletWidget";
import { useAuth } from "@/lib/auth-context";

interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  property_type?: string;
  total_capital_needed?: number;
  description?: string;
}

interface ActiveProject {
  address: string;
  city: string;
  trade: string;
  milestone: string;
  milestoneProgress: number;
  nextDraw: string;
  totalEarned: string;
  dueDate: string;
}

interface Payment {
  date: string;
  project: string;
  amount: string;
  status: string;
}

const tradeOptions = ["Electrical", "Plumbing", "Framing", "HVAC", "Roofing", "Drywall", "Painting", "Flooring", "General Labor"];
const tradeColors: Record<string, string> = {
  Electrical: "#D4A843",
  Plumbing: "#2B4C7E",
  Framing: "#E8632B",
  HVAC: "#2ECC71",
  Roofing: "#8B5CF6",
  Drywall: "#4A4A5A",
  Painting: "#2ECC71",
  Flooring: "#D4A843",
  "General Labor": "#2B4C7E",
};

const sampleActiveProjects: ActiveProject[] = [
  { address: "1847 Oakwood Dr", city: "Charlotte, NC", trade: "Electrical", milestone: "MEP Rough-In", milestoneProgress: 60, nextDraw: "$3,200", totalEarned: "$4,800", dueDate: "Mar 5, 2026" },
  { address: "903 Pine Valley Rd", city: "Greenville, SC", trade: "Plumbing", milestone: "Finishes", milestoneProgress: 35, nextDraw: "$2,100", totalEarned: "$5,600", dueDate: "Mar 20, 2026" },
];

const samplePayments: Payment[] = [
  { date: "Feb 8, 2026", project: "1847 Oakwood Dr", amount: "1,600 $BRIX", status: "Paid" },
  { date: "Jan 25, 2026", project: "903 Pine Valley Rd", amount: "2,800 $BRIX", status: "Paid" },
  { date: "Jan 15, 2026", project: "1847 Oakwood Dr", amount: "1,600 $BRIX", status: "Paid" },
  { date: "Jan 5, 2026", project: "903 Pine Valley Rd", amount: "2,800 $BRIX", status: "Paid" },
  { date: "Mar 5, 2026", project: "1847 Oakwood Dr", amount: "3,200 $BRIX", status: "Pending" },
];

const brixScoreBreakdown = [
  { label: "Quality", score: 92, color: "#2ECC71" },
  { label: "Timeliness", score: 85, color: "#D4A843" },
  { label: "Communication", score: 78, color: "#2B4C7E" },
  { label: "Reliability", score: 90, color: "#E8632B" },
];

export default function BuilderPage() {
  const { profile } = useAuth();
  const [availableDeals, setAvailableDeals] = useState<Deal[]>([]);
  const [activeProjects] = useState<ActiveProject[]>(sampleActiveProjects);
  const [payments] = useState<Payment[]>(samplePayments);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [selectedTrade, setSelectedTrade] = useState("Electrical");

  const displayName = profile?.full_name?.split(" ")[0] || "Builder";

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/deals?status=Active");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setAvailableDeals(data.slice(0, 6));
      }
    } catch { /* fallback */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const handleApply = async (dealId: string, address: string) => {
    setApplying(dealId);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job_application",
          amount: 0,
          description: `Applied for ${selectedTrade} work at ${address}`,
        }),
      });
      setApplied((prev) => new Set(prev).add(dealId));
    } catch { /* handled */ }
    setApplying(null);
  };

  const totalEarned = payments.filter((p) => p.status === "Paid").reduce((sum, p) => {
    const num = parseFloat(p.amount.replace(/[$,]/g, "").replace(" $BRIX", "").replace(" BRIX", ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const brixScore = brixScoreBreakdown.reduce((s, c) => s + c.score, 0);
  const brixScoreAvg = Math.round(brixScore / brixScoreBreakdown.length);

  const builderStats = [
    { label: "Brix Score", value: String(Math.round(brixScoreAvg * 10)), icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z", color: "#D4A843" },
    { label: "Active Projects", value: String(activeProjects.length), icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "#2B4C7E" },
    { label: "$BRIX Earned", value: totalEarned.toLocaleString(), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#2ECC71" },
    { label: "Sweat Equity Value", value: `$${(totalEarned * 3).toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#E8632B" },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Your skills build wealth. Keep going.</p>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {builderStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + "20" }}>
                <svg className="w-5 h-5" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Available Deals Near You */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Available Deals Near You</h2>
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none"
            style={{ backgroundColor: "#0D0D1A" }}
          >
            {tradeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availableDeals.length > 0 ? availableDeals.map((deal) => (
            <div key={deal.id} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{deal.address}</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{deal.city}, {deal.state}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: (tradeColors[selectedTrade] || "#D4A843") + "20", color: tradeColors[selectedTrade] || "#D4A843" }}>
                  {selectedTrade}
                </span>
              </div>
              <p className="mb-3 text-sm leading-relaxed" style={{ color: "#F8F6F0" }}>
                {deal.description || `${selectedTrade} work needed for ${deal.property_type || "property"} project.`}
              </p>
              <div className="mb-4 flex items-center justify-between border-t border-white/10 pt-3">
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>$BRIX Rate</p>
                  <p className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                    {Math.round((deal.total_capital_needed || 200000) * 0.004).toLocaleString()} $BRIX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Timeline</p>
                  <p className="text-sm font-medium text-white">3-4 weeks</p>
                </div>
              </div>
              <button
                onClick={() => handleApply(deal.id, deal.address)}
                disabled={applying === deal.id || applied.has(deal.id)}
                className="w-full rounded-lg py-2.5 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: applied.has(deal.id) ? "#2ECC71" : "#D4A843", color: "#0D0D1A" }}
              >
                {applied.has(deal.id) ? "Applied!" : applying === deal.id ? "Applying..." : "Apply for Job"}
              </button>
            </div>
          )) : (
            <div className="col-span-full rounded-xl border border-white/10 p-8 text-center" style={{ backgroundColor: "#1A1A2E" }}>
              <p className="text-white/60">No deals available right now. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* My Active Projects */}
      <div className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-white">My Active Projects</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {activeProjects.map((project) => (
            <div key={project.address} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{project.address}</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{project.city} - {project.trade}</p>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}>Active</span>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-white">{project.milestone}</span>
                  <span className="text-xs" style={{ color: "#D4A843" }}>{project.milestoneProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                  <div className="h-full rounded-full" style={{ width: `${project.milestoneProgress}%`, backgroundColor: "#D4A843" }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Next Draw</p>
                  <p className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{project.nextDraw}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Total Earned</p>
                  <p className="text-sm font-semibold text-white">{project.totalEarned}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Due Date</p>
                  <p className="text-sm font-medium text-white">{project.dueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Widget */}
      <div className="mb-6">
        <WalletWidget brixBalance={totalEarned || 8250} usdcBalance={1500} stakedAmount={0} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment History */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {["Date", "Project", "Amount", "Status", ""].map((h) => (
                    <th key={h} className="pb-3 text-left text-xs font-medium" style={{ color: "#4A4A5A" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((payment, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-white/80">{payment.date}</td>
                    <td className="py-3 text-white">{payment.project}</td>
                    <td className="py-3 font-semibold" style={{ color: "#D4A843" }}>{payment.amount}</td>
                    <td className="py-3">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: payment.status === "Paid" ? "#2ECC7130" : "#D4A84330", color: payment.status === "Paid" ? "#2ECC71" : "#D4A843" }}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {payment.status === "Paid" && (
                        <button className="rounded-md px-2.5 py-1 text-xs font-medium border transition-colors hover:bg-white/5" style={{ borderColor: "#D4A843", color: "#D4A843" }}>
                          Convert
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Brix Score Breakdown */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Brix Score Breakdown</h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-6 flex h-40 w-40 items-center justify-center">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#0D0D1A" strokeWidth="12" />
                <circle cx="80" cy="80" r="70" fill="none" stroke="#D4A843" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(brixScoreAvg * 10 / 1000) * 440} 440`} />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-white">{brixScoreAvg * 10}</span>
                <span className="text-xs" style={{ color: "#4A4A5A" }}>/ 1000</span>
              </div>
            </div>
            <div className="w-full space-y-4">
              {brixScoreBreakdown.map((cat) => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white">{cat.label}</span>
                    <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.score}/100</span>
                  </div>
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${cat.score}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
