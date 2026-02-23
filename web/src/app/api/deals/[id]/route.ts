import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getDealById } from "@/lib/deals-data";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkRateLimit(getRateLimitKey(request, "deals:get-one"), RATE_LIMITS.standard);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;

  // Try Supabase first, fall back to sample data
  try {
    const supabase = await createServerSupabase();
    const { data: dbDeal } = await supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .single();

    if (dbDeal) {
      return NextResponse.json(dbDeal);
    }
  } catch {
    // Supabase not configured or deal not found in DB, use sample data
  }

  const deal = getDealById(id);
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}
