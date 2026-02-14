"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  from_address?: string;
  to_address?: string;
}

const sampleTransactions: Transaction[] = [
  { id: "1", type: "investment", amount: 5000, description: "Investment in 1847 Oakwood Dr", status: "confirmed", created_at: "2026-02-12", from_address: "0x7a3B...9f2E", to_address: "Deal Pool #001" },
  { id: "2", type: "staking_reward", amount: 42, description: "Staking reward", status: "confirmed", created_at: "2026-02-10", from_address: "Staking Pool", to_address: "0x7a3B...9f2E" },
  { id: "3", type: "yield", amount: 312, description: "Yield payout - Pine Valley", status: "confirmed", created_at: "2026-02-05", from_address: "Deal Pool #003", to_address: "0x7a3B...9f2E" },
  { id: "4", type: "conversion", amount: 2000, description: "Convert BRIX to USDC", status: "confirmed", created_at: "2026-02-01", from_address: "0x7a3B...9f2E", to_address: "USDC Wallet" },
  { id: "5", type: "received", amount: 1000, description: "Received from 0x4e2C...1a8D", status: "confirmed", created_at: "2026-01-28", from_address: "0x4e2C...1a8D", to_address: "0x7a3B...9f2E" },
  { id: "6", type: "investment", amount: 10000, description: "Investment in 412 Magnolia Ln", status: "confirmed", created_at: "2026-01-20", from_address: "0x7a3B...9f2E", to_address: "Deal Pool #002" },
  { id: "7", type: "yield", amount: 275, description: "Yield payout - Oakwood Dr", status: "confirmed", created_at: "2026-01-15", from_address: "Deal Pool #001", to_address: "0x7a3B...9f2E" },
  { id: "8", type: "staking_reward", amount: 38, description: "Staking reward", status: "confirmed", created_at: "2026-01-10", from_address: "Staking Pool", to_address: "0x7a3B...9f2E" },
];

const typeLabels: Record<string, string> = {
  investment: "Investment",
  staking_reward: "Staking Reward",
  yield: "Yield",
  conversion: "Conversion",
  received: "Received",
  send: "Send",
  stake: "Stake",
  unstake: "Unstake",
};

const typeColors: Record<string, string> = {
  investment: "#2B4C7E",
  staking_reward: "#D4A843",
  yield: "#2ECC71",
  conversion: "#E8632B",
  received: "#2ECC71",
  send: "#E8632B",
  stake: "#D4A843",
  unstake: "#2B4C7E",
};

const positiveTypes = ["yield", "staking_reward", "received", "unstake"];

