import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/app/client";
// 1. IMPORTANTE: Importar o middleware e o construtor de erros oficiais
import { createAuthMiddleware, APIError } from "better-auth/api"; 

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    advanced: {
        database: {
            generateId: "uuid",
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
            user_datanascimento: {
                type: "date",
                required: true,
                input: true,
                defaultValue: () => new Date(),
                returned: true
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, 
    },
    
    // 🚀 ADICIONE O BLOCO DE HOOKS AQUI
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            // Monitora especificamente a rota de criação de conta por e-mail
            if (ctx.path.startsWith("/sign-up/email")) {
                const body = ctx.body as any;
                const email = body?.email;
                const nickname = body?.user_apelido;

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
