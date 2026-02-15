"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import WalletProvider from "@/lib/wallet/provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // @ts-expect-error -- next-themes types don't include children in React 19
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem>
      <LanguageProvider>
        <WalletProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </WalletProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
