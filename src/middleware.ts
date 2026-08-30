import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET_STRING = process.env.SESSION_SECRET || "terra-toastmasters-session-secret-key-2026-secure-auth";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/auth/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  // Allow auth API routes unconditionally
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("terra_session")?.value;
  const sessionUserId = request.cookies.get("terra_session_user_id")?.value;

  // 1. If user has NO session token or user cookie
  if (!sessionToken && !sessionUserId) {
    if (isLoginPage) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/auth/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Cryptographic JWT verification if token is present
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);

      // If already authenticated and visiting login page, redirect to dashboard
      if (isLoginPage) {
        return NextResponse.redirect(new URL("/portal", request.url));
      }

      // If authenticated and visiting root /, redirect to dashboard
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }

      // Enforce RBAC for /admin routes (must be admin role)
      if (pathname.startsWith("/admin") && payload.role !== "admin") {
        const portalUrl = new URL("/portal", request.url);
        portalUrl.searchParams.set("unauthorized", "admin_required");
        return NextResponse.redirect(portalUrl);
      }

      return NextResponse.next();
    } catch {
      // Invalid or tampered token: invalidate and force login
      if (isLoginPage) {
        return NextResponse.next();
      }
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("terra_session");
      response.cookies.delete("terra_session_user_id");
      response.cookies.delete("terra_role");
      return response;
    }
  }

  // 3. Fallback for session user ID cookie
  if (isLoginPage) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

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
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public assets (images, icons)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
