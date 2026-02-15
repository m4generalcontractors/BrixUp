import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizeString, isValidEthAddress } from "@/lib/security/validate";

export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "profile:get"), RATE_LIMITS.standard);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "profile:put"), RATE_LIMITS.write);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await request.json();

  // Only allow updating specific fields — NEVER allow user_role, kyc_status, id, email
  const allowedFields = [
    "full_name",
    "phone",
    "avatar_url",
    "email_notifications",
    "sms_notifications",
    "push_notifications",
    "language",
    "wallet_address",
  ];

  // Explicitly deny dangerous fields
  const deniedFields = ["user_role", "kyc_status", "id", "email"];
  for (const field of deniedFields) {
    if (field in updates) {
      return NextResponse.json({ error: `Cannot modify ${field}` }, { status: 403 });
    }
  }

  const safeUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) {
      if (key === "wallet_address" && updates[key]) {
        if (typeof updates[key] !== "string" || !isValidEthAddress(updates[key])) {
          return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
        }
        safeUpdates[key] = updates[key];
      } else if (key === "full_name" || key === "phone" || key === "avatar_url" || key === "language") {
        safeUpdates[key] = sanitizeString(updates[key], key === "full_name" ? 100 : 200);
      } else {
        safeUpdates[key] = Boolean(updates[key]);
      }
    }
  }

  safeUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("profiles")
    .update(safeUpdates as never)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json(data);
}
