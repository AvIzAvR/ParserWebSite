import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const jwt = request.cookies.get("jwt")?.value
  const isLoggedIn = Boolean(jwt)

  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/recovery" || pathname === "/recovery/confirm" 

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next|static|.*\\..*|favicon.ico).*)",
  ],
}
