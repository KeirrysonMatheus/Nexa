'use server'

import { signUpFormSchema } from "@/components/signup-form"; 
import { auth } from "@/lib/auth"; 
import { prisma } from "@/app/client";
import { headers } from "next/headers";

export const createUser = async (data: unknown) => {
  
  const result = signUpFormSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      validationErrors: result.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, nickname } = result.data;

  try {
    
    
    
    const existingEmail = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return {
        success: false,
        conflictError: {
          field: "email",
          message: "Este e-mail já está cadastrado em nossa plataforma.",
        },
      };
    }

    
    const existingNickname = await prisma.user.findFirst({
      where: { user_apelido: nickname },
    });

    if (existingNickname) {
      return {
        success: false,
        conflictError: {
          field: "nickname",
          message: "Este apelido já está em uso por outro usuário.",
        },
      };
    }

    
    const session = await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password,
        name,
        user_apelido: nickname, 
      },
      headers: await headers(), 
    });

    return {
      success: true,
      data: session,
    };

  } catch (error: any) {
    console.error("Erro interno no cadastro:", error);
    return {
      success: false,
      serverError: "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
    };
  }
};
