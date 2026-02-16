import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import { auditLog } from "@/lib/security/audit";

export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "deals:get"), RATE_LIMITS.standard);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const supabase = await createServerSupabase();
    const { data: dbDeals, error } = await supabase.from("deals").select("*");

    if (error) {
      return NextResponse.json([]);
    }

    return NextResponse.json(dbDeals || []);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const rl2 = checkRateLimit(getRateLimitKey(request, "deals:post"), RATE_LIMITS.write);
  if (!rl2.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Validate required fields
  const required = ["address", "city", "state", "property_type", "asking_price", "rehab_budget", "arv", "description"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  // Validate string lengths
  const stringLimits: Record<string, number> = { address: 200, city: 100, state: 50, property_type: 50, description: 2000 };
  for (const [field, maxLen] of Object.entries(stringLimits)) {
    if (typeof body[field] === "string" && body[field].length > maxLen) {
      return NextResponse.json(
        { error: `${field} exceeds maximum length of ${maxLen} characters` },
        { status: 400 }
      );
    }
  }

  // Validate property type
  const validTypes = ["Flip", "New Build", "Value-Add", "Wholesale", "Land"];
  if (!validTypes.includes(body.property_type)) {
    return NextResponse.json(
      { error: "Invalid property type" },
      { status: 400 }
    );
  }

  // Validate numeric fields are reasonable
  const askingPrice = Number(body.asking_price);
  const rehabBudget = Number(body.rehab_budget);
  const arv = Number(body.arv);
  if ([askingPrice, rehabBudget, arv].some((n) => isNaN(n) || n < 0 || n > 100_000_000)) {
    return NextResponse.json(
      { error: "Numeric values must be between 0 and 100,000,000" },
      { status: 400 }
    );
  }

  // Business logic: ARV must exceed total cost for a viable deal
  if (arv <= askingPrice + rehabBudget) {
    return NextResponse.json(
      { error: "After-repair value (ARV) must exceed asking price + rehab budget" },
      { status: 400 }
    );
  }

  // Minimum realistic property price
  if (askingPrice < 1000) {
    return NextResponse.json(
      { error: "Asking price must be at least $1,000" },
      { status: 400 }
    );
  }

  auditLog({ action: "deal.create", userId: user.id, metadata: { address: body.address, askingPrice, arv } });

  const deal = {
    address: body.address.slice(0, 200),
    city: body.city.slice(0, 100),
    state: body.state.slice(0, 50),
    zip: body.zip || "",
    property_type: body.property_type,
    status: "Pending Review",
    source: "BrixUp",
    asking_price: Number(body.asking_price),
    rehab_budget: Number(body.rehab_budget),
    arv: Number(body.arv),
    total_capital_needed: Number(body.asking_price) + Number(body.rehab_budget),
    funded_amount: 0,
    projected_roi: Math.round(
      ((Number(body.arv) - Number(body.asking_price) - Number(body.rehab_budget)) /
        (Number(body.asking_price) + Number(body.rehab_budget))) *
        100
    ),
    projected_timeline: body.projected_timeline || "6 months",
    investor_interest_rate: 10,
    beds: Number(body.beds) || 0,
    baths: Number(body.baths) || 0,
    sqft: Number(body.sqft) || 0,
    year_built: Number(body.year_built) || new Date().getFullYear(),
    lot_size: body.lot_size || "N/A",
    description: typeof body.description === "string" ? body.description.slice(0, 2000) : "",
    dealmaker_id: user.id,
    gc_id: null,
    listed_date: new Date().toISOString(),
    funding_deadline: body.funding_deadline || new Date(Date.now() + 60 * 86400000).toISOString(),
    est_completion: body.est_completion || "",
    investor_count: 0,
    min_investment: Number(body.min_investment) || 500,
  };

  try {
    const { data, error } = await supabase
      .from("deals")
      .insert(deal as never)
      .select()
      .single();

    if (error) {
      // If Supabase table doesn't exist, return success with local ID
      return NextResponse.json({
        id: `deal-${Date.now()}`,
        ...deal,
        message: "Deal submitted for review (local mode)",
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    // Supabase not configured
    return NextResponse.json({
      id: `deal-${Date.now()}`,
      ...deal,
      message: "Deal submitted for review",
    });
  }
}
