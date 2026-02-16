import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import crypto from "crypto";

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN || "";
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY || "";
const SUMSUB_BASE_URL = "https://api.sumsub.com";
const LEVEL_NAME = "basic-kyc-level";

function createSignature(ts: number, method: string, url: string, body: string = "") {
  const hmac = crypto.createHmac("sha256", SUMSUB_SECRET_KEY);
  hmac.update(ts + method + url + body);
  return hmac.digest("hex");
}

/**
 * POST /api/kyc/token — Generate a Sumsub access token for the WebSDK
 */
export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "kyc:token"), RATE_LIMITS.sensitive);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
    return NextResponse.json({ error: "KYC service not configured" }, { status: 503 });
  }

  try {
    const ts = Math.floor(Date.now() / 1000);
    const method = "POST";
    const url = `/resources/accessTokens?userId=${user.id}&levelName=${LEVEL_NAME}`;
    const signature = createSignature(ts, method, url);

    const response = await fetch(`${SUMSUB_BASE_URL}${url}`, {
      method,
      headers: {
        "Accept": "application/json",
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Sig": signature,
        "X-App-Access-Ts": ts.toString(),
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Sumsub token error:", response.status, errText);
      return NextResponse.json(
        { error: "Failed to generate verification token" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ token: data.token, userId: user.id });
  } catch (err) {
    console.error("Sumsub token generation failed:", err);
    return NextResponse.json(
      { error: "KYC service unavailable" },
      { status: 502 }
    );
  }
}
