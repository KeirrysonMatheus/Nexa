import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SignupForm } from "@/components/signup-form"

export const metadata: Metadata = {
  title: "Cadastro - Nexa.",
  description: "Crie sua conta na Nexa e comece a postar hoje mesmo.",
}

export default function SignupPage() {
  return (
    <main className="relative grid min-h-svh overflow-hidden lg:grid-cols-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,oklch(0.95_0.02_264)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.94_0.03_230)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,oklch(0.28_0.04_264)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.25_0.03_230)_0%,transparent_50%)]"
      />

      <section className="relative flex flex-col justify-between gap-8 p-6 md:p-10">
        <Link
          href="/authenticate/login"
          className="animate-in fade-in slide-in-from-top-2 flex items-center gap-2.5 duration-500"
          title="Ir para o login da Nexa"
        >
          <Image
            src="/logo.png"
            width={36}
            height={36}
            alt=""
            priority
            className="size-9 rounded-md object-contain"
          />
          <span className="text-lg font-semibold tracking-tight">Nexa.</span>
        </Link>

        <div className="animate-in fade-in slide-in-from-bottom-3 mx-auto flex w-full max-w-sm flex-1 flex-col justify-center duration-700">
          <h1 className="sr-only">Crie sua conta na Nexa</h1>
          <SignupForm />
        </div>

        <p className="text-center text-xs text-muted-foreground md:text-left">
          Ao continuar, você concorda com nossos{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Termos
          </a>{" "}
          e{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground">
            Privacidade
          </a>
          .
        </p>
      </section>

      <aside
        className="relative hidden overflow-hidden border-l border-border/60 lg:flex"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-foreground/[0.03] dark:bg-foreground/[0.06]" />
        <div className="absolute -right-24 top-1/5 size-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-16 bottom-0 size-[22rem] rounded-full bg-chart-2/20 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              width={48}
              height={48}
              alt=""
              className="size-12 rounded-xl object-contain shadow-sm"
            />
            <div>
              <p className="text-xl font-semibold tracking-tight">Nexa.</p>
              <p className="text-sm text-muted-foreground">
                Comece em poucos minutos.
              </p>
            </div>
          </div>

          <blockquote className="max-w-md space-y-4">
            <p className="text-3xl leading-snug font-medium tracking-tight text-balance">
              Crie seu espaço e encontre sua comunidade.
            </p>
            <footer className="text-sm text-muted-foreground">
              Um cadastro rápido para postar, seguir e interagir.
            </footer>
          </blockquote>

          <div className="flex gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="h-1.5 w-8 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </aside>
    </main>
  )
}
