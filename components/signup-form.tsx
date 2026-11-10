"use client"

import { Spinner } from "./ui/spinner"
import { cn } from "@/lib/utils"
import { signUpFormSchema, type SignUpFormData } from "@/types/schemas"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { FormFieldError } from "@/components/form-field-error"
import { GoogleAuthButton } from "@/components/google-auth-button"

type SignupField = {
  name: keyof SignUpFormData
  label: string
  id: string
  type?: "text" | "email" | "password"
  placeholder?: string
  description?: string
  autoComplete?: string
}

const SIGNUP_FIELDS: SignupField[] = [
  {
    name: "name",
    label: "Nome e Sobrenome",
    id: "nome",
    placeholder: "John Doe",
    autoComplete: "name",
  },
  {
    name: "nickname",
    label: "Apelido (Username)",
    id: "nickname",
    placeholder: "johndoe_99",
    description: "Seu identificador único na plataforma.",
    autoComplete: "username",
  },
  {
    name: "email",
    label: "Email",
    id: "email",
    type: "email",
    placeholder: "m@example.com",
    description:
      "Nós usaremos seu email para contatar você. Não compartilharemos seu email com ninguém.",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Senha",
    id: "password",
    type: "password",
    description: "Deve conter pelo menos 8 caracteres",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirmar senha",
    id: "confirm-password",
    type: "password",
    description: "Por favor, confirme sua senha",
    autoComplete: "new-password",
  },
]

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
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
    },
  })

  const onSubmit = async (values: SignUpFormData) => {
    setIsLoading(true)
    setGlobalError(null)

    const { error: authError } = await authClient.signUp.email({
      email: values.email.trim(),
      password: values.password,
      name: values.name.trim(),
      user_apelido: values.nickname.trim(),
    })

    setIsLoading(false)

    if (authError) {
      if (authError.code === "EMAIL_ALREADY_EXISTS") {
        form.setError("email", {
          type: "manual",
          message: authError.message,
        })
        return
      }

      if (authError.code === "NICKNAME_ALREADY_EXISTS") {
        form.setError("nickname", {
          type: "manual",
          message: authError.message,
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
          <div
            role="alert"
            className="rounded-md border border-destructive/25 bg-destructive/10 p-3 text-center text-sm text-destructive"
          >
            {globalError}
          </div>
        )}

        {SIGNUP_FIELDS.map((fieldConfig) => (
          <Controller
            key={fieldConfig.name}
            name={fieldConfig.name}
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={fieldConfig.id}>{fieldConfig.label}</FieldLabel>
                <Input
                  {...field}
                  id={fieldConfig.id}
                  type={fieldConfig.type ?? "text"}
                  placeholder={fieldConfig.placeholder}
                  autoComplete={fieldConfig.autoComplete}
                  className="bg-background"
                  disabled={isLoading}
                />
                {fieldConfig.description && (
                  <FieldDescription>{fieldConfig.description}</FieldDescription>
                )}
                <FormFieldError
                  message={form.formState.errors[fieldConfig.name]?.message}
                />
              </Field>
            )}
          />
        ))}

        <Field>
          <Button
            type="submit"
            className="flex w-full items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
            {isLoading && <Spinner className="size-4" />}
          </Button>
        </Field>

        <FieldSeparator>Ou continue com</FieldSeparator>

        <Field>
          <GoogleAuthButton
            label="Cadastre-se com Google"
            disabled={isLoading}
            className="w-full"
          />
          <FieldDescription className="mt-2 px-6 text-center">
            Já tem uma conta?{" "}
            <Link
              href="/authenticate/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Faça login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
