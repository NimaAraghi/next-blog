import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return NextResponse.json("Unauthorized", { status: 401 });

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json("Forbidden", { status: 403 });
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name)
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return NextResponse.json(
        { error: "User Already Exists" },
        { status: 400 }
      );

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User Created", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
