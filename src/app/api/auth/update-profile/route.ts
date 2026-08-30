import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/server/auth";
import { updateServerUser } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("terra_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const payload = await verifySessionToken(sessionCookie);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session token." }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateServerUser(payload.userId, body);

    if (!updated) {
      return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
