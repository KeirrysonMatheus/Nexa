"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { PostCard } from "@/components/post-card"
import { getPosts } from "@/actions/posts"
import { Spinner } from "@/components/ui/spinner"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Newspaper } from "lucide-react"
import type { FeedPost } from "@/types/post"
import SkeletonCard from "@/components/skeleton-card"

type PostsFeedProps = {
  initialPosts: FeedPost[]
  initialCursor: string | null
  initialHasMore: boolean
  userId?: string
  emptyTitle?: string
  emptyDescription?: string
}

export function PostsFeed({
  initialPosts,
  initialCursor,
  initialHasMore,
  userId,
  emptyTitle = "Nenhum post por aqui",
  emptyDescription = "Seja o primeiro a compartilhar algo com a comunidade.",
}: PostsFeedProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [cursor, setCursor] = useState(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isPending, startTransition] = useTransition()
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    setPosts(initialPosts)
    setCursor(initialCursor)
    setHasMore(initialHasMore)
  }, [initialPosts, initialCursor, initialHasMore])

  const loadMore = useCallback(() => {
    if (!hasMore || !cursor || loadingRef.current) return

    loadingRef.current = true
    startTransition(async () => {
      try {
        const page = await getPosts({ cursor, userId })
        setPosts((prev) => {
          const existing = new Set(prev.map((post) => post.post_id))
          const unique = page.posts.filter((post) => !existing.has(post.post_id))
          return [...prev, ...unique]
        })
        setCursor(page.nextCursor)
        setHasMore(page.hasMore)
      } finally {
        loadingRef.current = false
      }
    })
  }, [cursor, hasMore, userId])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: "240px 0px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (posts.length === 0) {
    return (
      <Empty className="border border-dashed border-border/80 bg-card/40 py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Newspaper />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          post_id={post.post_id}
          post_titulo={post.post_titulo}
          post_conteudo={post.post_conteudo}
          post_image_url={post.post_image_url}
          post_data={new Date(post.post_data)}
          post_ncurtidas={post.post_ncurtidas}
          user={post.user}
          post_comentarios={post.post_comentarios}
          postCurtidas={post.postCurtidas}
        />
      ))}

      <div ref={sentinelRef} className="flex min-h-10 items-center justify-center py-2">
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="size-4" />
            Carregando mais posts...
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-xs text-muted-foreground">Você chegou ao fim do feed.</p>
        )}
      </div>

      {isPending && posts.length > 0 && (
        <div className="sr-only" aria-live="polite">
          Carregando
        </div>
      )}

      {isPending && (
        <div className="space-y-4 md:hidden">
          <SkeletonCard />
        </div>
      )}
    </div>
  )
}
