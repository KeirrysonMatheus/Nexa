export type FeedPost = {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_url?: string
  post_data: string
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
    jaSeguindo: boolean
    isOwnPost: boolean
  }
}

export type PostsPage = {
  posts: FeedPost[]
  nextCursor: string | null
  hasMore: boolean
}
