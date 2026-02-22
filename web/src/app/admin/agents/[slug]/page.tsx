"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";

interface AgentDetail {
  slug: string;
  name: string;
  department: string;
  slackChannel: string;
  status: "online" | "offline" | "error";
  uptime?: number;
  lastHeartbeat?: string;
  memoryUsage?: number;
  activeTask?: string;
}

interface TaskResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskInput, setTaskInput] = useState("");
  const [taskResult, setTaskResult] = useState<TaskResult | null>(null);
  const [sending, setSending] = useState(false);

  const fetchAgent = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/${slug}`);
      const data = await res.json();
      setAgent(data);
    } catch {
      // fetch failed
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchAgent();
    const interval = setInterval(fetchAgent, 15_000);
    return () => clearInterval(interval);
  }, [fetchAgent]);

  async function sendTask() {
    if (!taskInput.trim()) return;
    setSending(true);
    setTaskResult(null);
    try {
      const res = await fetch(`/api/agents/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: taskInput }),
      });
      const data = await res.json();
      setTaskResult({ ok: res.ok, data });
      if (res.ok) setTaskInput("");
    } catch (err) {
      setTaskResult({
        ok: false,
        error: err instanceof Error ? err.message : "Failed to send task",
      });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
      </div>
    );
  }

  const isOnline = agent?.status === "online";
  const statusColor = isOnline ? "#22C55E" : "#EF4444";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: "var(--brix-fg-muted)" }}>
        <Link href="/admin/agents" className="hover:text-white transition-colors">
          OPS Agents
        </Link>
        <span>/</span>
        <span className="text-white">{agent?.name ?? slug}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{agent?.name ?? slug}</h1>
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              style={{
                backgroundColor: `${statusColor}15`,
                color: statusColor,
              }}
            >
              <span
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: statusColor }}
              />
              {agent?.status ?? "unknown"}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--brix-fg-muted)" }}>
            {agent?.department} &middot; Slack: {agent?.slackChannel}
          </p>
        </div>
        <button
          onClick={fetchAgent}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
        >
          Refresh
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Status", value: agent?.status ?? "--" },
          {
            label: "Uptime",
            value: agent?.uptime
              ? `${Math.floor(agent.uptime / 3600)}h ${Math.floor((agent.uptime % 3600) / 60)}m`
              : "--",
          },
          {
            label: "Memory",
            value: agent?.memoryUsage
              ? `${(agent.memoryUsage / 1024 / 1024).toFixed(1)} MB`
              : "--",
          },
          { label: "Active Task", value: agent?.activeTask ?? "Idle" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl p-4 border border-[var(--brix-border)]"
            style={{ backgroundColor: "var(--brix-surface)" }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--brix-fg-muted)" }}>
              {metric.label}
            </p>
            <p className="text-lg font-semibold text-white mt-1 truncate">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Send Task */}
      <div
        className="rounded-xl p-5 border border-[var(--brix-border)]"
        style={{ backgroundColor: "var(--brix-surface)" }}
      >
        <h2 className="text-base font-semibold text-white mb-3">Send Task</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !sending) sendTask();
            }}
            placeholder={`Send a task to ${agent?.name ?? slug}...`}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 border border-[var(--brix-border)] focus:border-[#D4A843] focus:outline-none transition-colors"
            style={{ backgroundColor: "var(--brix-bg)" }}
          />
          <button
            onClick={sendTask}
            disabled={sending || !taskInput.trim()}
            className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#E8632B", color: "#FFFFFF" }}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Task Result */}
        {taskResult && (
          <div
            className="mt-3 rounded-lg p-3 text-sm"
            style={{
              backgroundColor: taskResult.ok ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: taskResult.ok ? "#22C55E" : "#EF4444",
            }}
          >
            {taskResult.ok ? (
              <pre className="whitespace-pre-wrap text-xs">{JSON.stringify(taskResult.data, null, 2)}</pre>
            ) : (
              <p>{taskResult.error ?? "Task failed"}</p>
            )}
          </div>
        )}
      </div>

      {/* Agent Info */}
      <div
        className="rounded-xl p-5 border border-[var(--brix-border)]"
        style={{ backgroundColor: "var(--brix-surface)" }}
      >
        <h2 className="text-base font-semibold text-white mb-3">Agent Configuration</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { dt: "Slug", dd: slug },
            { dt: "Department", dd: agent?.department ?? "--" },
            { dt: "Slack Channel", dd: agent?.slackChannel ?? "--" },
            { dt: "Gateway Port", dd: getPort(slug).toString() },
            { dt: "Runtime", dd: "ZeroClaw (Rust)" },
            { dt: "AI Model", dd: "claude-sonnet-4-20250514" },
            { dt: "Heartbeat", dd: "Every 30 minutes" },
            { dt: "Identity", dd: "AIEOS v1.1 JSON" },
          ].map((item) => (
            <div key={item.dt} className="flex justify-between py-1.5 border-b border-white/5">
              <dt style={{ color: "var(--brix-fg-muted)" }}>{item.dt}</dt>
              <dd className="text-white font-medium">{item.dd}</dd>
            </div>
          ))}
        </dl>
      </div>
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
