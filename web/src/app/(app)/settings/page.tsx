"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAccount, useConnect } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const router = useRouter();
  const { address: wagmiAddress, isConnected: walletConnected } = useAccount();
  const { connect, isPending: isWalletConnecting } = useConnect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [kycStatus, setKycStatus] = useState<string>("pending");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const walletAddress = walletConnected && wagmiAddress
    ? wagmiAddress
    : profile?.wallet_address && profile.wallet_address.startsWith("0x")
    ? profile.wallet_address
    : "";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large. Max 2MB.");
      return;
    }
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // Storage bucket may not exist — save a short placeholder URL instead
        await updateProfile({ avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2B4C7E&color=F8F6F0&size=128` });
      } else {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        await updateProfile({ avatar_url: urlData.publicUrl });
      }
    } catch {
      // Fallback to generated avatar URL
      await updateProfile({ avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2B4C7E&color=F8F6F0&size=128` });
    }
    setUploading(false);
  };

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setEmailNotif(profile.email_notifications ?? true);
      setSmsNotif(profile.sms_notifications ?? true);
      setPushNotif(profile.push_notifications ?? false);
      setLanguage(profile.language || "en");
      setKycStatus(profile.kyc_status || "pending");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const result = await updateProfile({
      full_name: name,
      phone,
      email_notifications: emailNotif,
      sms_notifications: smsNotif,
      push_notifications: pushNotif,
      language,
    });
    setSaving(false);
    if (!result.error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleNotifToggle = async (type: "email" | "sms" | "push", value: boolean) => {
    if (type === "email") setEmailNotif(value);
    if (type === "sms") setSmsNotif(value);
    if (type === "push") setPushNotif(value);
    await updateProfile({ [`${type}_notifications`]: value });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = async () => {
    await signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      await signOut();
      router.push("/");
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>
          Manage your account and preferences
        </p>
      </div>

      {saved && (
        <div
          className="mb-4 rounded-lg border px-4 py-3 text-sm"
          style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}
        >
          Changes saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {avatarPreview || profile?.avatar_url ? (
                <img
                  src={avatarPreview || profile?.avatar_url || ""}
                  alt="Avatar"
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                  style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
                >
                  {initials}
                </div>
              )}
              <div>
                <label
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium border transition-colors hover:bg-white/5 inline-block"
                  style={{ borderColor: "#D4A843", color: "#D4A843" }}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs" style={{ color: "#4A4A5A" }}>JPG, PNG or GIF. Max 2MB.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white/50 cursor-not-allowed"
                style={{ backgroundColor: "#0D0D1A" }}
              />
              <p className="mt-1 text-xs" style={{ color: "#4A4A5A" }}>Email cannot be changed</p>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "#4A4A5A" }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 py-2.5 px-4 text-sm text-white focus:outline-none focus:ring-1"
                style={{ backgroundColor: "#0D0D1A" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* KYC Status */}
        <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">KYC Verification</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: kycStatus === "verified" ? "#2ECC7120" : "#E8632B20" }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: kycStatus === "verified" ? "#2ECC71" : "#E8632B" }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Identity Verification</p>
                <p className="text-xs" style={{ color: "#4A4A5A" }}>
                  {kycStatus === "verified" ? "Your identity has been verified" : "Verification pending"}
                </p>
              </div>
            </div>
            {kycStatus === "verified" ? (
              <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}>
                Verified
              </span>
            ) : (
              <a
                href="/verify"
                className="rounded-lg px-4 py-2 text-xs font-semibold hover:opacity-90 inline-block"
                style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
              >
                Start Verification
              </a>
            )}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { key: "email" as const, label: "Email Notifications", desc: "Deal updates, yield payouts, and account alerts", value: emailNotif },
              { key: "sms" as const, label: "SMS Notifications", desc: "Security alerts and important transaction confirmations", value: smsNotif },
              { key: "push" as const, label: "Push Notifications", desc: "Real-time updates on milestones and draw schedules", value: pushNotif },
            ].map((notif, i) => (
              <div key={notif.key} className={`flex items-center justify-between ${i > 0 ? "border-t border-white/10 pt-4" : ""}`}>
                <div>
                  <p className="text-sm font-medium text-white">{notif.label}</p>
                  <p className="text-xs" style={{ color: "#4A4A5A" }}>{notif.desc}</p>
                </div>
                <button
                  onClick={() => handleNotifToggle(notif.key, !notif.value)}
                  className="relative h-6 w-11 rounded-full transition-colors"
                  style={{ backgroundColor: notif.value ? "#2ECC71" : "#4A4A5A" }}
                >
                  <span
                    className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                    style={{ left: notif.value ? "calc(100% - 1.375rem)" : "0.125rem" }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Connected Wallet */}
        <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Connected Wallet</h2>
          {walletAddress ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 rounded-lg px-4 py-3 font-mono text-sm text-white/80 overflow-hidden text-ellipsis whitespace-nowrap" style={{ backgroundColor: "#0D0D1A" }}>
              <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
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
          ) : (
          <div className="flex items-center justify-between rounded-lg px-4 py-4" style={{ backgroundColor: "#0D0D1A" }}>
            <div>
              <p className="text-sm text-white/60">No wallet connected</p>
              <p className="mt-0.5 text-xs" style={{ color: "#4A4A5A" }}>Connect your wallet to see your on-chain address</p>
            </div>
            <button
              onClick={() => connect({ connector: coinbaseWallet({ appName: "BrixUp" }) })}
              disabled={isWalletConnecting}
              className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
            >
              {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </div>
          )}
        </section>

        {/* Language */}
        <section className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-4 text-lg font-semibold text-white">Language</h2>
          <div className="flex gap-3">
            {(["en", "es"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); updateProfile({ language: lang }); }}
                className="flex-1 rounded-lg border py-3 text-sm font-medium transition-colors hover:bg-white/5"
                style={{
                  borderColor: language === lang ? "#D4A843" : "rgba(255,255,255,0.1)",
                  backgroundColor: language === lang ? "#D4A84320" : "transparent",
                  color: language === lang ? "#D4A843" : "#F8F6F0",
                }}
              >
                {lang === "en" ? "English" : "Espanol"}
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-500/30 p-5" style={{ backgroundColor: "#1A1A2E" }}>
          <h2 className="mb-2 text-lg font-semibold text-red-400">Danger Zone</h2>
          <p className="mb-4 text-xs" style={{ color: "#4A4A5A" }}>
            These actions are irreversible. Please proceed with caution.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDisconnect} className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10">
              Disconnect Wallet
            </button>
            <button onClick={handleDeleteAccount} className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
