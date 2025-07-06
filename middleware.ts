import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isProfileRoute = req.nextUrl.pathname.startsWith("/profile");

  if (isProfileRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (req.nextUrl.pathname === "/profile")
    return NextResponse.rewrite(new URL("/profile/account", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
