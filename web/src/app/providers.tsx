"use client";

import { AuthProvider } from "@/lib/auth-context";
import WalletProvider from "@/lib/wallet/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </WalletProvider>
  );
}
