"use client";

/**
 * useBalance — single source of truth for BRIX balance across all views.
 *
 * Priority:
 *   1. On-chain balance (when wallet connected + contracts deployed)
 *   2. Supabase transaction history (computed from DB)
 *   3. Fallback constant (12,500 BRIX)
 *
 * All components (header, dashboard, wallet) should use this hook
 * instead of computing balance independently.
 */

import { useState, useEffect, useCallback } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { BrixTokenABI, BrixStakingABI } from "@/lib/contracts/abis";
import {
  BRIX_TOKEN_ADDRESS,
  BRIX_STAKING_ADDRESS,
  CONTRACTS_DEPLOYED,
} from "@/lib/contracts/config";

const FALLBACK_BALANCE = 12_500;
const FALLBACK_STAKED = 2_000;
const REFRESH_INTERVAL = 30_000; // 30 seconds

export interface BalanceState {
  /** Total BRIX balance (available + staked) */
  totalBalance: number;
  /** Available (unstaked) BRIX */
  availableBalance: number;
  /** Currently staked BRIX */
  stakedBalance: number;
  /** Pending staking rewards */
  pendingRewards: number;
  /** Whether data is loading */
  loading: boolean;
  /** Data source: "onchain" | "supabase" | "fallback" */
  source: "onchain" | "supabase" | "fallback";
  /** Connected wallet address */
  address: `0x${string}` | undefined;
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Trigger a manual refresh */
  refetch: () => void;
}

export function useBalance(): BalanceState {
  const { address, isConnected } = useAccount();
  const [supabaseBalance, setSupabaseBalance] = useState<number | null>(null);
  const [supabaseStaked, setSupabaseStaked] = useState(FALLBACK_STAKED);
  const [supabaseRewards, setSupabaseRewards] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- On-chain reads (only when wallet connected + contracts deployed) ---
  const { data: onChainBalance, refetch: refetchOnChain } = useReadContract({
    address: BRIX_TOKEN_ADDRESS,
    abi: BrixTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  const { data: onChainStaked, refetch: refetchStaked } = useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  const { data: onChainRewards, refetch: refetchRewards } = useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });

  // --- Supabase fallback ---
  const fetchSupabaseBalance = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=200");
      if (!res.ok) return;
      const txs = await res.json();
      if (!Array.isArray(txs) || txs.length === 0) return;

      const positiveTypes = new Set(["yield", "staking_reward", "received", "unstake", "buy"]);
      const brixTypes = new Set([...positiveTypes, "conversion", "send", "stake"]);

      let balance = FALLBACK_BALANCE;
      let staked = 0;
      let rewards = 0;

      for (const tx of txs) {
        if (brixTypes.has(tx.type)) {
          if (positiveTypes.has(tx.type)) balance += tx.amount || 0;
          else balance -= tx.amount || 0;
        }
        if (tx.type === "stake") staked += tx.amount || 0;
        if (tx.type === "unstake") staked -= tx.amount || 0;
        if (tx.type === "staking_reward") rewards += tx.amount || 0;
      }

      setSupabaseBalance(Math.round(balance));
      setSupabaseStaked(Math.max(0, staked + FALLBACK_STAKED));
      setSupabaseRewards(rewards);
    } catch {
      // Keep fallback
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSupabaseBalance();
    const interval = setInterval(fetchSupabaseBalance, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchSupabaseBalance]);

  // --- Determine source and values ---
  const useOnChain = CONTRACTS_DEPLOYED && isConnected && onChainBalance !== undefined;

  const availableBalance = useOnChain
    ? parseFloat(formatUnits(onChainBalance as bigint, 18))
    : (supabaseBalance ?? FALLBACK_BALANCE);

  const stakedBalance = useOnChain && onChainStaked !== undefined
    ? parseFloat(formatUnits(onChainStaked as bigint, 18))
    : supabaseStaked;

  const pendingRewards = useOnChain && onChainRewards !== undefined
    ? parseFloat(formatUnits(onChainRewards as bigint, 18))
    : supabaseRewards;

  const refetch = useCallback(() => {
    fetchSupabaseBalance();
    if (CONTRACTS_DEPLOYED && isConnected) {
      refetchOnChain();
      refetchStaked();
      refetchRewards();
    }
  }, [fetchSupabaseBalance, isConnected, refetchOnChain, refetchStaked, refetchRewards]);

  return {
    totalBalance: availableBalance + stakedBalance,
    availableBalance,
    stakedBalance,
    pendingRewards,
    loading,
    source: useOnChain ? "onchain" : supabaseBalance !== null ? "supabase" : "fallback",
    address,
    isConnected,
    refetch,
  };
}
