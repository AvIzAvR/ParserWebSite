"use client";

import { logout } from "@/app/(auth)/logout/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="destructive" className="w-full">
        Logout
      </Button>
    </form>
  );
}