export default function WalletPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [convertAmount, setConvertAmount] = useState("1000");
  const [stakeAmount, setStakeAmount] = useState("500");
  const [filterType, setFilterType] = useState("All");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [staking, setStaking] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=50");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) setTransactions(data);
      }
    } catch { /* Use sample data */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Compute balances from transactions
  const brixBalance = transactions.reduce((sum, tx) => {
    const isPositive = positiveTypes.includes(tx.type);
    return sum + (isPositive ? tx.amount : -tx.amount);
  }, 12500); // base balance

  const stakedAmount = transactions
    .filter((tx) => tx.type === "stake")
    .reduce((sum, tx) => sum + tx.amount, 0) -
    transactions.filter((tx) => tx.type === "unstake").reduce((sum, tx) => sum + tx.amount, 0) + 3500;

  const usdcEquivalent = (parseFloat(convertAmount.replace(/,/g, "")) || 0).toFixed(2);

  const handleConvert = async () => {
    const amount = parseFloat(convertAmount.replace(/,/g, ""));
    if (!amount || amount <= 0) return;
    setConverting(true);
    setConvertSuccess(false);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "conversion",
          amount,
          description: `Convert ${amount.toLocaleString()} BRIX to USDC`,
          from_address: user?.email || "Wallet",
          to_address: "USDC Wallet",
        }),
      });
      setConvertSuccess(true);
      await fetchTransactions();
      setTimeout(() => setConvertSuccess(false), 3000);
    } catch { /* handled */ }
    setConverting(false);
  };

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount.replace(/,/g, "")) || 500;
    if (amount <= 0) return;
    setStaking(true);
    setStakeSuccess(false);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "stake",
          amount,
          description: `Staked ${amount.toLocaleString()} BRIX`,
        }),
      });
      setStakeSuccess(true);
      await fetchTransactions();
      setTimeout(() => setStakeSuccess(false), 3000);
    } catch { /* handled */ }
    setStaking(false);
  };

  const handleUnstake = async () => {
    if (stakedAmount <= 0) return;
    setStaking(true);
    setStakeSuccess(false);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "unstake",
          amount: stakedAmount,
          description: `Unstaked ${stakedAmount.toLocaleString()} BRIX`,
        }),
      });
      setStakeSuccess(true);
      await fetchTransactions();
      setTimeout(() => setStakeSuccess(false), 3000);
    } catch { /* handled */ }
    setStaking(false);
  };

  const filteredTx = transactions.filter(
    (tx) => filterType === "All" || tx.type === filterType.toLowerCase().replace(/ /g, "_")
  );

  const shortenAddr = (addr?: string) => {
    if (!addr) return "—";
    if (addr.length > 20) return addr.slice(0, 6) + "..." + addr.slice(-4);
    return addr;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Manage your $BRIX tokens</p>
      </div>

      {/* Balance card */}
      <div
        className="mb-6 rounded-xl border p-8 text-center"
        style={{ backgroundColor: "#1A1A2E", borderColor: "#D4A84340", background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 50%, #1A1A2E 100%)" }}
      >
        <p className="text-sm font-medium" style={{ color: "#4A4A5A" }}>Total Balance</p>
        <p className="mt-2 text-5xl font-bold text-white">
          {Math.max(0, brixBalance).toLocaleString()} <span style={{ color: "#D4A843" }}>BRIX</span>
        </p>
        <p className="mt-2 text-lg" style={{ color: "#4A4A5A" }}>
          ≈ ${Math.max(0, brixBalance).toLocaleString()} USD
        </p>
      </div>

      {/* Action buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Send", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", color: "#2B4C7E" },
          { label: "Receive", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", color: "#2ECC71" },
          { label: "Convert to USDC", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", color: "#D4A843" },
          { label: "Stake", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#E8632B" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setActiveAction(activeAction === action.label ? null : action.label)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-white/5 ${activeAction === action.label ? "border-white/30" : "border-white/10"}`}
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: action.color + "20" }}>
              <svg className="w-5 h-5" style={{ color: action.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Conversion panel */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Convert $BRIX to USDC</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Amount ($BRIX)</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full rounded-lg border border-white/10 py-3 px-4 text-lg text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#D4A843" }}>BRIX</span>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                <svg className="w-4 h-4" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>You Receive (USDC)</label>
              <div className="relative mt-1">
                <input type="text" value={usdcEquivalent} readOnly className="w-full rounded-lg border border-white/10 py-3 px-4 text-lg text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#2ECC71" }}>USDC</span>
              </div>
            </div>
            {convertSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Conversion submitted! Funds arrive in 1-2 business days.
              </div>
            )}
            <button onClick={handleConvert} disabled={converting || !convertAmount} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
              {converting ? "Converting..." : "Convert"}
            </button>
            <p className="text-center text-xs" style={{ color: "#4A4A5A" }}>Funds arrive via ACH in 1-2 business days</p>
          </div>
        </div>

        {/* Staking panel */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Staking</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "#0D0D1A" }}>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>Currently Staked</p>
                <p className="mt-1 text-xl font-bold text-white">{Math.max(0, stakedAmount).toLocaleString()}</p>
                <p className="text-xs" style={{ color: "#D4A843" }}>BRIX</p>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "#0D0D1A" }}>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>APY</p>
                <p className="mt-1 text-xl font-bold" style={{ color: "#2ECC71" }}>12.5%</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>Annual</p>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: "#0D0D1A" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Rewards Earned</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "#2ECC71" }}>
                    +{transactions.filter((t) => t.type === "staking_reward").reduce((s, t) => s + t.amount, 0).toLocaleString()} BRIX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Next Payout</p>
                  <p className="mt-1 text-sm font-medium text-white">in 3 days</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Stake Amount</label>
              <input
                type="text"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A" }}
                placeholder="Amount to stake"
              />
            </div>

            {stakeSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Staking transaction submitted!
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleStake} disabled={staking} className="rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                {staking ? "Processing..." : "Stake"}
              </button>
              <button onClick={handleUnstake} disabled={staking || stakedAmount <= 0} className="rounded-lg border py-3 text-sm font-bold transition-colors hover:bg-white/5 disabled:opacity-50" style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}>
                Unstake
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Transaction History</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="All">All Types</option>
            <option value="investment">Investment</option>
            <option value="yield">Yield</option>
            <option value="staking_reward">Staking Reward</option>
            <option value="conversion">Conversion</option>
            <option value="received">Received</option>
            <option value="stake">Stake</option>
            <option value="unstake">Unstake</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Date", "Type", "Amount", "From", "To", "Status"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-medium whitespace-nowrap pr-4" style={{ color: "#4A4A5A" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTx.map((tx) => {
                const isPositive = positiveTypes.includes(tx.type);
                const color = typeColors[tx.type] || "#4A4A5A";
                return (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 whitespace-nowrap text-white/80">
                      {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap" style={{ backgroundColor: color + "20", color }}>
                        {typeLabels[tx.type] || tx.type}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-semibold whitespace-nowrap" style={{ color: isPositive ? "#2ECC71" : "#E8632B" }}>
                      {isPositive ? "+" : "-"}{tx.amount.toLocaleString()} BRIX
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-white/60">{shortenAddr(tx.from_address)}</td>
                    <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-white/60">{shortenAddr(tx.to_address)}</td>
                    <td className="py-3">
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}>
                        {tx.status === "confirmed" ? "Confirmed" : tx.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredTx.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-sm text-white/40">No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
