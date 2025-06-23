"use client"

import { useEffect, useState } from "react"

export default function Hydrate({ children }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  return children
}
