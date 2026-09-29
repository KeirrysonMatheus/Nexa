import type { Metadata } from "next"
import { SignupForm } from "@/components/signup-form"
import { GalleryVerticalEndIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
export const metadata: Metadata = {
  title: 'Cadastro - Nexa.',
  description: 'Crie sua conta na Nexa e comece a postar hoje mesmo.',
}

export default function SignupPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium" title="Ir para a página inicial da Nexa.">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground" aria-hidden="true">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <span>Nexa.</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <h1 className="sr-only">Crie sua conta na Nexa.</h1>
            <SignupForm />
          </div>
        </div>
      </div>
      
      <div className="relative hidden bg-muted lg:block" aria-hidden="true">
        
        <Image 
          src="" 
          alt="Ilustração de fundo para a página de cadastro" 
          priority
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </main>
  )
}
