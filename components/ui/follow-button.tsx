"use client"

import { useState, useTransition } from "react"
import { Button } from "./button"
import { UserPlus, UserMinus, UserCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { toggleFollowAction } from "@/actions/users"

interface FollowButtonProps {
  initialJaSeguindo: boolean
  targetUserId: string
  size?: "sm" | "default"
  className?: string
}

export default function FollowButton({
  initialJaSeguindo,
  targetUserId,
  size = "sm",
  className,
}: FollowButtonProps) {
  const [jaSeguindo, setJaSeguindo] = useState(initialJaSeguindo)
  const [isPending, startTransition] = useTransition()

  const handleFollow = () => {
    const previous = jaSeguindo
    setJaSeguindo(!previous)

    startTransition(async () => {
      try {
        const result = await toggleFollowAction(targetUserId)
        if (result?.following !== undefined) {
          setJaSeguindo(result.following)
        }
      } catch (error) {
        setJaSeguindo(previous)
        console.error("Erro ao seguir/deseguir:", error)
      }
    })
  }

  return (
    <Button
      size={size}
      disabled={isPending}
      onClick={handleFollow}
      className={cn(
        "group min-w-22.5 rounded-full px-3 text-xs font-medium transition-all duration-200",
        size === "default" && "h-9 min-w-28 px-4 text-sm",
        jaSeguindo
          ? "border border-border bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
    >
      {jaSeguindo ? (
        <>
          <span className="flex items-center gap-1 group-hover:hidden">
            <UserCheck className="size-3.5" />
            Seguindo
          </span>
          <span className="hidden items-center gap-1 group-hover:flex">
            <UserMinus className="size-3.5" />
            Unfollow
          </span>
        </>
      ) : (
        <span className="flex items-center gap-1">
          <UserPlus className="size-3.5" />
          Seguir
        </span>
      )}
    </Button>
  )
}
