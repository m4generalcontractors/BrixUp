"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface AgentStatus {
  slug: string;
  name: string;
  department: string;
  status: "online" | "offline" | "error" | "not_configured";
  uptime?: number;
  lastHeartbeat?: string;
}

interface SystemHealth {
  timestamp: string;
  totalAgents: number;
  online: number;
  offline: number;
  agents: AgentStatus[];
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: "rgba(34,197,94,0.1)", text: "#22C55E", dot: "#22C55E" },
  offline: { bg: "rgba(239,68,68,0.1)", text: "#EF4444", dot: "#EF4444" },
  error: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B", dot: "#F59E0B" },
  not_configured: { bg: "rgba(107,114,128,0.1)", text: "#6B7280", dot: "#6B7280" },
};

function formatUptime(seconds?: number): string {
  if (!seconds) return "--";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

export default function AgentsPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/agents/heartbeat");
      const data = await res.json();
      setHealth(data);
    } catch {
      // Health check failed
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  async function triggerHeartbeat() {
    setTriggering(true);
    try {
      await fetch("/api/agents/heartbeat", { method: "POST" });
      await fetchHealth();
    } finally {
      setTriggering(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">OPS Agents</h1>
          <p className="text-sm mt-1" style={{ color: "var(--brix-fg-muted)" }}>
            M4 OPS Commander x ZeroClaw Agent Runtime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerHeartbeat}
            disabled={triggering}
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
          >
            {triggering ? "Triggering..." : "Trigger Heartbeat"}
          </button>
          <button
            onClick={fetchHealth}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl p-5 border border-[var(--brix-border)]" style={{ backgroundColor: "var(--brix-surface)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--brix-fg-muted)" }}>Total Agents</p>
          <p className="text-3xl font-bold text-white mt-1">{health?.totalAgents ?? 0}</p>
        </div>
        <div className="rounded-xl p-5 border border-[var(--brix-border)]" style={{ backgroundColor: "var(--brix-surface)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#22C55E" }}>Online</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#22C55E" }}>{health?.online ?? 0}</p>
        </div>
        <div className="rounded-xl p-5 border border-[var(--brix-border)]" style={{ backgroundColor: "var(--brix-surface)" }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#EF4444" }}>Offline</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#EF4444" }}>{health?.offline ?? 0}</p>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {health?.agents.map((agent) => {
          const colors = STATUS_COLORS[agent.status] ?? STATUS_COLORS.error;
          return (
            <Link
              key={agent.slug}
              href={`/admin/agents/${agent.slug}`}
              className="rounded-xl p-5 border border-[var(--brix-border)] hover:border-white/20 transition-colors group"
              style={{ backgroundColor: "var(--brix-surface)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-[#D4A843] transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--brix-fg-muted)" }}>
                    {agent.department}
                  </p>
                </div>
                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.dot }} />
                  {agent.status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: "var(--brix-fg-muted)" }}>
                <span>Port: {getPort(agent.slug)}</span>
                <span>Uptime: {formatUptime(agent.uptime)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Last updated */}
      {health?.timestamp && (
        <p className="text-xs text-center" style={{ color: "var(--brix-fg-muted)" }}>
          Last checked: {new Date(health.timestamp).toLocaleString()}
        </p>
      )}
    </div>
  );
}

function getPort(slug: string): number {
  const ports: Record<string, number> = {
    "ops-commander": 3001, "marketing-command": 3002, "sales-command": 3003,
    "estimating-command": 3004, "precon-command": 3005, "pm-command": 3006,
    "accounting-command": 3007, "document-command": 3008, "permit-command": 3009,
    "hr-command": 3010, "investor-command": 3011,
  };
  return ports[slug] ?? 0;
}
