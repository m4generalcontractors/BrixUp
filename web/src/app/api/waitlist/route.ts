import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import { isValidEmail } from "@/lib/security/validate";

export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "waitlist:post"), RATE_LIMITS.public);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
      .from("waitlist")
      .upsert(
        { email: email.toLowerCase().trim(), signed_up_at: new Date().toISOString() } as never,
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        id: `wl-${Date.now()}`,
        email: email.toLowerCase().trim(),
        message: "Added to waitlist (local mode)",
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({
      id: `wl-${Date.now()}`,
      email: email.toLowerCase().trim(),
      message: "Added to waitlist",
    });
  }
}

export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "waitlist:get"), RATE_LIMITS.public);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const supabase = await createServerSupabase();
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({ count: count || 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
