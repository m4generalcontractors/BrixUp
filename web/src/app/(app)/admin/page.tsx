"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CONTRACTS_DEPLOYED } from "@/lib/contracts/config";

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

interface Deal {
  id: string;
  address: string;
  city: string;
  state: string;
  status: string;
  funded_amount: number;
  total_capital_needed: number;
  created_at: string;
}

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  user_role: string;
  wallet_address: string | null;
  kyc_status: string;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  deal_id: string;
  uploaded_at: string;
  uploaded_by: string;
  size: string;
}

// ---------------------------------------------------------------------------
//  Sample data (until Supabase tables are populated)
// ---------------------------------------------------------------------------

const sampleDeals: Deal[] = [
  { id: "deal-001", address: "1847 Oakwood Dr", city: "Charlotte", state: "NC", status: "Active", funded_amount: 190950, total_capital_needed: 285000, created_at: "2026-01-05" },
  { id: "deal-002", address: "412 Magnolia Ln", city: "Raleigh", state: "NC", status: "Funding", funded_amount: 223600, total_capital_needed: 520000, created_at: "2026-01-15" },
  { id: "deal-003", address: "903 Pine Valley Rd", city: "Greenville", state: "SC", status: "Active", funded_amount: 155750, total_capital_needed: 175000, created_at: "2026-01-20" },
];

const sampleUsers: UserRow[] = [
  { id: "u1", email: "admin@brixup.io", full_name: "Platform Admin", user_role: "admin", wallet_address: "0x7a3B...9f2E", kyc_status: "verified", created_at: "2025-12-01" },
  { id: "u2", email: "john@example.com", full_name: "John Builder", user_role: "builder", wallet_address: "0x4e2C...1a8D", kyc_status: "verified", created_at: "2025-12-15" },
  { id: "u3", email: "sarah@investor.co", full_name: "Sarah Investor", user_role: "investor", wallet_address: null, kyc_status: "pending", created_at: "2026-01-10" },
];

const sampleDocuments: Document[] = [
  { id: "d1", name: "SPV Operating Agreement", type: "PDF", deal_id: "deal-001", uploaded_at: "2026-01-06", uploaded_by: "admin@brixup.io", size: "2.4 MB" },
  { id: "d2", name: "Title Insurance Certificate", type: "PDF", deal_id: "deal-001", uploaded_at: "2026-01-08", uploaded_by: "admin@brixup.io", size: "1.1 MB" },
  { id: "d3", name: "Construction Permit", type: "PDF", deal_id: "deal-002", uploaded_at: "2026-01-20", uploaded_by: "john@example.com", size: "890 KB" },
];

// ---------------------------------------------------------------------------
//  Component
// ---------------------------------------------------------------------------

