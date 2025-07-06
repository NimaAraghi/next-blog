import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  if (!session?.user)
    return NextResponse.json({ error: "Please Login" }, { status: 400 });
  try {
    const { id } = await params;

    if (!id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json({ error: "Post not found!" }, { status: 404 });

    if (session.user.role !== "ADMIN" || session.user.id !== post.authorId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const deletedPost = await prisma.post.delete({ where: { id } });
    return NextResponse.json({ post: deletedPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
