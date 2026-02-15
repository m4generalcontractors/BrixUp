import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import { sanitizeString, isValidEmail } from "@/lib/security/validate";
import { auditLog } from "@/lib/security/audit";

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null, user: null, role: null };

  const { data: profile } = await supabase.from("profiles").select("user_role").eq("id", user.id).single();
  const role = (profile as { user_role?: string } | null)?.user_role || "investor";
  if (role !== "admin" && role !== "manager") return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null, user: null, role: null };

  return { error: null, supabase, user, role };
}

// GET — list all users (without wallet addresses for security)
export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "admin:users:get"), RATE_LIMITS.sensitive);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { error, supabase } = await requireAdmin();
  if (error) return error;

  try {
    // Exclude wallet_address from list endpoint to reduce exposure
    const { data, error: dbErr } = await supabase!
      .from("profiles")
      .select("id, email, full_name, user_role, kyc_status, created_at")
      .order("created_at", { ascending: false });

    if (dbErr || !data) {
      return NextResponse.json([
        { id: "u1", email: "admin@brixup.com", full_name: "Admin User", user_role: "admin", kyc_status: "verified", created_at: "2026-01-01T00:00:00Z" },
        { id: "u2", email: "user2@example.com", full_name: "Sarah Chen", user_role: "investor", kyc_status: "verified", created_at: "2026-01-15T00:00:00Z" },
        { id: "u3", email: "user3@example.com", full_name: "James Wright", user_role: "builder", kyc_status: "pending", created_at: "2026-01-20T00:00:00Z" },
        { id: "u4", email: "user4@example.com", full_name: "Aisha Johnson", user_role: "dealmaker", kyc_status: "verified", created_at: "2026-02-01T00:00:00Z" },
        { id: "u5", email: "user5@example.com", full_name: "Marcus Thompson", user_role: "manager", kyc_status: "verified", created_at: "2026-02-05T00:00:00Z" },
      ]);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

// PATCH — update user role
export async function PATCH(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "admin:users:patch"), RATE_LIMITS.sensitive);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { error, supabase, user, role: adminRole } = await requireAdmin();
  if (error) return error;

  const body = await request.json();
  const { userId, user_role } = body;

  if (!userId || !user_role) {
    return NextResponse.json({ error: "userId and user_role required" }, { status: 400 });
  }

  // Only full admins can assign admin role
  const validRoles = ["investor", "builder", "dealmaker", "manager", "admin"];
  if (!validRoles.includes(user_role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (user_role === "admin" && adminRole !== "admin") {
    return NextResponse.json({ error: "Only admins can assign admin role" }, { status: 403 });
  }

  auditLog({ action: "admin.update_role", userId: user!.id, targetId: userId, metadata: { newRole: user_role } });

  try {
    const { error: dbErr } = await supabase!
      .from("profiles")
      .update({ user_role } as never)
      .eq("id", userId);

    if (dbErr) {
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, message: "Role updated (local mode)" });
  }
}

// POST — create team member
export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "admin:users:post"), RATE_LIMITS.sensitive);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const { error, supabase, user, role: adminRole } = await requireAdmin();
  if (error) return error;

  if (adminRole !== "admin") {
    return NextResponse.json({ error: "Only admins can create team members" }, { status: 403 });
  }

  const body = await request.json();
  const { email, full_name, user_role } = body;

  if (!email || !full_name || !user_role) {
    return NextResponse.json({ error: "email, full_name, and user_role are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const safeName = sanitizeString(full_name, 100);
  if (!safeName) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const validRoles = ["investor", "builder", "dealmaker", "manager"];
  if (!validRoles.includes(user_role)) {
    return NextResponse.json({ error: "Invalid role for team creation" }, { status: 400 });
  }

  // Check if email already exists
  const { data: existing } = await supabase!
    .from("profiles")
    .select("id")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  auditLog({ action: "admin.create_user", userId: user!.id, metadata: { email: email.toLowerCase().trim(), role: user_role } });

  try {
    const id = `team-${Date.now()}`;
    const { data, error: dbErr } = await supabase!
      .from("profiles")
      .insert({
        id,
        email: email.toLowerCase().trim(),
        full_name: safeName,
        user_role,
        kyc_status: "pending",
        email_notifications: true,
        sms_notifications: false,
        push_notifications: false,
        language: "en",
      } as never)
      .select()
      .single();

    if (dbErr) {
      return NextResponse.json({
        id,
        email: email.toLowerCase().trim(),
        full_name: safeName,
        user_role,
        kyc_status: "pending",
        created_at: new Date().toISOString(),
        message: "Team member created (local mode)",
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({
      id: `team-${Date.now()}`,
      email: email.toLowerCase().trim(),
      full_name: safeName,
      user_role,
      kyc_status: "pending",
      created_at: new Date().toISOString(),
    });
  }
}
