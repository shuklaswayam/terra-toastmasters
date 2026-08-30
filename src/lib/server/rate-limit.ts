// In-memory sliding-window rate limiter for brute force protection

interface RateLimitRecord {
  failedAttempts: number;
  firstFailedAt: number;
  lockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lock on 5 failures

/**
 * Clean up expired entries every 30 minutes
 */
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      if (now - record.firstFailedAt > WINDOW_MS && (!record.lockedUntil || now > record.lockedUntil)) {
        rateLimitStore.delete(ip);
      }
    }
  }, 30 * 60 * 1000);
}

/**
 * Check if the IP is allowed to attempt login
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset window if expired
  if (now - record.firstFailedAt > WINDOW_MS) {
    rateLimitStore.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil(((record.lockedUntil || (record.firstFailedAt + WINDOW_MS)) - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  return { allowed: true, remainingAttempts: remaining };
}

/**
 * Record a failed login attempt for the IP
 */
export function recordFailedAttempt(ip: string): {
  isLocked: boolean;
  remainingAttempts: number;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now - record.firstFailedAt > WINDOW_MS) {
    record = {
      failedAttempts: 1,
      firstFailedAt: now,
    };
    rateLimitStore.set(ip, record);
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS - 1 };
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    rateLimitStore.set(ip, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000),
    };
  }

  rateLimitStore.set(ip, record);
  return {
    isLocked: false,
    remainingAttempts: Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts),
  };
}

/**
 * Reset rate limit record upon successful login
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}
