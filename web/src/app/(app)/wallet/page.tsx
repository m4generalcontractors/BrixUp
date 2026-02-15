"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAccount } from "wagmi";
import {
  Wallet,
  ConnectWallet,
} from "@coinbase/onchainkit/wallet";
import {
  useBrixBalance,
  useStakedBalance,
  usePendingRewards,
  useStakerInfo,
  useBrixApprove,
  useStake,
  useUnstake,
  useClaimRewards,
  useBrixTransfer,
  formatBrix,
  parseBrix,
} from "@/lib/contracts";
import { BRIX_STAKING_ADDRESS, CONTRACTS_DEPLOYED } from "@/lib/contracts/config";

// ---------------------------------------------------------------------------
//  Types & sample data (fallback when contracts not deployed)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
//  Component
// ---------------------------------------------------------------------------

export default function WalletPage() {
  const { user } = useAuth();
  const { address, isConnected } = useAccount();

  // On-chain reads
  const { data: onChainBalance, refetch: refetchBalance } = useBrixBalance(address);
  const { data: onChainStaked, refetch: refetchStaked } = useStakedBalance(address);
  const { data: onChainRewards, refetch: refetchRewards } = usePendingRewards(address);
  const { data: stakerInfo } = useStakerInfo(address);

  // On-chain writes
  const { approve, isPending: isApproving } = useBrixApprove();
  const { stake: doStake, isPending: isStaking, isSuccess: stakeSuccess } = useStake();
  const { unstake: doUnstake, isPending: isUnstaking, isSuccess: unstakeSuccess } = useUnstake();
  const { claim: doClaim, isPending: isClaiming, isSuccess: claimSuccess } = useClaimRewards();
  const { transfer: doTransfer, isPending: isTransferring, isSuccess: transferSuccess } = useBrixTransfer();

  // Fallback state for when contracts aren't deployed
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [convertAmount, setConvertAmount] = useState("1000");
  const [stakeAmount, setStakeAmount] = useState("500");
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
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

  // Refetch on-chain data after successful operations
  useEffect(() => {
    if (stakeSuccess || unstakeSuccess || claimSuccess || transferSuccess) {
      refetchBalance();
      refetchStaked();
      refetchRewards();
    }
  }, [stakeSuccess, unstakeSuccess, claimSuccess, transferSuccess, refetchBalance, refetchStaked, refetchRewards]);

  // Compute balances — prefer on-chain when available
  const brixBalance = CONTRACTS_DEPLOYED && onChainBalance
    ? parseFloat(formatBrix(onChainBalance as bigint))
    : transactions.reduce((sum, tx) => {
        const isPositive = positiveTypes.includes(tx.type);
        return sum + (isPositive ? tx.amount : -tx.amount);
      }, 12500);

  const stakedAmount = CONTRACTS_DEPLOYED && onChainStaked
    ? parseFloat(formatBrix(onChainStaked as bigint))
    : transactions.filter((tx) => tx.type === "stake").reduce((sum, tx) => sum + tx.amount, 0) -
      transactions.filter((tx) => tx.type === "unstake").reduce((sum, tx) => sum + tx.amount, 0) + 3500;

  const pendingRewardsAmount = CONTRACTS_DEPLOYED && onChainRewards
    ? parseFloat(formatBrix(onChainRewards as bigint))
    : transactions.filter((t) => t.type === "staking_reward").reduce((s, t) => s + t.amount, 0);

  const stakedAt = stakerInfo ? Number((stakerInfo as readonly bigint[])[2]) : 0;
  const lockEnds = stakedAt > 0 ? new Date((stakedAt + 7 * 86400) * 1000) : null;
  const isLocked = lockEnds ? lockEnds > new Date() : false;

  const usdcEquivalent = (parseFloat(convertAmount.replace(/,/g, "")) || 0).toFixed(2);

  // ---- Handlers (on-chain when deployed, DB fallback otherwise) -----------

  const handleStake = async () => {
    const amount = parseFloat(stakeAmount.replace(/,/g, "")) || 500;
    if (amount <= 0) return;

    if (CONTRACTS_DEPLOYED && isConnected && BRIX_STAKING_ADDRESS) {
      const wei = parseBrix(amount.toString());
      // First approve staking contract to spend BRIX
      approve(BRIX_STAKING_ADDRESS, wei);
      // After approval confirmation, stake (user triggers from UI)
      setTimeout(() => doStake(wei), 2000);
    } else {
      // DB fallback
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "stake", amount, description: `Staked ${amount.toLocaleString()} BRIX` }),
        });
        await fetchTransactions();
      } catch { /* handled */ }
    }
  };

  const handleUnstake = async () => {
    if (stakedAmount <= 0) return;

    if (CONTRACTS_DEPLOYED && isConnected) {
      doUnstake(parseBrix(stakedAmount.toString()));
    } else {
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "unstake", amount: stakedAmount, description: `Unstaked ${stakedAmount.toLocaleString()} BRIX` }),
        });
        await fetchTransactions();
      } catch { /* handled */ }
    }
  };

  const handleClaimRewards = async () => {
    if (pendingRewardsAmount <= 0) return;
    if (CONTRACTS_DEPLOYED && isConnected) {
      doClaim();
    }
  };

  const handleSend = async () => {
    const amount = parseFloat(sendAmount.replace(/,/g, ""));
    if (!amount || amount <= 0 || !sendTo) return;

    if (CONTRACTS_DEPLOYED && isConnected && sendTo.startsWith("0x")) {
      doTransfer(sendTo as `0x${string}`, parseBrix(amount.toString()));
    } else {
      // DB fallback
      try {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "send",
            amount,
            description: `Sent ${amount.toLocaleString()} BRIX to ${sendTo.startsWith("0x") ? sendTo.slice(0, 6) + "..." + sendTo.slice(-4) : sendTo}`,
            from_address: address || user?.email || "Wallet",
            to_address: sendTo,
          }),
        });
        await fetchTransactions();
        setSendAmount("");
        setSendTo("");
      } catch { /* handled */ }
    }
  };

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
          from_address: address || user?.email || "Wallet",
          to_address: "USDC Wallet",
        }),
      });
      setConvertSuccess(true);
      await fetchTransactions();
      setTimeout(() => setConvertSuccess(false), 3000);
    } catch { /* handled */ }
    setConverting(false);
  };

  const filteredTx = transactions.filter(
    (tx) => filterType === "All" || tx.type === filterType.toLowerCase().replace(/ /g, "_")
  );

  const shortenAddr = (addr?: string) => {
    if (!addr) return "\u2014";
    if (addr.length > 20) return addr.slice(0, 6) + "..." + addr.slice(-4);
    return addr;
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Wallet</h1>
          <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Manage your $BRIX tokens</p>
        </div>
        {/* Coinbase Smart Wallet Connect — only show when not connected */}
        {!isConnected ? (
          <Wallet>
            <ConnectWallet />
          </Wallet>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2" style={{ backgroundColor: "#0D0D1A" }}>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            <span className="font-mono text-xs text-white/60">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        )}
      </div>

      {/* On-chain status banner */}
      {CONTRACTS_DEPLOYED && !isConnected && (
        <div className="mb-4 rounded-lg border px-4 py-3 text-xs" style={{ borderColor: "#2B4C7E40", backgroundColor: "#2B4C7E10", color: "#6B9FE8" }}>
          Connect your wallet above to interact with $BRIX contracts on Base mainnet.
        </div>
      )}
      {CONTRACTS_DEPLOYED && isConnected && (
        <div className="mb-4 rounded-lg border px-4 py-3 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            Connected to Base mainnet &middot; All transactions are live
          </div>
        </div>
      )}

      {/* Balance card */}
      <div
        className="mb-6 rounded-xl border p-8 text-center"
        style={{ backgroundColor: "#1A1A2E", borderColor: "#D4A84340", background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 50%, #1A1A2E 100%)" }}
      >
        <p className="text-sm font-medium" style={{ color: "#4A4A5A" }}>Total Balance</p>
        <p className="mt-2 text-3xl sm:text-5xl font-bold text-white">
          {Math.max(0, brixBalance).toLocaleString()} <span style={{ color: "#D4A843" }}>BRIX</span>
        </p>
        <p className="mt-2 text-base sm:text-lg" style={{ color: "#4A4A5A" }}>
          ≈ ${Math.max(0, brixBalance).toLocaleString()} USD
        </p>
        {isConnected && address && (
          <p className="mt-2 font-mono text-xs text-white/30">{shortenAddr(address)}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Send", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", color: "#2B4C7E" },
          { label: "Receive", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", color: "#2ECC71" },
          { label: "Convert", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", color: "#D4A843" },
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

      {/* Send panel */}
      {activeAction === "Send" && (
        <div className="mb-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Send $BRIX</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Recipient Address</label>
              <input
                type="text"
                value={sendTo}
                onChange={(e) => setSendTo(e.target.value)}
                placeholder="0x..."
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A" }}
              />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Amount ($BRIX)</label>
              <input
                type="text"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="1000"
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A" }}
              />
            </div>
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2B4C7E30", backgroundColor: "#2B4C7E10", color: "#6B9FE8" }}>
              Available: {Math.max(0, brixBalance).toLocaleString()} BRIX
            </div>
            {transferSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Transfer sent!
              </div>
            )}
            <button onClick={handleSend} disabled={isTransferring || !sendTo || !sendAmount} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}>
              {isTransferring ? "Sending..." : "Send BRIX"}
            </button>
          </div>
        </div>
      )}

      {/* Receive panel */}
      {activeAction === "Receive" && (
        <div className="mb-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Receive $BRIX</h2>
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-xl bg-white p-4">
                <svg viewBox="0 0 200 200" className="h-40 w-40">
                  {/* QR code visual representation */}
                  <rect width="200" height="200" fill="white" />
                  {/* Corner squares */}
                  <rect x="10" y="10" width="50" height="50" fill="black" />
                  <rect x="15" y="15" width="40" height="40" fill="white" />
                  <rect x="20" y="20" width="30" height="30" fill="black" />
                  <rect x="140" y="10" width="50" height="50" fill="black" />
                  <rect x="145" y="15" width="40" height="40" fill="white" />
                  <rect x="150" y="20" width="30" height="30" fill="black" />
                  <rect x="10" y="140" width="50" height="50" fill="black" />
                  <rect x="15" y="145" width="40" height="40" fill="white" />
                  <rect x="20" y="150" width="30" height="30" fill="black" />
                  {/* Data pattern - pseudo-random based on address */}
                  {[70,80,90,100,110,120].map((y) =>
                    [70,80,90,100,110,120,130,140,150,160].map((x) => {
                      const hash = ((x * 7 + y * 13) % 17);
                      return hash > 8 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="black" /> : null;
                    })
                  )}
                  {[10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180].map((x) =>
                    [70,80,90,100,110,120].map((y) => {
                      const hash = ((x * 11 + y * 3) % 13);
                      return hash > 6 ? <rect key={`b-${x}-${y}`} x={x} y={y} width="8" height="8" fill="black" /> : null;
                    })
                  )}
                  {/* Center logo area */}
                  <rect x="80" y="80" width="40" height="40" rx="4" fill="#D4A843" />
                  <text x="100" y="106" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B</text>
                </svg>
              </div>
            </div>

            {/* Wallet address */}
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Your Wallet Address</label>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex-1 rounded-lg px-4 py-3 font-mono text-sm text-white/80 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ backgroundColor: "#0D0D1A" }}
                >
                  {isConnected && address ? address : user?.id ? `0x${user.id.replace(/-/g, "").slice(0, 40)}` : "Connect wallet to receive"}
                </div>
                <button
                  onClick={() => {
                    const addr = isConnected && address ? address : user?.id ? `0x${user.id.replace(/-/g, "").slice(0, 40)}` : "";
                    if (addr) {
                      navigator.clipboard.writeText(addr);
                    }
                  }}
                  className="shrink-0 rounded-lg border px-3 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Network info */}
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
                Base Network (Mainnet) &middot; Only send $BRIX or ETH on Base to this address
              </div>
            </div>

            {/* Share options */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  const addr = isConnected && address ? address : "";
                  if (addr && navigator.share) {
                    navigator.share({ title: "My BrixUp Wallet", text: addr });
                  } else if (addr) {
                    navigator.clipboard.writeText(addr);
                  }
                }}
                className="rounded-lg border border-white/10 py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
              >
                Share Address
              </button>
              <button
                onClick={() => {
                  const addr = isConnected && address ? address : "";
                  if (addr) navigator.clipboard.writeText(addr);
                }}
                className="rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90"
                style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
              >
                Copy Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert panel */}
      {activeAction === "Convert" && (
        <div className="mb-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
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
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#D4A84330", backgroundColor: "#D4A84310", color: "#D4A843" }}>
              Rate: 1 BRIX = 1.00 USDC &middot; Fee: 0.5%
            </div>
            {convertSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Conversion submitted! Funds arrive in 1-2 business days.
              </div>
            )}
            <button onClick={handleConvert} disabled={converting || !convertAmount} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
              {converting ? "Converting..." : "Convert to USDC"}
            </button>
            <p className="text-center text-xs" style={{ color: "#4A4A5A" }}>Funds arrive via ACH in 1-2 business days</p>
          </div>
        </div>
      )}

      {/* Staking panel */}
      <div className="mb-6">
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
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>Pending Rewards</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "#2ECC71" }}>
                    +{pendingRewardsAmount.toLocaleString()} BRIX
                  </p>
                </div>
                <div className="text-right">
                  {isLocked && lockEnds ? (
                    <>
                      <p className="text-xs" style={{ color: "#4A4A5A" }}>Locked Until</p>
                      <p className="mt-1 text-sm font-medium text-white">{lockEnds.toLocaleDateString()}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs" style={{ color: "#4A4A5A" }}>Status</p>
                      <p className="mt-1 text-sm font-medium" style={{ color: "#2ECC71" }}>Unlocked</p>
                    </>
                  )}
                </div>
              </div>
              {pendingRewardsAmount > 0 && (
                <button onClick={handleClaimRewards} disabled={isClaiming} className="mt-3 w-full rounded-lg py-2 text-xs font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                  {isClaiming ? "Claiming..." : claimSuccess ? "Claimed!" : "Claim Rewards"}
                </button>
              )}
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

            {(stakeSuccess || unstakeSuccess) && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Transaction confirmed on-chain!
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleStake} disabled={isStaking || isApproving} className="rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                {isApproving ? "Approving..." : isStaking ? "Staking..." : "Stake"}
              </button>
              <button onClick={handleUnstake} disabled={isUnstaking || stakedAmount <= 0 || isLocked} className="rounded-lg border py-3 text-sm font-bold transition-colors hover:bg-white/5 disabled:opacity-50" style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}>
                {isUnstaking ? "Unstaking..." : isLocked ? "Locked" : "Unstake"}
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
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
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
        {/* Mobile card layout */}
        <div className="lg:hidden space-y-2">
          {filteredTx.map((tx) => {
            const isPositive = positiveTypes.includes(tx.type);
            const color = typeColors[tx.type] || "#4A4A5A";
            return (
              <div key={tx.id} className="flex items-center gap-3 rounded-lg border border-white/5 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: color + "20", color }}>
                  {isPositive ? "+" : "-"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{tx.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: color + "20", color }}>{typeLabels[tx.type] || tx.type}</span>
                    <span className="text-[10px]" style={{ color: "#4A4A5A" }}>{new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <span className="text-sm font-semibold shrink-0" style={{ color: isPositive ? "#2ECC71" : "#E8632B" }}>
                  {isPositive ? "+" : "-"}${tx.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
          {filteredTx.length === 0 && (
            <div className="py-8 text-center text-sm text-white/40">No transactions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
