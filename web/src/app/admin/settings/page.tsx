"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function PlatformSettingsPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.user_role === "admin";

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Platform settings state
  const [settings, setSettings] = useState({
    platformName: "BrixUp",
    tagline: "Tokenized Real Estate Marketplace",
    minInvestment: "500",
    maxInvestment: "100000",
    platformFeePercent: "2.5",
    dealmakerCommission: "3",
    stakingAPY: "12",
    kycRequired: true,
    newDealApprovalRequired: true,
    drawApprovalRequired: true,
    maintenanceMode: false,
    allowNewSignups: true,
    requireEmailVerification: true,
    network: "base-sepolia",
    rpcUrl: "https://sepolia.base.org",
    brixTokenAddress: "0x636E2f0cA4eFaAB67fd3FB67B31dfc677a494850",
    factoryAddress: "0x214F5A820494C8a2AEAE796038C5e33E12eBf6C6",
    stakingAddress: "0x4909eaC2484E9A121e8E917155D343f61Eec6714",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* silent */ }
    setSaving(false);
  };

  const update = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
          <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Deployment, backend config, and controls</p>
        </div>
        {isAdmin && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: saved ? "#2ECC71" : "#D4A843", color: "#0D0D1A" }}
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">General</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>Platform Name</label>
              <input value={settings.platformName} onChange={(e) => update("platformName", e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]" style={{ backgroundColor: "#0D0D1A" }} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>Tagline</label>
              <input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]" style={{ backgroundColor: "#0D0D1A" }} />
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Financial</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "minInvestment", label: "Min Investment ($)", type: "number" },
              { key: "maxInvestment", label: "Max Investment ($)", type: "number" },
              { key: "platformFeePercent", label: "Platform Fee (%)", type: "number" },
              { key: "dealmakerCommission", label: "Dealmaker Commission (%)", type: "number" },
              { key: "stakingAPY", label: "Staking APY (%)", type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>{f.label}</label>
                <input type={f.type} value={(settings as Record<string, string | boolean>)[f.key] as string} onChange={(e) => update(f.key, e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Approval & Access Controls */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Approval & Access</h2>
          <div className="space-y-4">
            {[
              { key: "newDealApprovalRequired", label: "Require admin approval for new deals", desc: "Deals go through review before going live on marketplace" },
              { key: "drawApprovalRequired", label: "Require admin approval for draw requests", desc: "Builder draw requests need admin sign-off before payment" },
              { key: "kycRequired", label: "Require KYC verification", desc: "Users must complete identity verification before investing" },
              { key: "allowNewSignups", label: "Allow new signups", desc: "Toggle public registration on/off" },
              { key: "requireEmailVerification", label: "Require email verification", desc: "Users must verify email before accessing the platform" },
              { key: "maintenanceMode", label: "Maintenance mode", desc: "Show maintenance page to all non-admin users" },
            ].map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{toggle.label}</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{toggle.desc}</p>
                </div>
                <button
                  onClick={() => isAdmin && update(toggle.key, !(settings as Record<string, string | boolean>)[toggle.key])}
                  disabled={!isAdmin}
                  className="relative h-6 w-11 rounded-full transition-colors disabled:opacity-50"
                  style={{ backgroundColor: (settings as Record<string, string | boolean>)[toggle.key] ? "#2ECC71" : "#4A4A5A" }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                    style={{ transform: (settings as Record<string, string | boolean>)[toggle.key] ? "translateX(20px)" : "translateX(0)" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment / Contract Addresses */}
        <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Blockchain Deployment</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>Network</label>
              <select value={settings.network} onChange={(e) => update("network", e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white disabled:opacity-50 focus:outline-none" style={{ backgroundColor: "#0D0D1A" }}>
                <option value="base-sepolia">Base Sepolia (Testnet)</option>
                <option value="base">Base (Mainnet)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>RPC URL</label>
              <input value={settings.rpcUrl} onChange={(e) => update("rpcUrl", e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white font-mono disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]" style={{ backgroundColor: "#0D0D1A" }} />
            </div>
            {[
              { key: "brixTokenAddress", label: "BrixToken Address" },
              { key: "factoryAddress", label: "BrixFactory Address" },
              { key: "stakingAddress", label: "BrixStaking Address" },
            ].map((c) => (
              <div key={c.key} className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium" style={{ color: "#4A4A5A" }}>{c.label}</label>
                <input value={(settings as Record<string, string | boolean>)[c.key] as string} onChange={(e) => update(c.key, e.target.value)} disabled={!isAdmin} className="w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white font-mono disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]" style={{ backgroundColor: "#0D0D1A" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
