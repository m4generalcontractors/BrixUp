import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";




export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "notif:get"), RATE_LIMITS.standard);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json([], { status: 401 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "notif:patch"), RATE_LIMITS.write);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, read } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    if (id === "all") {
      await supabase
        .from("notifications")
        .update({ read: true } as never)
        .eq("user_id", user.id);
    } else {
      if (id.length > 50) {
        return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
      }
      await supabase
        .from("notifications")
        .update({ read: read ?? true } as never)
        .eq("id", id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
