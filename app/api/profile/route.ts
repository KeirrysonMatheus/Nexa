import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/app/client"
import { removeStoredFile, saveImageFile } from "@/lib/upload"

export const runtime = "nodejs"

type ProfileResponse = {
  id: string
  name: string
  user_apelido: string
  user_bio: string | null
  image: string | null
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const formData = await request.formData()
  const name = formData.get("name")
  const nickname = formData.get("user_apelido")
  const bio = formData.get("user_bio")
  const image = formData.get("image")

  if (typeof name !== "string" || !name.trim() || name.length > 100) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 400 })
  }

  if (typeof nickname !== "string" || !/^[a-zA-Z0-9_]{3,100}$/.test(nickname)) {
    return NextResponse.json({ error: "Apelido inválido." }, { status: 400 })
  }

  if (typeof bio !== "string" || bio.length > 300) {
    return NextResponse.json({ error: "Bio inválida." }, { status: 400 })
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { image: true },
  })

  if (!currentUser) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 })
  }

  let imagePath = currentUser.image
  let uploadedImagePath: string | null = null

  try {
    if (image instanceof File && image.size > 0) {
      uploadedImagePath = await saveImageFile(image, "users", 2 * 1024 * 1024)
      imagePath = uploadedImagePath
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        user_apelido: nickname.trim(),
        user_bio: bio.trim() || null,
        image: imagePath,
      },
      select: {
        id: true,
        name: true,
        user_apelido: true,
        user_bio: true,
        image: true,
      },
    })

    if (imagePath !== currentUser.image) {
      await removeStoredFile(currentUser.image)
    }

    const response: ProfileResponse = user
    return NextResponse.json(response)
  } catch (error: unknown) {
    if (uploadedImagePath) {
      await removeStoredFile(uploadedImagePath)
    }

    console.error("Erro ao atualizar perfil:", error)

    const isUniqueError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"

    const isImageError =
      error instanceof Error &&
      (error.message.includes("imagem") || error.message.includes("Formato"))

    const errorMessage = error instanceof Error ? error.message : ""
    const isBlobError =
      errorMessage.includes("BLOB") ||
      errorMessage.includes("blob") ||
      errorMessage.includes("token")

    return NextResponse.json(
      {
        error: isImageError
          ? error.message
          : isUniqueError
            ? "Esse apelido já está em uso."
            : isBlobError
              ? "O armazenamento de imagens não está configurado corretamente."
            : "Não foi possível atualizar o perfil.",
      },
      { status: isImageError ? 400 : isUniqueError ? 409 : 500 }
    )
  }
}
