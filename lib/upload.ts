import { del, put } from "@vercel/blob"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_PROFILE_IMAGE_SIZE = 2 * 1024 * 1024
const blobToken =
  process.env.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_PUBLIC_READ_WRITE_TOKEN

const IMAGE_FORMATS = [
  {
    contentType: "image/jpeg",
    extension: ".jpg",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    contentType: "image/png",
    extension: ".png",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a,
  },
  {
    contentType: "image/webp",
    extension: ".webp",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP",
  },
  {
    contentType: "image/gif",
    extension: ".gif",
    matches: (bytes: Uint8Array) =>
      bytes.length >= 6 &&
      (String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" ||
        String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a"),
  },
]

export async function saveImageFile(
  file: File,
  folder: "posts" | "users",
  maxFileSize = MAX_FILE_SIZE
): Promise<string> {
  if (file.size === 0 || file.size > maxFileSize) {
    const limitInMb = maxFileSize / (1024 * 1024)
    throw new Error(`A imagem deve ter no máximo ${limitInMb} MB.`)
  }

  if (folder === "users" && file.size > MAX_PROFILE_IMAGE_SIZE) {
    throw new Error("A imagem de perfil deve ter no máximo 2 MB.")
  }

  const fileBytes = new Uint8Array(await file.arrayBuffer())
  const format = IMAGE_FORMATS.find(({ matches }) => matches(fileBytes))

  if (!format) {
    throw new Error("Formato de imagem não suportado.")
  }

  if (process.env.NODE_ENV === "production" && !blobToken) {
    throw new Error("O armazenamento de imagens não está configurado.")
  }

  const filename = `${randomUUID()}${format.extension}`

  if (blobToken) {
    const blob = await put(`images/${folder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: format.contentType,
      token: blobToken,
    })

    return blob.url
  }

  const relativeDirectory = path.join("images", folder)
  const absoluteDirectory = path.join(process.cwd(), "public", relativeDirectory)
  await mkdir(absoluteDirectory, { recursive: true })

  await writeFile(
    path.join(absoluteDirectory, filename),
    fileBytes
  )

  return `/images/${folder}/${filename}`
}

export async function removeStoredFile(filePath: string | null | undefined) {
  if (!filePath) return

  if (filePath.startsWith("https://")) {
    await del(filePath, { token: blobToken }).catch(() => undefined)
    return
  }

  if (!filePath.startsWith("/images/")) return

  const absolutePath = path.join(process.cwd(), "public", filePath)
  await unlink(absolutePath).catch(() => undefined)
}
