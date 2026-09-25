"use server"

import { prisma } from "@/app/client";
import { revalidatePath } from "next/cache";

export async function toggleCurtidaPost(postId: string, userId: string) {
  try {
    const existentLike = await prisma.post_curtidas.findUnique({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });

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
      ]);
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
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao processar curtida" };
  }
}