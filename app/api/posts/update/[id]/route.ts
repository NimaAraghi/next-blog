import { authOptions } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (!id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post)
      return NextResponse.json({ error: "Post not found!" }, { status: 404 });

    if (session.user.role !== "ADMIN" && session.user.id !== post.authorId)
      return NextResponse.json(
        {
          error: `Forbidden id: ${session.user.id} postID: ${post.authorId} role: ${session.user.role}`,
        },
        { status: 403 }
      );

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "true";
    const file = formData.get("coverImage") as File;

    console.log(formData);

    if (!title || !slug || !content || !file) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let coverImageUrl = typeof file === "string" ? file : "";

    // ✅ Upload to Cloudinary
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResult = await uploadImageToCloudinary(
        buffer,
        file.name,
        "posts"
      );
      coverImageUrl = uploadResult.secure_url;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        published,
        coverImage: coverImageUrl,
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ updatedPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
