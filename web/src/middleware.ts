import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Block access to protected routes if Supabase is not configured
  if (!supabaseUrl || !supabaseKey || supabaseUrl === "https://your-project.supabase.co") {
    // Gate-protect /admin/login even when Supabase is not configured
    if (request.nextUrl.pathname === "/admin/login") {
      const gateSecret = process.env.ADMIN_GATE_SECRET;
      const gateParam = request.nextUrl.searchParams.get("gate");
      const gateCookie = request.cookies.get("admin_gate")?.value;
      const gateValid =
        !gateSecret ||
        gateParam === gateSecret ||
        gateCookie === gateSecret;
      if (!gateValid) {
        return new NextResponse("Not Found", { status: 404 });
      }
      if (gateParam && gateSecret && gateParam === gateSecret) {
        const url = request.nextUrl.clone();
        url.searchParams.delete("gate");
        const response = NextResponse.redirect(url);
        response.cookies.set("admin_gate", gateSecret, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          path: "/admin",
        });
        return response;
      }
      return NextResponse.next();
    }
    const protectedPrefixes = ["/dashboard", "/marketplace", "/builder", "/dealfinder", "/wallet", "/settings", "/verify", "/agreements", "/admin"];
    const isProtectedRoute = protectedPrefixes.some(
      (prefix) => request.nextUrl.pathname === prefix || request.nextUrl.pathname.startsWith(prefix + "/")
    );
    if (isProtectedRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — redirect to /login if not authenticated
  const protectedPaths = [
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

  const isProtected = protectedPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(path + "/")
  );

  // Allow /admin/login only with valid gate token or session cookie
  if (request.nextUrl.pathname === "/admin/login") {
    const gateSecret = process.env.ADMIN_GATE_SECRET;
    const gateParam = request.nextUrl.searchParams.get("gate");
    const gateCookie = request.cookies.get("admin_gate")?.value;

    // Validate gate: must have correct query param or existing session cookie
    const gateValid =
      (gateSecret && gateParam === gateSecret) ||
      (gateSecret && gateCookie === gateSecret);

    if (gateSecret && !gateValid) {
      // Return generic 404 — don't reveal the admin login exists
      return new NextResponse("Not Found", { status: 404 });
    }

    // If gate param provided, set session cookie and redirect to clean URL
    if (gateParam && gateSecret && gateParam === gateSecret) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("gate");
      const response = NextResponse.redirect(url);
      response.cookies.set("admin_gate", gateSecret, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/admin",
      });
      return response;
    }

    // If already logged in as admin, redirect to /admin/tokens
    if (user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_role")
          .eq("id", user.id)
          .single();
        const role = (profile as { user_role?: string } | null)?.user_role || "investor";
        if (role === "admin" || role === "manager") {
          const url = request.nextUrl.clone();
          url.pathname = "/admin/tokens";
          return NextResponse.redirect(url);
        }
      } catch {
        // Profile table may not exist — allow through
      }
    }
    return supabaseResponse;
  }

  if (isProtected && !user) {
    // Redirect admin routes to admin login, others to regular login
    const url = request.nextUrl.clone();
    if (request.nextUrl.pathname.startsWith("/admin")) {
      url.pathname = "/admin/login";
    } else {
      url.pathname = "/login";
      url.searchParams.set("next", request.nextUrl.pathname);
    }
    return NextResponse.redirect(url);
  }

  // Role-based route protection — prevent cross-role access
  if (user && isProtected) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_role")
        .eq("id", user.id)
        .single();

      const role = (profile as { user_role?: string } | null)?.user_role || "investor";

      // Admin routes — only admin/manager can access; send others to admin login
      if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin" && role !== "manager") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }

      if (request.nextUrl.pathname.startsWith("/builder") && role !== "builder" && role !== "admin" && role !== "manager") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }

      if (request.nextUrl.pathname.startsWith("/dealfinder") && role !== "dealmaker" && role !== "admin" && role !== "manager") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } catch {
      // Profile table may not exist — allow through
    }
  }

  // If logged in and visiting /login, redirect to dashboard
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
