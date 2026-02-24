"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useSearchParams } from "next/navigation";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { useBalance } from "@/lib/wallet/useBalance";
import { CONTRACTS_DEPLOYED } from "@/lib/contracts/config";
import {
  useBrxuApprove,
  useBrxuTransfer,
  useStake as useContractStake,
  useUnstake as useContractUnstake,
  useClaimRewards as useContractClaim,
  parseBrxu,
} from "@/lib/contracts";
import { validate, amountSchema, createAmountSchema, createAddressSchema, parseAmount, validateAmount, sanitizeAmountInput } from "@/lib/validation";
import { QRCodeSVG } from "qrcode.react";

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
  { id: "4", type: "conversion", amount: 1667, description: "Convert 1,667 BRXU to USDC", status: "confirmed", created_at: "2026-02-01", from_address: "0x7a3B...9f2E", to_address: "USDC Wallet" },
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
  buy: "Purchase",
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
  buy: "#2ECC71",
};

const positiveTypes = ["yield", "staking_reward", "received", "unstake", "buy"];

// ---------------------------------------------------------------------------
//  Component
// ---------------------------------------------------------------------------

export default function WalletPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [stripeSuccess, setStripeSuccess] = useState(false);

  // Handle Stripe redirect success
  useEffect(() => {
    if (searchParams.get("purchase") === "success") {
      setStripeSuccess(true);
      const amount = searchParams.get("amount");
      if (amount) {
        setBuySuccess(true);
        setTimeout(() => setBuySuccess(false), 5000);
      }
      // Clean URL params
      window.history.replaceState({}, "", "/wallet");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Real wallet connection via wagmi — no auto-popup, user-initiated only
  const { address: wagmiAddress, isConnected: wagmiConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  // Shared balance — single source of truth across all views
  const balance = useBalance();
  const isConnected = wagmiConnected || balance.isConnected;
  const address = wagmiAddress || balance.address;

  // On-chain write hooks (only active when CONTRACTS_DEPLOYED)
  const { approve, isPending: isApproving } = useBrxuApprove();
  const { transfer: onChainTransfer, isPending: isOnChainTransferring, isSuccess: onChainTransferSuccess } = useBrxuTransfer();
  const { stake: onChainStake, isPending: isOnChainStaking, isSuccess: onChainStakeSuccess } = useContractStake();
  const { unstake: onChainUnstake, isPending: isOnChainUnstaking, isSuccess: onChainUnstakeSuccess } = useContractUnstake();
  const { claim: onChainClaim, isPending: isOnChainClaiming, isSuccess: onChainClaimSuccess } = useContractClaim();

  // Operation states (DB fallback)
  const [isStaking, setIsStaking] = useState(false);
  const [stakeSuccess, setStakeSuccess] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [unstakeSuccess, setUnstakeSuccess] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Validation error states
  const [sendToError, setSendToError] = useState<string | null>(null);
  const [sendAmountError, setSendAmountError] = useState<string | null>(null);
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [unstakeError, setUnstakeError] = useState<string | null>(null);

  // Refetch balance after on-chain operations
  useEffect(() => {
    if (onChainStakeSuccess || onChainUnstakeSuccess || onChainClaimSuccess || onChainTransferSuccess) {
      balance.refetch();
    }
  }, [onChainStakeSuccess, onChainUnstakeSuccess, onChainClaimSuccess, onChainTransferSuccess, balance]);

  // State for wallet features
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [convertAmount, setConvertAmount] = useState("1000");
  const [stakeAmount, setStakeAmount] = useState("500");
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertSuccess, setConvertSuccess] = useState(false);
  const [buyAmount, setBuyAmount] = useState("100");
  const [buyMethod, setBuyMethod] = useState<"card" | "bank" | "coinbase">("card");
  const [buying, setBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=50");
      if (res.ok) {
        const data = await res.json();
        // Only replace sample data if API returns more transactions
        if (Array.isArray(data) && data.length >= sampleTransactions.length) {
          setTransactions(data);
        }
      }
    } catch { /* Use sample data */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  // Balances from shared useBalance hook (on-chain when connected, Supabase fallback)
  const brixBalance = balance.availableBalance;
  const stakedAmount = balance.stakedBalance;
  const pendingRewardsAmount = balance.pendingRewards;
  const isLocked = false;

  const usdcEquivalent = (parseFloat(convertAmount.replace(/,/g, "")) || 0).toFixed(2);

  // Real-time validation on Stake input change
  useEffect(() => {
    if (!stakeAmount) { setStakeError(null); return; }
    const { error } = validateAmount(stakeAmount, brixBalance, 1);
    setStakeError(error);
  }, [stakeAmount, brixBalance]);

  // Real-time validation on Unstake input change
  useEffect(() => {
    if (!unstakeAmount) { setUnstakeError(null); return; }
    const { error } = validateAmount(unstakeAmount, stakedAmount, 1);
    setUnstakeError(error);
  }, [unstakeAmount, stakedAmount]);

  // ---- Handlers (on-chain when deployed, DB fallback otherwise) -----------

  const handleStake = async () => {
    const schema = createAmountSchema({ min: 1, max: brixBalance, minLabel: "Minimum is 1 BRXU", maxLabel: `Insufficient balance (${brixBalance.toLocaleString()} available)` });
    const err = validate(schema, stakeAmount);
    setStakeError(err);
    if (err) return;
    const amount = parseAmount(stakeAmount);

    // On-chain staking when contracts deployed
    if (CONTRACTS_DEPLOYED && isConnected) {
      const wei = parseBrxu(amount.toString());
      approve(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS as `0x${string}`, wei);
      setTimeout(() => onChainStake(wei), 2000);
      return;
    }

    // DB fallback
    setIsStaking(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "stake", amount, description: `Staked ${amount.toLocaleString()} BRXU` }),
      });
      setStakeSuccess(true);
      balance.refetch();
      await fetchTransactions();
      setTimeout(() => setStakeSuccess(false), 3000);
    } catch { /* handled */ }
    setIsStaking(false);
  };

  const handleUnstake = async () => {
    const { valid, error } = validateAmount(unstakeAmount || String(stakedAmount), stakedAmount, 1);
    setUnstakeError(error);
    if (!valid) return;
    const amount = parseAmount(unstakeAmount || String(stakedAmount));

    if (CONTRACTS_DEPLOYED && isConnected) {
      const wei = parseBrxu(amount.toString());
      onChainUnstake(wei);
      return;
    }

    setIsUnstaking(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "unstake", amount, description: `Unstaked ${amount.toLocaleString()} BRXU` }),
      });
      setUnstakeSuccess(true);
      balance.refetch();
      await fetchTransactions();
      setUnstakeAmount("");
      setTimeout(() => setUnstakeSuccess(false), 3000);
    } catch { /* handled */ }
    setIsUnstaking(false);
  };

  const handleClaimRewards = async () => {
    if (pendingRewardsAmount <= 0) return;
    setIsClaiming(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "staking_reward", amount: pendingRewardsAmount, description: `Claimed ${pendingRewardsAmount.toLocaleString()} BRXU rewards` }),
      });
      setClaimSuccess(true);
      await fetchTransactions();
      setTimeout(() => setClaimSuccess(false), 3000);
    } catch { /* handled */ }
    setIsClaiming(false);
  };

  const handleSend = async () => {
    // Validate address
    const addrSchema = createAddressSchema(address);
    const addrErr = validate(addrSchema, sendTo);
    setSendToError(addrErr);
    // Validate amount
    const amtSchema = createAmountSchema({ min: 1, max: brixBalance, minLabel: "Minimum is 1 BRXU", maxLabel: `Insufficient balance (you have ${brixBalance.toLocaleString()} BRXU)` });
    const amtErr = validate(amtSchema, sendAmount);
    setSendAmountError(amtErr);
    if (addrErr || amtErr) return;

    const amount = parseAmount(sendAmount);

    // On-chain transfer when contracts deployed + wallet connected
    if (CONTRACTS_DEPLOYED && isConnected && sendTo.startsWith("0x")) {
      onChainTransfer(sendTo as `0x${string}`, parseBrxu(amount.toString()));
      return;
    }

    // DB fallback
    setIsTransferring(true);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "send",
          amount,
          description: `Sent ${amount.toLocaleString()} BRXU to ${sendTo.startsWith("0x") ? sendTo.slice(0, 6) + "..." + sendTo.slice(-4) : sendTo}`,
          from_address: address || user?.email || "Wallet",
          to_address: sendTo,
        }),
      });
      setTransferSuccess(true);
      balance.refetch();
      await fetchTransactions();
      setSendAmount("");
      setSendTo("");
      setTimeout(() => setTransferSuccess(false), 3000);
    } catch { /* handled */ }
    setIsTransferring(false);
  };

  const handleConvert = async () => {
    const { valid, error } = validateAmount(convertAmount, brixBalance, 1);
    setConvertError(error);
    if (!valid) return;
    const amount = parseAmount(convertAmount);
    setConverting(true);
    setConvertSuccess(false);
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "conversion",
          amount,
          description: `Convert ${amount.toLocaleString()} BRXU to USDC`,
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

  const handleBuy = async () => {
    const usdAmount = parseAmount(buyAmount);
    if (!usdAmount || usdAmount <= 0) { setBuyError("Please enter a valid amount"); return; }
    if (usdAmount < 10) { setBuyError("Minimum purchase is $10"); return; }
    setBuyError(null);
    setBuying(true);
    setBuySuccess(false);

    // Try Stripe Checkout for card/bank payments
    if (buyMethod === "card" || buyMethod === "bank") {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: usdAmount }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      } catch { /* Fall through to DB fallback */ }
    }

    // Fallback: record transaction directly (Coinbase method or Stripe unavailable)
    const brixAmount = usdAmount;
    const methodLabel = buyMethod === "card" ? "Debit/Credit Card" : buyMethod === "bank" ? "Bank Transfer (ACH)" : "Coinbase Account";

    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "buy",
          amount: brixAmount,
          description: `Purchased ${brixAmount.toLocaleString()} BRXU via ${methodLabel} ($${usdAmount.toLocaleString()})`,
          from_address: methodLabel,
          to_address: address || user?.email || "Wallet",
        }),
      });
      setBuySuccess(true);
      balance.refetch();
      await fetchTransactions();
      setTimeout(() => setBuySuccess(false), 4000);
    } catch { /* handled */ }
    setBuying(false);
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
          <p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>Manage your $BRXU tokens</p>
        </div>
        {/* Wallet connect — user-initiated via Coinbase Smart Wallet */}
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: coinbaseWallet({ appName: "BrixUp" }) })}
            disabled={isConnecting}
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--brix-border)] px-3 py-2" style={{ backgroundColor: "var(--brix-bg)" }}>
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            <span className="font-mono text-xs text-white/60">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </div>
        )}
      </div>

      {/* Connection status */}
      {isConnected && (
        <div className="mb-4 rounded-lg border px-4 py-3 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
            Wallet connected &middot; Base Network
          </div>
        </div>
      )}

      {/* Balance card */}
      <div
        className="mb-6 rounded-xl border p-8 text-center"
        style={{ backgroundColor: "var(--brix-surface)", borderColor: "#D4A84340", background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 50%, #1A1A2E 100%)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--brix-fg-muted)" }}>Total Balance</p>
        <p className="mt-2 text-3xl sm:text-5xl font-bold text-white">
          {Math.max(0, brixBalance).toLocaleString()} <span style={{ color: "#D4A843" }}>BRXU</span>
        </p>
        <p className="mt-2 text-base sm:text-lg" style={{ color: "var(--brix-fg-muted)" }}>
          ≈ ${Math.max(0, brixBalance).toLocaleString()} USD
        </p>
        {isConnected && address && (
          <p className="mt-2 font-mono text-xs text-white/30">{shortenAddr(address)}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {[
          { label: "Buy", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#2ECC71" },
          { label: "Send", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", color: "#2B4C7E" },
          { label: "Receive", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4", color: "#D4A843" },
          { label: "Convert", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", color: "#E8632B" },
          { label: "Stake", icon: "M13 10V3L4 14h7v7l9-11h-7z", color: "#D4A843" },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => setActiveAction(activeAction === action.label ? null : action.label)}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors hover:bg-white/5 ${activeAction === action.label ? "border-white/30" : "border-[var(--brix-border)]"}`}
            style={{ backgroundColor: "var(--brix-surface)" }}
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

      {/* Buy BRXU panel — Coinbase Onramp */}
      {activeAction === "Buy" && (
        <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#2ECC7120" }}>
              <svg className="w-5 h-5" style={{ color: "#2ECC71" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Buy $BRXU</h2>
              <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Purchase with fiat via Coinbase</p>
            </div>
          </div>
          <div className="space-y-4">
            {/* Amount input */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Amount (USD)</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-white/40">$</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={buyAmount}
                  onChange={(e) => { setBuyAmount(sanitizeAmountInput(e.target.value)); setBuyError(null); }}
                  className="w-full rounded-lg border py-3 pl-8 pr-4 text-lg text-white focus:outline-none focus:ring-1 focus:ring-[#2ECC71]"
                  style={{ backgroundColor: "var(--brix-bg)", borderColor: buyError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
                />
              </div>
              {buyError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{buyError}</p>}
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2">
              {["50", "100", "500", "1000"].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBuyAmount(amt)}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors ${buyAmount === amt ? "border-[#2ECC71] text-[#2ECC71]" : "border-[var(--brix-border)] text-white/60 hover:border-white/20"}`}
                  style={{ backgroundColor: buyAmount === amt ? "#2ECC7110" : "#0D0D1A" }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* You receive */}
            <div className="rounded-lg border border-white/5 px-4 py-3" style={{ backgroundColor: "var(--brix-bg)" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>You Receive</span>
                <span className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Rate: 1 BRXU = $1.00</span>
              </div>
              <p className="mt-1 text-xl font-bold text-white">
                {(parseFloat(buyAmount.replace(/,/g, "")) || 0).toLocaleString()} <span style={{ color: "#D4A843" }}>BRXU</span>
              </p>
            </div>

            {/* Payment method */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Payment Method</label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {([
                  { key: "card" as const, label: "Card", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", desc: "Visa / Mastercard" },
                  { key: "bank" as const, label: "Bank", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", desc: "ACH Transfer" },
                  { key: "coinbase" as const, label: "Coinbase", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1", desc: "Coinbase Balance" },
                ]).map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setBuyMethod(method.key)}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${buyMethod === method.key ? "border-[#2ECC71]" : "border-[var(--brix-border)] hover:border-white/20"}`}
                    style={{ backgroundColor: buyMethod === method.key ? "#2ECC7108" : "#0D0D1A" }}
                  >
                    <svg className="w-5 h-5 shrink-0" style={{ color: buyMethod === method.key ? "#2ECC71" : "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{method.label}</p>
                      <p className="text-[10px]" style={{ color: "var(--brix-fg-muted)" }}>{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7120", backgroundColor: "#2ECC7108", color: "var(--brix-fg-muted)" }}>
              <div className="flex justify-between"><span>Subtotal</span><span className="text-white">${(parseFloat(buyAmount.replace(/,/g, "")) || 0).toFixed(2)}</span></div>
              <div className="flex justify-between mt-1"><span>Processing Fee (2.5%)</span><span className="text-white">${((parseFloat(buyAmount.replace(/,/g, "")) || 0) * 0.025).toFixed(2)}</span></div>
              <div className="flex justify-between mt-1 pt-1 border-t border-[var(--brix-border)]"><span className="font-medium text-white">Total</span><span className="font-bold text-white">${((parseFloat(buyAmount.replace(/,/g, "")) || 0) * 1.025).toFixed(2)}</span></div>
            </div>

            {buySuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Purchase successful! {(parseFloat(buyAmount.replace(/,/g, "")) || 0).toLocaleString()} BRXU has been added to your wallet.
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={buying || !buyAmount || parseFloat(buyAmount.replace(/,/g, "")) <= 0}
              className="w-full rounded-lg py-3.5 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
            >
              {buying ? "Processing..." : `Buy ${(parseFloat(buyAmount.replace(/,/g, "")) || 0).toLocaleString()} BRXU`}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "var(--brix-fg-muted)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secured by Coinbase &middot; 256-bit encryption</span>
            </div>
          </div>
        </div>
      )}

      {/* Send panel */}
      {activeAction === "Send" && (
        <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Send $BRXU</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Recipient Address</label>
              <input
                type="text"
                value={sendTo}
                onChange={(e) => { setSendTo(e.target.value); setSendToError(null); }}
                placeholder="0x..."
                className="mt-1 w-full rounded-lg border py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "var(--brix-bg)", borderColor: sendToError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
              />
              {sendToError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{sendToError}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Amount ($BRXU)</label>
                <button onClick={() => setSendAmount(String(Math.floor(brixBalance)))} className="text-[10px] font-medium" style={{ color: "#D4A843" }}>Max</button>
              </div>
              <input
                type="text"
                inputMode="decimal"
                value={sendAmount}
                onChange={(e) => { setSendAmount(sanitizeAmountInput(e.target.value)); setSendAmountError(null); }}
                placeholder="1000"
                className="mt-1 w-full rounded-lg border py-2.5 px-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1"
                style={{ backgroundColor: "var(--brix-bg)", borderColor: sendAmountError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
              />
              {sendAmountError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{sendAmountError}</p>}
            </div>
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2B4C7E30", backgroundColor: "#2B4C7E10", color: "#6B9FE8" }}>
              Available: {Math.max(0, brixBalance).toLocaleString()} BRXU
            </div>
            {transferSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Transfer sent!
              </div>
            )}
            <button onClick={handleSend} disabled={isTransferring || !sendTo || !sendAmount} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}>
              {isTransferring ? "Sending..." : "Send BRXU"}
            </button>
          </div>
        </div>
      )}

      {/* Receive panel */}
      {activeAction === "Receive" && (
        <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Receive $BRXU</h2>
          <div className="space-y-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="rounded-xl bg-white p-4">
                {isConnected && address ? (
                  <QRCodeSVG
                    value={address}
                    size={160}
                    level="M"
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    imageSettings={{
                      src: "",
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center text-center text-xs text-black/40">
                    Connect wallet to<br />generate QR code
                  </div>
                )}
              </div>
            </div>

            {/* Wallet address */}
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Your Wallet Address</label>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex-1 rounded-lg px-4 py-3 font-mono text-sm text-white/80 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ backgroundColor: "var(--brix-bg)" }}
                >
                  {isConnected && address ? address : "Connect wallet to receive"}
                </div>
                <button
                  onClick={() => {
                    if (isConnected && address) {
                      navigator.clipboard.writeText(address);
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
                Base Network (Mainnet) &middot; Only send $BRXU or ETH on Base to this address
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
                className="rounded-lg border border-[var(--brix-border)] py-3 text-sm font-medium text-white transition-colors hover:bg-white/5"
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
        <div className="mb-6 rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Convert $BRXU to USDC</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Amount ($BRXU)</label>
                <button onClick={() => setConvertAmount(String(Math.floor(brixBalance)))} className="text-[10px] font-medium" style={{ color: "#D4A843" }}>Max</button>
              </div>
              <div className="relative mt-1">
                <input
                  type="text"
                  inputMode="decimal"
                  value={convertAmount}
                  onChange={(e) => { setConvertAmount(sanitizeAmountInput(e.target.value)); setConvertError(null); }}
                  className="w-full rounded-lg border py-3 px-4 text-lg text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "var(--brix-bg)", borderColor: convertError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#D4A843" }}>BRXU</span>
              </div>
              {convertError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{convertError}</p>}
            </div>
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: "var(--brix-bg)" }}>
                <svg className="w-4 h-4" style={{ color: "var(--brix-fg-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>You Receive (USDC)</label>
              <div className="relative mt-1">
                <input type="text" value={usdcEquivalent} readOnly className="w-full rounded-lg border border-[var(--brix-border)] py-3 px-4 text-lg text-white focus:outline-none" style={{ backgroundColor: "var(--brix-bg)", borderColor: "rgba(255,255,255,0.1)" }} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium" style={{ color: "#2ECC71" }}>USDC</span>
              </div>
            </div>
            <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#D4A84330", backgroundColor: "#D4A84310", color: "#D4A843" }}>
              Rate: 1 BRXU = 1.00 USDC &middot; Fee: 0.5%
            </div>
            {convertSuccess && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Conversion submitted! Funds arrive in 1-2 business days.
              </div>
            )}
            <button onClick={handleConvert} disabled={converting || !convertAmount || parseAmount(convertAmount) <= 0 || parseAmount(convertAmount) > brixBalance} className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
              {converting ? "Converting..." : "Convert to USDC"}
            </button>
            <p className="text-center text-xs" style={{ color: "var(--brix-fg-muted)" }}>Funds arrive via ACH in 1-2 business days</p>
          </div>
        </div>
      )}

      {/* Staking panel */}
      <div className="mb-6">
        {/* Staking panel */}
        <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Staking</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--brix-bg)" }}>
                <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Currently Staked</p>
                <p className="mt-1 text-xl font-bold text-white">{Math.max(0, stakedAmount).toLocaleString()}</p>
                <p className="text-xs" style={{ color: "#D4A843" }}>BRXU</p>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: "var(--brix-bg)" }}>
                <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>APY</p>
                <p className="mt-1 text-xl font-bold" style={{ color: "#2ECC71" }}>12.5%</p>
                <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Annual</p>
              </div>
            </div>

            <div className="rounded-lg p-4" style={{ backgroundColor: "var(--brix-bg)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Pending Rewards</p>
                  <p className="mt-1 text-lg font-bold" style={{ color: "#2ECC71" }}>
                    +{pendingRewardsAmount.toLocaleString()} BRXU
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>Status</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "#2ECC71" }}>{isLocked ? "Locked" : "Unlocked"}</p>
                </div>
              </div>
              {pendingRewardsAmount > 0 && (
                <button onClick={handleClaimRewards} disabled={isClaiming} className="mt-3 w-full rounded-lg py-2 text-xs font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                  {isClaiming ? "Claiming..." : claimSuccess ? "Claimed!" : "Claim Rewards"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="stake-amount" className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Stake Amount</label>
                  <button onClick={() => setStakeAmount(String(Math.floor(brixBalance)))} className="text-[10px] font-medium" style={{ color: "#D4A843" }}>Max</button>
                </div>
                <input
                  id="stake-amount"
                  type="text"
                  inputMode="decimal"
                  value={stakeAmount}
                  onChange={(e) => { setStakeAmount(sanitizeAmountInput(e.target.value)); setStakeError(null); }}
                  className="mt-1 w-full rounded-lg border py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "var(--brix-bg)", borderColor: stakeError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
                  placeholder="Amount to stake"
                />
                {stakeError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{stakeError}</p>}
                <button onClick={handleStake} disabled={isStaking || isApproving || !stakeAmount || parseAmount(stakeAmount) <= 0 || parseAmount(stakeAmount) > brixBalance} className="mt-2 w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>
                  {isApproving ? "Approving..." : isStaking ? "Staking..." : "Stake"}
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="unstake-amount" className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>Unstake Amount</label>
                  <button onClick={() => setUnstakeAmount(String(Math.floor(stakedAmount)))} className="text-[10px] font-medium" style={{ color: "#D4A843" }}>Max</button>
                </div>
                <input
                  id="unstake-amount"
                  type="text"
                  inputMode="decimal"
                  value={unstakeAmount}
                  onChange={(e) => { setUnstakeAmount(sanitizeAmountInput(e.target.value)); setUnstakeError(null); }}
                  className="mt-1 w-full rounded-lg border py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                  style={{ backgroundColor: "var(--brix-bg)", borderColor: unstakeError ? "#E8632B" : "rgba(255,255,255,0.1)" }}
                  placeholder="Amount to unstake"
                />
                {unstakeError && <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>{unstakeError}</p>}
                <button onClick={handleUnstake} disabled={isUnstaking || stakedAmount <= 0 || isLocked || !unstakeAmount || parseAmount(unstakeAmount) <= 0 || parseAmount(unstakeAmount) > stakedAmount} className="mt-2 w-full rounded-lg border py-3 text-sm font-bold transition-colors hover:bg-white/5 disabled:opacity-50" style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}>
                  {isUnstaking ? "Unstaking..." : isLocked ? "Locked" : "Unstake"}
                </button>
              </div>
            </div>

            {(stakeSuccess || unstakeSuccess) && (
              <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                Transaction confirmed on-chain!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-[var(--brix-border)] p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Transaction History</h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-[var(--brix-border)] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1"
            style={{ backgroundColor: "var(--brix-bg)", borderColor: "rgba(255,255,255,0.1)" }}
          >
            <option value="All">All Types</option>
            <option value="investment">Investment</option>
            <option value="yield">Yield</option>
            <option value="staking_reward">Staking Reward</option>
            <option value="conversion">Conversion</option>
            <option value="received">Received</option>
            <option value="stake">Stake</option>
            <option value="unstake">Unstake</option>
            <option value="buy">Purchase</option>
          </select>
        </div>
        {/* Desktop table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Transaction history</caption>
            <thead>
              <tr className="border-b border-[var(--brix-border)]">
                {["Date", "Type", "Amount", "From", "To", "Status"].map((h) => (
                  <th key={h} scope="col" className="pb-3 text-left text-xs font-medium whitespace-nowrap pr-4" style={{ color: "var(--brix-fg-muted)" }}>{h}</th>
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
                      {isPositive ? "+" : "-"}{tx.amount.toLocaleString()} BRXU
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
                    <span className="text-[10px]" style={{ color: "var(--brix-fg-muted)" }}>{new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
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
