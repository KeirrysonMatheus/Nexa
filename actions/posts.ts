"use server"

import { prisma } from "@/app/client"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import type { FeedPost, PostsPage } from "@/types/post"

const PAGE_SIZE = 10

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    throw new Error("Usuário não autenticado.")
  }

  return session.user.id
}

function mapPost(
  post: {
    post_id: string
    post_titulo: string
    post_conteudo: string
    post_image_path: string | null
    post_data: Date
    post_ncurtidas: number
    user: {
      id: string
      name: string
      email: string
      image: string | null
      user_apelido: string
    }
    post_comentarios: { comentario: string }[]
    postCurtidas: { post_id: string; user_id: string }[]
  },
  followingSet: Set<string>
): FeedPost {
  return {
    post_id: post.post_id,
    post_titulo: post.post_titulo,
    post_conteudo: post.post_conteudo,
    post_image_url: post.post_image_path || undefined,
    post_data: post.post_data.toISOString(),
    post_ncurtidas: post.post_ncurtidas,
    post_comentarios: post.post_comentarios
      .map((comentario) => comentario.comentario)
      .join("\n"),
    user: {
      id: post.user.id,
      name: post.user.name,
      email: post.user.email,
      image: post.user.image,
      user_apelido: post.user.user_apelido,
      jaSeguindo: followingSet.has(post.user.id),
    },
    postCurtidas: post.postCurtidas,
  }
}
export async function getPosts(options?: {
  cursor?: string | null
  userId?: string
}): Promise<PostsPage> {
  const currentUserId = await getAuthenticatedUser()
  const cursor = options?.cursor || undefined

  const posts = await prisma.post.findMany({
    take: PAGE_SIZE + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { post_id: cursor },
        }
      : {}),
    ...(options?.userId
      ? {
          where: { user_id: options.userId },
        }
      : {}),
    include: {
      user: true,
      post_comentarios: true,
      postCurtidas: true,
    },
    orderBy: [{ post_data: "desc" }, { post_id: "desc" }],
  })

  const hasMore = posts.length > PAGE_SIZE
  const page = hasMore ? posts.slice(0, PAGE_SIZE) : posts

  const authorIds = [...new Set(page.map((post) => post.user.id))]
  const follows =
    authorIds.length > 0
      ? await prisma.seguidores.findMany({
          where: {
            seguidor_id: currentUserId,
            seguido_id: { in: authorIds },
          },
          select: { seguido_id: true },
        })
      : []

  const followingSet = new Set(follows.map((follow) => follow.seguido_id))
  const mapped = page.map((post) => mapPost(post, followingSet))

  return {
    posts: mapped,
    nextCursor: hasMore ? mapped[mapped.length - 1]?.post_id ?? null : null,
    hasMore,
  }
}
export async function createPost(formData: {
  titulo: string
  conteudo: string
}) {
  try {
    const userId = await getAuthenticatedUser()

    await prisma.post.create({
      data: {
        post_titulo: formData.titulo,
        post_conteudo: formData.conteudo,
        post_image_path: null,
        user_id: userId,
      },
    })

    revalidatePath("/dashboard")

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { user_apelido: true },
    })

    if (user) {
      revalidatePath(`/users/${user.user_apelido}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return { success: false, error: "Erro ao criar a publicação" }
  }
}

export async function toggleCurtidaPost(postId: string) {
  try {
    const userId = await getAuthenticatedUser()

    const existentLike = await prisma.post_curtidas.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    })

    if (existentLike) {
      await prisma.$transaction([
        prisma.post_curtidas.delete({
          where: {
            post_id_user_id: {
              post_id: postId,
              user_id: userId,
            },
          },
        }),
        prisma.post.update({
          where: { post_id: postId },
          data: { post_ncurtidas: { decrement: 1 } },
        }),
      ])
    } else {
      await prisma.$transaction([
        prisma.post_curtidas.create({
          data: {
            post_id: postId,
            user_id: userId,
          },
        }),
        prisma.post.update({
          where: { post_id: postId },
          data: { post_ncurtidas: { increment: 1 } },
        }),
      ])
    }

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao processar curtida:", error)
    return { success: false, error: "Erro ao processar curtida" }
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getAuthenticatedUser()
    const post = await prisma.post.findUnique({
      where: { post_id: postId },
      select: { user_id: true, user: { select: { user_apelido: true } } },
    })

    if (!post) return { success: false, error: "Post não encontrado." }
    if (post.user_id !== userId) return { success: false, error: "Você não pode remover este post." }

    await prisma.post.delete({ where: { post_id: postId } })
    revalidatePath("/dashboard")
    revalidatePath(`/users/${post.user.user_apelido}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao remover post:", error)
    return { success: false, error: "Não foi possível remover o post." }
  }
}

