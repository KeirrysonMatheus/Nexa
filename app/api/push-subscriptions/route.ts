import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/client"
import { isAllowedMutationOrigin } from "@/lib/request-security"
import { enforceRequestRateLimit } from "@/lib/rate-limit"

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(512),
  p256dh: z.string().min(1).max(255),
  auth: z.string().min(1).max(255),
})

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 })
  }

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const rateLimit = await enforceRequestRateLimit("push-subscription:create", {
    limit: 20,
    windowMs: 60_000,
  })
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const parsed = subscriptionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 })
  }

  try {
    await prisma.push_subscription.upsert({
      where: { endpoint: parsed.data.endpoint },
      create: {
        user_id: session.user.id,
        endpoint: parsed.data.endpoint,
        p256dh: parsed.data.p256dh,
        auth: parsed.data.auth,
      },
      update: {
        user_id: session.user.id,
        p256dh: parsed.data.p256dh,
        auth: parsed.data.auth,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    console.error("Erro ao salvar assinatura push:", error)
    return NextResponse.json(
      { error: "Não foi possível salvar a assinatura push." },
      { status: 500 },
    )
  }
}
