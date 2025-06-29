import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (session.user.id !== id && session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user)
    return NextResponse.json({ error: "User Not Found" }, { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    if (session.user.id !== id && session.user.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json({ updatedUser }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "User Not found" }, { status: 404 });
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    if (session.user.id !== id && session.user.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ deletedUser }, { status: 200 });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "User Not found" }, { status: 404 });
    return NextResponse.json({ error }, { status: 500 });
  }
}
