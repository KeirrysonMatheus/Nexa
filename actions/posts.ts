"use server"

import { prisma } from "@/app/client"
import { getAuthenticatedUserId } from "@/actions/users"
import { cacheLife, cacheTag, updateTag } from "next/cache"
import type { ActionResult, PostsPage } from "@/types/post"
import { consumeRateLimit } from "@/lib/rate-limit"
import { enqueueOneSignalNotification } from "@/lib/onesignal"
import { PAGE_SIZE, feedPostInclude, mapFeedPost } from "@/lib/posts/feed"

export async function getPosts(options?: {
  cursor?: string | null
  userId?: string
}): Promise<PostsPage> {
  const currentUserId = await getAuthenticatedUserId()
  return getCachedPosts(options?.cursor || null, options?.userId, currentUserId)
}

async function getCachedPosts(
  cursor: string | null,
  userId: string | undefined,
  currentUserId: string,
) {
  "use cache"
  cacheLife("minutes")
  cacheTag("posts")
  if (userId) cacheTag(`user-posts:${userId}`)

  const posts = await prisma.post.findMany({
    take: PAGE_SIZE + 1,
    ...(cursor
      ? {
          skip: 1,
          cursor: { post_id: cursor },
        }
      : {}),
    ...(userId ? { where: { user_id: userId } } : {}),
    include: feedPostInclude,
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
  const mapped = page.map((post) => mapFeedPost(post, followingSet, currentUserId))

  return {
    posts: mapped,
    nextCursor: hasMore ? mapped[mapped.length - 1]?.post_id ?? null : null,
    hasMore,
  }
}

export async function toggleCurtidaPost(postId: string): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId()
    const rateLimit = await consumeRateLimit(`posts:like:user:${userId}`, {
      limit: 60,
      windowMs: 60_000,
    })
    if (!rateLimit.allowed) {
      return { success: false, error: "Muitas tentativas. Tente novamente mais tarde." }
    }

    const [existentLike, post] = await Promise.all([
      prisma.post_curtidas.findUnique({
        where: {
          post_id_user_id: {
            post_id: postId,
            user_id: userId,
          },
        },
      }),
      prisma.post.findUnique({
        where: { post_id: postId },
        select: {
          user_id: true,
          post_titulo: true,
        },
      }),
    ])

    if (!post) return { success: false, error: "Publicação não encontrada." }

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
      await prisma.$transaction(async (transaction) => {
        await transaction.post_curtidas.create({
          data: {
            post_id: postId,
            user_id: userId,
          },
        })
        await transaction.post.update({
          where: { post_id: postId },
          data: { post_ncurtidas: { increment: 1 } },
        })

        if (post.user_id !== userId) {
          await transaction.notification.create({
            data: {
              recipient_id: post.user_id,
              actor_id: userId,
              type: "POST_LIKE",
              post_id: postId,
            },
          })
        }
      })

      if (post.user_id !== userId) {
        const actor = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        })

        if (actor) {
          enqueueOneSignalNotification(
            {
              externalIds: [post.user_id],
              title: "Nova curtida",
              message: `${actor.name} curtiu seu post "${post.post_titulo}".`,
              url: `/dashboard`,
            },
            "curtida",
          )
        }
      }
    }

    updateTag("posts")
    return { success: true }
  } catch (error) {
    console.error("Erro ao processar curtida:", error)
    return { success: false, error: "Erro ao processar curtida" }
  }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    const userId = await getAuthenticatedUserId()
    const post = await prisma.post.findUnique({
      where: { post_id: postId },
      select: { user_id: true, user: { select: { user_apelido: true } } },
    })

    if (!post) return { success: false, error: "Post não encontrado." }
    if (post.user_id !== userId) {
      return { success: false, error: "Você não pode remover este post." }
    }

    await prisma.post.delete({ where: { post_id: postId } })
    updateTag("posts")
    updateTag(`user-posts:${post.user.user_apelido}`)
    return { success: true }
  } catch (error) {
    console.error("Erro ao remover post:", error)
    return { success: false, error: "Não foi possível remover o post." }
  }
}
