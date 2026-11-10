"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ProfileConnection } from "@/actions/users"
import { ChevronRight, UsersRound } from "lucide-react"

type ProfileConnectionsProps = {
  followers: ProfileConnection[]
  following: ProfileConnection[]
}

function ConnectionList({ users }: { users: ProfileConnection[] }) {
  if (users.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Nenhuma conexão ainda.</p>
  }

  return (
    <div className="max-h-72 space-y-1 overflow-y-auto">
      {users.map((connection) => (
        <Link
          key={connection.id}
          href={`/users/${connection.user_apelido}`}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
        >
          {connection.image ? (
            <Image
            unoptimized
              src={connection.image}
              alt={`Avatar de ${connection.name}`}
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
              {connection.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{connection.name}</span>
            <span className="block truncate text-xs text-muted-foreground">@{connection.user_apelido}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

export function ProfileConnections({ followers, following }: ProfileConnectionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Clique para ver quem está conectado</p>
      <div className="flex flex-wrap gap-2">
      <Dialog>
        <DialogTrigger className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted">
          <UsersRound className="size-4 text-primary" />
          <span>
            <strong className="block text-sm font-semibold text-foreground">{followers.length} seguidores</strong>
          </span>
          <ChevronRight className="ml-1 size-4 text-muted-foreground" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seguidores</DialogTitle>
          </DialogHeader>
          <ConnectionList users={followers} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:border-primary/40 hover:bg-muted">
          <UsersRound className="size-4 text-primary" />
          <span>
            <strong className="block text-sm font-semibold text-foreground">{following.length} seguindo</strong>
          </span>
          <ChevronRight className="ml-1 size-4 text-muted-foreground" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seguindo</DialogTitle>
          </DialogHeader>
          <ConnectionList users={following} />
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
}
