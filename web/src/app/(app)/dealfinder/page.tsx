"use client";

import { useState, useEffect, useCallback } from "react";
import WalletWidget from "@/components/WalletWidget";
import { useAuth } from "@/lib/auth-context";

interface ListedDeal {
  id: string;
  address: string;
  city: string;
  state: string;
  status: string;
  total_capital_needed: number;
  funded_amount: number;
  listed_date?: string;
  created_at?: string;
}

interface ActivityItem {
  date: string;
  event: string;
  amount: string;
  type: string;
}

const sampleListings: ListedDeal[] = [
  { id: "listing-001", address: "3421 Blanche St", city: "Charlotte", state: "NC", status: "Funded", total_capital_needed: 285000, funded_amount: 285000, listed_date: "2026-01-12" },
  { id: "listing-002", address: "782 Eastway Dr", city: "Charlotte", state: "NC", status: "Funding", total_capital_needed: 195000, funded_amount: 124800, listed_date: "2026-02-01" },
  { id: "listing-003", address: "1509 Parkwood Ave", city: "Raleigh", state: "NC", status: "Under Review", total_capital_needed: 340000, funded_amount: 0, listed_date: "2026-02-10" },
];

const sampleActivity: ActivityItem[] = [
  { date: "Feb 13", event: "Deal #001 fully funded — commission pending", amount: "+8,550 $BRXU", type: "earning" },
  { date: "Feb 10", event: "New deal submitted: 1509 Parkwood Ave", amount: "-", type: "action" },
  { date: "Feb 5", event: "Investor inquiry on 782 Eastway Dr", amount: "-", type: "info" },
  { date: "Feb 1", event: "Deal #002 listed on marketplace", amount: "-", type: "action" },
  { date: "Jan 28", event: "Referral bonus: Sarah M. signed up", amount: "+500 $BRXU", type: "earning" },
  { date: "Jan 15", event: "Deal #001 funding milestone 50%", amount: "-", type: "info" },
];

const statusColors: Record<string, string> = {
  Funded: "#2ECC71",
  Funding: "#D4A843",
  Active: "#D4A843",
  Open: "#2B4C7E",
  "Under Review": "#E8632B",
  Completed: "#2ECC71",
};

