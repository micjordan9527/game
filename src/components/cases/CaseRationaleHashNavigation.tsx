"use client"

import { useEffect } from "react"

export function CaseRationaleHashNavigation({ id }: { id: string }) {
  useEffect(() => {
    const hash = `#${id}`
    let firstFrame = 0, secondFrame = 0, generation = 0
    let historyHash: string | null = null
    const cancel = () => {
      generation++
      window.cancelAnimationFrame(firstFrame)
      window.cancelAnimationFrame(secondFrame)
    }
    const reveal = (initial = false) => {
      cancel()
      if (window.location.hash !== hash) return
      const attempt = generation
      Promise.resolve(document.fonts?.ready).then(() => {
        if (attempt !== generation) return
        firstFrame = window.requestAnimationFrame(() => {
          secondFrame = window.requestAnimationFrame(() => {
            if (attempt !== generation || window.location.hash !== hash) return
            // Native fragment scrolling or restored reading positions need no correction.
            if (initial && window.scrollY > 1) return
            if (document.body.style.position === "fixed") return
            document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" })
          })
        })
      })
    }
    const onHistory = () => {
      cancel()
      historyHash = window.location.hash
    }
    const onHash = () => {
      if (historyHash === window.location.hash) {
        historyHash = null
        return
      }
      historyHash = null
      reveal()
    }
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return
      const url = new URL(anchor.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search || url.hash !== hash) return
      event.preventDefault()
      historyHash = null
      if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash)
      reveal()
    }
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
    if (navigation?.type !== "back_forward") reveal(true)
    window.addEventListener("hashchange", onHash)
    window.addEventListener("popstate", onHistory)
    window.addEventListener("pagehide", cancel)
    document.addEventListener("click", onClick, true)
    return () => {
      cancel()
      window.removeEventListener("hashchange", onHash)
      window.removeEventListener("popstate", onHistory)
      window.removeEventListener("pagehide", cancel)
      document.removeEventListener("click", onClick, true)
    }
  }, [id])
  return null
}
