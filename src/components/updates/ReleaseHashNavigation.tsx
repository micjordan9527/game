"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function ReleaseHashNavigation() {
  const pathname = usePathname()
  useEffect(() => {
    if (pathname !== "/updates") return
    let frame = 0
    let observer: MutationObserver | null = null
    const apply = () => {
      let id: string
      try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return true }
      if (!document.getElementById("release-history")) return false
      const saved = window.history.state?.knowledgeReleaseReturn
      if (saved?.url === window.location.pathname + window.location.search + window.location.hash && Array.isArray(saved.open)) {
        document.querySelectorAll<HTMLDetailsElement>("details[data-release-version]").forEach((item) => { item.open = saved.open.includes(item.id) })
        window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(() => window.scrollTo({ top: saved.top, behavior: "instant" }))
        return true
      }
      if (!id) return true
      const target = document.getElementById(id)
      if (!target) return false
      if (id === "knowledge-content") {
        document.querySelectorAll<HTMLDetailsElement>('details[data-release-kind="content"]').forEach((item) => { item.open = true })
      }
      const release = target.closest<HTMLDetailsElement>("details[data-release-version]")
      if (release) release.open = true
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }))
      return true
    }
    const reveal = () => {
      observer?.disconnect()
      if (apply()) return
      observer = new MutationObserver(() => { if (apply()) observer?.disconnect() })
      observer.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true })
    }
    const rememberOrReveal = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || anchor.target === "_blank") return
      const target = new URL(anchor.href)
      if (target.origin !== window.location.origin) return
      if (target.pathname === window.location.pathname && target.hash) {
        window.history.replaceState({ ...window.history.state, knowledgeReleaseReturn: null }, "")
        window.cancelAnimationFrame(frame)
        frame = window.requestAnimationFrame(reveal)
      } else if (anchor.closest("#release-history, #current-release, #demonstrations")) {
        window.history.replaceState({ ...window.history.state, knowledgeReleaseReturn: {
          url: window.location.pathname + window.location.search + window.location.hash,
          top: window.scrollY,
          open: Array.from(document.querySelectorAll<HTMLDetailsElement>("details[data-release-version][open]")).map((item) => item.id),
        } }, "")
      }
    }
    reveal()
    window.addEventListener("hashchange", reveal)
    window.addEventListener("popstate", reveal)
    document.addEventListener("click", rememberOrReveal, true)
    return () => {
      window.cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener("hashchange", reveal)
      window.removeEventListener("popstate", reveal)
      document.removeEventListener("click", rememberOrReveal, true)
    }
  }, [pathname])
  return null
}
