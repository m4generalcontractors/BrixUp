import { NextResponse } from "next/server";
import { getAgentBaseUrl, getAgentConfig } from "@/lib/zeroclaw/config";

/**
 * GET /api/agents/[slug] — Get agent health status
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const config = getAgentConfig(slug);
  if (!config) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  const baseUrl = getAgentBaseUrl(slug);
  if (!baseUrl) {
    return NextResponse.json({ error: "Agent not configured" }, { status: 500 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${baseUrl}/health`, { signal: controller.signal });
    clearTimeout(timeout);

    const health = await res.json();
    return NextResponse.json({
      slug: config.slug,
      name: config.name,
      department: config.department,
      slackChannel: config.slackChannel,
      status: "online",
      ...health,
    });
  } catch {
    return NextResponse.json({
      slug: config.slug,
      name: config.name,
      department: config.department,
      status: "offline",
    });
  }
}

/**
 * POST /api/agents/[slug] — Send a task to a specific agent
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const config = getAgentConfig(slug);
  if (!config) {
    return NextResponse.json({ error: "Unknown agent" }, { status: 404 });
  }

  const baseUrl = getAgentBaseUrl(slug);
  if (!baseUrl) {
    return NextResponse.json({ error: "Agent not configured" }, { status: 500 });
  }

  const body = await req.json();
  const tokenKey = `ZEROCLAW_TOKEN_${slug.toUpperCase().replace(/-/g, "_")}`;
  const token = process.env[tokenKey];

  try {
    const res = await fetch(`${baseUrl}/webhook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: body.message || body.task }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Connection failed" },
      { status: 502 },
    );
  }
}
