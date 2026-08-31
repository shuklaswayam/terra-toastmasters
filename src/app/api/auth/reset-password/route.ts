import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByUsernameOrEmail, updateServerUser } from "@/lib/server/db";
import { verifySessionToken } from "@/lib/server/auth";

const resetPasswordSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Admin Permissions (Only Admin can reset member passwords)
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

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Access denied. Only Club Admin (TM Swayam) has authorization to reset member passwords." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { usernameOrEmail, newPassword } = parsed.data;
    const user = await getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this username or email." },
        { status: 404 }
      );
    }

    // Update password hash in Supabase and server DB via Bcrypt
    const updated = await updateServerUser(user.id, { password: newPassword });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Password for ${user.name} has been reset successfully by Admin.`,
      user: updated,
    });

    // Delete any legacy plaintext cookies
    response.cookies.delete(`terra_pwd_${user.id}`);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during password reset." },
      { status: 500 }
    );
  }
}
