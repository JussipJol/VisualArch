import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

/**
 * GET /api/auth/sync?redirect=/dashboard
 *
 * Called after OAuth login. Reads the NextAuth JWT (which contains the backend
 * JWT set in the jwt() callback), sets it as an httpOnly va_token cookie,
 * then redirects the user to their destination.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  try {
    const session = await getServerSession(authOptions);

    if (!session?.backendToken) {
      // No backend token — OAuth backend sync may have failed
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("error", "sync_failed");
      return NextResponse.redirect(loginUrl);
    }

    const destination = new URL(redirectTo, req.url);
    const response = NextResponse.redirect(destination);

    // Set the va_token cookie — now this OAuth user is treated exactly
    // like an email/password user for all backend API calls
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    response.cookies.set("va_token", session.backendToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (err) {
    console.error("[sync] Error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
