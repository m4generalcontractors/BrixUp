"use client";

/**
 * WalletProvider — wraps the app with WagmiProvider + QueryClientProvider.
 *
 * IMPORTANT: This provider does NOT auto-connect or trigger popups.
 * Wallet connection only happens when the user explicitly clicks
 * "Connect Wallet" and calls `useConnect().connect()`.
 *
 * Safe to render on all authenticated pages.
 */

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus (reduces RPC calls)
      refetchOnWindowFocus: false,
      // Retry once on failure
      retry: 1,
      // Cache for 30 seconds
      staleTime: 30_000,
    },
  },
});

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
