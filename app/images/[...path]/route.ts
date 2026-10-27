import { readFile } from "node:fs/promises"
import path from "node:path"

const CONTENT_TYPES: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
}

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: imagePath } = await params

  if (
    imagePath.length !== 2 ||
    !["posts", "users"].includes(imagePath[0]) ||
    imagePath.some((part) => part === ".." || part.includes("/"))
  ) {
    return new Response("Imagem não encontrada.", { status: 404 })
  }

  const filename = imagePath[1]
  const extension = path.extname(filename).toLowerCase()
  const contentType = CONTENT_TYPES[extension]

  if (!contentType) {
    return new Response("Tipo de imagem não suportado.", { status: 404 })
  }

  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "images", imagePath[0], filename)
    )

    return new Response(new Uint8Array(file), {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": contentType,
      },
    })
  } catch {
    return new Response("Imagem não encontrada.", { status: 404 })
  }
}