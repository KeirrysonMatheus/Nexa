import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const LOGIN_PATH = "/authenticate/login"
const DASHBOARD_PATH = "/dashboard"

const PUBLIC_ROUTES = new Set([
  "/authenticate/login",
  "/authenticate/signup",
  "/cadastro",
])

const AUTH_ROUTES = new Set([
  "/authenticate/login",
  "/authenticate/signup"
])

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (pathname === "/") {
    const url = req.nextUrl.clone()
    url.pathname = session ? DASHBOARD_PATH : LOGIN_PATH
    return NextResponse.redirect(url)
  }

  if (!session && !PUBLIC_ROUTES.has(pathname)) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = LOGIN_PATH
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (session && AUTH_ROUTES.has(pathname)) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = DASHBOARD_PATH
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)",
  ],
}
