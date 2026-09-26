'use client'

import { LoginFormSchema } from "@/types/schemas"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils" 
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { authClient } from "@/lib/auth-client" 
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginFormData = z.infer<typeof LoginFormSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })
  const router = useRouter()

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true)
    setGlobalError(null)
    
    
    const { data, error } = await authClient.signIn.email({
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
      callbackURL: "/dashboard"
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-balance text-muted-foreground">
                  Faça Login na sua conta
                </p>
              </div>

              {globalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-md text-sm text-red-600 dark:text-red-400 text-center">
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
                      placeholder="seu@email.com" 
                      className="bg-background" 
                      disabled={isLoading} 
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs font-medium text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </Field>
                )}
              />

              
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Senha</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Esqueceu sua senha?
                      </a>
                    </div>
                    <Input 
                      {...field} 
                      id="password" 
                      type="password" 
                      disabled={isLoading}
                    />
                    {form.formState.errors.password && (
                      <p className="text-xs font-medium text-red-500">{form.formState.errors.password.message}</p>
                    )}
                  </Field>
                )}
              />

              <Field>
                <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
                 Entrar
                 {isLoading && <Spinner className="w-4 h-4" />}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Ou continue com
              </FieldSeparator>

              <Field>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full" 
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://w3.org" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login com Google
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Não tem uma conta? <Link href="/cadastro" className="underline hover:text-primary">Cadastre-se</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos <a href="#" className="underline">Termos de Serviço</a>{" "}
        e <a href="#" className="underline">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  )
}
