/**
 * BrixUp Contract Configuration
 *
 * Chain definitions and contract addresses for the BrixUp platform.
 * Reads deployed addresses from environment variables.
 */

import { base, baseSepolia } from "wagmi/chains";

// ---------------------------------------------------------------------------
//  Chain
// ---------------------------------------------------------------------------

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "8453", 10);

/** Active chain — Base Sepolia (testnet) or Base (mainnet). */
export const activeChain = chainId === 8453 ? base : baseSepolia;

// ---------------------------------------------------------------------------
//  Contract Addresses
// ---------------------------------------------------------------------------

export const BRXU_TOKEN_ADDRESS =
  (process.env.NEXT_PUBLIC_BRXU_TOKEN_ADDRESS as `0x${string}`) || undefined;

export const BRXU_FACTORY_ADDRESS =
  (process.env.NEXT_PUBLIC_BRXU_FACTORY_ADDRESS as `0x${string}`) || undefined;

export const BRXU_STAKING_ADDRESS =
  (process.env.NEXT_PUBLIC_BRXU_STAKING_ADDRESS as `0x${string}`) || undefined;

export const BRXU_VESTING_ADDRESS =
  (process.env.NEXT_PUBLIC_BRXU_VESTING_ADDRESS as `0x${string}`) || undefined;

/** True when all three core contracts have been deployed and configured. */
export const CONTRACTS_DEPLOYED =
  !!BRXU_TOKEN_ADDRESS && !!BRXU_FACTORY_ADDRESS && !!BRXU_STAKING_ADDRESS;
