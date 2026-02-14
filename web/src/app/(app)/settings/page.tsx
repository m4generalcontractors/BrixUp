"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (704) 555-0123");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [copied, setCopied] = useState(false);

  const walletAddress = "0x7a3B4c8D9E2f1A6b5C0d3E4F7a8B9c0D1e2F9f2E";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
          <div className="space-y-4">
            {/* Avatar upload */}
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
              >
                JD
              </div>
              <div>
                <button
                  className="rounded-lg px-4 py-2 text-sm font-medium border transition-colors hover:bg-white/5"
                  style={{ borderColor: "#D4A843", color: "#D4A843" }}
                >
                  Upload Photo
                </button>
                <p className="mt-1 text-xs" style={{ color: "#4A4A5A" }}>
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A", borderColor: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <button
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              Save Changes
            </button>
          </div>
        </section>

        {/* KYC Status */}
        <section
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">KYC Verification</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "#2ECC7120" }}
              >
                <svg className="w-5 h-5" style={{ color: "#2ECC71" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Identity Verification</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Your identity has been verified
                </p>
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}
            >
              Verified
            </span>
          </div>
        </section>

        {/* Notification Preferences */}
        <section
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Notification Preferences</h2>
          <div className="space-y-4">
            {/* Email toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Deal updates, yield payouts, and account alerts
                </p>
              </div>
              <button
                onClick={() => setEmailNotif(!emailNotif)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ backgroundColor: emailNotif ? "#2ECC71" : "#4A4A5A" }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{
                    left: emailNotif ? "calc(100% - 1.375rem)" : "0.125rem",
                  }}
                />
              </button>
            </div>

            {/* SMS toggle */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="text-sm font-medium text-white">SMS Notifications</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Security alerts and important transaction confirmations
                </p>
              </div>
              <button
                onClick={() => setSmsNotif(!smsNotif)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ backgroundColor: smsNotif ? "#2ECC71" : "#4A4A5A" }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{
                    left: smsNotif ? "calc(100% - 1.375rem)" : "0.125rem",
                  }}
                />
              </button>
            </div>

            {/* Push toggle */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="text-sm font-medium text-white">Push Notifications</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  Real-time updates on milestones and draw schedules
                </p>
              </div>
              <button
                onClick={() => setPushNotif(!pushNotif)}
                className="relative h-6 w-11 rounded-full transition-colors"
                style={{ backgroundColor: pushNotif ? "#2ECC71" : "#4A4A5A" }}
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                  style={{
                    left: pushNotif ? "calc(100% - 1.375rem)" : "0.125rem",
                  }}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Connected Wallet */}
        <section
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Connected Wallet</h2>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-lg px-4 py-3 font-mono text-sm text-white/80 overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ backgroundColor: "#0D0D1A" }}
            >
              {walletAddress}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ borderColor: "#4A4A5A", color: "#F8F6F0" }}
            >
              {copied ? (
                <span className="flex items-center gap-1.5" style={{ color: "#2ECC71" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Language Preference */}
        <section
          className="rounded-xl border border-white/10 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-4 text-lg font-semibold text-white">Language</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-colors ${
                language === "en" ? "" : "hover:bg-white/5"
              }`}
              style={{
                borderColor: language === "en" ? "#D4A843" : "rgba(255,255,255,0.1)",
                backgroundColor: language === "en" ? "#D4A84320" : "transparent",
                color: language === "en" ? "#D4A843" : "#F8F6F0",
              }}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`flex-1 rounded-lg border py-3 text-sm font-medium transition-colors ${
                language === "es" ? "" : "hover:bg-white/5"
              }`}
              style={{
                borderColor: language === "es" ? "#D4A843" : "rgba(255,255,255,0.1)",
                backgroundColor: language === "es" ? "#D4A84320" : "transparent",
                color: language === "es" ? "#D4A843" : "#F8F6F0",
              }}
            >
              Espanol
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section
          className="rounded-xl border border-red-500/30 p-5"
          style={{ backgroundColor: "#1A1A2E" }}
        >
          <h2 className="mb-2 text-lg font-semibold text-red-400">Danger Zone</h2>
          <p className="mb-4 text-xs" style={{ color: "#4A4A5A" }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10">
              Disconnect Wallet
            </button>
            <button className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
