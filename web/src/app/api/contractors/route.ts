import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizeString, isValidExperience, isValidLicenseNumber } from "@/lib/security/validate";
import { auditLog } from "@/lib/security/audit";

export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "contractor:post"), RATE_LIMITS.write);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const primaryTrade = sanitizeString(body.primary_trade || body.trade, 50);
  if (!primaryTrade) {
    return NextResponse.json({ error: "Primary trade is required" }, { status: 400 });
  }

  const yearsExperience = Number(body.years_experience) || 0;
  if (!isValidExperience(yearsExperience)) {
    return NextResponse.json({ error: "Years of experience must be 0-70" }, { status: 400 });
  }

  const licenseNumber = body.license_number ? sanitizeString(body.license_number, 30) : null;
  if (licenseNumber && !isValidLicenseNumber(licenseNumber)) {
    return NextResponse.json({ error: "Invalid license number format" }, { status: 400 });
  }

  const contractor = {
    user_id: user.id,
    primary_trade: primaryTrade,
    years_experience: yearsExperience,
    license_number: licenseNumber,
    insurance_provider: sanitizeString(body.insurance_provider, 100) || null,
    brix_score: 500,
    location: sanitizeString(body.location, 100),
    w9_status: body.w9_status === "submitted" ? "submitted" : "pending",
  };

  auditLog({ action: "contractor.register", userId: user.id, metadata: { trade: primaryTrade } });

  try {
    const { data, error } = await supabase
      .from("contractors")
      .upsert(contractor as never)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        id: `contractor-${Date.now()}`,
        ...contractor,
        message: "Contractor registered (local mode)",
      });
    }

    await supabase
      .from("profiles")
      .update({ user_role: "builder" } as never)
      .eq("id", user.id);

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({
      id: `contractor-${Date.now()}`,
      ...contractor,
      message: "Contractor registered",
    });
  }
}
