import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// Whitelisted emails that can claim the initial admin role.
// This prevents race conditions where any first user becomes admin.
const ALLOWED_BOOTSTRAP_EMAILS = [
  "mph.cordero@gmail.com",
];

/**
 * POST /api/admin/setup
 *
 * Promotes the currently authenticated user to admin role.
 * First-admin bootstrap: only whitelisted emails can self-promote when
 * no admin exists yet. After that, only existing admins can promote.
 */
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if any admin already exists
  const { data: existingAdmins } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_role", "admin")
    .limit(1);

  const hasAdmin = existingAdmins && existingAdmins.length > 0;

  if (hasAdmin) {
    // Only existing admins can promote new admins
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", user.id)
      .single();

    const callerRole = (callerProfile as { user_role?: string } | null)?.user_role;
    if (callerRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  } else {
    // First-admin bootstrap — only whitelisted emails allowed
    const email = user.email?.toLowerCase();
    if (!email || !ALLOWED_BOOTSTRAP_EMAILS.includes(email)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  }

  // Promote the current user to admin
  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ user_role: "admin", kyc_status: "verified", updated_at: new Date().toISOString() } as never)
    .eq("id", user.id);

  if (updateErr) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Admin role assigned",
    role: "admin",
  });
}
