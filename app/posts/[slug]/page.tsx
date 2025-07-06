import { prisma } from "@/lib/prisma";
import { formatter } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import React from "react";

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({ where: { slug } });

  if (!post) return <h1>Post Not Found</h1>;

  return (
    <article className='flex flex-col w-2/3 mx-auto py-10'>
      <h1 className='font-bold text-4xl'>{post?.title}</h1>
      <span className='text-sm'>{formatter.format(post.createdAt)}</span>
      <div className='post-content'>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
