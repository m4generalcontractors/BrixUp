"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const transactions = [
  {
    date: "Feb 12, 2026",
    type: "Investment",
    amount: "-5,000 BRIX",
    from: "0x7a3B...9f2E",
    to: "Deal Pool #001",
    status: "Confirmed",
    txHash: "0x8f2a...3b7c",
  },
  {
    date: "Feb 10, 2026",
    type: "Staking Reward",
    amount: "+42 BRIX",
    from: "Staking Pool",
    to: "0x7a3B...9f2E",
    status: "Confirmed",
    txHash: "0x1d4e...8a9f",
  },
  {
    date: "Feb 5, 2026",
    type: "Yield",
    amount: "+312 BRIX",
    from: "Deal Pool #003",
    to: "0x7a3B...9f2E",
    status: "Confirmed",
    txHash: "0x5c7b...2e1d",
  },
  {
    date: "Feb 1, 2026",
    type: "Conversion",
    amount: "-2,000 BRIX",
    from: "0x7a3B...9f2E",
    to: "USDC Wallet",
    status: "Completed",
    txHash: "0x9a3f...4c8b",
  },
  {
    date: "Jan 28, 2026",
    type: "Received",
    amount: "+1,000 BRIX",
    from: "0x4e2C...1a8D",
    to: "0x7a3B...9f2E",
    status: "Confirmed",
    txHash: "0x3b8d...7e2a",
  },
  {
    date: "Jan 20, 2026",
    type: "Investment",
    amount: "-10,000 BRIX",
    from: "0x7a3B...9f2E",
    to: "Deal Pool #002",
    status: "Confirmed",
    txHash: "0x6f1c...9d4e",
  },
  {
    date: "Jan 15, 2026",
    type: "Yield",
    amount: "+275 BRIX",
    from: "Deal Pool #001",
    to: "0x7a3B...9f2E",
    status: "Confirmed",
    txHash: "0x2e5a...8b3c",
  },
  {
    date: "Jan 10, 2026",
    type: "Staking Reward",
    amount: "+38 BRIX",
    from: "Staking Pool",
    to: "0x7a3B...9f2E",
    status: "Confirmed",
    txHash: "0x7c9d...1a5f",
  },
];

const typeColors: Record<string, string> = {
  Investment: "#2B4C7E",
  "Staking Reward": "#D4A843",
  Yield: "#2ECC71",
  Conversion: "#E8632B",
  Received: "#2ECC71",
};

