"use client"
import { logout } from "@/app/(auth)/logout/actions"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  return <Button onClick={() => logout()}>Logout</Button>
}
