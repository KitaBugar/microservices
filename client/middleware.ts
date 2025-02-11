import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


const protectedRoutes = ["/", "/dashboard"];
const publicRoutes = ['/login','/*']
export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/","/:path*"],
};
