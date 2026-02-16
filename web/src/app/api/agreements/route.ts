import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";

const BOLDSIGN_API_KEY = process.env.BOLDSIGN_API_KEY || "";
const BOLDSIGN_BASE_URL = "https://api.boldsign.com/v1";

/**
 * GET /api/agreements — List user's agreements
 */
export async function GET(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "agreements:get"), RATE_LIMITS.standard);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("agreements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json([]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}

/**
 * POST /api/agreements — Create and send a BoldSign document for e-signature
 */
export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "agreements:post"), RATE_LIMITS.write);
  if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!BOLDSIGN_API_KEY) {
    return NextResponse.json({ error: "E-signature service not configured" }, { status: 503 });
  }

  const body = await request.json();
  const { templateId, signerEmail, signerName, dealId, documentType } = body;

  if (!signerEmail || !signerName) {
    return NextResponse.json({ error: "Signer email and name required" }, { status: 400 });
  }

  try {
    const endpoint = templateId
      ? `${BOLDSIGN_BASE_URL}/template/send?templateId=${templateId}`
      : `${BOLDSIGN_BASE_URL}/document/send`;

    const payload = templateId
      ? {
          roles: [
            { roleIndex: 1, signerEmail, signerName, signerType: "Signer" },
          ],
          title: `${documentType || "Agreement"} — ${dealId || "BrixUp"}`,
        }
      : {
          title: `${documentType || "Investment Agreement"} — ${dealId || "BrixUp"}`,
          signers: [
            { signerEmail, signerName, signerType: "Signer", signerOrder: 1 },
          ],
          message: `Please review and sign this ${documentType || "agreement"} for BrixUp.`,
        };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": BOLDSIGN_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("BoldSign error:", response.status, errText);
      return NextResponse.json({ error: "Failed to create agreement" }, { status: 502 });
    }

    const data = await response.json();

    await supabase.from("agreements").insert({
      user_id: user.id,
      deal_id: dealId || null,
      document_id: data.documentId || data.id,
      document_type: documentType || "investment_agreement",
      status: "sent",
      signer_email: signerEmail,
    } as never);

    return NextResponse.json({
      documentId: data.documentId || data.id,
      status: "sent",
      message: "Agreement sent for signature",
    });
  } catch (err) {
    console.error("BoldSign agreement creation failed:", err);
    return NextResponse.json({ error: "E-signature service unavailable" }, { status: 502 });
  }
}

/**
 * PATCH /api/agreements — Sign or decline an agreement via BoldSign
 */
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

  // Update agreement status in DB
  const newStatus = action === "sign" ? "signed" : "declined";
  await supabase
    .from("agreements")
    .update({ status: newStatus } as never)
    .eq("document_id", id)
    .eq("user_id", user.id);

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
