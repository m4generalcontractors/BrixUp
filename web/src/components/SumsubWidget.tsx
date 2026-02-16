"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface SumsubWidgetProps {
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export default function SumsubWidget({ onComplete, onError }: SumsubWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const launchedRef = useRef(false);

  const getAccessToken = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/kyc/token", { method: "POST" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Failed to get token" }));
      throw new Error(err.error || "Failed to get verification token");
    }
    const data = await res.json();
    return data.token;
  }, []);

  useEffect(() => {
    if (launchedRef.current) return;

    const launchWidget = async () => {
      try {
        const token = await getAccessToken();
        const snsWebSdk = (await import("@sumsub/websdk")).default;

        if (!containerRef.current) return;
        launchedRef.current = true;

        snsWebSdk
          .init(token, () => getAccessToken())
          .withConf({
            lang: "en",
            theme: "dark",
          })
          .withOptions({ addViewportTag: false, adaptIframeHeight: true })
          .on("idCheck.onStepCompleted", (payload: { idDocSetType?: string }) => {
            console.log("KYC step completed:", payload);
          })
          .on("idCheck.onApplicantStatusChanged", (payload: { reviewStatus?: string }) => {
            if (payload.reviewStatus === "completed") {
              onComplete?.();
            }
          })
          .on("idCheck.onError", (err: { code: string; error: string; reason?: string }) => {
            console.error("Sumsub error:", err);
            setError(err.error || err.code);
            onError?.(err.error || err.code);
          })
          .build()
          .launch("#sumsub-websdk-container");

        setLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load verification widget";
        setError(message);
        onError?.(message);
        setLoading(false);
      }
    };

    launchWidget();
  }, [getAccessToken, onComplete, onError]);

  if (error) {
    return (
      <div className="rounded-xl border p-8 text-center" style={{ borderColor: "#E8632B40", backgroundColor: "#E8632B10" }}>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full" style={{ backgroundColor: "#E8632B20" }}>
          <svg className="w-6 h-6" style={{ color: "#E8632B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-white">Verification Unavailable</h3>
        <p className="mt-2 text-sm" style={{ color: "var(--brix-fg-muted)" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg px-6 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
          <p className="mt-4 text-sm" style={{ color: "var(--brix-fg-muted)" }}>Loading verification widget...</p>
        </div>
      )}
      <div id="sumsub-websdk-container" ref={containerRef} className="min-h-[400px]" />
    </div>
  );
}
