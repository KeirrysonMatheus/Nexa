
"use client";

import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreatePostFormProps {
  onSuccess: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    try {
      setLoading(true);
      const response = await fetch("/api/posts", {
        method: "POST",
        body: new FormData(form),
      })

      if (!response.ok) {
        const result: { error?: string } = await response.json()
        alert(result.error || "Houve um erro ao publicar seu post.");
        return;
      }
      form.reset();
      onSuccess();
      router.refresh();
    } catch (error: unknown) {
      console.error("Erro ao criar post:", error);
      alert("Houve um erro ao publicar seu post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-4 pt-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Título</label>
        <input
          name="titulo"
          required
          maxLength={300}
          placeholder="Dê um título ao seu post..."
          className="w-full rounded-md border p-2 bg-background"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Imagem (opcional)</label>
        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="w-full rounded-md border p-2 bg-background"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Conteúdo</label>
        <textarea
          name="conteudo"
          required
          maxLength={5000}
          rows={5}
          placeholder="O que você está pensando?"
          className="w-full rounded-md border p-2 bg-background resize-none"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
