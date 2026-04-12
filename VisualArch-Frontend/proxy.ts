import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

const COOKIE_NAME = "va_token";
const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/project", "/settings", "/workspace"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  let isAuthenticated = false;

  // ── 1. Check JWT cookie (email/password flow) ───────────
  const jwtToken = request.cookies.get(COOKIE_NAME)?.value;
  if (jwtToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
      await jwtVerify(jwtToken, secret);
      isAuthenticated = true;
    } catch {
      // Token invalid or expired
    }
  }

  // ── 2. Check NextAuth session (OAuth flow) ──────────────
  if (!isAuthenticated) {
    try {
      const nextAuthToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      });
      if (nextAuthToken) {
        isAuthenticated = true;
      }
    } catch {
      // NextAuth session check failed
    }
  }

  // ── Route guards ────────────────────────────────────────
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/project/:path*",
    "/workspace/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
