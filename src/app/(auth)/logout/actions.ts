"use server"

import { redirect } from "next/navigation"
import { clearAuthCookies } from "@/lib/auth"

export async function logout() {
  clearAuthCookies()
  redirect("/login")
}
