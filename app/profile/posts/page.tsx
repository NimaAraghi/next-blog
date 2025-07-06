import { PostTable } from "@/components/PostTable";
import { columns } from "@/components/Columns";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function Posts() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    where: { authorId: session?.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className='w-full p-10'>
      <div className='flex items-center justify-between mb-4'>
        <h1>Your Posts</h1>
        <Button asChild variant='outline'>
          <Link href='/profile/posts/create'>Create New Post</Link>
        </Button>
      </div>
      <PostTable data={posts} columns={columns} />
    </div>
  );
}
