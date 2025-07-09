import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatter } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function Posts() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full md:w-2/3 py-10'>
      {posts.map((post) => (
        <Card className='overflow-hidden transition-shadow hover:shadow-md'>
          <CardHeader className='pb-2'>
            {post.coverImage && (
              <Link href={`/posts/${post.slug}`}>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={600}
                  height={300}
                  className='w-full h-48 rounded-lg object-cover'
                />
              </Link>
            )}
            <CardTitle className='text-lg line-clamp-1'>
              <Link href={`/posts/${post.slug}`} className='hover:underline'>
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='text-sm text-muted-foreground flex justify-between items-center'>
            <p>By {post.author.name}</p>
            <p>{formatter.format(post.createdAt)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
