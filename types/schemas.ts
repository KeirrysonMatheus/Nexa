import z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." })
});

export const signUpFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." })
    .regex(/^[\p{L}\p{M}]+(?:[ '\u002D][\p{L}\p{M}]+)*$/u, {
      message: "O nome deve conter apenas letras, espaços, hífens ou apóstrofos.",
    }),
  nickname: z.string()
    .trim()
    .min(3, { message: "O apelido deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O apelido deve ter no máximo 100 caracteres." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "O apelido deve conter apenas letras, números e underscore, sem espaços." }),
  email: z.string()
    .trim()
    .max(100, { message: "O e-mail deve ter no máximo 100 caracteres." })
    .email({ message: "Insira um e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"]
});
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;

export const postInputSchema = z.object({
  titulo: z.string().trim().min(1).max(300),
  conteudo: z.string().trim().min(1).max(5000),
})

export const profileInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  user_apelido: z.string().trim().regex(/^[a-zA-Z0-9_]{3,100}$/),
  user_bio: z.string().max(300),
})
