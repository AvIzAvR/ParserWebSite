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
  const cookieStore = await cookies();

  // Удаляем jwt (httpOnly + secure)
  cookieStore.set("jwt", "", {
    expires: new Date(0),  // Дата в прошлом
    httpOnly: true,
    secure: true,
    path: "/",
  });

  // Удаляем refreshToken (httpOnly + secure)
  cookieStore.set("refreshToken", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    path: "/",
  });

  // Удаляем username (доступен клиенту)
  cookieStore.set("username", "", {
    expires: new Date(0),
    path: "/",
  });
}

