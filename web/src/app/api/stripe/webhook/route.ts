import { NextResponse } from "next/server";
import { createServiceRoleSupabase } from "@/lib/supabase/server";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Lazy-init: Stripe throws at module level if secret key is missing (e.g. during build)
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-01-28.clover",
    });
  }
  return _stripe;
}

/**
 * POST /api/stripe/webhook — Handle Stripe payment events
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    if (WEBHOOK_SECRET) {
      event = getStripe().webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
    } else {
      // Dev fallback: parse without signature verification
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const brxuAmount = parseFloat(session.metadata?.brxu_amount || "0");

    if (userId && brxuAmount > 0) {
      const supabase = createServiceRoleSupabase();

      // Record the purchase transaction
      await supabase.from("transactions").insert({
        user_id: userId,
        type: "buy",
        amount: brxuAmount,
        description: `Purchased ${brxuAmount.toLocaleString()} BRXU via Stripe ($${brxuAmount.toLocaleString()})`,
        from_address: "Stripe Payment",
        to_address: userId,
        status: "confirmed",
      } as never);
    }
  }

  return NextResponse.json({ received: true });
}
