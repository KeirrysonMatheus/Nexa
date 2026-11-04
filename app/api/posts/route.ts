import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/client"
import { removeStoredFile, saveImageFile } from "@/lib/upload"
import { isAllowedMutationOrigin } from "@/lib/request-security"
import { enforceRequestRateLimit } from "@/lib/rate-limit"
import { postInputSchema } from "@/types/schemas"

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 })
  }

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const rateLimit = await enforceRequestRateLimit("posts:create", { limit: 20, windowMs: 60_000 })
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Muitas tentativas. Tente novamente mais tarde." }, { status: 429 })
  }

  const formData = await request.formData()
  const title = formData.get("titulo")
  const content = formData.get("conteudo")
  const image = formData.get("image")

  const parsedInput = postInputSchema.safeParse({ titulo: title, conteudo: content })
  if (!parsedInput.success) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })

  let imagePath: string | null = null

  try {
    imagePath = image instanceof File && image.size > 0
      ? await saveImageFile(image, "posts")
      : null

    const post = await prisma.post.create({
      data: {
        post_titulo: parsedInput.data.titulo,
        post_conteudo: parsedInput.data.conteudo,
        post_image_path: imagePath,
        user_id: session.user.id,
      },
      select: { post_id: true },
    })

    return NextResponse.json({ postId: post.post_id }, { status: 201 })
  } catch (error) {
    await removeStoredFile(imagePath)
    if (error instanceof Error && (error.message.includes("imagem") || error.message.includes("Formato"))) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error("Erro ao criar post:", error)
    return NextResponse.json({ error: "Não foi possível criar o post." }, { status: 500 })
  }
}
