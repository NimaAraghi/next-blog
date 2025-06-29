import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (!id)
      return NextResponse.json(
        { error: "Post ID is required", id },
        { status: 400 }
      );

    const updatedPost = await prisma.post.update({ where: { id }, data });

    return NextResponse.json({ post: updatedPost }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update post", error: error.message },
      { status: 500 }
    );
  }
}
