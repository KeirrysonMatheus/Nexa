import { getPosts } from "@/actions/posts"
import { PostsFeed } from "@/components/posts-feed"

type PostsProps = {
  userId?: string
  emptyTitle?: string
  emptyDescription?: string
}

const Posts = async ({ userId, emptyTitle, emptyDescription }: PostsProps) => {
  const page = await getPosts({ userId })

  return (
    <PostsFeed
      initialPosts={page.posts}
      initialCursor={page.nextCursor}
      initialHasMore={page.hasMore}
      userId={userId}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
    />
  )
}

export { Posts }
