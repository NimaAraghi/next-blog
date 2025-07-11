import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { NextResponse } from "next/server";
import { prisma } from "../prisma";

async function athorizeAndGetId(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.user.role !== "ADMIN" && session.user.id !== id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return { session, id };
}

async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user)
    return NextResponse.json({ error: "User Not Found" }, { status: 404 });

  return user;
}
