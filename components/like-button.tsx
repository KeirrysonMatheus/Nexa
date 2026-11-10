"use client"

import { useOptimistic, useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { toggleCurtidaPost } from "@/actions/posts"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LikeButtonProps = {
  postId: string
  initialLiked: boolean
  initialCount: number
}

type LikeState = {
  liked: boolean
  count: number
}

export function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [baseState, setBaseState] = useState<LikeState>({
    liked: initialLiked,
    count: initialCount,
  })
  const [optimisticState, setOptimisticState] = useOptimistic(baseState)
  const [isPending, startTransition] = useTransition()
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const handleLike = () => {
    if (!session?.user?.id) {
      router.push("/authenticate/login")
      return
    }

    const nextState = {
      liked: !optimisticState.liked,
      count: optimisticState.liked ? optimisticState.count - 1 : optimisticState.count + 1,
    }

    startTransition(async () => {
      setOptimisticState(nextState)
      const result = await toggleCurtidaPost(postId)
      if (result.success) {
        setBaseState(nextState)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={handleLike}
      aria-label={optimisticState.liked ? "Remover curtida" : "Curtir publicação"}
      title={optimisticState.liked ? "Remover curtida" : "Curtir publicação"}
      className={cn(
        "h-8 gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-red-500",
        optimisticState.liked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("size-4", optimisticState.liked && "fill-current")} />
      <span className="text-xs tabular-nums">{optimisticState.count}</span>
    </Button>
  )
}
