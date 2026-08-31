import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, createSessionToken } from "@/lib/server/auth";
import { updateServerUser } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("terra_session")?.value;
    let userId: string | null = null;

    if (sessionCookie) {
      const payload = await verifySessionToken(sessionCookie);
      if (payload) {
        userId = payload.userId;
      }
    }

    const body = await req.json();

    // Fallback to userId cookie or body userId
    if (!userId) {
      userId = req.cookies.get("terra_session_user_id")?.value || body.userId || null;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    if (body.password && typeof body.password === "string" && body.password.trim().length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const updated = await updateServerUser(userId, body);

    if (!updated) {
      return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: updated,
      message: "Profile updated successfully.",
    });

    const isProduction = process.env.NODE_ENV === "production";
    const SEVEN_DAYS = 7 * 24 * 60 * 60;

    // Issue updated JWT session token
    const freshToken = await createSessionToken({
      userId: updated.id,
      role: updated.role,
      email: updated.email,
      name: updated.name,
    });

    response.cookies.set("terra_session", freshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });

    response.cookies.set("terra_session_user_id", updated.id, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });

    // Delete any legacy plaintext cookies
    response.cookies.delete(`terra_pwd_${updated.id}`);

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An unexpected server error occurred." }, { status: 500 });
  }
}
