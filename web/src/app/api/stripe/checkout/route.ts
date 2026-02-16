import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/security/rate-limit";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-01-28.clover",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * POST /api/stripe/checkout — Create a Stripe Checkout Session for BRXU purchase
 */
export async function POST(request: Request) {
  const rl = checkRateLimit(getRateLimitKey(request, "stripe:checkout"), RATE_LIMITS.write);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payment service not configured" }, { status: 503 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { amount } = body;

  // Validate amount
  const usdAmount = parseFloat(amount);
  if (!usdAmount || usdAmount < 10 || usdAmount > 100000) {
    return NextResponse.json(
      { error: "Amount must be between $10 and $100,000" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BRXU Tokens",
              description: `Purchase ${usdAmount.toLocaleString()} BRXU tokens at $1.00/token`,
              images: [`${APP_URL}/icon.png`],
            },
            unit_amount: Math.round(usdAmount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${APP_URL}/wallet?purchase=success&amount=${usdAmount}`,
      cancel_url: `${APP_URL}/wallet?purchase=cancelled`,
      metadata: {
        user_id: user.id,
        brxu_amount: usdAmount.toString(),
        email: user.email || "",
      },
      customer_email: user.email || undefined,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 502 }
    );
  }
}
