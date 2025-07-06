import { prisma } from "../prisma";

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) return null;

  return {
    title: post.title,
    slug: post.slug,
    content: post.content,
    coverImage: post.coverImage ?? "",
  };
}
