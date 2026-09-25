import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Altere para "mysql", "mongodb" ou "sqlite" se necessário
    }),
    emailAndPassword: {
        enabled: true
    }
});
