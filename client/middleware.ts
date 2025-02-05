import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)


  // const session = req.cookies.get("auth_token")?.value;
  // if (isProtectedRoute && !session) {
  //   return NextResponse.redirect(new URL('/login', req.nextUrl))
  // }

  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
