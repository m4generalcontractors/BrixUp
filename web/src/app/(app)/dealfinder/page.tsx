"use client";

import { useState } from "react";
import WalletWidget from "@/components/WalletWidget";

const myListings = [
  {
    id: "listing-001",
    address: "3421 Blanche St",
    city: "Charlotte",
    state: "NC",
    status: "Funded",
    capitalNeeded: 285000,
    funded: 100,
    commission: 8550,
    listedDate: "Jan 12, 2026",
    statusColor: "#2ECC71",
  },
  {
    id: "listing-002",
    address: "782 Eastway Dr",
    city: "Charlotte",
    state: "NC",
    status: "Funding",
    capitalNeeded: 195000,
    funded: 64,
    commission: 5850,
    listedDate: "Feb 1, 2026",
    statusColor: "#D4A843",
  },
  {
    id: "listing-003",
    address: "1509 Parkwood Ave",
    city: "Raleigh",
    state: "NC",
    status: "Under Review",
    capitalNeeded: 340000,
    funded: 0,
    commission: 10200,
    listedDate: "Feb 10, 2026",
    statusColor: "#E8632B",
  },
];

const recentActivity = [
  { date: "Feb 13", event: "Deal #001 fully funded — commission pending", amount: "+8,550 $BRIX", type: "earning" },
  { date: "Feb 10", event: "New deal submitted: 1509 Parkwood Ave", amount: "-", type: "action" },
  { date: "Feb 5", event: "Investor inquiry on 782 Eastway Dr", amount: "-", type: "info" },
  { date: "Feb 1", event: "Deal #002 listed on marketplace", amount: "-", type: "action" },
  { date: "Jan 28", event: "Referral bonus: Sarah M. signed up", amount: "+500 $BRIX", type: "earning" },
  { date: "Jan 15", event: "Deal #001 funding milestone 50%", amount: "-", type: "info" },
];

export default function DealFinderDashboard() {
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
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Deal Finder Dashboard</h1>
        <p className="mt-1 text-sm text-white/40">
          Source deals, earn commissions, grow your network
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Deals Listed", value: "12", icon: "📋" },
              { label: "Deals Funded", value: "7", icon: "✅" },
              { label: "Total Commission", value: "$24,500", icon: "💰" },
              { label: "Referrals", value: "18", icon: "👥" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 p-4"
                style={{ backgroundColor: "#1A1A2E" }}
              >
                <div className="mb-2 text-2xl">{stat.icon}</div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* My Listed Deals */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">My Listed Deals</h2>
              <button
                className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
              >
                + List New Deal
              </button>
            </div>

            <div className="space-y-3">
              {myListings.map((listing) => (
                <div
                  key={listing.id}
                  className="flex flex-col gap-3 rounded-lg border border-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{ backgroundColor: "#0D0D1A" }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">
                        {listing.address}
                      </h3>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${listing.statusColor}20`,
                          color: listing.statusColor,
                        }}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/40">
                      {listing.city}, {listing.state} · Listed {listing.listedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-white/40">Capital</p>
                      <p className="text-sm font-semibold text-white">
                        ${listing.capitalNeeded.toLocaleString()}
                      </p>
                    </div>
                    {listing.funded > 0 && (
                      <div className="w-24">
                        <div className="mb-1 flex justify-between">
                          <span className="text-xs text-white/40">Funded</span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: "#D4A843" }}
                          >
                            {listing.funded}%
                          </span>
                        </div>
                        <div
                          className="h-1.5 w-full rounded-full"
                          style={{ backgroundColor: "#1A1A2E" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${listing.funded}%`,
                              backgroundColor: "#D4A843",
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="text-right">
                      <p className="text-xs text-white/40">Commission</p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#2ECC71" }}
                      >
                        ${listing.commission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit New Deal Form */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              Submit a New Deal
            </h2>
            {submitSuccess && (
              <div className="mb-4 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Deal submitted successfully! It will appear after review.
              </div>
            )}
            {submitError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {submitError}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-white/50">Property Address</label>
                <input
                  type="text"
                  placeholder="123 Main St"
                  value={dealForm.address}
                  onChange={(e) => setDealForm({ ...dealForm, address: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">City, State</label>
                <input
                  type="text"
                  placeholder="Charlotte, NC"
                  value={dealForm.cityState}
                  onChange={(e) => setDealForm({ ...dealForm, cityState: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Property Type</label>
                <select
                  value={dealForm.propertyType}
                  onChange={(e) => setDealForm({ ...dealForm, propertyType: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                >
                  <option>Flip</option>
                  <option>New Build</option>
                  <option>Value-Add</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Asking Price</label>
                <input
                  type="text"
                  placeholder="$150,000"
                  value={dealForm.askingPrice}
                  onChange={(e) => setDealForm({ ...dealForm, askingPrice: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">Estimated Rehab</label>
                <input
                  type="text"
                  placeholder="$80,000"
                  value={dealForm.rehabBudget}
                  onChange={(e) => setDealForm({ ...dealForm, rehabBudget: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/50">ARV (After Repair Value)</label>
                <input
                  type="text"
                  placeholder="$310,000"
                  value={dealForm.arv}
                  onChange={(e) => setDealForm({ ...dealForm, arv: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-white/50">Deal Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the opportunity, property condition, neighborhood..."
                  value={dealForm.description}
                  onChange={(e) => setDealForm({ ...dealForm, description: e.target.value })}
                  className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A" }}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleDealSubmit}
                  disabled={submitting || !dealForm.address || !dealForm.cityState}
                  className="w-full rounded-lg py-3 text-sm font-semibold transition-colors hover:opacity-80 disabled:opacity-50"
                  style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
                >
                  {submitting ? "Submitting..." : "Submit Deal for Review"}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{ backgroundColor: "#0D0D1A" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/30">{item.date}</span>
                    <span className="text-sm text-white/70">{item.event}</span>
                  </div>
                  {item.amount !== "-" && (
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#2ECC71" }}
                    >
                      {item.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-6">
          {/* Wallet Widget */}
          <WalletWidget
            brixBalance={24500}
            usdcBalance={8200}
            stakedAmount={5000}
          />

          {/* Commission Summary */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h3 className="mb-3 text-sm font-semibold text-white/60">
              Commission Rate
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Deal Funded</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                  3% of capital
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Profit Share</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                  5% of net profit
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-white/40">Referral Bonus</span>
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                  500 $BRIX/referral
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h3 className="mb-3 text-sm font-semibold text-white/60">
              Deal Finder Score
            </h3>
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                style={{ backgroundColor: "#D4A84320", color: "#D4A843" }}
              >
                92
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Excellent</p>
                <p className="text-xs text-white/40">Top 5% of deal finders</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: "Deal Quality", value: 95 },
                { label: "Accuracy", value: 88 },
                { label: "Response Time", value: 92 },
                { label: "Close Rate", value: 78 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs text-white/40">{metric.label}</span>
                    <span className="text-xs text-white/60">{metric.value}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${metric.value}%`,
                        backgroundColor: "#D4A843",
                      }}
                    />
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
