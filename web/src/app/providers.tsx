"use client";

import { AuthProvider } from "@/lib/auth-context";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { activeChain } from "@/lib/contracts/config";
import "@coinbase/onchainkit/styles.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_COINBASE_APP_ID}
        chain={activeChain}
        config={{
          appearance: {
            name: "BrixUp",
            logo: "https://brixups.com/logo.png",
            mode: "dark",
            theme: "cyberpunk",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </AuthProvider>
  );
}
