
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "./ui/button";
import { createPost } from "@/actions/posts";
import { useState } from "react";

const postSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório").max(300, "Máximo 300 caracteres"),
  conteudo: z.string().min(1, "O conteúdo é obrigatório").max(5000, "Máximo 5000 caracteres"),
  imgUrl: z.string().url("Insira uma URL válida").max(512, "Máximo 512 caracteres").optional().or(z.literal("")),
});

type PostFormValues = z.infer<typeof postSchema>;

interface CreatePostFormProps {
  onSuccess: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
  });

  const onSubmit = async (data: PostFormValues) => {
    try {
      setLoading(true);
      await createPost(data);
      reset();
      onSuccess(); 
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Houve um erro ao publicar seu post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Título</label>
        <input
          {...register("titulo")}
          placeholder="Dê um título ao seu post..."
          className="w-full rounded-md border p-2 bg-background"
        />
        {errors.titulo && <span className="text-xs text-red-500">{errors.titulo.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">URL da Imagem (Opcional)</label>
        <input
          {...register("imgUrl")}
          placeholder="https://exemplo.com"
          className="w-full rounded-md border p-2 bg-background"
        />
        {errors.imgUrl && <span className="text-xs text-red-500">{errors.imgUrl.message}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Conteúdo</label>
        <textarea
          {...register("conteudo")}
          rows={5}
          placeholder="O que você está pensando?"
          className="w-full rounded-md border p-2 bg-background resize-none"
        />
        {errors.conteudo && <span className="text-xs text-red-500">{errors.conteudo.message}</span>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
