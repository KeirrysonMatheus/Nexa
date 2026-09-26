import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/app/client";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", 
    }),
    user: {
        additionalFields: {
            user_apelido: {
                type: 'string',
                required: true,
                defaultValue: "", // Alterado de null para string para respeitar o required: true
                returned: true
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, 
    },
});
