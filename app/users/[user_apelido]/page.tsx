import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import MobileNavBar from "@/components/mobile-navbar"
import { Posts } from "@/components/posts"
import { UserProfile } from "@/components/user-profile"
import { getUserProfile } from "@/actions/users"
import SkeletonCard from "@/components/skeleton-card"

type UserPageProps = {
  params: Promise<{ user_apelido: string }>
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const { user_apelido } = await params
  const user = await getUserProfile(user_apelido)

  if (!user) {
    return { title: "Usuário não encontrado - Nexa" }
  }

  return {
    title: `${user.name} (@${user.user_apelido}) - Nexa`,
    description: user.user_bio || `Perfil de ${user.name} na Nexa.`,
  }
}

const PostsSkeleton = () => (
  <div className="flex w-full flex-col gap-4">
    <SkeletonCard />
    <SkeletonCard />
  </div>
)

export default async function UserPage({ params }: UserPageProps) {
  const { user_apelido } = await params

  if (!user_apelido) {
    notFound()
  }

  const user = await getUserProfile(user_apelido)

  if (!user) {
    notFound()
  }

  return (
    <div className="relative min-h-dvh w-full pb-20 md:pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.96_0.015_264)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,oklch(0.95_0.02_230)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.26_0.03_264)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.24_0.025_230)_0%,transparent_50%)]"
      />

      <Header />

      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <UserProfile user={user} />

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Publicações</h2>
            <p className="text-sm text-muted-foreground">
              Posts recentes de @{user.user_apelido}
            </p>
          </div>

          <Suspense fallback={<PostsSkeleton />}>
            <Posts
              userId={user.id}
              emptyTitle="Nenhuma publicação ainda"
              emptyDescription="Quando este usuário postar, as publicações aparecerão aqui."
            />
          </Suspense>
        </section>
      </main>

      <MobileNavBar />
    </div>
  )
}
