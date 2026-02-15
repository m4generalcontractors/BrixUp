import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };

  const { data: profile } = await supabase.from("profiles").select("user_role").eq("id", user.id).single();
  const role = (profile as { user_role?: string } | null)?.user_role || "investor";
  if (role !== "admin" && role !== "manager") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };

  return { error: null, supabase };
}

// GET — list draw requests
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  // In production, this would query a draw_requests table
  // For now return empty to let the frontend use its sample data
  return NextResponse.json([]);
}

// PATCH — approve, reject, or mark paid
export async function PATCH(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { drawId, status } = body;

  if (!drawId || !status) {
    return NextResponse.json({ error: "drawId and status are required" }, { status: 400 });
  }

  const validStatuses = ["pending", "approved", "rejected", "paid"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // In production, update the draw_requests table
  return NextResponse.json({ success: true, drawId, status });
}
