"use client"

import { Button } from "./button"
import { Input } from "./input"
import { useState } from "react"
import { Search } from "lucide-react"
import { Spinner } from "./spinner"
import { useRouter } from "next/navigation"

const FilterPost = () => {
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!busca.trim()) return

    setLoading(true)
    router.push(`/busca?termo=${encodeURIComponent(busca)}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5"
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <Input
        placeholder="Pesquisar usuários, posts..."
        required
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        disabled={loading}
        variant="ghost"
        size="icon-sm"
        className="shrink-0 rounded-full"
        aria-label="Buscar"
      >
        {loading ? (
          <Spinner className="size-4 text-foreground" />
        ) : (
          <span className="text-xs font-medium text-muted-foreground">Ir</span>
        )}
      </Button>
    </form>
  )
}

export default FilterPost
