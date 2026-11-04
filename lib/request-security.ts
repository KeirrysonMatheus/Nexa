const configuredOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_URL,
  process.env.NEXT_PUBLIC_APP_URL,
]
  .filter((origin): origin is string => Boolean(origin))
  .map((origin) => {
    try {
      return new URL(origin).origin
    } catch {
      return null
    }
  })
  .filter((origin): origin is string => Boolean(origin))

export function isAllowedMutationOrigin(request: Request) {
  const origin = request.headers.get("origin")

  if (!origin) {
    return process.env.NODE_ENV !== "production"
  }

  return configuredOrigins.includes(origin)
}
