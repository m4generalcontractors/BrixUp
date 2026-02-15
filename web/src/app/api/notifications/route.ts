import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const sampleNotifications = [
  {
    id: "n1",
    type: "yield",
    title: "Yield Payout Received",
    message: "You received $312 yield from Pine Valley Rd",
    read: false,
    created_at: "2026-02-13T14:30:00Z",
  },
  {
    id: "n2",
    type: "deal",
    title: "New Deal Available",
    message: "567 Elm Creek Way in Charlotte is now open for investment",
    read: false,
    created_at: "2026-02-14T09:00:00Z",
  },
  {
    id: "n3",
    type: "milestone",
    title: "Construction Milestone",
    message: "1847 Oakwood Dr has reached 65% completion",
    read: true,
    created_at: "2026-02-12T16:45:00Z",
  },
  {
    id: "n4",
    type: "system",
    title: "Welcome to BrixUp",
    message: "Your account is set up. Start exploring deals!",
    read: true,
    created_at: "2026-02-10T08:00:00Z",
  },
];

export async function GET() {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json([], { status: 401 });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return NextResponse.json(sampleNotifications);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(sampleNotifications);
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, read } = body;

    if (id === "all") {
      await supabase
        .from("notifications")
        .update({ read: true } as never)
        .eq("user_id", user.id);
    } else if (id) {
      await supabase
        .from("notifications")
        .update({ read: read ?? true } as never)
        .eq("id", id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
