import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (user && req.nextUrl.pathname == "/") {
    return NextResponse.redirect(new URL("/dashboard/requests", req.url));
  }

  if (user) {
    const { data: userProfile } = await supabase
      .from("users")
      .select("*, role(*)")
      .eq("id", user.id)
      .single();

    if (req.nextUrl.pathname !== "/dashboard/verified") {
      if (!userProfile) {
        await supabase.from("users").upsert({
          id: user.id,
          email: user.email,
        });
        return NextResponse.redirect(new URL("/dashboard/verified", req.url));
      }

      if (!userProfile.verified) {
        return NextResponse.redirect(new URL("/dashboard/verified", req.url));
      }
    }

    if (req.nextUrl.pathname !== "/dashboard/unauthorized") {
      // check role
      const permissionLevel = userProfile.role
        ? userProfile.role.permission_level
        : null;

      const userAllowed = [
        "/dashboard/requests",
        "/dashboard/account",
      ];
      const moderatorAllowed = [
        "/dashboard/verified",
        "/dashboard/requests",
        "/dashboard/approvals",
        "/dashboard/account",
      ];
      const adminAllowed = [
        "/dashboard",
        "/dashboard/campuses",
        "/dashboard/groups",
        "/dashboard/requests",
        "/dashboard/approvals",
        "/dashboard/update-types",
        "/dashboard/account",
        "/dashboard/users",
        "/dashboard/groups",
      ];

      let allowed = ["/dashboard/verified", "/dashboard/unauthorized"];

      if (permissionLevel) {
        if (permissionLevel == "ADMIN") allowed = adminAllowed;
        if (permissionLevel == "USER") allowed = userAllowed;
        if (permissionLevel == "MODERATOR") allowed = moderatorAllowed;
      }

      let allowedFlag = false;

      for (const allowedPath of allowed) {
        if (req.nextUrl.pathname.includes(allowedPath)) {
          allowedFlag = true;
        }
      }

      if (!allowedFlag) {
        return NextResponse.redirect(
          new URL("/dashboard/unauthorized", req.url)
        );
      }
    }
  }

  return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: ["/", "/dashboard/:path*", "/dashboard/:path*/:path*"],
};
