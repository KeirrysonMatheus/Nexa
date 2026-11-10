import type { FeedPost, UserPublicProfile } from "@/types/post"

export const PAGE_SIZE = 10

export const userPublicSelect = {
  id: true,
  name: true,
  image: true,
  user_apelido: true,
} as const

export const feedPostInclude = {
  user: { select: userPublicSelect },
  postCurtidas: {
    select: {
      user_id: true,
      user: { select: userPublicSelect },
    },
  },
} as const

export type FeedPostRecord = {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_path: string | null
  post_data: Date
  post_ncurtidas: number
  user: UserPublicProfile
  postCurtidas: {
    user_id: string
    user: UserPublicProfile
  }[]
}

export function mapFeedPost(
  post: FeedPostRecord,
  followingSet: Set<string>,
  currentUserId: string,
): FeedPost {
  return {
    post_id: post.post_id,
    post_titulo: post.post_titulo,
    post_conteudo: post.post_conteudo,
    post_image_url: post.post_image_path || undefined,
    post_data: post.post_data.toISOString(),
    post_ncurtidas: post.post_ncurtidas,
    curtidas: post.postCurtidas.map(({ user }) => user),
    user: {
      id: post.user.id,
      name: post.user.name,
      image: post.user.image,
      user_apelido: post.user.user_apelido,
      jaSeguindo: followingSet.has(post.user.id),
      isOwnPost: post.user.id === currentUserId,
    },
    likedByCurrentUser: post.postCurtidas.some(
      ({ user_id }) => user_id === currentUserId,
    ),
  }
}
