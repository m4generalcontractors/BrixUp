import { AGENT_REGISTRY, type AgentConfig } from "./config";

export interface AgentHealthStatus {
  slug: string;
  name: string;
  department: string;
  status: "online" | "offline" | "error";
  uptime?: number;
  lastHeartbeat?: string;
  memoryUsage?: number;
  activeTask?: string;
  error?: string;
}

export interface SystemStatus {
  timestamp: string;
  agents: AgentHealthStatus[];
  totalOnline: number;
  totalOffline: number;
}

async function checkAgentHealth(
  agent: AgentConfig,
): Promise<AgentHealthStatus> {
  const host = process.env.ZEROCLAW_HOST ?? "127.0.0.1";
  const url = `http://${host}:${agent.port}/health`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        slug: agent.slug,
        name: agent.name,
        department: agent.department,
        status: "error",
        error: `HTTP ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      slug: agent.slug,
      name: agent.name,
      department: agent.department,
      status: "online",
      uptime: data.uptime,
      lastHeartbeat: data.last_heartbeat,
      memoryUsage: data.memory_bytes,
      activeTask: data.active_task,
    };
  } catch {
    return {
      slug: agent.slug,
      name: agent.name,
      department: agent.department,
      status: "offline",
    };
  }
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const results = await Promise.allSettled(
    AGENT_REGISTRY.map((agent) => checkAgentHealth(agent)),
  );

  const agents = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { slug: "unknown", name: "Unknown", department: "Unknown", status: "error" as const },
  );

  return {
    timestamp: new Date().toISOString(),
    agents,
    totalOnline: agents.filter((a) => a.status === "online").length,
    totalOffline: agents.filter((a) => a.status !== "online").length,
  };
}

export async function sendAgentTask(
  slug: string,
  message: string,
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const agent = AGENT_REGISTRY.find((a) => a.slug === slug);
  if (!agent) return { ok: false, error: "Unknown agent" };

  const host = process.env.ZEROCLAW_HOST ?? "127.0.0.1";
  const tokenKey = `ZEROCLAW_TOKEN_${slug.toUpperCase().replace(/-/g, "_")}`;
  const token = process.env[tokenKey];

  try {
    const res = await fetch(`http://${host}:${agent.port}/webhook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}
