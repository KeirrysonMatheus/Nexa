import z from "zod";

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." })
});

export const signUpFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  nickname: z.string().min(2, { message: "O apelido deve ter pelo menos 2 caracteres." }),
  email: z.string().trim().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string(),
  user_datanascimento: z.string().min(1, { message: "A data de nascimento é obrigatória." }) 
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"]
});
export type SignUpFormData = z.infer<typeof signUpFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
