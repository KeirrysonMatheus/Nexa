import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/app/client";
// 1. IMPORTANTE: Importar o middleware e o construtor de erros oficiais
import { createAuthMiddleware, APIError } from "better-auth/api"; 

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()

async function createSocialNickname(email: string) {
    const emailName = email.split("@")[0] ?? ""
    const normalizedName = emailName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_]/g, "")
        .toLowerCase()
    const base = `google_${(normalizedName || "usuario").slice(0, 80)}`

    let nickname = base
    let suffix = 1
    while (await prisma.user.findUnique({ where: { user_apelido: nickname } })) {
        nickname = `${base.slice(0, 99 - String(suffix).length)}_${suffix}`
        suffix += 1
    }

    return nickname
}

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    advanced: {
        database: {
            generateId: "uuid",
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 300,
        },
    },
    user: {
        additionalFields: {
            user_apelido: {
                type: 'string',
                required: true,
                input: true,
                defaultValue: "", 
                returned: true
            },
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, 
    },
    ...(googleClientId && googleClientSecret
        ? {
              socialProviders: {
                  google: {
                      clientId: googleClientId,
                      clientSecret: googleClientSecret,
                  },
              },
          }
        : {}),
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const userData = { ...user }

                    if (!userData.user_apelido && userData.email) {
                        userData.user_apelido = await createSocialNickname(userData.email)
                    }

                    return { data: userData }
                },
            },
        },
    },
    
    // 🚀 ADICIONE O BLOCO DE HOOKS AQUI
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Monitora especificamente a rota de criação de conta por e-mail
            if (ctx.path.startsWith("/sign-up/email")) {
                const body = ctx.body as Record<string, unknown> | undefined;
                const email = typeof body?.email === "string" ? body.email : undefined;
                const nickname = typeof body?.user_apelido === "string" ? body.user_apelido : undefined;

                if (nickname && !/^[a-zA-Z0-9_]{3,100}$/.test(nickname.trim())) {
                    throw new APIError("BAD_REQUEST", {
                        message: "O apelido deve conter apenas letras, números e underscore, sem espaços.",
                        code: "INVALID_NICKNAME",
                    });
                }

                // Validação 1: E-mail duplicado
                if (email) {
                    const existingEmail = await prisma.user.findUnique({
                        where: { email },
                    });
                    if (existingEmail) {
                        // Lançar um APIError interrompe o fluxo de cadastro imediatamente
                        throw new APIError("BAD_REQUEST", {
                            message: "Este e-mail já está cadastrado em nossa plataforma.",
                            // O campo 'code' será mapeado como 'error.code' no frontend
                            code: "EMAIL_ALREADY_EXISTS", 
                        });
                    }
                }

                // Validação 2: Apelido duplicado
                if (nickname) {
                    const existingNickname = await prisma.user.findFirst({
                        where: { user_apelido: nickname },
                    });
                    if (existingNickname) {
                        throw new APIError("BAD_REQUEST", {
                            message: "Este apelido já está em uso por outro usuário.",
                            code: "NICKNAME_ALREADY_EXISTS",
                        });
                    }
                }
            }
            
            // Permite que a requisição continue normalmente caso passe nas validações
            return; 
        }),
    },
});
