"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "./ui/dialog"
import Logo from "./ui/logo"
import FilterPost from "./ui/filter-post"
import Link from "next/link"
import { Plus } from "lucide-react"
import UserAvatar from "./ui/user-avatar"
import { authClient } from "@/lib/auth-client"
import { Skeleton } from "./ui/skeleton"
import CreatePostForm from "./create-post-form"

const HeaderSkeleton = () => {
  return <Skeleton className="h-10 w-10 rounded-full" />
}

const Header = () => {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <Logo />
          <span className="text-xl font-semibold tracking-tight">Nexa</span>
        </Link>

        <div className="hidden max-w-md flex-1 md:block">
          <FilterPost />
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted md:h-8 md:w-auto md:gap-1.5 md:rounded-full md:border-transparent md:bg-primary md:px-3 md:text-primary-foreground md:hover:bg-primary/90"
                aria-label="Criar nova publicação"
              >
                <Plus className="size-4" />
                <span className="hidden text-sm font-medium md:inline">
                  Novo post
                </span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Criar nova publicação</DialogTitle>
                </DialogHeader>
                <CreatePostForm onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          )}

          {isPending ? (
            <HeaderSkeleton />
          ) : !user ? (
            <Link
              href="/authenticate/login"
              className="inline-flex h-8 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium hover:bg-muted"
            >
              Login
            </Link>
          ) : (
            <UserAvatar />
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
