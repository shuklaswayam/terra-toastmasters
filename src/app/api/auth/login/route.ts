import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserByUsernameOrEmail } from "@/lib/server/db";
import { verifyPassword, createSessionToken } from "@/lib/server/auth";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "@/lib/server/rate-limit";

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);

    // 1. Check Rate Limit (Max 5 failed attempts per 15 mins)
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts from this IP. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
          retryAfter: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSeconds || 900),
          },
        }
      );
    }

    // 2. Validate Input
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { usernameOrEmail, password } = parsed.data;

    // 3. Lookup User in Server DB
    const user = getUserByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      const failInfo = recordFailedAttempt(ip);
      return NextResponse.json(
        {
          error: "Invalid username, email, or password.",
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Verify Bcrypt Password Hash
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      const failInfo = recordFailedAttempt(ip);
      const attemptWarning =
        failInfo.remainingAttempts > 0
          ? ` (${failInfo.remainingAttempts} attempt${failInfo.remainingAttempts === 1 ? "" : "s"} remaining)`
          : " (Account locked for 15 minutes)";
      return NextResponse.json(
        {
          error: `Invalid credentials.${attemptWarning}`,
          remainingAttempts: failInfo.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 5. Successful Login: Reset IP Rate Limit
    resetRateLimit(ip);

    // 6. Create Encrypted JWT Session Token
    const sessionToken = await createSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const { passwordHash, ...publicUser } = user;

    // 7. Set HTTP-only, secure, SameSite=Lax cookies
    const response = NextResponse.json({
      success: true,
      user: publicUser,
      message: `Welcome back, ${user.name}!`,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const SEVEN_DAYS = 7 * 24 * 60 * 60; // 604800 seconds

    // Secure HTTP-Only JWT Session Cookie
    response.cookies.set("terra_session", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });

    // Session helper cookies for Edge middleware routing and UI state
    response.cookies.set("terra_session_user_id", user.id, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });

    response.cookies.set("terra_role", user.role, {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SEVEN_DAYS,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "An unexpected authentication error occurred." },
      { status: 500 }
    );
  }
}
