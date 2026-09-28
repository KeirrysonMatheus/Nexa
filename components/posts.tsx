import { prisma } from "@/app/client";
import { PostCard } from "../components/post-card";
import { unstable_cache } from "next/cache";
const getCachedPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      include: { 
        user: true, 
        post_comentarios: true, 
        postCurtidas: true 
      },
      orderBy: { 
        post_data: "desc" 
      }
    });
  },
  ["posts-list-cache"], 
  { tags: ["posts"] }
);

const Posts = async () => {
  const currentUserId = ""; 

  const posts = await getCachedPosts();

  if (posts.length < 1) {
    return <p className="text-gray-500">Nenhum post encontrado.</p>;
  }

  return (
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
  );
};

export { Posts };
