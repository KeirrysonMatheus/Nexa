"use server";

import { prisma } from "@/app/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session || !session.user) {
    throw new Error("Usuário não autenticado.");
  }


  return session.user.id;
}


export async function createPost(formData: { titulo: string; conteudo: string; imgUrl?: string }) {
  try {
    const userId = await getAuthenticatedUser();

    await prisma.post.create({
      data: {
        post_titulo: formData.titulo,
        post_conteudo: formData.conteudo,
        post_img_url: formData.imgUrl || null,
        user_id: userId,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, error: "Erro ao criar a publicação" };
  }
}


export async function toggleCurtidaPost(postId: string) {
  try {
    const userId = await getAuthenticatedUser();

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

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao processar curtida:", error);
    return { success: false, error: "Erro ao processar curtida" };
  }
}
