import { del, put } from "@vercel/blob"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}

export async function saveImageFile(
  file: File,
  folder: "posts" | "users",
  maxFileSize = MAX_FILE_SIZE
): Promise<string> {
  const extension = MIME_EXTENSIONS[file.type]

  if (!extension) {
    throw new Error("Formato de imagem não suportado.")
  }

  if (file.size === 0 || file.size > maxFileSize) {
    const limitInMb = maxFileSize / (1024 * 1024)
    throw new Error(`A imagem deve ter no máximo ${limitInMb} MB.`)
  }

  if (folder === "users" && file.size > MAX_PROFILE_IMAGE_SIZE) {
    throw new Error("A imagem de perfil deve ter no máximo 2 MB.")
  }

  const filename = `${randomUUID()}${extension}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`images/${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
    })

    return blob.url
  }

  const relativeDirectory = path.join("images", folder)
  const absoluteDirectory = path.join(process.cwd(), "public", relativeDirectory)
  await mkdir(absoluteDirectory, { recursive: true })

  await writeFile(
    path.join(absoluteDirectory, filename),
    Buffer.from(await file.arrayBuffer())
  )

  return `/images/${folder}/${filename}`
}

export async function removeStoredFile(filePath: string | null | undefined) {
  if (!filePath) return

  if (filePath.startsWith("https://")) {
    await del(filePath).catch(() => undefined)
    return
  }

  if (!filePath.startsWith("/images/")) return

  const absolutePath = path.join(process.cwd(), "public", filePath)
  await unlink(absolutePath).catch(() => undefined)
}
