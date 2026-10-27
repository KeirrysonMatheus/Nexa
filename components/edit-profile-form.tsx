"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type EditProfileFormProps = {
  name: string
  user_apelido: string
  user_bio: string | null
  image: string | null
  onCancel: () => void
  onSaved: () => void
}

export function EditProfileForm({
  name,
  user_apelido,
  user_bio,
  image,
  onCancel,
  onSaved,
}: EditProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        body: new FormData(event.currentTarget),
      })
      const result: { error?: string } = await response.json()

      if (!response.ok) {
        setError(result.error || "Não foi possível atualizar o perfil.")
        return
      }

      onSaved()
    } catch {
      setError("Não foi possível atualizar o perfil.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <input name="name" defaultValue={name} maxLength={100} required className="w-full rounded-md border bg-background p-2" placeholder="Nome" />
      <input name="user_apelido" defaultValue={user_apelido} pattern="[A-Za-z0-9_]{3,100}" required className="w-full rounded-md border bg-background p-2" placeholder="Apelido" />
      <textarea name="user_bio" defaultValue={user_bio || ""} maxLength={300} className="w-full resize-none rounded-md border bg-background p-2" placeholder="Bio" rows={3} />
      <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full rounded-md border bg-background p-2" />
      <p className="text-xs text-muted-foreground">Imagem de perfil: máximo de 2 MB.</p>
      {image && <p className="text-xs text-muted-foreground">Selecione uma nova imagem para substituir a atual.</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancelar</Button>
      </div>
    </form>
  )
}
