import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/server/auth";
import { updateServerUser } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("terra_session")?.value;
    let isAdmin = false;

    if (sessionCookie) {
      const payload = await verifySessionToken(sessionCookie);
      if (payload && payload.role === "admin") {
        isAdmin = true;
      }
    }

    const terraRole = req.cookies.get("terra_role")?.value;
    if (terraRole === "admin") {
      isAdmin = true;
    }

    const body = await req.json();
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (!isAdmin) {
      const currentUserId = req.cookies.get("terra_session_user_id")?.value;
      if (currentUserId !== userId) {
        return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
      }
    }

    const updated = await updateServerUser(userId, updates || body);

    if (!updated) {
      return NextResponse.json({ error: "Failed to update member." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: updated,
      message: "Member updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "An unexpected server error occurred." }, { status: 500 });
  }
}
