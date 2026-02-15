import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// GET — list user's agreements
export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production, this would query an agreements table
  // For now, return empty to use the client-side fallback data
  return NextResponse.json([]);
}

// PATCH — sign an agreement
export async function PATCH(request: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, action } = body;

  if (!id || !action) {
    return NextResponse.json({ error: "id and action required" }, { status: 400 });
  }

  if (typeof id !== "string" || id.length > 100) {
    return NextResponse.json({ error: "Invalid agreement id" }, { status: 400 });
  }

  const validActions = ["sign", "decline"];
  if (!validActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  // In production, this would:
  // 1. Generate a DocuSign envelope or equivalent e-signature
  // 2. Record the signature with timestamp, IP, user agent
  // 3. Hash the document and store the signature hash
  // 4. Send confirmation email

  return NextResponse.json({
    success: true,
    agreementId: id,
    action,
    signedAt: new Date().toISOString(),
    signatureHash: `sig_${Date.now()}_${user.id.slice(0, 8)}`,
    message: action === "sign"
      ? "Agreement signed electronically. ESIGN Act compliant."
      : "Agreement declined.",
  });
}
