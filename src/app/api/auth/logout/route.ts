import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  const isProduction = process.env.NODE_ENV === "production";

  // Expire all auth & session cookies
  response.cookies.set("terra_session", "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("terra_session_user_id", "", {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("terra_role", "", {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
