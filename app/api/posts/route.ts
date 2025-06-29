import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json(posts, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, content, slug } = await req.json();

  if (!title || !content || !slug)
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });

  const existingSlug = await prisma.post.findUnique({ where: { slug } });
  if (existingSlug)
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });

  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
