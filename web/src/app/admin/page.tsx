"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PlatformStats {
  totalUsers: number;
  activeDeals: number;
  pendingDeals: number;
  pendingDraws: number;
  totalInvested: number;
  totalBrixSupply: number;
  newUsersToday: number;
  waitlistCount: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeDeals: 0,
    pendingDeals: 0,
    pendingDraws: 0,
    totalInvested: 0,
    totalBrixSupply: 0,
    newUsersToday: 0,
    waitlistCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch { /* use defaults */ }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "#2B4C7E", href: "/admin/users" },
    { label: "Active Deals", value: stats.activeDeals, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", color: "#2ECC71", href: "/admin/deals" },
    { label: "Pending Approval", value: stats.pendingDeals, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "#D4A843", href: "/admin/deals" },
    { label: "Pending Draws", value: stats.pendingDraws, icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", color: "#E8632B", href: "/admin/draws" },
    { label: "Total Invested", value: `$${stats.totalInvested.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "#2ECC71", href: "#" },
    { label: "$BRIX Supply", value: stats.totalBrixSupply.toLocaleString(), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "#D4A843", href: "/admin/tokens" },
    { label: "New Users Today", value: stats.newUsersToday, icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z", color: "#2B4C7E", href: "/admin/users" },
    { label: "Waitlist", value: stats.waitlistCount, icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", color: "#E8632B", href: "#" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#E8632B]" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: "#4A4A5A" }}>Platform overview and quick actions</p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-white/10 p-5 transition-colors hover:border-white/20"
            style={{ backgroundColor: "#1A1A2E" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium" style={{ color: "#4A4A5A" }}>{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: card.color + "20" }}>
                <svg className="w-5 h-5" style={{ color: card.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-white/10 p-5" style={{ backgroundColor: "#1A1A2E" }}>
        <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Review Pending Deals", href: "/admin/deals", count: stats.pendingDeals, color: "#D4A843" },
            { label: "Review Draw Requests", href: "/admin/draws", count: stats.pendingDraws, color: "#E8632B" },
            { label: "Manage Users", href: "/admin/users", count: stats.totalUsers, color: "#2B4C7E" },
            { label: "Token Controls", href: "/admin/tokens", count: null, color: "#2ECC71" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between rounded-lg border border-white/5 p-4 transition-colors hover:bg-white/5"
            >
              <div>
                <p className="text-sm font-medium text-white">{action.label}</p>
                {action.count !== null && (
                  <p className="mt-0.5 text-xs" style={{ color: "#4A4A5A" }}>{action.count} items</p>
                )}
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: action.color + "20" }}>
                <svg className="w-4 h-4" style={{ color: action.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
