"use client"

import { useState } from "react"
import Image from "next/image"
import FollowButton from "@/components/ui/follow-button"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditProfileForm } from "@/components/edit-profile-form"

type UserProfileProps = {
  user: {
    id: string
    name: string
    image: string | null
    user_apelido: string
    user_bio: string | null
    user_nseguidores: number
    user_nseguindo: number
    postCount: number
    createdAt: string
    jaSeguindo: boolean
    isOwnProfile: boolean
  }
}

export function UserProfile({ user }: UserProfileProps) {
  const [editing, setEditing] = useState(false)
  const memberSince = new Date(user.createdAt).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })

  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm">
      <div className="relative h-28 bg-[linear-gradient(135deg,oklch(0.72_0.12_264),oklch(0.78_0.08_230))] dark:bg-[linear-gradient(135deg,oklch(0.38_0.1_264),oklch(0.32_0.06_230))] md:h-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white/25,transparent_45%)]" />
      </div>

      <div className="relative px-5 pb-5 md:px-6">
        <div className="-mt-12 mb-4 flex items-end justify-between gap-4">
          {user.image ? (
            <div className="relative size-24 overflow-hidden rounded-full border-4 border-card shadow-md md:size-28">
              <Image
                src={user.image}
                alt={`Avatar de ${user.name}`}
                fill
                priority
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full border-4 border-card bg-secondary text-3xl font-semibold text-secondary-foreground shadow-md md:size-28">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {user.isOwnProfile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditing((value) => !value)}
            >
              {editing ? "Fechar edição" : "Editar perfil"}
            </Button>
          ) : (
            <FollowButton
              initialJaSeguindo={user.jaSeguindo}
              targetUserId={user.id}
              size="default"
              className="mb-1"
            />
          )}
        </div>

        <div className="space-y-3">
          {editing && (
            <EditProfileForm
              name={user.name}
              user_apelido={user.user_apelido}
              user_bio={user.user_bio}
              image={user.image}
              onCancel={() => setEditing(false)}
              onSaved={() => window.location.reload()}
            />
          )}

          <div className={editing ? "hidden" : undefined}>
            <h1 className="text-2xl font-semibold tracking-tight">{user.name}</h1>
            <p className="text-sm text-muted-foreground">@{user.user_apelido}</p>
          </div>

          {user.user_bio ? (
            <p className="max-w-prose text-sm leading-relaxed text-foreground/90">
              {user.user_bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Este usuário ainda não adicionou uma bio.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span>
              <strong className="font-semibold text-foreground">
                {user.user_nseguidores}
              </strong>{" "}
              <span className="text-muted-foreground">seguidores</span>
            </span>
            <span>
              <strong className="font-semibold text-foreground">
                {user.user_nseguindo}
              </strong>{" "}
              <span className="text-muted-foreground">seguindo</span>
            </span>
            <span>
              <strong className="font-semibold text-foreground">
                {user.postCount}
              </strong>{" "}
              <span className="text-muted-foreground">posts</span>
            </span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            Entrou em {memberSince}
          </p>
        </div>
      </div>
    </section>
  )
}
