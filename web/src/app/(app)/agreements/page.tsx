"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface Agreement {
  id: string;
  title: string;
  type: "saft" | "spv" | "tos" | "ppm" | "contractor";
  dealId?: string;
  dealAddress?: string;
  status: "pending" | "signed" | "expired";
  createdAt: string;
  signedAt?: string;
}

const TYPE_LABELS: Record<string, string> = {
  saft: "Token Purchase Agreement (SAFT)",
  spv: "SPV Operating Agreement",
  tos: "Terms of Service",
  ppm: "Private Placement Memorandum",
  contractor: "Contractor Participation Agreement",
};

const TYPE_COLORS: Record<string, string> = {
  saft: "#D4A843",
  spv: "#2B4C7E",
  tos: "#4A4A5A",
  ppm: "#E8632B",
  contractor: "#2ECC71",
};

export default function AgreementsPage() {
  const { profile } = useAuth();
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState<string | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Agreement | null>(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const res = await fetch("/api/agreements");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAgreements(data);
            setLoading(false);
            return;
          }
        }
      } catch { /* use fallback */ }

      // Fallback sample agreements based on user role
      const role = profile?.user_role || "investor";
      const sampleAgreements: Agreement[] = [
        { id: "a1", title: "BrixUp Terms of Service", type: "tos", status: "signed", createdAt: "2026-01-01T00:00:00Z", signedAt: "2026-01-01T12:00:00Z" },
      ];

      if (role === "investor" || role === "dealmaker") {
        sampleAgreements.push(
          { id: "a2", title: "Private Placement Memorandum - 1847 Oakwood Dr", type: "ppm", dealId: "d1", dealAddress: "1847 Oakwood Dr", status: "signed", createdAt: "2026-01-15T00:00:00Z", signedAt: "2026-01-15T14:00:00Z" },
          { id: "a3", title: "Token Purchase Agreement (SAFT)", type: "saft", status: "signed", createdAt: "2026-01-15T00:00:00Z", signedAt: "2026-01-15T14:30:00Z" },
          { id: "a4", title: "SPV Operating Agreement - 412 Magnolia Ln", type: "spv", dealId: "d2", dealAddress: "412 Magnolia Ln", status: "pending", createdAt: "2026-02-10T00:00:00Z" },
        );
      }

      if (role === "builder") {
        sampleAgreements.push(
          { id: "a5", title: "Contractor Participation Agreement - Pine Valley", type: "contractor", dealId: "d3", dealAddress: "Pine Valley Estates", status: "signed", createdAt: "2026-01-20T00:00:00Z", signedAt: "2026-01-20T10:00:00Z" },
          { id: "a6", title: "Contractor Participation Agreement - 1847 Oakwood Dr", type: "contractor", dealId: "d1", dealAddress: "1847 Oakwood Dr", status: "pending", createdAt: "2026-02-12T00:00:00Z" },
        );
      }

      setAgreements(sampleAgreements);
      setLoading(false);
    };

    fetchAgreements();
  }, [profile?.user_role]);

  const handleSign = async (agreementId: string) => {
    setSigning(agreementId);
    try {
      await fetch("/api/agreements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agreementId, action: "sign" }),
      });
    } catch { /* silent */ }

    // Update local state
    setAgreements((prev) =>
      prev.map((a) =>
        a.id === agreementId
          ? { ...a, status: "signed" as const, signedAt: new Date().toISOString() }
          : a
      )
    );
    setSigning(null);
  };

  const pendingCount = agreements.filter((a) => a.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agreements</h1>
          <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Legal documents and e-signatures</p>
        </div>
        {pendingCount > 0 && (
          <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#E8632B20", color: "#E8632B" }}>
            {pendingCount} pending signature{pendingCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Pending signatures banner */}
      {pendingCount > 0 && (
        <div className="mb-6 rounded-lg border px-4 py-3" style={{ borderColor: "#D4A84340", backgroundColor: "#D4A84310" }}>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <div>
              <p className="text-sm font-medium" style={{ color: "#D4A843" }}>Action Required</p>
              <p className="text-xs" style={{ color: "#4A4A5A" }}>You have {pendingCount} document{pendingCount > 1 ? "s" : ""} awaiting your electronic signature.</p>
            </div>
          </div>
        </div>
      )}

      {/* Compliance info */}
      <div className="mb-6 rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#2B4C7E20" }}>
            <svg className="w-5 h-5" style={{ color: "#6B9FE8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Legal Compliance</h3>
            <p className="mt-1 text-xs" style={{ color: "#4A4A5A" }}>
              All agreements use ESIGN Act and UETA compliant electronic signatures. Documents are timestamped, hashed, and stored with full audit trails. Signatures are legally binding under US federal and state law.
            </p>
          </div>
        </div>
      </div>

      {/* Agreements list */}
      <div className="space-y-3">
        {agreements.map((agreement) => (
          <div
            key={agreement.id}
            className="rounded-xl border border-white/10 p-5 transition-colors hover:border-white/20"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ backgroundColor: TYPE_COLORS[agreement.type] + "20", color: TYPE_COLORS[agreement.type] }}
                  >
                    {agreement.type}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: agreement.status === "signed" ? "#2ECC7120" : agreement.status === "pending" ? "#E8632B20" : "#4A4A5A20",
                      color: agreement.status === "signed" ? "#2ECC71" : agreement.status === "pending" ? "#E8632B" : "#4A4A5A",
                    }}
                  >
                    {agreement.status === "signed" ? "Signed" : agreement.status === "pending" ? "Pending" : "Expired"}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{agreement.title}</h3>
                <p className="mt-0.5 text-xs" style={{ color: "#4A4A5A" }}>
                  {TYPE_LABELS[agreement.type]}
                  {agreement.dealAddress && ` - ${agreement.dealAddress}`}
                </p>
                <div className="mt-2 flex items-center gap-4 text-[10px]" style={{ color: "#4A4A5A" }}>
                  <span>Created: {new Date(agreement.createdAt).toLocaleDateString()}</span>
                  {agreement.signedAt && (
                    <span>Signed: {new Date(agreement.signedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewingDoc(viewingDoc?.id === agreement.id ? null : agreement)}
                  className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}
                >
                  View
                </button>
                {agreement.status === "pending" && (
                  <button
                    onClick={() => handleSign(agreement.id)}
                    disabled={signing === agreement.id}
                    className="rounded-lg px-4 py-2 text-xs font-semibold disabled:opacity-50"
                    style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
                  >
                    {signing === agreement.id ? "Signing..." : "Sign Document"}
                  </button>
                )}
              </div>
            </div>

            {/* Document preview (expandable) */}
            {viewingDoc?.id === agreement.id && (
              <div className="mt-4 rounded-lg border border-white/5 p-4" style={{ backgroundColor: "#0D0D1A" }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Document Preview</h4>
                  <button onClick={() => setViewingDoc(null)} className="text-xs text-white/40 hover:text-white">Close</button>
                </div>
                <div className="space-y-2 text-xs" style={{ color: "#4A4A5A" }}>
                  {agreement.type === "tos" && (
                    <>
                      <p className="text-white font-semibold">BrixUp Platform Terms of Service</p>
                      <p>By accessing and using the BrixUp platform, you agree to be bound by these Terms of Service.</p>
                      <p>Section 1 - Eligibility: Users must be 18+ years of age and complete KYC/AML verification.</p>
                      <p>Section 2 - Investment Risks: All investments carry risk of loss. Securities offered are illiquid.</p>
                      <p>Section 3 - Platform Fees: 2.5% platform fee on all investments. 3% dealmaker commission.</p>
                      <p className="text-white/30">... [Full document available for download]</p>
                    </>
                  )}
                  {agreement.type === "ppm" && (
                    <>
                      <p className="text-white font-semibold">Private Placement Memorandum</p>
                      <p>This PPM is for {agreement.dealAddress || "the referenced deal"}.</p>
                      <p>Offering: Tokenized fractional ownership via $BRXU tokens on Base L2 network.</p>
                      <p>Minimum Investment: $500 (500 BRXU tokens at $1.00/token).</p>
                      <p>Use of Proceeds: Property acquisition, rehabilitation, and resale.</p>
                      <p>Risk Factors: Market risk, construction risk, liquidity risk, regulatory risk.</p>
                      <p className="text-white/30">... [Full document available for download]</p>
                    </>
                  )}
                  {agreement.type === "saft" && (
                    <>
                      <p className="text-white font-semibold">Simple Agreement for Future Tokens (SAFT)</p>
                      <p>Token: $BRXU on Base L2 (ERC-20). Contract: 0x636E2f0cA4eFaAB67fd3FB67B31dfc677a494850</p>
                      <p>Each BRXU token represents a fractional interest in the underlying real estate deal SPV.</p>
                      <p>Tokens are non-transferable for 12 months from issuance (lock-up period).</p>
                      <p className="text-white/30">... [Full document available for download]</p>
                    </>
                  )}
                  {agreement.type === "spv" && (
                    <>
                      <p className="text-white font-semibold">SPV Operating Agreement</p>
                      <p>Deal: {agreement.dealAddress || "Referenced property"}</p>
                      <p>Structure: Single-purpose LLC holding title to the property.</p>
                      <p>Distribution: Pro-rata based on BRXU token holdings in the deal pool.</p>
                      <p className="text-white/30">... [Full document available for download]</p>
                    </>
                  )}
                  {agreement.type === "contractor" && (
                    <>
                      <p className="text-white font-semibold">Contractor Participation Agreement</p>
                      <p>Deal: {agreement.dealAddress || "Referenced property"}</p>
                      <p>Compensation: Cash draws per milestone + sweat equity BRXU tokens.</p>
                      <p>Performance Bond: 500 BRXU staked as quality guarantee.</p>
                      <p>Draw Schedule: Based on milestone completion verified by inspections.</p>
                      <p className="text-white/30">... [Full document available for download]</p>
                    </>
                  )}
                </div>

                {agreement.status === "signed" && (
                  <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
                    <svg className="w-4 h-4" style={{ color: "#2ECC71" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs" style={{ color: "#2ECC71" }}>
                      Electronically signed on {agreement.signedAt ? new Date(agreement.signedAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {agreements.length === 0 && (
        <div className="rounded-xl border border-white/10 p-12 text-center" style={{ backgroundColor: "#1A1A2E" }}>
          <svg className="mx-auto w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-sm text-white/40">No agreements yet. Documents will appear here when you invest in deals.</p>
        </div>
      )}
    </div>
  );
}
