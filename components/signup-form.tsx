"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createUser } from "@/actions/register"


export const signUpFormSchema = z.object({
  name: z.string().min(1, "Nome inválido."),
  nickname: z.string()
    .min(3, "O apelido deve conter no mínimo 3 caracteres.")
    .max(20, "O apelido deve conter no máximo 20 caracteres.")
    .regex(/^[a-zA-Z0-9_]+$/, "Apenas letras, números e sublinhados (_) são permitidos."),
  email: z.string().email('Digite um email válido.'),
  password: z.string().min(8, "A senha deve conter no mínimo 8 caracteres."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"]
})

type SignUpFormData = z.infer<typeof signUpFormSchema>

export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      nickname: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (values: SignUpFormData) => {
    setIsLoading(true)
    

    const res = await createUser(values)
    
    setIsLoading(false)

    if (!res.success) {
  
      if (res.validationErrors) {
        Object.entries(res.validationErrors).forEach(([field, messages]) => {
          form.setError(field as any, { 
            type: "server", 
            message: messages?.[0] 
          })
        })
        return
      }

  
      if (res.conflictError) {
        form.setError(res.conflictError.field as any, {
          type: "manual",
          message: res.conflictError.message
        })
        return
      }

  
      if (res.serverError) {
        alert(res.serverError)
      }
      return
    }


    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Preencha seus dados abaixo
          </p>
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
              <Input {...field} id="nome" type="text" placeholder="John Doe" className="bg-background" disabled={isLoading} />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </Field>
          )}
        />

        <Controller
          name="nickname"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="nickname">Apelido (Username)</FieldLabel>
              <Input {...field} id="nickname" type="text" placeholder="johndoe_99" className="bg-background" disabled={isLoading} />
              <FieldDescription>Seu identificador único na plataforma.</FieldDescription>
              {form.formState.errors.nickname && (
                <p className="text-xs text-red-500">{form.formState.errors.nickname.message}</p>
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id="email" type="email" placeholder="m@example.com" className="bg-background" disabled={isLoading} />
              <FieldDescription>
                Nós usaremos seu email para contatar você. Não compartilharemos seu email com ninguém.
              </FieldDescription>
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input {...field} id="password" type="password" className="bg-background" disabled={isLoading} />
              <FieldDescription>Deve conter pelo menos 8 caracteres</FieldDescription>
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">{form.formState.errors.password.message}</p>
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirmar senha</FieldLabel>
              <Input {...field} id="confirm-password" type="password" className="bg-background" disabled={isLoading} />
              <FieldDescription>Por favor, confirme sua senha</FieldDescription>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500">{form.formState.errors.confirmPassword.message}</p>
              )}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </Field>

        <FieldSeparator>Ou continue com</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
            </svg>
            Cadastre-se com Google
          </Button>
          <FieldDescription className="px-6 text-center mt-2">
            Já tem uma conta? <a href="#" className="underline context-link">Faça login</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}