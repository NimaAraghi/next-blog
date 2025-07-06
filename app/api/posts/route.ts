import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json(posts, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const published = formData.get("published") === "true";
  const file = formData.get("coverImage") as File;

  if (!title || !slug || !content || !file) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existingSlug = await prisma.post.findUnique({ where: { slug } });
  if (existingSlug) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  // ✅ Upload to Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await uploadImageToCloudinary(buffer, file.name);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      published,
      coverImage: uploadResult.secure_url,
      authorId: session.user.id,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
