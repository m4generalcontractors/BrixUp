import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import crypto from "crypto";

const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || "";

/**
 * POST /api/kyc/webhook — Sumsub sends verification status updates here
 *
 * Sumsub signs webhooks with HMAC-SHA1 using the secret key.
 * Header: X-Payload-Digest
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  // Verify webhook signature
  const digest = request.headers.get("x-payload-digest") || "";
  if (SUMSUB_SECRET_KEY) {
    const expected = crypto
      .createHmac("sha1", SUMSUB_SECRET_KEY)
      .update(rawBody)
      .digest("hex");
    if (digest !== expected) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: {
    type?: string;
    externalUserId?: string;
    reviewResult?: { reviewAnswer?: string };
    reviewStatus?: string;
    applicantId?: string;
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, externalUserId, reviewResult, reviewStatus } = payload;

  // Only process applicant review events
  if (type !== "applicantReviewed" && type !== "applicantPending") {
    return NextResponse.json({ ok: true });
  }

  if (!externalUserId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  // Map Sumsub status to our KYC status
  let kycStatus: "verified" | "pending" | "rejected" = "pending";
  if (type === "applicantReviewed") {
    if (reviewResult?.reviewAnswer === "GREEN") {
      kycStatus = "verified";
    } else if (reviewResult?.reviewAnswer === "RED") {
      kycStatus = "rejected";
    }
  } else if (reviewStatus === "pending") {
    kycStatus = "pending";
  }

  await supabase
    .from("profiles")
    .update({ kyc_status: kycStatus } as never)
    .eq("id", externalUserId);

  return NextResponse.json({ ok: true, status: kycStatus });
}
