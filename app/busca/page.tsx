import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { searchContent } from "@/actions/search"
import Header from "@/components/header"
import MobileNavBar from "@/components/mobile-navbar"
import FilterPost from "@/components/ui/filter-post"

export const metadata: Metadata = { title: "Buscar - Nexa" }

type SearchPageProps = {
  searchParams: Promise<{ termo?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { termo = "" } = await searchParams
  const results = await searchContent(termo)

  return (
    <div className="min-h-dvh pb-20 md:pb-8">
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <div className="md:hidden">
          <FilterPost />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resultados da busca</h1>
          <p className="text-sm text-muted-foreground">
            {termo ? `Resultados para “${termo}”` : "Digite algo para pesquisar."}
          </p>
        </div>

        {termo && (
          <>
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Usuários</h2>
              {results.users.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum usuário encontrado.</p>
              ) : (
                <div className="space-y-1">
                  {results.users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users/${user.user_apelido}`}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 hover:bg-muted"
                    >
                      {user.image ? (
                        <Image
                        unoptimized
                          src={user.image}
                          alt={`Avatar de ${user.name}`}
                          width={44}
                          height={44}
                          className="size-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex size-11 items-center justify-center rounded-full bg-secondary font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <span>
                        <strong className="block text-sm">{user.name}</strong>
                        <span className="text-xs text-muted-foreground">@{user.user_apelido}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Posts</h2>
              {results.posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum post encontrado.</p>
              ) : (
                results.posts.map((post) => (
                  <article key={post.post_id} className="rounded-xl border border-border/70 bg-card p-4">
                    <p className="text-xs text-muted-foreground">
                      {post.user.name} · @{post.user.user_apelido}
                    </p>
                    <h3 className="mt-1 font-semibold">{post.post_titulo}</h3>
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-foreground/80">
                      {post.post_conteudo}
                    </p>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </main>
      <MobileNavBar />
    </div>
  )
}
