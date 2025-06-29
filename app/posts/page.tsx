import { prisma } from "@/lib/prisma";
import { formatter } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default async function Posts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {posts.map((post) => (
        <Link
          href={`/posts/${post.slug}`}
          key={post.id}
          className='flex items-start gap-7'
        >
          <p>{formatter.format(post.createdAt)}</p>
          <h1>{post.title}</h1>
        </Link>
      ))}
    </>
  );
}
