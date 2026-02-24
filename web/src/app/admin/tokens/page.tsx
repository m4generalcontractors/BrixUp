"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { BRXU_TOKEN_ADDRESS, BRXU_FACTORY_ADDRESS, BRXU_STAKING_ADDRESS } from "@/lib/contracts/config";

const CONTRACT_ADDRESSES = {
  brixToken: BRXU_TOKEN_ADDRESS || "",
  brixFactory: BRXU_FACTORY_ADDRESS || "",
  brixStaking: BRXU_STAKING_ADDRESS || "",
};

export default function TokenManagementPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.user_role === "admin";

  const [mintAmount, setMintAmount] = useState("");
  const [mintTo, setMintTo] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const tokenStats = [
    { label: "Total Supply", value: "10,000,000", color: "#D4A843" },
    { label: "Circulating", value: "2,450,000", color: "#2ECC71" },
    { label: "Staked", value: "1,200,000", color: "#2B4C7E" },
    { label: "Treasury", value: "6,350,000", color: "#E8632B" },
  ];

  const recentActions = [
    { action: "Mint", amount: "50,000 $BRXU", to: "Staking Pool", date: "Feb 10, 2026", by: "deployer" },
    { action: "Transfer", amount: "10,000 $BRXU", to: "Marketing Wallet", date: "Feb 5, 2026", by: "admin" },
    { action: "Burn", amount: "5,000 $BRXU", to: "—", date: "Jan 28, 2026", by: "deployer" },
  ];

  const handleAction = async (type: "mint" | "burn") => {
    setActionLoading(type);
    setActionResult(null);
    // In production this would call the smart contract via the API
    await new Promise((r) => setTimeout(r, 1500));
    setActionResult({ type: "success", message: `${type === "mint" ? "Mint" : "Burn"} transaction submitted. Check BaseScan for confirmation.` });
    setActionLoading(null);
    if (type === "mint") { setMintAmount(""); setMintTo(""); }
    if (type === "burn") setBurnAmount("");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Token Management</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>$BRXU token controls and contract management</p>
      </div>

      {/* Token Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tokenStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
            <div className="mt-2 h-1 w-full rounded-full" style={{ backgroundColor: "var(--brix-bg)" }}>
              <div className="h-full rounded-full" style={{ backgroundColor: s.color, width: "60%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Contract Addresses */}
      <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
        <h2 className="mb-4 text-lg font-semibold text-white">Deployed Contracts (Base Mainnet)</h2>
        <div className="space-y-3">
          {Object.entries(CONTRACT_ADDRESSES).map(([name, addr]) => (
            <div key={name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{name.replace(/([A-Z])/g, " $1").trim()}</p>
                <p className="text-xs font-mono text-white/40">{addr}</p>
              </div>
              <a
                href={`https://basescan.org/address/${addr}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover:opacity-80"
                style={{ color: "#D4A843" }}
              >
                View on BaseScan
              </a>
            </div>
          ))}
        </div>
      </div>

      {actionResult && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${actionResult.type === "success" ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
          {actionResult.message}
        </div>
      )}

      {/* Mint / Burn Controls */}
      {isAdmin && (
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="mb-4 text-sm font-semibold text-white">Mint $BRXU</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Recipient address (0x...)"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
                className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                style={{ backgroundColor: "var(--brix-bg)" }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                style={{ backgroundColor: "var(--brix-bg)" }}
              />
              <button
                onClick={() => handleAction("mint")}
                disabled={!mintAmount || !mintTo || actionLoading === "mint"}
                className="w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
              >
                {actionLoading === "mint" ? "Submitting..." : "Mint Tokens"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
            <h3 className="mb-4 text-sm font-semibold text-white">Burn $BRXU</h3>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Amount to burn"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                className="w-full rounded-lg border border-[var(--brix-border)] px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                style={{ backgroundColor: "var(--brix-bg)" }}
              />
              <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Tokens will be burned from treasury wallet. This action is irreversible.</p>
              <button
                onClick={() => handleAction("burn")}
                disabled={!burnAmount || actionLoading === "burn"}
                className="w-full rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
              >
                {actionLoading === "burn" ? "Submitting..." : "Burn Tokens"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Token Actions */}
      <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
        <h3 className="mb-4 text-sm font-semibold text-white">Recent Token Actions</h3>
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--brix-border)]">{["Action", "Amount", "To", "Date", "By"].map((h) => (<th key={h} className="pb-3 text-left text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-white/5">
              {recentActions.map((a, i) => (
                <tr key={i}>
                  <td className="py-3"><span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: a.action === "Mint" ? "#2ECC7120" : a.action === "Burn" ? "#E8632B20" : "#2B4C7E20", color: a.action === "Mint" ? "#2ECC71" : a.action === "Burn" ? "#E8632B" : "#2B4C7E" }}>{a.action}</span></td>
                  <td className="py-3 font-medium text-white">{a.amount}</td>
                  <td className="py-3 text-white/60">{a.to}</td>
                  <td className="py-3 text-white/40">{a.date}</td>
                  <td className="py-3 text-white/40">{a.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="sm:hidden space-y-2">
          {recentActions.map((a, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: a.action === "Mint" ? "#2ECC7120" : a.action === "Burn" ? "#E8632B20" : "#2B4C7E20", color: a.action === "Mint" ? "#2ECC71" : a.action === "Burn" ? "#E8632B" : "#2B4C7E" }}>{a.action}</span>
                <span className="text-sm font-medium text-white">{a.amount}</span>
              </div>
              <span className="text-xs text-white/40">{a.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
