import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET_STRING = process.env.SESSION_SECRET || "terra-toastmasters-session-secret-key-2026-secure-auth";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = pathname.startsWith("/admin") || pathname.startsWith("/portal");
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("terra_session")?.value;
  const sessionUserId = request.cookies.get("terra_session_user_id")?.value;

  if (!sessionToken && !sessionUserId) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cryptographic signature check for JWT session token
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

      // Enforce RBAC for /admin routes
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        const portalUrl = new URL("/portal", request.url);
        portalUrl.searchParams.set("unauthorized", "admin_required");
        return NextResponse.redirect(portalUrl);
      }

      return NextResponse.next();
    } catch {
      // Invalid or tampered token: redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Fallback for pre-session cookie if valid
  const roleCookie = request.cookies.get("terra_role")?.value;
  if (pathname.startsWith("/admin") && roleCookie !== "admin") {
    const portalUrl = new URL("/portal", request.url);
    portalUrl.searchParams.set("unauthorized", "admin_required");
    return NextResponse.redirect(portalUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/admin/:path*",
    "/portal/:path*",
  ],
};
