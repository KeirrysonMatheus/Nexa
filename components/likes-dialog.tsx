"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, UsersRound } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Like = {
  id: string
  name: string
  image: string | null
  user_apelido: string
}

type LikesDialogProps = {
  count: number
  likes: Like[]
}

export function LikesDialog({ count, likes }: LikesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <UsersRound className="size-3.5" />
          <span>
            {count} {count === 1 ? "curtida" : "curtidas"}
          </span>
          <ChevronRight className="size-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quem curtiu</DialogTitle>
        </DialogHeader>
        {likes.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Ninguém curtiu esta publicação ainda.
          </p>
        ) : (
          <div className="max-h-72 space-y-1 overflow-y-auto">
            {likes.map((like) => (
              <Link
                key={like.id}
                href={`/users/${like.user_apelido}`}
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
              >
                {like.image ? (
                  <Image
                  unoptimized
                    src={like.image}
                    alt={`Avatar de ${like.name}`}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                    {like.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{like.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    @{like.user_apelido}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
