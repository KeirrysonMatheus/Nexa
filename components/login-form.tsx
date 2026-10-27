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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })
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
              {form.formState.errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
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
                <a
                  href="#"
                  className="ml-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                {...field}
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-10 bg-background/80"
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
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
          <Button
            variant="outline"
            type="button"
            size="lg"
            className="h-10 w-full bg-background/60"
            disabled={isLoading}
            onClick={handleGoogleLogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
              aria-hidden="true"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continuar com Google
          </Button>
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
