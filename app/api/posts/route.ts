import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/client"
import { removeStoredFile, saveImageFile } from "@/lib/upload"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const formData = await request.formData()
  const title = formData.get("titulo")
  const content = formData.get("conteudo")
  const image = formData.get("image")

  if (typeof title !== "string" || !title.trim() || title.length > 300) {
    return NextResponse.json({ error: "Título inválido." }, { status: 400 })
  }

  if (typeof content !== "string" || !content.trim() || content.length > 5000) {
    return NextResponse.json({ error: "Conteúdo inválido." }, { status: 400 })
  }

  let imagePath: string | null = null

  try {
    imagePath = image instanceof File && image.size > 0
      ? await saveImageFile(image, "posts")
      : null

    const post = await prisma.post.create({
      data: {
        post_titulo: title.trim(),
        post_conteudo: content.trim(),
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
