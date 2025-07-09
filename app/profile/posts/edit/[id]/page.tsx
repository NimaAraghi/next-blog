import PostForm from "@/components/PostForm";
import { prisma } from "@/lib/prisma";
import { PostFormData } from "@/lib/validations/post";

export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    return <h1>Post Not Found</h1>;
  }

  return (
    <PostForm
      isEditMode
      defaultValues={post as PostFormData}
      postId={post.id}
    />
  );
}
