"use server"

import { cookies } from "next/headers"

export async function setAuthCookies(jwt: string, refreshToken: string, username: string) {
  const cookieStore = await cookies()

  cookieStore.set("jwt", jwt, {
    httpOnly: true,
    secure: true,
    path: "/",
  })

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  })

  cookieStore.set("username", username, {
    path: "/", // доступен клиенту
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("jwt")
  cookieStore.delete("refreshToken")
  cookieStore.delete("username")
}
