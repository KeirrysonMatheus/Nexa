"use client"

import React, { useTransition } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { toggleCurtidaPost } from "@/actions/posts";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post_id: string;
  post_titulo: string;
  post_conteudo: string;
  post_image_url?: string;
  post_data: Date;
  post_ncurtidas: number;
  currentUserId: string;
  user: {
    name: string;
    email: string;
    image: string | null;
    user_apelido: string;
  };
  post_comentarios: {
    post_id: string;
    user_id: string;
    comentario_id: string;
    comentario: string;
    criado_em: Date | null;
  }[];
  postCurtidas: {
    post_id: string;
    user_id: string;
  }[];
}

const stripScripts = (text: string) => {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
};

const PostCard = ({ 
  post_id, 
  post_conteudo, 
  post_titulo, 
  user, 
  post_data, 
  post_image_url, 
  post_ncurtidas,
  post_comentarios,
  postCurtidas,
  currentUserId
}: PostCardProps) => {
  const [isPending, startTransition] = useTransition();
  
  const jaCurtiu = postCurtidas.some(curtida => curtida.user_id === currentUserId);

  const handleLike = () => {
    if (!currentUserId) {
      alert("Você precisa estar logado para curtir!");
      return;
    }
    
    startTransition(async () => {
      await toggleCurtidaPost(post_id, currentUserId);
    });
  };

  const postDataBR = post_data
    ? new Date(post_data).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
    : "Data indisponível";

  return (
    <Card className="w-full transition-all duration-200 hover:shadow-md bg-card border-muted/80 overflow-hidden"> 
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/perfil/${user?.user_apelido}`} className="transition-opacity hover:opacity-80 shrink-0">
              {user?.image ? (
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border shadow-sm">
                  <Image
                    src={user.image}
                    alt={`Avatar de ${user.name}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm border border-border">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </Link>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground tracking-tight truncate leading-none mb-1">
                {user?.name || "Usuário"}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Link href={`/perfil/${user?.user_apelido}`} className="hover:text-primary transition-colors font-medium">
                  @{user?.user_apelido || "usuario"}
                </Link>
                <span className="text-muted-foreground/50">•</span>
                <span className="whitespace-nowrap">{postDataBR}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex flex-col gap-3"> 
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-lg font-bold tracking-tight text-foreground/90">
            {stripScripts(post_titulo)}
          </CardTitle>
          <p className="text-sm text-foreground/95 leading-relaxed whitespace-pre-line font-normal">
            {stripScripts(post_conteudo)}
          </p>
        </div>

        {post_image_url && post_image_url.trim() !== "" && (
          <div className="relative w-full h-80 rounded-xl overflow-hidden border border-border/60 bg-muted/20 shadow-sm">
            <Image
              alt={post_titulo}
              src={post_image_url}
              unoptimized
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>

      <div className="px-4">
        <Separator className="bg-muted/80" />
      </div>

      <CardFooter className="p-2 px-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            disabled={isPending}
            onClick={handleLike}
            className={cn(
              "h-9 px-3 gap-2 rounded-full transition-colors",
              jaCurtiu 
                ? "text-red-500 hover:text-red-600 bg-red-50/50 dark:bg-red-950/20" 
                : "text-muted-foreground hover:text-red-500 hover:bg-red-50/10 dark:hover:bg-red-950/20"
            )}
          >
            <Heart className={cn("h-4 w-4", jaCurtiu && "fill-current")} />
            <span className="text-xs font-medium">{post_ncurtidas}</span>
          </Button>

          <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-950/20 rounded-full transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-medium">{post_comentarios.length}</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export { PostCard };