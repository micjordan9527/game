"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [])

  return <div className="fixed left-0 top-0 z-50 h-1 bg-brand-600 transition-[width]" style={{ width: `${progress}%` }} aria-hidden="true" />
}
