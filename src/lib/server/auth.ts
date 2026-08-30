import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const BCRYPT_SALT_ROUNDS = 12;
const JWT_SECRET_STRING = process.env.SESSION_SECRET || "terra-toastmasters-session-secret-key-2026-secure-auth";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface SessionPayload {
  userId: string;
  role: "admin" | "officer" | "member";
  email: string;
  name: string;
}

/**
 * Hash a plaintext password with bcrypt (12 salt rounds)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign and create an encrypted JWT session token valid for 7 days
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Verify and decode an encrypted JWT session token
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as "admin" | "officer" | "member",
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
