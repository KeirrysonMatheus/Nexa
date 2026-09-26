"use client"

import { Spinner } from "./ui/spinner";
import { cn } from "@/lib/utils"
import { signUpFormSchema, SignUpFormData } from "@/types/schemas";
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"


export function SignupForm({ className, ...props }: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const router = useRouter()
  
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      nickname: "",
      email: "",
      password: "",
      confirmPassword: "",
      user_datanascimento: "" 
    }
  })

  const onSubmit = async (values: SignUpFormData) => {
  setIsLoading(true)
  setGlobalError(null)

  
  const { data, error: authError } = await authClient.signUp.email({
    email: values.email,
    password: values.password,
    name: values.name,
    user_apelido: values.nickname, 
    user_datanascimento: new Date(values.user_datanascimento), 
  })
  
  setIsLoading(false)

  if (authError) {
    
    if (authError.code === "EMAIL_ALREADY_EXISTS") {
      form.setError("email", {
        type: "manual",
        message: authError.message
      })
      return
    }

    if (authError.code === "NICKNAME_ALREADY_EXISTS") {
      form.setError("nickname", {
        type: "manual",
        message: authError.message
      })
      return
    }

  
    setGlobalError(authError.message || "Erro ao tentar registrar.")
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

        {globalError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md text-sm text-red-600 dark:text-red-400 text-center">
            {globalError}
          </div>
        )}

        {/* Nome */}
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

        {/* Apelido */}
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

        {/* Data de Nascimento */}
        <Controller
          name="user_datanascimento"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="user_datanascimento">Data de Nascimento</FieldLabel>
              <Input 
                {...field} 
                id="user_datanascimento" 
                type="date" 
                className="bg-background uppercase text-sm block w-full" 
                disabled={isLoading} 
              />
              {form.formState.errors.user_datanascimento && (
                <p className="text-xs text-red-500">{form.formState.errors.user_datanascimento.message}</p>
              )}
            </Field>
          )}
        />

        {/* Email */}
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

        {/* Senha */}
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

        {/* Confirmar Senha */}
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
          <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
            {isLoading && <Spinner className="w-4 h-4" />}
          </Button>
        </Field>

        <FieldSeparator>Ou continue com</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" className="w-full" disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
            </svg>
            Cadastre-se com Google
          </Button>
          <FieldDescription className="px-6 text-center mt-2">
            Já tem uma conta? <a href="/login" className="underline context-link hover:text-primary">Faça login</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
