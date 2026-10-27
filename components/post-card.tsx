"use client"

import { useTransition, useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Bookmark, Trash2 } from "lucide-react"
import { deletePost, toggleCurtidaPost } from "@/actions/posts"
import FollowButton from "@/components/ui/follow-button"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PostCardProps {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_url?: string
  post_data: Date
  post_comentarios: string
  post_ncurtidas: number
  user: {
    id: string
    name: string
    email: string
    image: string | null
    user_apelido: string
    jaSeguindo?: boolean
  }
  postCurtidas: {
    post_id: string
    user_id: string
  }[]
}

const stripScripts = (text: string) => {
  if (!text) return ""
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
}

const PostCard = ({
  post_id,
  post_conteudo,
  post_titulo,
  user,
  post_data,
  post_image_url,
  post_ncurtidas,
  postCurtidas,
}: PostCardProps) => {
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post_ncurtidas)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: session } = authClient.useSession()
  const currentUserId = session?.user?.id

  // Sincroniza o estado interno com as propriedades recebidas quando montado ou quando os dados mudam
  useEffect(() => {
    if (!mounted) return
    
    setLiked(currentUserId ? postCurtidas.some((curtida) => curtida.user_id === currentUserId) : false)
    setLikeCount(post_ncurtidas)
  }, [mounted, currentUserId, postCurtidas, post_ncurtidas])

  const handleLike = () => {
    if (!mounted) return
    if (!currentUserId) {
      router.push("/authenticate/login")
      return
    }

    const previousLiked = liked
    const previousCount = likeCount

    setLiked(!previousLiked)
    setLikeCount(previousLiked ? previousCount - 1 : previousCount + 1)

    startTransition(async () => {
      const result = await toggleCurtidaPost(post_id)
      if (!result.success) {
        setLiked(previousLiked)
        setLikeCount(previousCount)
      }
    })
  }

  const handleDelete = () => {
    if (!window.confirm("Remover este post? Essa ação não pode ser desfeita.")) return
    
    setIsDeleting(true)
    startTransition(async () => {
      const result = await deletePost(post_id)
      if (!result.success) {
        setIsDeleting(false)
        window.alert(result.error)
        return
      }
      router.refresh()
    })
  }

  const postDataBR = post_data
    ? new Date(post_data).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Data indisponível"

  const ehOutroUsuario = currentUserId !== user?.id
  const profileHref = `/users/${user?.user_apelido || ""}`

  return (
    <Card className="w-full overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
    <CardHeader className="border-b border-border/50 bg-muted/15 p-4 pb-3">
  {/* Mantém sempre em linha (flex-row) e distribui os lados igualmente */}
  <div className="flex w-full items-center justify-between gap-3">
    
    {/* Bloco da Esquerda: Avatar + Textos */}
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Link href={profileHref} className="shrink-0 transition-opacity hover:opacity-80">
        {user?.image ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
            <Image 
              src={user.image} 
              alt={`Avatar de ${user.name}`} 
              fill 
              className="object-cover" 
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-secondary-foreground">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </Link>
      
      {/* Container dos textos: min-w-0 é crucial aqui para permitir o truncamento */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={profileHref} className="mb-0.5 truncate text-sm font-semibold tracking-tight text-foreground hover:underline">
          {user?.name || "Usuário"}
        </Link>
        
        {/* Metadados sempre em linha, escondendo o ponto e jogando a data para baixo apenas em telas minúsculas via flex-wrap */}
        <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          <Link href={profileHref} className="truncate font-medium transition-colors hover:text-primary max-w-[120px] sm:max-w-[200px]">
            @{user?.user_apelido || "usuario"}
          </Link>
          <span className="inline text-muted-foreground/50 text-[10px] select-none">•</span>
          <span className="whitespace-nowrap">{postDataBR}</span>
        </div>
      </div>
    </div>

    {/* Bloco da Direita: Botão fixo que nunca encolhe */}
    <div className="flex shrink-0 items-center justify-end">
      {mounted && ehOutroUsuario && user?.id && (
        <FollowButton initialJaSeguindo={user.jaSeguindo || false} targetUserId={user.id} />
      )}
      {mounted && !ehOutroUsuario && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Remover post"
          title="Remover post"
          disabled={isDeleting || isPending}
          onClick={handleDelete}
          className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>

  </div>
</CardHeader>


      
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {stripScripts(post_titulo)}
          </CardTitle>
          <p className="text-[0.95rem] leading-7 whitespace-pre-line text-foreground/85">
            {stripScripts(post_conteudo)}
          </p>
        </div>
        {post_image_url && post_image_url.trim() !== "" && (
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-sm">
            <Image
              alt={post_titulo}
              src={post_image_url}
              fill
              sizes="(max-width: 768px) 100vw, 576px"
              className="object-contain"
            />
          </div>
        )}
      </CardContent>
      
      <div className="px-4">
        <Separator className="bg-border/70" />
      </div>
      
      <CardFooter className="flex items-center justify-between bg-muted/20 p-3 px-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending || isDeleting}
          onClick={handleLike}
          className={cn(
            "h-9 gap-2 rounded-full px-3 transition-colors",
            liked
              ? "bg-red-50/50 text-red-500 hover:text-red-600 dark:bg-red-950/20"
              : "text-muted-foreground hover:bg-red-50/10 hover:text-red-500 dark:hover:bg-red-950/20"
          )}
        >
          <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          <span className="text-xs font-medium">{likeCount}</span>
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export { PostCard }
