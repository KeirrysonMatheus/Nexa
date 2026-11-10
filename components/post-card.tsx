import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bookmark, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import FollowButton from "@/components/ui/follow-button"
import { DeleteButton } from "@/components/delete-button"
import { LikeButton } from "@/components/like-button"
import { LikesDialog } from "@/components/likes-dialog"

interface PostCardProps {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_url?: string
  post_data: Date
  post_ncurtidas: number
  likedByCurrentUser: boolean
  curtidas: {
    id: string
    name: string
    image: string | null
    user_apelido: string
  }[]
  user: {
    id: string
    name: string
    image: string | null
    user_apelido: string
    jaSeguindo?: boolean
    isOwnPost: boolean
  }
}

const PostCard = ({
  post_id,
  post_conteudo,
  post_titulo,
  user,
  post_data,
  post_image_url,
  post_ncurtidas,
  likedByCurrentUser,
  curtidas,
}: PostCardProps) => {
  const postDataBR = post_data
    ? new Date(post_data).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Data indisponível"
  const profileHref = `/users/${user.user_apelido}`

  return (
    <Card className="w-full overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all duration-200">
      <CardHeader className="border-b border-border/50 bg-muted/15 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link href={profileHref} className="shrink-0 transition-opacity hover:opacity-80">
              {user.image ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
                  <Image  unoptimized src={user.image} alt={`Avatar de ${user.name}`} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-secondary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={profileHref}
                title={user.name}
                className="mb-0.5 min-w-0 max-w-full truncate text-sm font-semibold tracking-tight text-foreground hover:underline"
              >
                {user.name}
              </Link>
              <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
                <Link
                  href={profileHref}
                  className="max-w-30 truncate font-medium transition-colors hover:text-primary sm:max-w-50"
                >
                  @{user.user_apelido}
                </Link>
                <span className="text-[10px] text-muted-foreground/50">•</span>
                <span className="whitespace-nowrap">{postDataBR}</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end">
            {user.isOwnPost ? (
              <DeleteButton postId={post_id} />
            ) : (
              <FollowButton
                initialJaSeguindo={user.jaSeguindo || false}
                targetUserId={user.id}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {post_titulo}
          </CardTitle>
          <p className="whitespace-pre-line text-[0.95rem] leading-7 text-foreground/85">
            {post_conteudo}
          </p>
        </div>
        {post_image_url && post_image_url.trim() !== "" && (
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-sm">
            <Image
            unoptimized
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
        <LikeButton
          postId={post_id}
          initialLiked={likedByCurrentUser}
          initialCount={post_ncurtidas}
        />
        <LikesDialog count={post_ncurtidas} likes={curtidas} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Salvar publicação"
            title="Salvar publicação"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Bookmark className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Compartilhar publicação"
            title="Compartilhar publicação"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}

export { PostCard }
