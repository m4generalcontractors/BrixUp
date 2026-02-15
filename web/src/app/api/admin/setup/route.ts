import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * POST /api/admin/setup
 *
 * Promotes the currently authenticated user to admin role.
 * Only works if there are NO existing admin users in the database
 * (first-admin bootstrap) OR if the caller is already an admin.
 */
export async function POST() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized — sign in first" }, { status: 401 });
  }

  // Check if any admin already exists
  const { data: existingAdmins } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_role", "admin")
    .limit(1);

  const hasAdmin = existingAdmins && existingAdmins.length > 0;

  // If an admin already exists, only admins can promote
  if (hasAdmin) {
    const { data: callerProfile } = await supabase
      .from("profiles")
      .select("user_role")
      .eq("id", user.id)
      .single();

    const callerRole = (callerProfile as { user_role?: string } | null)?.user_role;
    if (callerRole !== "admin") {
      return NextResponse.json(
        { error: "An admin already exists. Only admins can promote new admins." },
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
      { error: `Failed to promote: ${updateErr.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `User ${user.email} promoted to admin`,
    email: user.email,
    role: "admin",
  });
}
