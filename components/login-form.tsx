"use client"

import { LoginFormSchema, type LoginFormData } from "@/types/schemas"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { FormFieldError } from "@/components/form-field-error"
import { GoogleAuthButton } from "@/components/google-auth-button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const router = useRouter()

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true)
    setGlobalError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    setIsLoading(false)

    if (error) {
      if (error.status === 401 || error.code === "INVALID_EMAIL_OR_PASSWORD") {
        setGlobalError("E-mail ou senha inválidos.")
        return
      }

      setGlobalError(error.message || "Ocorreu um erro ao tentar fazer login.")
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
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Entre na sua conta para continuar na Nexa.
          </p>
        </div>

        {globalError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2.5 text-center text-sm text-destructive"
          >
            {globalError}
          </div>
        )}

        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                className="h-10 bg-background/80"
                disabled={isLoading}
              />
              <FormFieldError message={form.formState.errors.email?.message} />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <span className="ml-auto text-sm text-muted-foreground">
                  Esqueceu a senha?
                </span>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-10 bg-background/80"
                disabled={isLoading}
              />
              <FormFieldError message={form.formState.errors.password?.message} />
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            size="lg"
            className="h-10 w-full"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
            {isLoading && <Spinner className="size-4" />}
          </Button>
        </Field>

        <FieldSeparator>Ou continue com</FieldSeparator>

        <Field>
          <GoogleAuthButton label="Continuar com Google" disabled={isLoading} />
        </Field>

        <FieldDescription className="text-center">
          Não tem uma conta?{" "}
          <Link
            href="/authenticate/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Cadastre-se
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
