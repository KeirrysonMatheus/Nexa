import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import FollowButton from "@/components/ui/follow-button"
import { DeleteButton } from "@/components/delete-button"
import { LikeButton } from "@/components/like-button"
import { LikesDialog } from "@/components/likes-dialog"
import type { FeedPost } from "@/types/post"
import { formatPostDate } from "@/lib/format-date"

type PostCardProps = {
  post: FeedPost
}

const PostCard = ({ post }: PostCardProps) => {
  const {
    post_id,
    post_conteudo,
    post_titulo,
    user,
    post_data,
    post_image_url,
    post_ncurtidas,
    likedByCurrentUser,
    curtidas,
  } = post

  const profileHref = `/users/${user.user_apelido}`
  const hasImage = Boolean(post_image_url?.trim())

  return (
    <Card className="w-full overflow-hidden border-border/70 bg-card/95 shadow-sm transition-all duration-200">
      <CardHeader className="border-b border-border/50 bg-muted/15 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              href={profileHref}
              className="shrink-0 transition-opacity hover:opacity-80"
            >
              <Avatar size="lg" className="border border-border shadow-sm">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={`Avatar de ${user.name}`}
                />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                <span className="whitespace-nowrap">
                  {formatPostDate(post_data)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end">
            {user.isOwnPost ? (
              <DeleteButton postId={post_id} />
            ) : (
              <FollowButton
                initialJaSeguindo={user.jaSeguindo}
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
        {hasImage && (
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border/60 bg-muted/20 shadow-sm">
            <Image
              unoptimized
              alt={post_titulo}
              src={post_image_url!}
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
      </CardFooter>
    </Card>
  )
}

export { PostCard }
