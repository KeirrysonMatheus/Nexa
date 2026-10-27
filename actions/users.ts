"use server"

import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { prisma } from "@/app/client"
async function getAuthenticatedUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user?.id) {
    throw new Error("Não autorizado. Você precisa estar logado.")
  }

  return session.user.id
}

export async function getUserProfile(userApelido: string) {
  if (!userApelido) {
    return null
  }

  const currentUserId = await getAuthenticatedUserId()

  const user = await prisma.user.findUnique({
    where: { user_apelido: userApelido },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      user_apelido: true,
      user_bio: true,
      user_genero: true,
      user_datanascimento: true,
      user_nseguidores: true,
      user_nseguindo: true,
      createdAt: true,
      _count: {
        select: { post: true },
      },
    },
  })

  if (!user) {
    return null
  }

  const follow = await prisma.seguidores.findUnique({
    where: {
      seguidor_id_seguido_id: {
        seguidor_id: currentUserId,
        seguido_id: user.id,
      },
    },
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    user_apelido: user.user_apelido,
    user_bio: user.user_bio,
    user_genero: user.user_genero,
    user_datanascimento: user.user_datanascimento.toISOString(),
    user_nseguidores: user.user_nseguidores,
    user_nseguindo: user.user_nseguindo,
    createdAt: user.createdAt.toISOString(),
    postCount: user._count.post,
    jaSeguindo: Boolean(follow),
    isOwnProfile: currentUserId === user.id,
  }
}

export async function toggleFollowAction(targetUserId: string) {
  const currentUserId = await getAuthenticatedUserId()

  if (currentUserId === targetUserId) {
    throw new Error("Você não pode seguir a si mesmo.")
  }

  const jaSeguindo = await prisma.seguidores.findUnique({
    where: {
      seguidor_id_seguido_id: {
        seguidor_id: currentUserId,
        seguido_id: targetUserId,
      },
    },
  })

  await prisma.$transaction(async (tx) => {
    if (jaSeguindo) {
      await tx.seguidores.delete({
        where: {
          seguidor_id_seguido_id: {
            seguidor_id: currentUserId,
            seguido_id: targetUserId,
          },
        },
      })

      await tx.user.update({
        where: { id: currentUserId },
        data: { user_nseguindo: { decrement: 1 } },
      })

      await tx.user.update({
        where: { id: targetUserId },
        data: { user_nseguidores: { decrement: 1 } },
      })
    } else {
      await tx.seguidores.create({
        data: {
          seguidor_id: currentUserId,
          seguido_id: targetUserId,
        },
      })

      await tx.user.update({
        where: { id: currentUserId },
        data: { user_nseguindo: { increment: 1 } },
      })

      await tx.user.update({
        where: { id: targetUserId },
        data: { user_nseguidores: { increment: 1 } },
      })
    }
  })

  revalidatePath("/dashboard")
  const [targetUser, currentUser] = await Promise.all([
    prisma.user.findUnique({
      where: { id: targetUserId },
      select: { user_apelido: true },
    }),
    prisma.user.findUnique({
      where: { id: currentUserId },
      select: { user_apelido: true },
    }),
  ])

  if (targetUser) revalidatePath(`/users/${targetUser.user_apelido}`)
  if (currentUser) revalidatePath(`/users/${currentUser.user_apelido}`)

  return { success: true, following: !jaSeguindo }
}