export default function DealFinderDashboard() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<ListedDeal[]>(sampleListings);
  const [activity] = useState<ActivityItem[]>(sampleActivity);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [dealForm, setDealForm] = useState({
    address: "",
    cityState: "",
    propertyType: "Flip",
    askingPrice: "",
    rehabBudget: "",
    arv: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch("/api/deals?source=user");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setListings(data.map((d: Record<string, unknown>) => ({
            id: d.id as string,
            address: d.address as string,
            city: d.city as string,
            state: d.state as string,
            status: d.status as string,
            total_capital_needed: (d.total_capital_needed as number) || 0,
            funded_amount: (d.funded_amount as number) || 0,
            listed_date: (d.listed_date as string) || (d.created_at as string) || "",
          })));
        }
      }
    } catch { /* Use sample data */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleDealSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const [city, state] = dealForm.cityState.split(",").map((s) => s.trim());

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: dealForm.address,
          city: city || dealForm.cityState,
          state: state || "",
          property_type: dealForm.propertyType,
          asking_price: dealForm.askingPrice.replace(/[$,]/g, ""),
          rehab_budget: dealForm.rehabBudget.replace(/[$,]/g, ""),
          arv: dealForm.arv.replace(/[$,]/g, ""),
          description: dealForm.description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit deal");
      }

      setSubmitSuccess(true);
      setDealForm({ address: "", cityState: "", propertyType: "Flip", askingPrice: "", rehabBudget: "", arv: "", description: "" });
      await fetchListings();
      setTimeout(() => { setSubmitSuccess(false); setShowForm(false); }, 3000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  // Computed stats
  const totalListings = listings.length;
  const fundedDeals = listings.filter((l) => l.status === "Funded" || l.status === "Completed").length;
  const totalCommission = listings
    .filter((l) => l.status === "Funded" || l.status === "Completed")
    .reduce((sum, l) => sum + Math.round(l.total_capital_needed * 0.03), 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Deal Finder Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">
          Source deals, earn commissions, grow your network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Deals Listed", value: String(totalListings), color: "#2B4C7E", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
              { label: "Deals Funded", value: String(fundedDeals), color: "#2ECC71", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Total Commission", value: `$${totalCommission.toLocaleString()}`, color: "#D4A843", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "Referrals", value: "18", color: "#E8632B", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-[var(--brix-border)] p-4" style={{ backgroundColor: "var(--brix-surface)" }}>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: stat.color + "20" }}>
                  <svg className="w-4 h-4" style={{ color: stat.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Listed Deals */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">My Listed Deals</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
              >
                + List New Deal
              </button>
            </div>

            <div className="space-y-3">
              {listings.map((listing) => {
                const funded = listing.total_capital_needed > 0
                  ? Math.round((listing.funded_amount / listing.total_capital_needed) * 100)
                  : 0;
                const commission = Math.round(listing.total_capital_needed * 0.03);
                const sColor = statusColors[listing.status] || "#4A4A5A";
                return (
                  <div key={listing.id} className="flex flex-col gap-3 rounded-lg border border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between" style={{ backgroundColor: "var(--brix-bg)" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{listing.address}</h3>
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${sColor}20`, color: sColor }}>
                          {listing.status}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-white/40">
                        {listing.city}, {listing.state} · Listed {listing.listed_date ? new Date(listing.listed_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                      <div className="text-right">
                        <p className="text-xs text-white/40">Capital</p>
                        <p className="text-sm font-semibold text-white">${listing.total_capital_needed.toLocaleString()}</p>
                      </div>
                      {funded > 0 && (
                        <div className="hidden sm:block w-24">
                          <div className="mb-1 flex justify-between">
                            <span className="text-xs text-white/40">Funded</span>
                            <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>{funded}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "var(--brix-surface)" }}>
                            <div className="h-full rounded-full" style={{ width: `${funded}%`, backgroundColor: "#D4A843" }} />
                          </div>
                        </div>
                      )}
                      {funded > 0 && (
                        <span className="sm:hidden text-xs font-semibold" style={{ color: "#D4A843" }}>{funded}%</span>
                      )}
                      <div className="text-right">
                        <p className="text-xs text-white/40">Comm.</p>
                        <p className="text-sm font-semibold" style={{ color: "#2ECC71" }}>${commission.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {listings.length === 0 && (
                <div className="py-8 text-center text-white/40 text-sm">No deals listed yet. Submit your first deal below!</div>
              )}
            </div>
          </div>

          {/* Submit New Deal Form */}
          {showForm && (
            <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
              <h2 className="mb-4 text-lg font-semibold text-white">Submit a New Deal</h2>
              {submitSuccess && (
                <div className="mb-4 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                  Deal submitted successfully! It will appear after review.
                </div>
              )}
              {submitError && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{submitError}</div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/50">Property Address</label>
                  <input type="text" placeholder="123 Main St" value={dealForm.address} onChange={(e) => setDealForm({ ...dealForm, address: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">City, State</label>
                  <input type="text" placeholder="Charlotte, NC" value={dealForm.cityState} onChange={(e) => setDealForm({ ...dealForm, cityState: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Property Type</label>
                  <select value={dealForm.propertyType} onChange={(e) => setDealForm({ ...dealForm, propertyType: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }}>
                    <option>Flip</option>
                    <option>New Build</option>
                    <option>Value-Add</option>
                    <option>Wholesale</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Asking Price</label>
                  <input type="text" placeholder="$150,000" value={dealForm.askingPrice} onChange={(e) => setDealForm({ ...dealForm, askingPrice: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">Estimated Rehab</label>
                  <input type="text" placeholder="$80,000" value={dealForm.rehabBudget} onChange={(e) => setDealForm({ ...dealForm, rehabBudget: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/50">ARV (After Repair Value)</label>
                  <input type="text" placeholder="$310,000" value={dealForm.arv} onChange={(e) => setDealForm({ ...dealForm, arv: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-white/50">Deal Description</label>
                  <textarea rows={3} placeholder="Describe the opportunity, property condition, neighborhood..." value={dealForm.description} onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })} className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1" style={{ backgroundColor: "var(--brix-bg)" }} />
                </div>
                <div className="sm:col-span-2">
                  <button onClick={handleDealSubmit} disabled={submitting || !dealForm.address || !dealForm.cityState} className="w-full rounded-lg py-3 text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
                    {submitting ? "Submitting..." : "Submit Deal for Review"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
            <div className="space-y-3">
              {activity.map((item, i) => (
                <div key={i} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg px-3 py-2.5" style={{ backgroundColor: "var(--brix-bg)" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 text-xs text-white/30">{item.date}</span>
                    <span className="text-sm text-white/70 truncate">{item.event}</span>
                  </div>
                  {item.amount !== "-" && (
                    <span className="shrink-0 text-sm font-semibold pl-8 sm:pl-0" style={{ color: "#2ECC71" }}>{item.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <WalletWidget brixBalance={totalCommission || 24500} usdcBalance={8200} stakedAmount={5000} />

          {/* Commission Summary */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="mb-3 text-sm font-semibold text-white/60">Commission Rate</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Deal Funded</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>3% of capital</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Profit Share</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>5% of net profit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Referral Bonus</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>500 $BRXU/referral</span>
              </div>
            </div>
          </div>

          {/* Deal Finder Score */}
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="mb-3 text-sm font-semibold text-white/60">Deal Finder Score</h3>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold" style={{ backgroundColor: "#D4A84320", color: "#D4A843" }}>
                {fundedDeals > 0 ? Math.min(99, Math.round(70 + fundedDeals * 5)) : 92}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{profile?.full_name || "Deal Finder"}</p>
                <p className="text-xs text-white/40">Top 5% of deal finders</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Deal Quality", value: 95 },
                { label: "Accuracy", value: 88 },
                { label: "Response Time", value: 92 },
                { label: "Close Rate", value: fundedDeals > 0 ? Math.round((fundedDeals / totalListings) * 100) : 78 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-white/40">{metric.label}</span>
                    <span className="text-xs text-white/60">{metric.value}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: "var(--brix-bg)" }}>
                    <div className="h-full rounded-full" style={{ width: `${metric.value}%`, backgroundColor: "#D4A843" }} />
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
