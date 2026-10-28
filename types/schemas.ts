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
    .regex(/^[a-zA-Z0-9_]+$/, { message: "O apelido deve conter apenas letras, números e underscore." }),
  email: z.string()
    .trim()
    .max(100, { message: "O e-mail deve ter no máximo 100 caracteres." })
    .email({ message: "Insira um e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
  confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
  user_datanascimento: z.string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Informe uma data de nascimento válida." })
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number)
      const date = new Date(Date.UTC(year, month - 1, day))
      const today = new Date()

      return date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day &&
        date <= new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))
    }, { message: "A data de nascimento deve ser válida e não pode ser futura." })
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"]
});
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
