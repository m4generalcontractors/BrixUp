import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), role: null };

  const { data: profile } = await supabase.from("profiles").select("user_role").eq("id", user.id).single();
  const role = (profile as { user_role?: string } | null)?.user_role || "investor";
  if (role !== "admin") return { error: NextResponse.json({ error: "Forbidden — admin only" }, { status: 403 }), role: null };

  return { error: null, role };
}

// POST — save platform settings (admin only)
export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await request.json();

  // Validate expected fields
  const allowedKeys = [
    "platformName", "tagline", "minInvestment", "maxInvestment",
    "platformFeePercent", "dealmakerCommission", "stakingAPY",
    "kycRequired", "newDealApprovalRequired", "drawApprovalRequired",
    "maintenanceMode", "allowNewSignups", "requireEmailVerification",
    "network", "rpcUrl", "brixTokenAddress", "factoryAddress", "stakingAddress",
  ];

  const settings: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in body) {
      settings[key] = body[key];
    }
  }

  // In production, persist to a platform_settings table or KV store
  // For now, acknowledge success
  return NextResponse.json({ success: true, settings });
}
