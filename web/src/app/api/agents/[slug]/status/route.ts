import { NextResponse } from "next/server";
import { getAgentConfig } from "@/lib/zeroclaw/config";

/**
 * POST /api/agents/[slug]/status — Receive status updates from agents
 * Called by m4-dashboard-update.sh shared tool
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

  // Verify dashboard API key
  const authHeader = req.headers.get("Authorization");
  const expectedKey = process.env.DASHBOARD_API_KEY;
  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();

  // In production, this would write to Supabase or a real-time channel.
  // For now, log and acknowledge.
  console.log(`[${slug}] Status update:`, JSON.stringify(payload).slice(0, 200));

  return NextResponse.json({ received: true, slug, timestamp: new Date().toISOString() });
}
