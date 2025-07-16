// lib/api/utils.ts
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth";

type Handler = (req: NextRequest, params: { id: string }) => Promise<Response>;

export function withAuth(handler: Handler) {
  return async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    try {
      const session = await getServerSession(authOptions);
      const { id } = await params;

      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const isAdmin = session.user.role === "ADMIN";
      const isOwner = session.user.id === id;

      if (!isAdmin && !isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(req, { id });
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 }
      );
    }
  };
}
