import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/server/auth";
import { getUserById } from "@/lib/server/db";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("terra_session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "No active session." },
        { status: 401 }
      );
    }

    const payload = await verifySessionToken(sessionCookie);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired session token." },
        { status: 401 }
      );
    }

    const user = getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: "User associated with this session no longer exists." },
        { status: 401 }
      );
    }

    const { passwordHash, ...publicUser } = user;
    return NextResponse.json({
      success: true,
      user: publicUser,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate session." },
      { status: 500 }
    );
  }
}
