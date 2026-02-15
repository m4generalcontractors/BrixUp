"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  Wallet,
  ConnectWallet,
} from "@coinbase/onchainkit/wallet";
import {
  useBrxuBalance,
  useStakedBalance,
  usePendingRewards,
  formatBrxu,
} from "@/lib/contracts";
import { CONTRACTS_DEPLOYED } from "@/lib/contracts/config";

interface WalletWidgetProps {
  /** Fallback BRXU balance when contracts not deployed. */
  brixBalance: number;
  /** Fallback USDC balance. */
  usdcBalance: number;
  /** Fallback staked amount. */
  stakedAmount?: number;
  /** Callback after a conversion. */
  onConvert?: (amount: number) => void;
}

export default function WalletWidget({
  brixBalance: fallbackBrix,
  usdcBalance,
  stakedAmount: fallbackStaked = 0,
  onConvert,
}: WalletWidgetProps) {
  const { address, isConnected } = useAccount();
  const { data: onChainBalance } = useBrxuBalance(address);
  const { data: onChainStaked } = useStakedBalance(address);
  const { data: onChainRewards } = usePendingRewards(address);

  const [convertAmount, setConvertAmount] = useState("");
  const [showConvert, setShowConvert] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);

  // Prefer on-chain data when available
  const brixBalance = CONTRACTS_DEPLOYED && onChainBalance
    ? parseFloat(formatBrxu(onChainBalance as bigint))
    : fallbackBrix;
  const stakedAmount = CONTRACTS_DEPLOYED && onChainStaked
    ? parseFloat(formatBrxu(onChainStaked as bigint))
    : fallbackStaked;
  const pendingRewards = CONTRACTS_DEPLOYED && onChainRewards
    ? parseFloat(formatBrxu(onChainRewards as bigint))
    : 0;

  const usdEquivalent = brixBalance * 1.0; // 1 BRXU ≈ $1 at launch

  return (
    <div
      className="rounded-xl border border-[var(--brix-border)] p-5"
      style={{ backgroundColor: "var(--brix-surface)" }}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/60">My Wallet</h3>
        <div className="flex items-center gap-3">
          {!isConnected && (
            <Wallet>
              <ConnectWallet />
            </Wallet>
          )}
          <a
            href="/wallet"
            className="text-xs font-medium hover:underline"
            style={{ color: "#D4A843" }}
          >
            Full Wallet →
          </a>
        </div>
      </div>

      {/* Connection status */}
      {isConnected && address && (
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
          <span className="font-mono text-xs text-white/40">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      )}

      {/* Main Balance */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {brixBalance.toLocaleString()}
          </span>
          <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
            $BRXU
          </span>
        </div>
        <p className="mt-0.5 text-xs text-white/40">
          ≈ ${usdEquivalent.toLocaleString()} USD
        </p>
      </div>

      {/* Balance Rows */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "var(--brix-bg)" }}>
          <span className="text-xs text-white/50">USDC Balance</span>
          <span className="text-sm font-semibold text-white">
            ${usdcBalance.toLocaleString()}
          </span>
        </div>
        {stakedAmount > 0 && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "var(--brix-bg)" }}>
            <span className="text-xs text-white/50">Staked $BRXU</span>
            <span className="text-sm font-semibold" style={{ color: "#2ECC71" }}>
              {stakedAmount.toLocaleString()}
            </span>
          </div>
        )}
        {pendingRewards > 0 && (
          <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ backgroundColor: "var(--brix-bg)" }}>
            <span className="text-xs text-white/50">Pending Rewards</span>
            <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
              +{pendingRewards.toLocaleString()}
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
          className="mt-3 rounded-lg border border-[var(--brix-border)] p-3"
          style={{ backgroundColor: "var(--brix-bg)" }}
        >
          <p className="mb-2 text-xs text-white/50">Convert $BRXU → USDC</p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="flex-1 rounded-lg border border-[var(--brix-border)] bg-transparent px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
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
                    body: JSON.stringify({ type: "conversion", amount: amt, description: `Converted ${amt} $BRXU to USDC` }),
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
