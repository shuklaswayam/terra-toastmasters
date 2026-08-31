import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByUsernameOrEmail, updateServerUser } from "@/lib/server/db";

const resetPasswordSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
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

    // Update password in Supabase and server DB
    const updated = await updateServerUser(user.id, { password: newPassword });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: `Password for ${user.name} has been updated successfully.`,
      user: updated,
    });

    // Set persistent password cookie as an additional fallback
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set(`terra_pwd_${user.id}`, encodeURIComponent(newPassword), {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during password reset." },
      { status: 500 }
    );
  }
}