export default function AdminPortal() {
  const { profile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "deals" | "users" | "contracts" | "documents" | "settings">("overview");
  const [deals, setDeals] = useState<Deal[]>(sampleDeals);
  const [users, setUsers] = useState<UserRow[]>(sampleUsers);
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [loading, setLoading] = useState(true);

  // Admin-only actions
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<string | null>(null);
  const [pauseStatus, setPauseStatus] = useState(false);

  // Deal creation
  const [showCreateDeal, setShowCreateDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({ address: "", city: "", state: "", capitalNeeded: "", milestones: "5", investorSplit: "60", builderSplit: "20", platformSplit: "10", dealMakerSplit: "10" });

  // Document upload
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docDealId, setDocDealId] = useState("deal-001");

  // Access control — only admin/manager roles
  useEffect(() => {
    if (profile && profile.user_role !== "admin" && profile.user_role !== "manager") {
      router.push("/dashboard");
    }
  }, [profile, router]);

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      const supabase = createClient();
      const [dealsRes, profilesRes] = await Promise.all([
        supabase.from("deals").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      if (dealsRes.data && dealsRes.data.length > 0) setDeals(dealsRes.data as unknown as Deal[]);
      if (profilesRes.data && profilesRes.data.length > 0) setUsers(profilesRes.data as unknown as UserRow[]);
    } catch { /* Use sample data */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Handlers
  const handleMint = async () => {
    if (!mintAddress || !mintAmount) return;
    setMinting(true);
    setMintResult(null);
    try {
      const res = await fetch("/api/admin/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: mintAddress, amount: parseFloat(mintAmount) }),
      });
      if (res.ok) setMintResult(`Minted ${parseFloat(mintAmount).toLocaleString()} BRXU to ${mintAddress.slice(0, 8)}...`);
      else setMintResult("Mint failed — check contract deployment");
    } catch { setMintResult("Network error"); }
    setMinting(false);
  };

  const handleCreateDeal = async () => {
    const splits = [parseInt(newDeal.investorSplit), parseInt(newDeal.builderSplit), parseInt(newDeal.platformSplit), parseInt(newDeal.dealMakerSplit)];
    if (splits.reduce((a, b) => a + b, 0) !== 100) { alert("Splits must sum to 100%"); return; }
    try {
      const supabase = createClient();
      await supabase.from("deals").insert({
        address: newDeal.address,
        city: newDeal.city,
        state: newDeal.state,
        total_capital_needed: parseFloat(newDeal.capitalNeeded),
        funded_amount: 0,
        status: "Funding",
        milestones: parseInt(newDeal.milestones),
        investor_split_bps: splits[0] * 100,
        builder_split_bps: splits[1] * 100,
        platform_split_bps: splits[2] * 100,
        dealmaker_split_bps: splits[3] * 100,
      } as never);
      setShowCreateDeal(false);
      fetchData();
    } catch { /* handled */ }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const supabase = createClient();
      const path = `deal-docs/${docDealId}/${Date.now()}-${file.name}`;
      await supabase.storage.from("documents").upload(path, file);
      setDocuments(prev => [...prev, {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.includes("pdf") ? "PDF" : file.name.split(".").pop()?.toUpperCase() || "FILE",
        deal_id: docDealId,
        uploaded_at: new Date().toISOString().split("T")[0],
        uploaded_by: profile?.email || "admin",
        size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
      }]);
    } catch { /* handled */ }
    setUploadingDoc(false);
  };

  const handleApproveDeal = async (dealId: string) => {
    try {
      const supabase = createClient();
      await supabase.from("deals").update({ status: "Active" } as never).eq("id", dealId);
      setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: "Active" } : d));
    } catch { /* handled */ }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" /></div>;

  const totalInvested = deals.reduce((s, d) => s + d.funded_amount, 0);
  const activeDeals = deals.filter(d => d.status === "Active").length;
  const fundingDeals = deals.filter(d => d.status === "Funding").length;
  const verifiedUsers = users.filter(u => u.kyc_status === "verified").length;

  const tabs = [
    { key: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "deals", label: "Deals", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { key: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { key: "contracts", label: "Contracts", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
    { key: "documents", label: "Documents", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { key: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ] as const;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Platform management &middot; Token operations &middot; Deal approvals</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key ? "text-white" : "text-white/50 hover:text-white/70"}`}
            style={{ backgroundColor: activeTab === tab.key ? "#1A1A2E" : "transparent", borderColor: activeTab === tab.key ? "#D4A84340" : "transparent", borderWidth: "1px" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- OVERVIEW TAB ---- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Invested", value: `$${totalInvested.toLocaleString()}`, color: "#D4A843" },
              { label: "Active Deals", value: String(activeDeals), color: "#2ECC71" },
              { label: "Funding Deals", value: String(fundingDeals), color: "#2B4C7E" },
              { label: "Verified Users", value: String(verifiedUsers), color: "#D4A843" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>{s.label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Contract status */}
          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h2 className="mb-4 text-lg font-semibold text-white">Smart Contract Status</h2>
            <div className="space-y-3">
              {[
                { label: "BrixToken (ERC-20)", addr: process.env.NEXT_PUBLIC_BRXU_TOKEN_ADDRESS, deployed: !!process.env.NEXT_PUBLIC_BRXU_TOKEN_ADDRESS },
                { label: "BrixStaking", addr: process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_BRXU_STAKING_ADDRESS, deployed: !!process.env.NEXT_PUBLIC_BRXU_STAKING_ADDRESS },
                { label: "BrixFactory (Deal Pool)", addr: process.env.NEXT_PUBLIC_BRXU_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_DEAL_POOL_ADDRESS, deployed: !!process.env.NEXT_PUBLIC_BRXU_FACTORY_ADDRESS },
              ].map(c => (
                <div key={c.label} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ backgroundColor: "#0D0D1A" }}>
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.deployed ? "#2ECC71" : "#E8632B" }} />
                    <div>
                      <p className="text-sm font-medium text-white">{c.label}</p>
                      {c.addr && <p className="font-mono text-xs text-white/30">{c.addr}</p>}
                    </div>
                  </div>
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: c.deployed ? "#2ECC7120" : "#E8632B20", color: c.deployed ? "#2ECC71" : "#E8632B" }}>
                    {c.deployed ? "Deployed" : "Not Deployed"}
                  </span>
                </div>
              ))}
            </div>
            {!CONTRACTS_DEPLOYED && (
              <div className="mt-4 rounded-lg border px-4 py-3 text-xs" style={{ borderColor: "#D4A84330", backgroundColor: "#D4A84310", color: "#D4A843" }}>
                Set contract addresses in .env to enable on-chain features. Run <code className="font-mono">npm run deploy:testnet</code> in the contracts directory.
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid gap-4 sm:grid-cols-3">
            <button onClick={() => setActiveTab("deals")} className="flex items-center gap-3 rounded-xl border border-white/10 p-4 text-left transition-colors hover:bg-white/5" style={{ backgroundColor: "#1A1A2E" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#2B4C7E20" }}>
                <svg className="w-5 h-5" style={{ color: "#2B4C7E" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <div><p className="text-sm font-medium text-white">Create Deal</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Deploy new deal contract</p></div>
            </button>
            <button onClick={() => setActiveTab("contracts")} className="flex items-center gap-3 rounded-xl border border-white/10 p-4 text-left transition-colors hover:bg-white/5" style={{ backgroundColor: "#1A1A2E" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#D4A84320" }}>
                <svg className="w-5 h-5" style={{ color: "#D4A843" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" /></svg>
              </div>
              <div><p className="text-sm font-medium text-white">Mint Tokens</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Mint BRXU to an address</p></div>
            </button>
            <button onClick={() => setActiveTab("documents")} className="flex items-center gap-3 rounded-xl border border-white/10 p-4 text-left transition-colors hover:bg-white/5" style={{ backgroundColor: "#1A1A2E" }}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#2ECC7120" }}>
                <svg className="w-5 h-5" style={{ color: "#2ECC71" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </div>
              <div><p className="text-sm font-medium text-white">Upload Documents</p><p className="text-xs" style={{ color: "#4A4A5A" }}>Add deal contracts & docs</p></div>
            </button>
          </div>
        </div>
      )}

      {/* ---- DEALS TAB ---- */}
      {activeTab === "deals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Deal Management</h2>
            <button onClick={() => setShowCreateDeal(!showCreateDeal)} className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
              + New Deal
            </button>
          </div>

          {showCreateDeal && (
            <div className="rounded-xl border border-white/10 p-5 space-y-4" style={{ backgroundColor: "#1A1A2E" }}>
              <h3 className="text-base font-semibold text-white">Create New Deal</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><label className="text-xs" style={{ color: "#4A4A5A" }}>Property Address</label><input value={newDeal.address} onChange={e => setNewDeal(p => ({ ...p, address: e.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
                <div><label className="text-xs" style={{ color: "#4A4A5A" }}>City</label><input value={newDeal.city} onChange={e => setNewDeal(p => ({ ...p, city: e.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
                <div><label className="text-xs" style={{ color: "#4A4A5A" }}>State</label><input value={newDeal.state} onChange={e => setNewDeal(p => ({ ...p, state: e.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-xs" style={{ color: "#4A4A5A" }}>Capital Needed ($)</label><input type="text" inputMode="numeric" value={newDeal.capitalNeeded} onChange={e => setNewDeal(p => ({ ...p, capitalNeeded: e.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
                <div><label className="text-xs" style={{ color: "#4A4A5A" }}>Milestones</label><input type="number" value={newDeal.milestones} onChange={e => setNewDeal(p => ({ ...p, milestones: e.target.value }))} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
              </div>
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Profit Splits (%)</label>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {(["investorSplit", "builderSplit", "platformSplit", "dealMakerSplit"] as const).map(k => (
                    <div key={k}><label className="text-[10px] capitalize" style={{ color: "#4A4A5A" }}>{k.replace("Split", "")}</label><input type="number" value={newDeal[k]} onChange={e => setNewDeal(p => ({ ...p, [k]: e.target.value }))} className="w-full rounded-lg border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} /></div>
                  ))}
                </div>
                {parseInt(newDeal.investorSplit) + parseInt(newDeal.builderSplit) + parseInt(newDeal.platformSplit) + parseInt(newDeal.dealMakerSplit) !== 100 && (
                  <p className="mt-1 text-xs" style={{ color: "#E8632B" }}>Splits must sum to 100% (currently {parseInt(newDeal.investorSplit) + parseInt(newDeal.builderSplit) + parseInt(newDeal.platformSplit) + parseInt(newDeal.dealMakerSplit)}%)</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={handleCreateDeal} className="rounded-lg px-6 py-2.5 text-sm font-bold transition-colors hover:opacity-90" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>Create Deal</button>
                <button onClick={() => setShowCreateDeal(false)} className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5">Cancel</button>
              </div>
            </div>
          )}

          {/* Deal list */}
          <div className="rounded-xl border border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Deal ID", "Property", "Status", "Funded", "Progress", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#4A4A5A" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {deals.map(deal => {
                    const pct = Math.round((deal.funded_amount / deal.total_capital_needed) * 100);
                    const statusColor = deal.status === "Active" ? "#2ECC71" : deal.status === "Funding" ? "#D4A843" : "#4A4A5A";
                    return (
                      <tr key={deal.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-xs text-white/60">{deal.id}</td>
                        <td className="px-4 py-3"><p className="text-sm font-medium text-white">{deal.address}</p><p className="text-xs" style={{ color: "#4A4A5A" }}>{deal.city}, {deal.state}</p></td>
                        <td className="px-4 py-3"><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: statusColor + "20", color: statusColor }}>{deal.status}</span></td>
                        <td className="px-4 py-3 text-sm text-white">${deal.funded_amount.toLocaleString()} / ${deal.total_capital_needed.toLocaleString()}</td>
                        <td className="px-4 py-3"><div className="h-2 w-20 rounded-full" style={{ backgroundColor: "#0D0D1A" }}><div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: statusColor }} /></div></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {deal.status === "Funding" && (
                              <button onClick={() => handleApproveDeal(deal.id)} className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: "#2ECC7120", color: "#2ECC71" }}>Approve</button>
                            )}
                            <button className="rounded px-2 py-1 text-xs font-medium" style={{ backgroundColor: "#2B4C7E20", color: "#6B9FE8" }}>View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---- USERS TAB ---- */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">User Management</h2>
          <div className="rounded-xl border border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Name", "Email", "Role", "Wallet", "KYC", "Joined"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "#4A4A5A" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map(u => {
                    const kycColor = u.kyc_status === "verified" ? "#2ECC71" : u.kyc_status === "pending" ? "#D4A843" : "#E8632B";
                    return (
                      <tr key={u.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-sm font-medium text-white">{u.full_name || "—"}</td>
                        <td className="px-4 py-3 text-sm text-white/60">{u.email}</td>
                        <td className="px-4 py-3"><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize" style={{ backgroundColor: "#D4A84320", color: "#D4A843" }}>{u.user_role}</span></td>
                        <td className="px-4 py-3 font-mono text-xs text-white/40">{u.wallet_address || "Not connected"}</td>
                        <td className="px-4 py-3"><span className="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize" style={{ backgroundColor: kycColor + "20", color: kycColor }}>{u.kyc_status}</span></td>
                        <td className="px-4 py-3 text-xs text-white/40">{new Date(u.created_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---- CONTRACTS TAB ---- */}
      {activeTab === "contracts" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">Token & Contract Operations</h2>

          {/* Mint tokens */}
          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="mb-4 text-base font-semibold text-white">Mint $BRXU Tokens</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Recipient Address</label>
                <input value={mintAddress} onChange={e => setMintAddress(e.target.value)} placeholder="0x..." className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Amount (BRXU)</label>
                <input type="text" inputMode="numeric" value={mintAmount} onChange={e => setMintAmount(e.target.value)} placeholder="10000" className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
            </div>
            {mintResult && (
              <div className="mt-3 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: mintResult.includes("failed") ? "#E8632B30" : "#2ECC7130", backgroundColor: mintResult.includes("failed") ? "#E8632B10" : "#2ECC7110", color: mintResult.includes("failed") ? "#E8632B" : "#2ECC71" }}>
                {mintResult}
              </div>
            )}
            <button onClick={handleMint} disabled={minting || !mintAddress || !mintAmount} className="mt-4 rounded-lg px-6 py-2.5 text-sm font-bold transition-colors hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
              {minting ? "Minting..." : "Mint Tokens"}
            </button>
          </div>

          {/* Token controls */}
          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="mb-4 text-base font-semibold text-white">Token Controls</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg p-4" style={{ backgroundColor: "#0D0D1A" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Token Transfers</p>
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Pause/unpause all transfers</p>
                  </div>
                  <button
                    onClick={() => setPauseStatus(!pauseStatus)}
                    className="rounded-lg px-4 py-2 text-xs font-semibold"
                    style={{ backgroundColor: pauseStatus ? "#E8632B20" : "#2ECC7120", color: pauseStatus ? "#E8632B" : "#2ECC71" }}
                  >
                    {pauseStatus ? "Paused" : "Active"}
                  </button>
                </div>
              </div>
              <div className="rounded-lg p-4" style={{ backgroundColor: "#0D0D1A" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Staking Rewards</p>
                    <p className="text-xs" style={{ color: "#4A4A5A" }}>Distribute to staking pool</p>
                  </div>
                  <button className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ backgroundColor: "#D4A84320", color: "#D4A843" }}>
                    Distribute
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Deployment info */}
          <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
            <h3 className="mb-4 text-base font-semibold text-white">Deployment Instructions</h3>
            <div className="space-y-2 text-sm text-white/60">
              <p>1. Set <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white/80">DEPLOYER_PRIVATE_KEY</code> in <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white/80">contracts/.env</code></p>
              <p>2. Run <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white/80">cd contracts && npm run deploy:testnet</code></p>
              <p>3. Copy deployed addresses to <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white/80">web/.env.local</code></p>
              <p>4. Verify on Basescan: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-white/80">npx hardhat verify --network baseSepolia CONTRACT_ADDRESS</code></p>
            </div>
          </div>
        </div>
      )}

      {/* ---- DOCUMENTS TAB ---- */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Deal Documents</h2>
            <div className="flex items-center gap-3">
              <select value={docDealId} onChange={e => setDocDealId(e.target.value)} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }}>
                {deals.map(d => <option key={d.id} value={d.id}>{d.address}</option>)}
              </select>
              <label className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90" style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}>
                {uploadingDoc ? "Uploading..." : "Upload Document"}
                <input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleDocUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="space-y-1 p-2">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 shrink-0" style={{ color: "#E8632B" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    <div>
                      <p className="text-sm font-medium text-white">{doc.name}</p>
                      <p className="text-xs" style={{ color: "#4A4A5A" }}>{doc.deal_id} &middot; {doc.type} &middot; {doc.size} &middot; {doc.uploaded_at}</p>
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: "#4A4A5A" }}>{doc.uploaded_by}</span>
                </div>
              ))}
              {documents.length === 0 && (
                <div className="py-8 text-center text-sm text-white/40">No documents uploaded yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- SETTINGS TAB ---- */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">Platform Settings</h2>
          <div className="rounded-xl border border-white/10 p-5 space-y-4" style={{ backgroundColor: "#1A1A2E" }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Platform Fee (%)</label>
                <input type="number" defaultValue="10" className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Platform Wallet</label>
                <input type="text" defaultValue={process.env.NEXT_PUBLIC_PLATFORM_WALLET || "0x..."} className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm font-mono text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Min Investment (BRXU)</label>
                <input type="number" defaultValue="500" className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
              <div>
                <label className="text-xs" style={{ color: "#4A4A5A" }}>Staking APY (%)</label>
                <input type="number" defaultValue="12.5" step="0.1" className="mt-1 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
            </div>
            <button className="rounded-lg px-6 py-2.5 text-sm font-bold transition-colors hover:opacity-90" style={{ backgroundColor: "#2ECC71", color: "#0D0D1A" }}>Save Settings</button>
          </div>

          <div className="rounded-xl border p-5" style={{ backgroundColor: "#1A1A2E", borderColor: "#E8632B30" }}>
            <h3 className="text-base font-semibold" style={{ color: "#E8632B" }}>Danger Zone</h3>
            <p className="mt-1 text-xs text-white/40">Emergency actions — use with caution</p>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg border px-4 py-2 text-xs font-semibold" style={{ borderColor: "#E8632B40", color: "#E8632B" }}>Pause All Contracts</button>
              <button className="rounded-lg border px-4 py-2 text-xs font-semibold" style={{ borderColor: "#E8632B40", color: "#E8632B" }}>Emergency Withdraw</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
