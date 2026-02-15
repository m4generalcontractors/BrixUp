import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

// Whitelist of allowed redirect paths after auth
const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/marketplace",
  "/builder",
  "/dealfinder",
  "/wallet",
  "/settings",
  "/verify",
  "/agreements",
  "/admin",
];

function sanitizeRedirectPath(rawPath: string): string {
  // Must start with single slash, no protocol/double-slash
  if (!rawPath || !rawPath.startsWith("/") || rawPath.startsWith("//")) {
    return "/dashboard";
  }
  // Strip any query/hash to check path only
  const pathname = rawPath.split("?")[0].split("#")[0];
  // Must match a known protected path
  const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
  return isAllowed ? rawPath : "/dashboard";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeRedirectPath(searchParams.get("next") ?? "/dashboard");

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
