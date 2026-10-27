import { Suspense } from "react"
import MobileNavBar from "@/components/mobile-navbar"
import Header from "@/components/header"
import { Posts } from "@/components/posts"
import SkeletonCard from "@/components/skeleton-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Nexa",
  description: "Crie, comente e reaja a posts",
}

const PostsSkeleton = () => (
  <div className="flex w-full flex-col gap-4">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
)

export default function Dashboard() {
  return (
    <div className="relative min-h-dvh w-full pb-20 md:pb-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.96_0.015_264)_0%,transparent_50%),radial-gradient(ellipse_at_bottom_right,oklch(0.95_0.02_230)_0%,transparent_45%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.26_0.03_264)_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.24_0.025_230)_0%,transparent_50%)]"
      />

      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-5">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Início</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe as últimas publicações da comunidade.
            </p>
          </div>

          <Suspense fallback={<PostsSkeleton />}>
            <Posts />
          </Suspense>
        </div>
      </main>

      <MobileNavBar />
    </div>
  )
}
