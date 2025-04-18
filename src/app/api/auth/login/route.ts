// app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { setAuthCookies } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { jwt, refreshToken, username } = body

    if (!jwt || !refreshToken || !username) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 })
    }

    await setAuthCookies(jwt, refreshToken, username)

    return NextResponse.json({ message: "Cookies set successfully" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
