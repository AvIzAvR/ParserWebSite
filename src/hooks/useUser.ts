"use client"

import { useEffect, useState } from "react"

export function useUser() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const cookieMatch = document.cookie.match(/username=([^;]+)/)
    if (cookieMatch) {
      setUsername(decodeURIComponent(cookieMatch[1]))
    }
  }, [])

  return { username }
}
