"use client";

import { useState } from "react";

interface WalletWidgetProps {
  brixBalance: number;
  usdcBalance: number;
  stakedAmount?: number;
  onConvert?: (amount: number) => void;
}

export default function WalletWidget({
  brixBalance,
  usdcBalance,
  stakedAmount = 0,
  onConvert,
}: WalletWidgetProps) {
  const [convertAmount, setConvertAmount] = useState("");
  const [showConvert, setShowConvert] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);

  const usdEquivalent = brixBalance * 1.0; // 1 BRIX ≈ $1 at launch

  return (
    <div
      className="rounded-xl border border-white/10 p-5"
      style={{ backgroundColor: "#1A1A2E" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60">My Wallet</h3>
        <a
          href="/wallet"
          className="text-xs font-medium hover:underline"
          style={{ color: "#D4A843" }}
        >
          Full Wallet →
        </a>
      </div>

      {/* Main Balance */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {brixBalance.toLocaleString()}
          </span>
          <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
            $BRIX
          </span>
        </div>
        <p className="mt-0.5 text-xs text-white/40">
          ≈ ${usdEquivalent.toLocaleString()} USD
        </p>
      </div>

      {/* Balance Rows */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#0D0D1A" }}>
          <span className="text-xs text-white/50">USDC Balance</span>
          <span className="text-sm font-semibold text-white">
            ${usdcBalance.toLocaleString()}
          </span>
        </div>
        {stakedAmount > 0 && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "#0D0D1A" }}>
            <span className="text-xs text-white/50">Staked $BRIX</span>
            <span className="text-sm font-semibold" style={{ color: "#2ECC71" }}>
              {stakedAmount.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          className="rounded-lg py-2 text-xs font-semibold text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: "#2B4C7E" }}
        >
          Send
        </button>
        <button
          className="rounded-lg py-2 text-xs font-semibold transition-colors hover:opacity-80"
          style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
        >
          Receive
        </button>
        <button
          onClick={() => setShowConvert(!showConvert)}
          className="rounded-lg py-2 text-xs font-semibold text-white transition-colors hover:opacity-80"
          style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
        >
          Convert
        </button>
      </div>

      {/* Convert Panel */}
      {showConvert && (
        <div
          className="mt-3 rounded-lg border border-white/10 p-3"
          style={{ backgroundColor: "#0D0D1A" }}
        >
          <p className="mb-2 text-xs text-white/50">Convert $BRIX → USDC</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            />
            <button
              disabled={converting || !convertAmount || Number(convertAmount) <= 0 || Number(convertAmount) > brixBalance}
              onClick={async () => {
                const amt = Number(convertAmount);
                if (amt <= 0 || amt > brixBalance) return;
                setConverting(true);
                try {
                  const res = await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "conversion", amount: amt, description: `Converted ${amt} $BRIX to USDC` }),
                  });
                  if (res.ok) {
                    setConvertSuccess(true);
                    setConvertAmount("");
                    if (onConvert) onConvert(amt);
                    setTimeout(() => { setConvertSuccess(false); setShowConvert(false); }, 2000);
                  }
                } catch { /* silent */ }
                setConverting(false);
              }}
              className="rounded-lg px-4 py-2 text-xs font-semibold transition-colors hover:opacity-80 disabled:opacity-50"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              {converting ? "..." : convertSuccess ? "Done!" : "Convert"}
            </button>
          </div>
          {convertAmount && (
            <p className="mt-2 text-xs text-white/40">
              You&apos;ll receive ≈ ${Number(convertAmount).toLocaleString()} USDC
              → ACH in 1-2 business days
            </p>
          )}
        </div>
      )}
    </div>
  );
}
