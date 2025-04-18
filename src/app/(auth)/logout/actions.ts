"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  
  // Удаляем куки
  cookieStore.set("jwt", "", { expires: new Date(0), httpOnly: true, secure: true, path: "/" });
  cookieStore.set("refreshToken", "", { expires: new Date(0), httpOnly: true, secure: true, path: "/" });
  cookieStore.set("username", "", { expires: new Date(0), path: "/" });

  // Перенаправляем
  redirect("/login");
}