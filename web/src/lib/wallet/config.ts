"use client";

/**
 * Wagmi configuration for BrixUp.
 *
 * Uses Coinbase Smart Wallet as the primary connector on Base chain.
 * Does NOT auto-connect — wallet connection is user-initiated only.
 */

import { http, createConfig, createStorage } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "84532", 10);

const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URL ||
  (chainId === 8453 ? "https://mainnet.base.org" : "https://sepolia.base.org");

// Build config per-chain to satisfy TypeScript's strict transport typing.
const sharedOptions = {
  connectors: [
    coinbaseWallet({
      appName: "BrixUp",
      appLogoUrl: "https://brixups.com/logo.png",
      preference: "all" as const,
    }),
  ],
  storage: createStorage({ storage: typeof window !== "undefined" ? window.localStorage : undefined }),
  multiInjectedProviderDiscovery: false,
};

export const wagmiConfig =
  chainId === 8453
    ? createConfig({
        ...sharedOptions,
        chains: [base],
        transports: { [base.id]: http(rpcUrl) },
      })
    : createConfig({
        ...sharedOptions,
        chains: [baseSepolia],
        transports: { [baseSepolia.id]: http(rpcUrl) },
      });

export const activeChain = chainId === 8453 ? base : baseSepolia;
