"use client";

import { useState, useEffect, useCallback } from "react";

interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  property_type: string;
  status: string;
  asking_price: number;
  rehab_budget: number;
  arv: number;
  total_capital_needed: number;
  projected_roi: number;
  description: string;
  dealmaker_id: string | null;
  listed_date: string;
  min_investment: number;
}

const STATUS_COLORS: Record<string, string> = {
  "Pending Review": "#D4A843",
  Open: "#2B4C7E",
  Funding: "#2ECC71",
  Funded: "#2ECC71",
  Active: "#D4A843",
  Completed: "#4A4A5A",
  Rejected: "#E8632B",
};

export default function DealApprovalPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [expandedDeal, setExpandedDeal] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/deals");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDeals(data);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const handleAction = async (dealId: string, action: "approve" | "reject") => {
    setActionLoading(dealId);
    try {
      const newStatus = action === "approve" ? "Open" : "Rejected";
      const res = await fetch("/api/admin/deals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, status: newStatus }),
      });
      if (res.ok) {
        setDeals((prev) => prev.map((d) => d.id === dealId ? { ...d, status: newStatus } : d));
      }
    } catch { /* silent */ }
    setActionLoading(null);
  };

  const filtered = deals.filter((d) => {
    if (tab === "pending") return d.status === "Pending Review";
    if (tab === "approved") return ["Open", "Funding", "Funded", "Active", "Completed"].includes(d.status);
    if (tab === "rejected") return d.status === "Rejected";
    return true;
  });

  const pendingCount = deals.filter((d) => d.status === "Pending Review").length;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8632B]" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Deal Approval</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>{pendingCount} deal{pendingCount !== 1 ? "s" : ""} awaiting review</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg p-1" style={{ backgroundColor: "#1A1A2E" }}>
        {(["pending", "approved", "rejected", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            style={tab === t ? { backgroundColor: "#E8632B", color: "#FFFFFF" } : { color: "#4A4A5A" }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs" style={{ backgroundColor: "#D4A84330", color: "#D4A843" }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Deals List */}
      <div className="space-y-3">
        {filtered.map((deal) => {
          const statusColor = STATUS_COLORS[deal.status] || "#4A4A5A";
          const isExpanded = expandedDeal === deal.id;
          return (
            <div key={deal.id} className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: "#1A1A2E" }}>
              <div
                className="flex cursor-pointer items-center justify-between p-4 hover:bg-white/5 transition-colors"
                onClick={() => setExpandedDeal(isExpanded ? null : deal.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{deal.address}</p>
                      <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: statusColor + "20", color: statusColor }}>{deal.status}</span>
                    </div>
                    <p className="mt-0.5 text-xs" style={{ color: "#4A4A5A" }}>{deal.city}, {deal.state} &middot; {deal.property_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Capital Needed</p>
                    <p className="text-sm font-semibold text-white">${deal.total_capital_needed?.toLocaleString()}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Proj. ROI</p>
                    <p className="text-sm font-semibold" style={{ color: "#2ECC71" }}>{deal.projected_roi}%</p>
                  </div>
                  <svg className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/5 p-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
                    <div><p className="text-xs" style={{ color: "#4A4A5A" }}>Asking Price</p><p className="text-sm font-semibold text-white">${deal.asking_price?.toLocaleString()}</p></div>
                    <div><p className="text-xs" style={{ color: "#4A4A5A" }}>Rehab Budget</p><p className="text-sm font-semibold text-white">${deal.rehab_budget?.toLocaleString()}</p></div>
                    <div><p className="text-xs" style={{ color: "#4A4A5A" }}>ARV</p><p className="text-sm font-semibold text-white">${deal.arv?.toLocaleString()}</p></div>
                    <div><p className="text-xs" style={{ color: "#4A4A5A" }}>Min Investment</p><p className="text-sm font-semibold text-white">${deal.min_investment?.toLocaleString()}</p></div>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs mb-1" style={{ color: "#4A4A5A" }}>Description</p>
                    <p className="text-sm text-white/80">{deal.description}</p>
                  </div>
                  {deal.status === "Pending Review" && (
                    <div className="flex gap-3 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleAction(deal.id, "approve")}
                        disabled={actionLoading === deal.id}
                        className="rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50"
                        style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
                      >
                        {actionLoading === deal.id ? "..." : "Approve & Go Live"}
                      </button>
                      <button
                        onClick={() => handleAction(deal.id, "reject")}
                        disabled={actionLoading === deal.id}
                        className="rounded-lg px-6 py-2 text-sm font-semibold disabled:opacity-50"
                        style={{ backgroundColor: "#E8632B20", color: "#E8632B" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/10 p-12 text-center" style={{ backgroundColor: "#1A1A2E" }}>
            <p className="text-sm" style={{ color: "#4A4A5A" }}>No deals in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
