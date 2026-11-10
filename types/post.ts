export type UserPublicProfile = {
  id: string
  name: string
  image: string | null
  user_apelido: string
}

export type FeedPostAuthor = UserPublicProfile & {
  jaSeguindo: boolean
  isOwnPost: boolean
}

export type FeedPost = {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_url?: string
  post_data: string
  post_ncurtidas: number
  likedByCurrentUser: boolean
  curtidas: UserPublicProfile[]
  user: FeedPostAuthor
}

export type PostsPage = {
  posts: FeedPost[]
  nextCursor: string | null
  hasMore: boolean
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string }
