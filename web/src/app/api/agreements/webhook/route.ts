import { NextResponse } from "next/server";
import { createServiceRoleSupabase } from "@/lib/supabase/server";

/**
 * POST /api/agreements/webhook — BoldSign sends signature status updates here
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { event, document } = body as {
    event?: { eventType?: string };
    document?: { documentId?: string };
  };

  const eventType = event?.eventType;
  const documentId = document?.documentId;

  if (!documentId) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceRoleSupabase();

  let status: string | null = null;
  switch (eventType) {
    case "Signed":
    case "Completed":
      status = "signed";
      break;
    case "Declined":
      status = "declined";
      break;
    case "Expired":
      status = "expired";
      break;
    case "Viewed":
      status = "viewed";
      break;
    case "Sent":
      status = "sent";
      break;
    default:
      break;
  }

  if (status) {
    await supabase
      .from("agreements")
      .update({ status } as never)
      .eq("document_id", documentId);
  }

  return NextResponse.json({ ok: true });
}
