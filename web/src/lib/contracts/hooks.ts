"use client";

/**
 * BrixUp Contract Hooks
 *
 * React hooks for reading/writing to BrixUp smart contracts via wagmi.
 * Falls back gracefully when contracts are not deployed (returns defaults).
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { BrixTokenABI, BrixStakingABI, BrixDealABI, BrixFactoryABI } from "./abis";
import {
  BRIX_TOKEN_ADDRESS,
  BRIX_STAKING_ADDRESS,
  BRIX_FACTORY_ADDRESS,
  CONTRACTS_DEPLOYED,
} from "./config";

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

/** Parse a human-readable BRIX amount (e.g. "1000") to wei (18 decimals). */
export function parseBrix(amount: string): bigint {
  return parseUnits(amount, 18);
}

/** Format a wei amount to human-readable BRIX string. */
export function formatBrix(wei: bigint | undefined): string {
  if (!wei) return "0";
  return formatUnits(wei, 18);
}

// ---------------------------------------------------------------------------
//  BrixToken Reads
// ---------------------------------------------------------------------------

/** Get BRIX balance of an address. */
export function useBrixBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRIX_TOKEN_ADDRESS,
    abi: BrixTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get BRIX allowance for a spender. */
export function useBrixAllowance(
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) {
  return useReadContract({
    address: BRIX_TOKEN_ADDRESS,
    abi: BrixTokenABI,
    functionName: "allowance",
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender && CONTRACTS_DEPLOYED },
  });
}

// ---------------------------------------------------------------------------
//  BrixToken Writes
// ---------------------------------------------------------------------------

/** Approve a spender to use BRIX tokens. */
export function useBrixApprove() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: bigint) => {
    if (!BRIX_TOKEN_ADDRESS) return;
    writeContract({
      address: BRIX_TOKEN_ADDRESS,
      abi: BrixTokenABI,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

/** Transfer BRIX tokens. */
export function useBrixTransfer() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transfer = (to: `0x${string}`, amount: bigint) => {
    if (!BRIX_TOKEN_ADDRESS) return;
    writeContract({
      address: BRIX_TOKEN_ADDRESS,
      abi: BrixTokenABI,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return { transfer, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrixStaking Reads
// ---------------------------------------------------------------------------

/** Get staked balance for an address. */
export function useStakedBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get pending rewards for an address. */
export function usePendingRewards(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get total staked across all users. */
export function useTotalStaked() {
  return useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "totalStaked",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}

/** Get staker info (amount, rewardDebt, stakedAt, pendingClaim). */
export function useStakerInfo(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRIX_STAKING_ADDRESS,
    abi: BrixStakingABI,
    functionName: "stakers",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

// ---------------------------------------------------------------------------
//  BrixStaking Writes
// ---------------------------------------------------------------------------

/** Stake BRIX tokens (requires prior approve to staking contract). */
export function useStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: bigint) => {
    if (!BRIX_STAKING_ADDRESS) return;
    writeContract({
      address: BRIX_STAKING_ADDRESS,
      abi: BrixStakingABI,
      functionName: "stake",
      args: [amount],
    });
  };

  return { stake, hash, isPending, isConfirming, isSuccess, error };
}

/** Unstake BRIX tokens (after 7-day lock). */
export function useUnstake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unstake = (amount: bigint) => {
    if (!BRIX_STAKING_ADDRESS) return;
    writeContract({
      address: BRIX_STAKING_ADDRESS,
      abi: BrixStakingABI,
      functionName: "unstake",
      args: [amount],
    });
  };

  return { unstake, hash, isPending, isConfirming, isSuccess, error };
}

/** Claim staking rewards. */
export function useClaimRewards() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claim = () => {
    if (!BRIX_STAKING_ADDRESS) return;
    writeContract({
      address: BRIX_STAKING_ADDRESS,
      abi: BrixStakingABI,
      functionName: "claimRewards",
    });
  };

  return { claim, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrixDeal Reads
// ---------------------------------------------------------------------------

/** Get total capital raised for a deal. */
export function useDealCapitalRaised(dealAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: dealAddress,
    abi: BrixDealABI,
    functionName: "totalCapitalRaised",
    query: { enabled: !!dealAddress },
  });
}

/** Get investor count for a deal. */
export function useDealInvestorCount(dealAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: dealAddress,
    abi: BrixDealABI,
    functionName: "investorCount",
    query: { enabled: !!dealAddress },
  });
}

/** Get a user's investment in a specific deal. */
export function useDealInvestment(
  dealAddress: `0x${string}` | undefined,
  investor: `0x${string}` | undefined
) {
  return useReadContract({
    address: dealAddress,
    abi: BrixDealABI,
    functionName: "investments",
    args: investor ? [investor] : undefined,
    query: { enabled: !!dealAddress && !!investor },
  });
}

// ---------------------------------------------------------------------------
//  BrixDeal Writes
// ---------------------------------------------------------------------------

/** Invest BRIX tokens into a deal (requires prior approve to deal contract). */
export function useInvestInDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const invest = (dealAddress: `0x${string}`, amount: bigint) => {
    writeContract({
      address: dealAddress,
      abi: BrixDealABI,
      functionName: "investInDeal",
      args: [amount],
    });
  };

  return { invest, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrixFactory Reads
// ---------------------------------------------------------------------------

/** Get all deployed deal addresses. */
export function useAllDeals() {
  return useReadContract({
    address: BRIX_FACTORY_ADDRESS,
    abi: BrixFactoryABI,
    functionName: "getAllDeals",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}

/** Get total deal count. */
export function useDealCount() {
  return useReadContract({
    address: BRIX_FACTORY_ADDRESS,
    abi: BrixFactoryABI,
    functionName: "dealCount",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}
