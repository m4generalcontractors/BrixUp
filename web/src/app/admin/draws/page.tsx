"use client";

import { useState, useEffect, useCallback } from "react";

interface DrawRequest {
  id: string;
  contractor_name: string;
  deal_address: string;
  milestone: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  submitted_at: string;
  notes: string;
  proof_url?: string;
}




const STATUS_COLORS: Record<string, string> = { pending: "#D4A843", approved: "#2ECC71", rejected: "#E8632B", paid: "#2B4C7E" };

export default function DrawRequestsPage() {
  const [draws, setDraws] = useState<DrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"pending" | "approved" | "paid" | "all">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDraws = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/draws");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setDraws(data);
          setLoading(false);
          return;
        }
      }
    } catch { /* silent */ }
    setDraws([]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDraws(); }, [fetchDraws]);

  const handleAction = async (drawId: string, action: "approve" | "reject" | "pay") => {
    setActionLoading(drawId);
    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "paid";
    try {
      await fetch("/api/admin/draws", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ drawId, status: newStatus }),
      });
    } catch { /* silent */ }
    setDraws((prev) => prev.map((d) => d.id === drawId ? { ...d, status: newStatus as DrawRequest["status"] } : d));
    setActionLoading(null);
  };

  const filtered = draws.filter((d) => {
    if (tab === "pending") return d.status === "pending";
    if (tab === "approved") return d.status === "approved";
    if (tab === "paid") return d.status === "paid" || d.status === "rejected";
    return true;
  });

  const pendingCount = draws.filter((d) => d.status === "pending").length;
  const pendingTotal = draws.filter((d) => d.status === "pending").reduce((s, d) => s + d.amount, 0);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8632B]" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Draw Requests</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>
          {pendingCount} pending &middot; ${pendingTotal.toLocaleString()} total pending
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg p-1" style={{ backgroundColor: "var(--brix-surface)" }}>
        {(["pending", "approved", "paid", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            style={tab === t ? { backgroundColor: "#E8632B", color: "#FFFFFF" } : { color: "var(--brix-fg-muted)" }}
          >
            {t === "paid" ? "Completed" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Draw Requests List */}
      <div className="space-y-3">
        {filtered.map((draw) => {
          const statusColor = STATUS_COLORS[draw.status];
          return (
            <div key={draw.id} className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-white">{draw.contractor_name}</p>
                    <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: statusColor + "20", color: statusColor }}>{draw.status}</span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: "var(--brix-fg-muted)" }}>{draw.deal_address} &middot; {draw.milestone}</p>
                  <p className="text-sm text-white/70">{draw.notes}</p>
                  <p className="mt-2 text-xs" style={{ color: "var(--brix-fg-muted)" }}>Submitted {new Date(draw.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <p className="text-xl font-bold text-white">${draw.amount.toLocaleString()}</p>
                  {draw.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(draw.id, "approve")}
                        disabled={actionLoading === draw.id}
                        className="rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
                        style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(draw.id, "reject")}
                        disabled={actionLoading === draw.id}
                        className="rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
                        style={{ backgroundColor: "#E8632B20", color: "#E8632B" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {draw.status === "approved" && (
                    <button
                      onClick={() => handleAction(draw.id, "pay")}
                      disabled={actionLoading === draw.id}
                      className="rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
                      style={{ backgroundColor: "#2B4C7E", color: "#FFFFFF" }}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-[var(--brix-border)] p-12 text-center" style={{ backgroundColor: "var(--brix-surface)" }}>
            <p className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>No draw requests in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
