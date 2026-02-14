"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const drawSchedule = [
  { milestone: "Foundation", status: "Completed", amount: 18000, date: "Jan 15, 2026" },
  { milestone: "Framing", status: "Completed", amount: 22000, date: "Feb 10, 2026" },
  { milestone: "MEP (Mechanical, Electrical, Plumbing)", status: "In Progress", amount: 20000, date: "Mar 5, 2026" },
  { milestone: "Finishes", status: "Pending", amount: 17000, date: "Apr 1, 2026" },
  { milestone: "Certificate of Occupancy", status: "Pending", amount: 8000, date: "Apr 20, 2026" },
];

const documents = [
  { name: "Inspection Report", type: "PDF", size: "2.4 MB" },
  { name: "Title Search", type: "PDF", size: "1.1 MB" },
  { name: "Scope of Work", type: "PDF", size: "3.8 MB" },
  { name: "Insurance Certificate", type: "PDF", size: "890 KB" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "#2ECC71", text: "#0D0D1A" },
  "In Progress": { bg: "#D4A843", text: "#0D0D1A" },
  Pending: { bg: "#4A4A5A", text: "#F8F6F0" },
};

export default function DealDetailPage() {
  const { user } = useAuth();
  const [investAmount, setInvestAmount] = useState("5000");
  const [investing, setInvesting] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [investError, setInvestError] = useState<string | null>(null);

  const handleInvest = async () => {
    if (!user) return;
    setInvesting(true);
    setInvestError(null);
    setInvestSuccess(false);
    try {
      // In production this would call the smart contract
      await new Promise((r) => setTimeout(r, 1500));
      setInvestSuccess(true);
      setTimeout(() => setInvestSuccess(false), 5000);
    } catch {
      setInvestError("Investment failed. Please try again.");
    } finally {
      setInvesting(false);
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: "#4A4A5A" }}>
        <Link href="/marketplace" className="hover:text-white transition-colors">
          Marketplace
        </Link>
        <span>/</span>
        <span className="text-white">1847 Oakwood Dr</span>
      </div>

      {/* Hero section */}
      <div className="mb-6 overflow-hidden rounded-xl border border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="relative flex h-56 sm:h-72 items-center justify-center bg-gradient-to-br from-[#2B4C7E] to-[#1A1A2E]">
          <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
            >
              Flip
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}
            >
              Active
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-white">1847 Oakwood Dr</h1>
          <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
            Charlotte, NC 28205
          </p>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT COLUMN (2/3) */}
        <div className="flex-1 space-y-6 lg:max-w-[66%]">
          {/* Property Overview */}
          <section
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Property Overview</h2>
            <p className="mb-4 text-sm leading-relaxed" style={{ color: "#F8F6F0" }}>
              Distressed single-family home in the up-and-coming Plaza Midwood neighborhood of Charlotte.
              The property requires a full cosmetic renovation including kitchen, bathrooms, flooring,
              and exterior updates. The neighborhood has seen 15% appreciation over the past 12 months,
              making this an excellent flip opportunity with strong comparable sales supporting the ARV.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Beds", value: "3" },
                { label: "Baths", value: "2" },
                { label: "Sq Ft", value: "1,650" },
                { label: "Year Built", value: "1978" },
                { label: "Lot Size", value: "0.28 acres" },
                { label: "Parking", value: "2-car garage" },
                { label: "Foundation", value: "Slab" },
                { label: "Zoning", value: "R-3" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pro Forma Analysis */}
          <section
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Pro Forma Analysis</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-white/10">
                  {[
                    { label: "Purchase Price", value: "$165,000", highlight: false },
                    { label: "Rehab Budget", value: "$85,000", highlight: false },
                    { label: "Closing Costs (Buy)", value: "$4,950", highlight: false },
                    { label: "Holding Costs (6 mo)", value: "$9,600", highlight: false },
                    { label: "Closing Costs (Sell)", value: "$18,600", highlight: false },
                    { label: "Total Cost", value: "$283,150", highlight: true },
                    { label: "After Repair Value (ARV)", value: "$310,000", highlight: false },
                    { label: "Projected Profit", value: "$26,850", highlight: true },
                    { label: "Return on Investment", value: "22%", highlight: true },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-3 text-left" style={{ color: row.highlight ? "#F8F6F0" : "#4A4A5A" }}>
                        {row.label}
                      </td>
                      <td
                        className="py-3 text-right font-semibold"
                        style={{ color: row.highlight ? "#D4A843" : "#F8F6F0" }}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Draw Schedule */}
          <section
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Draw Schedule</h2>
            <div className="space-y-4">
              {drawSchedule.map((draw, i) => {
                const colors = statusColors[draw.status];
                const isCompleted = draw.status === "Completed";
                const isInProgress = draw.status === "In Progress";
                return (
                  <div key={draw.milestone} className="relative flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      {i < drawSchedule.length - 1 && (
                        <div
                          className="w-0.5 flex-1 min-h-[24px]"
                          style={{
                            backgroundColor: isCompleted ? "#2ECC71" : "rgba(255,255,255,0.1)",
                          }}
                        />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">{draw.milestone}</p>
                          <p className="text-xs" style={{ color: "#4A4A5A" }}>
                            {draw.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-white">
                            ${draw.amount.toLocaleString()}
                          </span>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {draw.status}
                          </span>
                        </div>
                      </div>
                      {isInProgress && (
                        <div className="mt-2">
                          <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                            <div
                              className="h-full w-3/5 rounded-full"
                              style={{ backgroundColor: "#D4A843" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Deal Documents */}
          <section
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Deal Documents</h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" style={{ color: "#E8632B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-xs" style={{ color: "#4A4A5A" }}>
                        {doc.type} - {doc.size}
                      </p>
                    </div>
                  </div>
                  <svg className="w-4 h-4" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="w-full space-y-6 lg:w-[340px] lg:shrink-0">
          {/* Investment Card */}
          <div
            className="rounded-xl border border-white/10 p-5 lg:sticky lg:top-4"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h3 className="text-base font-semibold text-white mb-4">Invest in this Deal</h3>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "#4A4A5A" }}>
                  Funding Progress
                </span>
                <span className="text-xs font-semibold" style={{ color: "#D4A843" }}>
                  67%
                </span>
              </div>
              <div className="h-3 w-full rounded-full" style={{ backgroundColor: "#0D0D1A" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: "67%", backgroundColor: "#D4A843" }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                  $190,950 raised
                </span>
                <span className="text-sm" style={{ color: "#4A4A5A" }}>
                  of $285,000
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-5 border-t border-white/10 pt-4">
              {[
                { label: "Investors", value: "24" },
                { label: "Min Investment", value: "$1,000" },
                { label: "Projected Return", value: "22% ROI" },
                { label: "Timeline", value: "6 months" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "#4A4A5A" }}>
                    {stat.label}
                  </span>
                  <span className="text-sm font-semibold text-white">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Invest form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                  Amount ($BRIX)
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#D4A843" }}>
                    $BRIX
                  </span>
                  <input
                    type="text"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="w-full rounded-lg border border-white/10 py-2.5 pl-16 pr-4 text-sm text-white text-right focus:outline-none focus:ring-1"
                    style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
                  />
                </div>
              </div>
              {investSuccess && (
                <div className="rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}>
                  Investment submitted successfully!
                </div>
              )}
              {investError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {investError}
                </div>
              )}
              <button
                onClick={handleInvest}
                disabled={investing || !investAmount}
                className="w-full rounded-lg py-3 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
              >
                {investing ? "Processing..." : "Invest $BRIX"}
              </button>
              <p className="text-center text-xs" style={{ color: "#4A4A5A" }}>
                By investing, you agree to the Terms & Conditions
              </p>
            </div>
          </div>

          {/* Deal Team */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h3 className="text-base font-semibold text-white mb-4">Deal Team</h3>
            <div className="space-y-4">
              {/* Dealmaker */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
                >
                  MR
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Marcus Reynolds</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    Dealmaker
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                    892
                  </p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    Brix Score
                  </p>
                </div>
              </div>
              {/* General Contractor */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{ backgroundColor: "#E8632B", color: "#F8F6F0" }}
                >
                  TJ
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Tony Jackson</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    General Contractor
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "#D4A843" }}>
                    847
                  </p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>
                    Brix Score
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Dates */}
          <div
            className="rounded-xl border border-white/10 p-5"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <h3 className="text-base font-semibold text-white mb-4">Key Dates</h3>
            <div className="space-y-3">
              {[
                { label: "Listed", value: "Dec 15, 2025", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                { label: "Funding Deadline", value: "Feb 28, 2026", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { label: "Est. Completion", value: "Jun 15, 2026", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              ].map((date) => (
                <div key={date.label} className="flex items-center gap-3">
                  <svg className="w-4 h-4 shrink-0" style={{ color: "#4A4A5A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={date.icon} />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>
                      {date.label}
                    </p>
                    <p className="text-sm font-medium text-white">{date.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
