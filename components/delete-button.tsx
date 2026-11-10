"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deletePost } from "@/actions/posts"
import { Button } from "@/components/ui/button"

type DeleteButtonProps = {
  postId: string
}

export function DeleteButton({ postId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!window.confirm("Remover este post? Essa ação não pode ser desfeita.")) return

    startTransition(async () => {
      const result = await deletePost(postId)
      if (!result.success) {
        window.alert(result.error)
        return
      }
      router.refresh()
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Remover post"
      title="Remover post"
      disabled={isPending}
      onClick={handleDelete}
      className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
