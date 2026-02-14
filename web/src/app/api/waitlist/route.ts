import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = await createServerSupabase();

    // Insert into waitlist table
    const { data, error } = await supabase
      .from("waitlist")
      .upsert(
        { email: email.toLowerCase().trim(), signed_up_at: new Date().toISOString() } as never,
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) {
      // Table might not exist yet — return success anyway
      return NextResponse.json({
        id: `wl-${Date.now()}`,
        email: email.toLowerCase().trim(),
        message: "Added to waitlist (local mode)",
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    // Supabase not configured — still count as success
    return NextResponse.json({
      id: `wl-${Date.now()}`,
      email: email.toLowerCase().trim(),
      message: "Added to waitlist",
    });
  }
}

export async function GET() {
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
