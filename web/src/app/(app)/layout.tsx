"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useBalance } from "@/lib/wallet/useBalance";
import GlobalSearch from "@/components/GlobalSearch";

import type { UserRole } from "@/lib/supabase/types";

interface NavItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[] | "all";
}

const navItems: NavItem[] = [
  {
    labelKey: "nav.dashboard",
    href: "/dashboard",
    roles: "all",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    labelKey: "nav.marketplace",
    href: "/marketplace",
    roles: "all",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
      </svg>
    ),
  },
  {
    labelKey: "nav.builder",
    href: "/builder",
    roles: ["builder"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    labelKey: "nav.dealFinder",
    href: "/dealfinder",
    roles: ["dealmaker"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
      </svg>
    ),
  },
  {
    labelKey: "nav.wallet",
    href: "/wallet",
    roles: "all",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    labelKey: "nav.agreements",
    href: "/agreements",
    roles: "all",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    labelKey: "nav.settings",
    href: "/settings",
    roles: "all",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    labelKey: "nav.admin",
    href: "/admin",
    roles: ["admin", "manager"],
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut, loading } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; type: string; title: string; message: string; read: boolean; created_at: string }[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Single source of truth — same hook used by wallet page and dashboard
  const balanceData = useBalance();
  const brixBalance = Math.round(balanceData.availableBalance);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setNotifications(data);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "all", read: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const displayEmail = profile?.email || user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--brix-bg)" }}
      >
        <div className="text-center">
          <div
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl font-bold"
            style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
          >
            BU
          </div>
          <p className="mt-4 text-sm" style={{ color: "var(--brix-fg-muted)" }}>{t("header.loading")}</p>
        </div>
      </div>
    );
  }

  // OnchainKitProvider completely removed — no SDK auto-init anywhere.

  const appContent = (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--brix-bg)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: "var(--brix-surface)" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6" style={{ borderBottom: "1px solid var(--brix-border)" }}>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm"
            style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
          >
            BU
          </div>
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--brix-fg)" }}>
            Brix<span style={{ color: "#D4A843" }}>Up</span>
          </span>
          <button
            className="ml-auto lg:hidden hover:opacity-80"
            style={{ color: "var(--brix-fg-muted)" }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation — filtered by user role */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems
            .filter((item) => item.roles === "all" || item.roles.includes((profile?.user_role as UserRole) || "investor"))
            .map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? ""
                      : "hover:opacity-80"
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: "#D4A843", color: "#0D0D1A" }
                      : { color: "var(--brix-fg-muted)" }
                  }
                >
                  {item.icon}
                  {t(item.labelKey)}
                </Link>
              );
            })}
        </nav>

        {/* User avatar area */}
        <div className="p-4" style={{ borderTop: "1px solid var(--brix-border)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium" style={{ backgroundColor: "var(--brix-border-strong)", color: "var(--brix-fg)" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--brix-fg)" }}>{displayName}</p>
              <p className="text-xs truncate" style={{ color: "var(--brix-fg-muted)" }}>
                {displayEmail}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="shrink-0 rounded-lg p-1.5 hover:opacity-80 transition-colors"
              style={{ color: "var(--brix-fg-muted)" }}
              title={t("header.signOut")}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex h-16 items-center gap-4 px-4 lg:px-6"
          style={{ backgroundColor: "var(--brix-bg)", borderBottom: "1px solid var(--brix-border)" }}
        >
          <button
            className="lg:hidden hover:opacity-80"
            style={{ color: "var(--brix-fg-muted)" }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <GlobalSearch placeholder={t("header.search")} />

          <div className="flex items-center gap-2 ml-auto">
            {/* Theme toggle */}
            <div className="hidden sm:flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid var(--brix-border)" }}>
              {(["light", "dark", "system"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className="flex h-8 w-8 items-center justify-center text-xs transition-colors"
                  style={{
                    backgroundColor: theme === mode ? "#D4A843" : "transparent",
                    color: theme === mode ? "#0D0D1A" : "var(--brix-fg-muted)",
                  }}
                  title={mode === "system" ? t("settings.themeAuto") : mode === "dark" ? t("settings.themeDark") : t("settings.themeLight")}
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
                </button>
              ))}
            </div>

            {/* Language toggle — i18n not yet implemented, disabled */}
            <button
              aria-disabled="true"
              className="hidden sm:flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-semibold transition-colors opacity-50 cursor-not-allowed"
              style={{ border: "1px solid var(--brix-border)", color: "var(--brix-fg-muted)" }}
              title="Coming soon"
            >
              EN
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative rounded-lg p-2 hover:opacity-80 transition-colors"
                style={{ color: "var(--brix-fg-muted)" }}
                aria-label="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: "#E8632B" }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifPanel && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
                  <div
                    className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl shadow-2xl overflow-hidden"
                    style={{ backgroundColor: "var(--brix-surface)", border: "1px solid var(--brix-border)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--brix-border)" }}>
                      <h3 className="text-sm font-semibold" style={{ color: "var(--brix-fg)" }}>{t("header.notifications")}</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs font-medium hover:underline"
                          style={{ color: "#D4A843" }}
                        >
                          {t("header.markAllRead")}
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--brix-fg-muted)" }}>{t("header.noNotifications")}</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="flex gap-3 px-4 py-3 transition-colors"
                            style={{ opacity: n.read ? 0.6 : 1, borderBottom: "1px solid var(--brix-border)" }}
                          >
                            <div
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs"
                              style={{
                                backgroundColor: n.type === "yield" ? "#2ECC7120" : n.type === "deal" ? "#2B4C7E20" : n.type === "milestone" ? "#D4A84320" : "#4A4A5A20",
                                color: n.type === "yield" ? "#2ECC71" : n.type === "deal" ? "#6b9fd4" : n.type === "milestone" ? "#D4A843" : "#4A4A5A",
                              }}
                            >
                              {n.type === "yield" ? "$" : n.type === "deal" ? "D" : n.type === "milestone" ? "M" : "i"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium" style={{ color: "var(--brix-fg)" }}>{n.title}</p>
                              <p className="mt-0.5 text-xs truncate" style={{ color: "var(--brix-fg-muted)" }}>{n.message}</p>
                              <p className="mt-1 text-[10px]" style={{ color: "var(--brix-fg-muted)", opacity: 0.6 }}>
                                {new Date(n.created_at).toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "short", day: "numeric" })}
                              </p>
                            </div>
                            {!n.read && (
                              <div className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: "#D4A843" }} />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wallet balance */}
            <div
              className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
              style={{ backgroundColor: "var(--brix-surface)" }}
            >
              <svg className="w-4 h-4" style={{ color: "#D4A843" }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.2v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.35c.09 1.71 1.37 2.66 2.85 2.97V19h2.04v-1.68c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.41z" />
              </svg>
              <span style={{ color: "#D4A843" }}>$BRXU</span>
              <span style={{ color: "var(--brix-fg)" }}>{brixBalance.toLocaleString()}</span>
            </div>

            {/* User role badge */}
            {profile?.user_role && (
              <span
                className="hidden sm:inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize"
                style={{ backgroundColor: "#D4A84320", color: "#D4A843" }}
              >
                {profile.user_role}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );

  return appContent;
}
