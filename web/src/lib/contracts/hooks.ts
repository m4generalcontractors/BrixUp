"use client";

/**
 * BrixUp Contract Hooks
 *
 * React hooks for reading/writing to BrixUp smart contracts via wagmi.
 * Falls back gracefully when contracts are not deployed (returns defaults).
 */

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { BrxuTokenABI, BrxuStakingABI, BrxuDealABI, BrxuFactoryABI, BrxuVestingABI } from "./abis";
import {
  BRXU_TOKEN_ADDRESS,
  BRXU_STAKING_ADDRESS,
  BRXU_FACTORY_ADDRESS,
  BRXU_VESTING_ADDRESS,
  CONTRACTS_DEPLOYED,
} from "./config";

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

/** Parse a human-readable BRXU amount (e.g. "1000") to wei (18 decimals). */
export function parseBrxu(amount: string): bigint {
  return parseUnits(amount, 18);
}

/** Format a wei amount to human-readable BRXU string. */
export function formatBrxu(wei: bigint | undefined): string {
  if (!wei) return "0";
  return formatUnits(wei, 18);
}

// ---------------------------------------------------------------------------
//  BrxuToken Reads
// ---------------------------------------------------------------------------

/** Get BRXU balance of an address. */
export function useBrxuBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_TOKEN_ADDRESS,
    abi: BrxuTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get BRXU allowance for a spender. */
export function useBrxuAllowance(
  owner: `0x${string}` | undefined,
  spender: `0x${string}` | undefined
) {
  return useReadContract({
    address: BRXU_TOKEN_ADDRESS,
    abi: BrxuTokenABI,
    functionName: "allowance",
    args: owner && spender ? [owner, spender] : undefined,
    query: { enabled: !!owner && !!spender && CONTRACTS_DEPLOYED },
  });
}

// ---------------------------------------------------------------------------
//  BrxuToken Writes
// ---------------------------------------------------------------------------

/** Approve a spender to use BRXU tokens. */
export function useBrxuApprove() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: bigint) => {
    if (!BRXU_TOKEN_ADDRESS) return;
    writeContract({
      address: BRXU_TOKEN_ADDRESS,
      abi: BrxuTokenABI,
      functionName: "approve",
      args: [spender, amount],
    });
  };

  return { approve, hash, isPending, isConfirming, isSuccess, error };
}

