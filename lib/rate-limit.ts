import { headers } from "next/headers"
import { prisma } from "@/app/client"

type RateLimitOptions = {
  limit: number
  windowMs: number
}

export async function getRequestIdentity() {
  const requestHeaders = await headers()
  const forwardedFor = requestHeaders.get("x-forwarded-for")
  return forwardedFor?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip") || "unknown"
}

export async function consumeRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions
) {
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)

  const result = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
    INSERT INTO "rate_limit_bucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, ${resetAt}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "rate_limit_bucket"."resetAt" <= ${now} THEN 1
        ELSE "rate_limit_bucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "rate_limit_bucket"."resetAt" <= ${now} THEN ${resetAt}
        ELSE "rate_limit_bucket"."resetAt"
      END,
      "updatedAt" = ${now}
    RETURNING "count", "resetAt"
  `

  const bucket = result[0]
  return {
    allowed: Boolean(bucket && bucket.count <= limit),
    retryAfterSeconds: bucket
      ? Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000))
      : Math.ceil(windowMs / 1000),
  }
}

export async function enforceRequestRateLimit(
  scope: string,
  options: RateLimitOptions
) {
  const identity = await getRequestIdentity()
  return consumeRateLimit(`${scope}:${identity}`, options)
}