import { prisma } from "@/app/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PostCard } from "../components/post-card";

const Posts = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user?.id || "";

  const posts = await prisma.post.findMany({
    include: {
      user: true, 
      post_comentarios: true,
      postCurtidas: true
    },
    orderBy: {
      post_data: 'desc'
    }
  });

  return (
    <div className="bg-background flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8">
      <div className="w-full max-w-xl flex flex-col gap-4">
        {posts.map((post) => (
          <PostCard 
            key={post.post_id} 
            post_id={post.post_id}
            post_titulo={post.post_titulo}
            post_conteudo={post.post_conteudo}
            post_image_url={post.post_img_url || undefined} 
            post_data={post.post_data}
            post_ncurtidas={post.post_ncurtidas}
            user={post.user}
            post_comentarios={post.post_comentarios}
            postCurtidas={post.postCurtidas}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export { Posts };