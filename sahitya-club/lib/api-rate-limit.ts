import crypto from "node:crypto";
import { getAdminDb } from "@/lib/firebase-admin";

type RateLimitOptions = {
  request: Request;
  namespace: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

function getClientAddress(request: Request) {
  // Vercel supplies the forwarding headers at the edge. Only the first address
  // is used so a caller cannot create unlimited keys by appending addresses.
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    || request.headers.get("x-forwarded-for")
    || "";
  const address = forwarded.split(",")[0]?.trim();
  return address || "unknown";
}

/**
 * Atomic, shared rate limiting for serverless instances. One stable document
 * per namespace + client address avoids relying on per-instance memory.
 */
export async function enforceRateLimit({
  request,
  namespace,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const address = getClientAddress(request);
  const key = crypto.createHash("sha256").update(namespace + ":" + address).digest("hex");
  const ref = getAdminDb().collection("api_rate_limits").doc(key);
  const now = Date.now();

  return getAdminDb().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = snapshot.exists ? snapshot.data() : undefined;
    const windowStart = Number(current?.windowStart || 0);
    const count = Number(current?.count || 0);
    const inWindow = windowStart > 0 && now - windowStart < windowMs;
    const nextCount = inWindow ? count + 1 : 1;
    const activeWindowStart = inWindow ? windowStart : now;
    const resetAt = activeWindowStart + windowMs;

    transaction.set(ref, {
      namespace,
      windowStart: activeWindowStart,
      count: nextCount,
      updatedAt: now,
      expiresAt: new Date(resetAt + windowMs),
    });

    return {
      allowed: nextCount <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil((resetAt - now) / 1000)),
    };
  });
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return Response.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    }
  );
}