/** Transfer BRXU tokens. */
export function useBrxuTransfer() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const transfer = (to: `0x${string}`, amount: bigint) => {
    if (!BRXU_TOKEN_ADDRESS) return;
    writeContract({
      address: BRXU_TOKEN_ADDRESS,
      abi: BrxuTokenABI,
      functionName: "transfer",
      args: [to, amount],
    });
  };

  return { transfer, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrxuStaking Reads
// ---------------------------------------------------------------------------

/** Get staked balance for an address. */
export function useStakedBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_STAKING_ADDRESS,
    abi: BrxuStakingABI,
    functionName: "stakedBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get pending rewards for an address. */
export function usePendingRewards(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_STAKING_ADDRESS,
    abi: BrxuStakingABI,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

/** Get total staked across all users. */
export function useTotalStaked() {
  return useReadContract({
    address: BRXU_STAKING_ADDRESS,
    abi: BrxuStakingABI,
    functionName: "totalStaked",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}

/** Get staker info (amount, rewardDebt, stakedAt, pendingClaim). */
export function useStakerInfo(address: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_STAKING_ADDRESS,
    abi: BrxuStakingABI,
    functionName: "stakers",
    args: address ? [address] : undefined,
    query: { enabled: !!address && CONTRACTS_DEPLOYED },
  });
}

// ---------------------------------------------------------------------------
//  BrxuStaking Writes
// ---------------------------------------------------------------------------

/** Stake BRXU tokens (requires prior approve to staking contract). */
export function useStake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const stake = (amount: bigint) => {
    if (!BRXU_STAKING_ADDRESS) return;
    writeContract({
      address: BRXU_STAKING_ADDRESS,
      abi: BrxuStakingABI,
      functionName: "stake",
      args: [amount],
    });
  };

  return { stake, hash, isPending, isConfirming, isSuccess, error };
}

/** Unstake BRXU tokens (no lock period). */
export function useUnstake() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const unstake = (amount: bigint) => {
    if (!BRXU_STAKING_ADDRESS) return;
    writeContract({
      address: BRXU_STAKING_ADDRESS,
      abi: BrxuStakingABI,
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
    if (!BRXU_STAKING_ADDRESS) return;
    writeContract({
      address: BRXU_STAKING_ADDRESS,
      abi: BrxuStakingABI,
      functionName: "claimRewards",
    });
  };

  return { claim, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrxuDeal Reads
// ---------------------------------------------------------------------------

/** Get total capital raised for a deal. */
export function useDealCapitalRaised(dealAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: dealAddress,
    abi: BrxuDealABI,
    functionName: "totalCapitalRaised",
    query: { enabled: !!dealAddress },
  });
}

/** Get investor count for a deal. */
export function useDealInvestorCount(dealAddress: `0x${string}` | undefined) {
  return useReadContract({
    address: dealAddress,
    abi: BrxuDealABI,
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
    abi: BrxuDealABI,
    functionName: "investments",
    args: investor ? [investor] : undefined,
    query: { enabled: !!dealAddress && !!investor },
  });
}

// ---------------------------------------------------------------------------
//  BrxuDeal Writes
// ---------------------------------------------------------------------------

/** Invest BRXU tokens into a deal (requires prior approve to deal contract). */
export function useInvestInDeal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const invest = (dealAddress: `0x${string}`, amount: bigint) => {
    writeContract({
      address: dealAddress,
      abi: BrxuDealABI,
      functionName: "investInDeal",
      args: [amount],
    });
  };

  return { invest, hash, isPending, isConfirming, isSuccess, error };
}

// ---------------------------------------------------------------------------
//  BrxuFactory Reads
// ---------------------------------------------------------------------------

/** Get all deployed deal addresses. */
export function useAllDeals() {
  return useReadContract({
    address: BRXU_FACTORY_ADDRESS,
    abi: BrxuFactoryABI,
    functionName: "getAllDeals",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}

/** Get total deal count. */
export function useDealCount() {
  return useReadContract({
    address: BRXU_FACTORY_ADDRESS,
    abi: BrxuFactoryABI,
    functionName: "dealCount",
    query: { enabled: CONTRACTS_DEPLOYED },
  });
}

// ---------------------------------------------------------------------------
//  BRXUVesting Reads
// ---------------------------------------------------------------------------

/** Get vesting schedule for a beneficiary. */
export function useVestingSchedule(beneficiary: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_VESTING_ADDRESS,
    abi: BrxuVestingABI,
    functionName: "schedules",
    args: beneficiary ? [beneficiary] : undefined,
    query: { enabled: !!beneficiary && !!BRXU_VESTING_ADDRESS },
  });
}

/** Get releasable vested tokens for a beneficiary. */
export function useReleasableAmount(beneficiary: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_VESTING_ADDRESS,
    abi: BrxuVestingABI,
    functionName: "releasableAmount",
    args: beneficiary ? [beneficiary] : undefined,
    query: { enabled: !!beneficiary && !!BRXU_VESTING_ADDRESS },
  });
}

/** Get total vested amount for a beneficiary. */
export function useVestedAmount(beneficiary: `0x${string}` | undefined) {
  return useReadContract({
    address: BRXU_VESTING_ADDRESS,
    abi: BrxuVestingABI,
    functionName: "vestedAmount",
    args: beneficiary ? [beneficiary] : undefined,
    query: { enabled: !!beneficiary && !!BRXU_VESTING_ADDRESS },
  });
}

// ---------------------------------------------------------------------------
//  BRXUVesting Writes
// ---------------------------------------------------------------------------

/** Release vested tokens to caller. */
export function useReleaseVested() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const release = () => {
    if (!BRXU_VESTING_ADDRESS) return;
    writeContract({
      address: BRXU_VESTING_ADDRESS,
      abi: BrxuVestingABI,
      functionName: "release",
    });
  };

  return { release, hash, isPending, isConfirming, isSuccess, error };
}
