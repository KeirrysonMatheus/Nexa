export type FeedPost = {
  post_id: string
  post_titulo: string
  post_conteudo: string
  post_image_url?: string
  post_data: string
  post_ncurtidas: number
  post_comentarios: string
  user: {
    id: string
    name: string
    email: string
    image: string | null
    user_apelido: string
    jaSeguindo: boolean
  }
  postCurtidas: {
    post_id: string
    user_id: string
  }[]
}

export type PostsPage = {
  posts: FeedPost[]
  nextCursor: string | null
  hasMore: boolean
}
