import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust the import path if needed

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug || slug.trim() === "") {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  try {
    const exists = await prisma.post.findUnique({
      where: { slug },
    });

    return NextResponse.json({ available: !exists }, { status: 200 });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
