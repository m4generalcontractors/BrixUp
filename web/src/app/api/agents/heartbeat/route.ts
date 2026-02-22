import { NextResponse } from "next/server";
import { AGENT_REGISTRY, getAgentBaseUrl } from "@/lib/zeroclaw/config";

/**
 * POST /api/agents/heartbeat — Trigger heartbeat on all agents
 */
export async function POST() {
  const results = await Promise.allSettled(
    AGENT_REGISTRY.map(async (agent) => {
      const baseUrl = getAgentBaseUrl(agent.slug);
      if (!baseUrl) return { slug: agent.slug, status: "no_url" };

      const tokenKey = `ZEROCLAW_TOKEN_${agent.slug.toUpperCase().replace(/-/g, "_")}`;
      const token = process.env[tokenKey];

      try {
        const res = await fetch(`${baseUrl}/webhook`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "HEARTBEAT: Execute scheduled tasks now.",
          }),
        });

        return { slug: agent.slug, status: res.ok ? "ok" : "error", httpStatus: res.status };
      } catch {
        return { slug: agent.slug, status: "offline" };
      }
    }),
  );

  const agentResults = results.map((r) =>
    r.status === "fulfilled" ? r.value : { slug: "unknown", status: "error" },
  );

  return NextResponse.json({
    triggered: agentResults.length,
    timestamp: new Date().toISOString(),
    results: agentResults,
  });
}

/**
 * GET /api/agents/heartbeat — Get system-wide health status
 */
export async function GET() {
  const results = await Promise.allSettled(
    AGENT_REGISTRY.map(async (agent) => {
      const baseUrl = getAgentBaseUrl(agent.slug);
      if (!baseUrl)
        return { slug: agent.slug, name: agent.name, status: "not_configured" as const };

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${baseUrl}/health`, { signal: controller.signal });
        clearTimeout(timeout);

        if (!res.ok) {
          return { slug: agent.slug, name: agent.name, status: "error" as const };
        }

        const data = await res.json();
        return {
          slug: agent.slug,
          name: agent.name,
          department: agent.department,
          status: "online" as const,
          ...data,
        };
      } catch {
        return { slug: agent.slug, name: agent.name, status: "offline" as const };
      }
    }),
  );

  const agents = results.map((r) =>
    r.status === "fulfilled"
      ? r.value
      : { slug: "unknown", name: "Unknown", status: "error" as const },
  );

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalAgents: AGENT_REGISTRY.length,
    online: agents.filter((a) => a.status === "online").length,
    offline: agents.filter((a) => a.status !== "online").length,
    agents,
  });
}
