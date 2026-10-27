import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login - Nexa",
  description:
    "Faça login na Nexa para acessar sua conta e continuar conversando.",
  robots: "noindex, follow",
}

export default function LoginPage() {
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
          title="Nexa"
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
          <h1 className="sr-only">Acesse sua conta na Nexa</h1>
          <LoginForm />
        </div>

        <p className="animate-in fade-in text-center text-xs text-muted-foreground duration-700 md:text-left">
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
        <div className="absolute -left-24 top-1/4 size-[28rem] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-16 bottom-0 size-[22rem] rounded-full bg-chart-2/20 blur-3xl" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-foreground">
          <div className="animate-in fade-in slide-in-from-right-4 flex items-center gap-3 duration-700">
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
                Sua rede, sem ruído.
              </p>
            </div>
          </div>

          <blockquote className="animate-in fade-in slide-in-from-right-6 max-w-md space-y-4 duration-1000">
            <p className="text-3xl leading-snug font-medium tracking-tight text-balance">
              Conecte-se com pessoas reais e compartilhe o que importa.
            </p>
            <footer className="text-sm text-muted-foreground">
              Posts, reações e conversas — tudo em um só lugar.
            </footer>
          </blockquote>

          <div className="animate-in fade-in flex gap-2 duration-1000">
            <span className="h-1.5 w-8 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </aside>
    </main>
  )
}
