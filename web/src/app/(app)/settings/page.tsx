"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAccount, useConnect } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";

export default function SettingsPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { address: wagmiAddress, isConnected: walletConnected } = useAccount();
  const { connect, isPending: isWalletConnecting } = useConnect();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
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
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        await updateProfile({ avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2B4C7E&color=F8F6F0&size=128` });
      } else {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        await updateProfile({ avatar_url: urlData.publicUrl });
      }
    } catch {
      await updateProfile({ avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2B4C7E&color=F8F6F0&size=128` });
    }
    setUploading(false);
  };

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      setPhone(profile.phone || "");
      setEmailNotif(profile.email_notifications ?? true);
      setSmsNotif(profile.sms_notifications ?? true);
      setPushNotif(profile.push_notifications ?? false);
      // Sync language context from profile on load
      if (profile.language && profile.language !== lang) {
        setLang(profile.language);
      }
      setKycStatus(profile.kyc_status || "pending");
    } else if (user?.email) {
      // Fallback: populate email from auth user even if profile hasn't loaded yet
      setEmail(user.email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const result = await updateProfile({
      full_name: name,
      phone,
      email_notifications: emailNotif,
      sms_notifications: smsNotif,
      push_notifications: pushNotif,
      language: lang,
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

  const handleLangChange = (newLang: "en" | "es") => {
    setLang(newLang);
    updateProfile({ language: newLang }).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
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
        <h1 className="text-2xl font-bold" style={{ color: "var(--brix-fg)" }}>{t("settings.title")}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--brix-fg-muted)" }}>
          {t("settings.subtitle")}
        </p>
      </div>

      {saved && (
        <div
          className="mb-4 rounded-lg border px-4 py-3 text-sm"
          style={{ borderColor: "#2ECC7130", backgroundColor: "#2ECC7110", color: "#2ECC71" }}
        >
          {t("settings.saved")}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.profile")}</h2>
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
                  className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium border transition-colors hover:opacity-80 inline-block"
                  style={{ borderColor: "#D4A843", color: "#D4A843" }}
                >
                  {uploading ? t("settings.uploading") : t("settings.uploadPhoto")}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.photoHint")}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.fullName")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                style={{ backgroundColor: "var(--brix-bg)", color: "var(--brix-fg)", border: "1px solid var(--brix-border)" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.email")}</label>
              <input
                type="email"
                value={email}
                disabled
                className="mt-1 w-full rounded-lg py-2.5 px-4 text-sm cursor-not-allowed opacity-50"
                style={{ backgroundColor: "var(--brix-bg)", color: "var(--brix-fg)", border: "1px solid var(--brix-border)" }}
              />
              <p className="mt-1 text-xs" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.emailCantChange")}</p>
            </div>

            <div>
              <label className="text-xs font-medium" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.phone")}</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A843]"
                style={{ backgroundColor: "var(--brix-bg)", color: "var(--brix-fg)", border: "1px solid var(--brix-border)" }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              {saving ? t("settings.saving") : t("settings.saveChanges")}
            </button>
          </div>
        </section>

        {/* Theme Section */}
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.theme")}</h2>
          <div className="flex gap-3">
            {(["dark", "light", "system"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: theme === mode ? "#D4A843" : "var(--brix-border)",
                  backgroundColor: theme === mode ? "#D4A84320" : "transparent",
                  color: theme === mode ? "#D4A843" : "var(--brix-fg)",
                }}
              >
                {mode === "light" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {mode === "dark" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                {mode === "system" && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {mode === "dark" ? t("settings.themeDark") : mode === "light" ? t("settings.themeLight") : t("settings.themeAuto")}
              </button>
            ))}
          </div>
        </section>

        {/* KYC Status */}
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.kyc")}</h2>
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
                <p className="text-sm font-medium" style={{ color: "var(--brix-fg)" }}>{t("settings.kycIdentity")}</p>
                <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>
                  {kycStatus === "verified" ? t("settings.kycVerified") : t("settings.kycPending")}
                </p>
              </div>
            </div>
            {kycStatus === "verified" ? (
              <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "#2ECC7130", color: "#2ECC71" }}>
                {t("settings.verified")}
              </span>
            ) : (
              <a
                href="/verify"
                className="rounded-lg px-4 py-2 text-xs font-semibold hover:opacity-90 inline-block"
                style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
              >
                {t("settings.startVerification")}
              </a>
            )}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.notifications")}</h2>
          <div className="space-y-4">
            {[
              { key: "email" as const, label: t("settings.emailNotif"), desc: t("settings.emailNotifDesc"), value: emailNotif },
              { key: "sms" as const, label: t("settings.smsNotif"), desc: t("settings.smsNotifDesc"), value: smsNotif },
              { key: "push" as const, label: t("settings.pushNotif"), desc: t("settings.pushNotifDesc"), value: pushNotif },
            ].map((notif, i) => (
              <div key={notif.key} className={`flex items-center justify-between ${i > 0 ? "pt-4" : ""}`} style={i > 0 ? { borderTop: "1px solid var(--brix-border)" } : undefined}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--brix-fg)" }}>{notif.label}</p>
                  <p className="text-xs" style={{ color: "var(--brix-fg-muted)" }}>{notif.desc}</p>
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
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.connectedWallet")}</h2>
          {walletAddress ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 rounded-lg px-4 py-3 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap" style={{ backgroundColor: "var(--brix-bg)", color: "var(--brix-fg)" }}>
              <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#2ECC71" }} />
              {walletAddress}
            </div>
            <button
              onClick={handleCopy}
              className="shrink-0 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
              style={{ borderColor: "var(--brix-border-strong)", color: "var(--brix-fg)" }}
            >
              {copied ? (
                <span className="flex items-center gap-1.5" style={{ color: "#2ECC71" }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("settings.copied")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {t("settings.copy")}
                </span>
              )}
            </button>
          </div>
          ) : (
          <div className="flex items-center justify-between rounded-lg px-4 py-4" style={{ backgroundColor: "var(--brix-bg)" }}>
            <div>
              <p className="text-sm" style={{ color: "var(--brix-fg-muted)" }}>{t("settings.noWallet")}</p>
              <p className="mt-0.5 text-xs" style={{ color: "var(--brix-fg-muted)", opacity: 0.7 }}>{t("settings.noWalletDesc")}</p>
            </div>
            <button
              onClick={() => connect({ connector: coinbaseWallet({ appName: "BrixUp" }) })}
              disabled={isWalletConnecting}
              className="shrink-0 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#2B4C7E", color: "#F8F6F0" }}
            >
              {isWalletConnecting ? t("settings.connecting") : t("settings.connectWallet")}
            </button>
          </div>
          )}
        </section>

        {/* Language */}
        <section className="rounded-xl p-5" style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}>
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--brix-fg)" }}>{t("settings.language")}</h2>
          <div className="flex gap-3">
            {(["en", "es"] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLangChange(l)}
                className="flex-1 rounded-lg border py-3 text-sm font-medium transition-colors hover:opacity-80"
                style={{
                  borderColor: lang === l ? "#D4A843" : "var(--brix-border)",
                  backgroundColor: lang === l ? "#D4A84320" : "transparent",
                  color: lang === l ? "#D4A843" : "var(--brix-fg)",
                }}
              >
                {l === "en" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-500/30 p-5" style={{ backgroundColor: "var(--brix-surface)" }}>
          <h2 className="mb-2 text-lg font-semibold text-red-400">{t("settings.dangerZone")}</h2>
          <p className="mb-4 text-xs" style={{ color: "var(--brix-fg-muted)" }}>
            {t("settings.dangerDesc")}
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleDisconnect} className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10">
              {t("settings.disconnectWallet")}
            </button>
            <button onClick={handleDeleteAccount} className="rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10">
              {t("settings.deleteAccount")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