export default function WalletPage() {
  const { user } = useAuth();
  const [convertAmount, setConvertAmount] = useState("1000");
  const [filterType, setFilterType] = useState("All");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [staking, setStaking] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState(false);

  const usdcEquivalent = (parseFloat(convertAmount.replace(/,/g, "")) || 0).toFixed(2);

  const handleConvert = async () => {
    setConverting(true);
    setConvertSuccess(false);
    // In production: call Circle API / smart contract
    await new Promise((r) => setTimeout(r, 1500));
    setConverting(false);
    setConvertSuccess(true);
    setTimeout(() => setConvertSuccess(false), 3000);
  };

  const handleStake = async () => {
    setStaking(true);
    setStakeSuccess(false);
    // In production: call BrixStaking contract
    await new Promise((r) => setTimeout(r, 1500));
    setStaking(false);
    setStakeSuccess(true);
    setTimeout(() => setStakeSuccess(false), 3000);
  };

  const filteredTx = transactions.filter(
    (tx) => filterType === "All" || tx.type === filterType
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
          Manage your $BRIX tokens
        </p>
      </div>

      {/* Balance card */}
      <div
        className="mb-6 rounded-xl border p-8 text-center"
        style={{
          backgroundColor: "#1A1A2E",
          borderColor: "#D4A84340",
          background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 50%, #1A1A2E 100%)",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "#4A4A5A" }}>
          Total Balance
        </p>
        <p className="mt-2 text-5xl font-bold text-white">
          12,500 <span style={{ color: "#D4A843" }}>BRIX</span>
        </p>
        <p className="mt-2 text-lg" style={{ color: "#4A4A5A" }}>
          ≈ $12,500 USD
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
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-white/5 ${
              activeAction === action.label ? "border-white/30" : "border-white/10"
            }`}
            style={{ backgroundColor: activeAction === action.label ? "#1A1A2E" : "#1A1A2E" }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: action.color + "20" }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: action.color }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
              </svg>
            </div>
            <span className="text-xs font-medium text-white">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Conversion panel */}
        <div
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Convert $BRIX to USDC</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Amount ($BRIX)
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full rounded-lg border border-white/10 py-3 px-4 text-lg text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#D4A843" }}>
                  BRIX
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                <svg className="w-4 h-4" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                You Receive (USDC)
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  value={usdcEquivalent}
                  readOnly
                  className="w-full rounded-lg border border-white/10 py-3 px-4 text-lg text-white focus:outline-none"
                  style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#2ECC71" }}>
                  USDC
                </span>
              </div>
            </div>

            {convertSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Conversion submitted! Funds arrive in 1-2 business days.
              </div>
            )}
            <button
              onClick={handleConvert}
              disabled={converting || !convertAmount}
              className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              {converting ? "Converting..." : "Convert"}
            </button>
            <p className="text-center text-xs" style={{ color: "#4A4A5A" }}>
              Funds arrive via ACH in 1-2 business days
            </p>
          </div>
        </div>

        {/* Staking panel */}
        <div
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Staking</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-lg p-4 text-center"
                style={{ backgroundColor: "#0D0D1A" }}
              >
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Currently Staked
                </p>
                <p className="mt-1 text-xl font-bold text-white">3,500</p>
                <p className="text-xs" style={{ color: "#D4A843" }}>
                  BRIX
                </p>
              </div>
              <div
                className="rounded-lg p-4 text-center"
                style={{ backgroundColor: "#0D0D1A" }}
              >
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  APY
                </p>
                <p className="mt-1 text-xl font-bold" style={{ color: "#2ECC71" }}>
                  12.5%
                </p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Annual
                </p>
              </div>
            </div>

            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: "#0D0D1A" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    Rewards Earned
                  </p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "#2ECC71" }}>
                    +218 BRIX
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    Next Payout
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">in 3 days</p>
                </div>
              </div>
            </div>

            {stakeSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Staking transaction submitted!
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleStake}
                disabled={staking}
                className="rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
              >
                {staking ? "Staking..." : "Stake"}
              </button>
              <button
                onClick={handleStake}
                disabled={staking}
                className="rounded-lg border py-3 text-sm font-bold transition-colors hover:bg-white/5 disabled:opacity-50"
                style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div
        className="rounded-xl border border-white/10 p-5"
        style={{ backgroundColor: "#1A1A2E" }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Transaction History</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="All">All Types</option>
            <option value="Investment">Investment</option>
            <option value="Yield">Yield</option>
            <option value="Staking Reward">Staking Reward</option>
            <option value="Conversion">Conversion</option>
            <option value="Received">Received</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {["Date", "Type", "Amount", "From", "To", "Status", "Tx Hash"].map((h) => (
                  <th
                    key={h}
                    className="pb-3 text-left text-xs font-medium whitespace-nowrap pr-4"
                    style={{ color: "#4A4A5A" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTx.map((tx, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 pr-4 whitespace-nowrap text-white/80">{tx.date}</td>
                  <td className="py-3 pr-4">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: (typeColors[tx.type] || "#4A4A5A") + "20",
                        color: typeColors[tx.type] || "#4A4A5A",
                      }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className="py-3 pr-4 font-semibold whitespace-nowrap"
                    style={{
                      color: tx.amount.startsWith("+") ? "#2ECC71" : "#E8632B",
                    }}
                  >
                    {tx.amount}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-white/60">
                    {tx.from}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs text-white/60">
                    {tx.to}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs" style={{ color: "#2B4C7E" }}>
                    {tx.txHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
