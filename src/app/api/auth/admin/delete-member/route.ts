import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/server/auth";
import { deleteServerUser } from "@/lib/server/db";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("terra_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized session." }, { status: 401 });
    }

    const payload = await verifySessionToken(sessionCookie);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Admin authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    await deleteServerUser(userId);

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected server error occurred." }, { status: 500 });
  }
}
