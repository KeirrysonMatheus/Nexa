"use server"

import { prisma } from "@/app/client"
import { getAuthenticatedUserId } from "@/actions/users"

export async function searchContent(term: string) {
  await getAuthenticatedUserId()
  const query = term.trim()

  if (!query) return { users: [], posts: [] }

  const [users, posts] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { user_apelido: { contains: query, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, image: true, user_apelido: true },
      take: 20,
      orderBy: { name: "asc" },
    }),
    prisma.post.findMany({
      where: {
        OR: [
          { post_titulo: { contains: query, mode: "insensitive" } },
          { post_conteudo: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        post_id: true,
        post_titulo: true,
        post_conteudo: true,
        user: { select: { name: true, user_apelido: true } },
      },
      take: 20,
      orderBy: { post_data: "desc" },
    }),
  ])

  return { users, posts }
}
