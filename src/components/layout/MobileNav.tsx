"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Home,
  Library,
  Menu,
  MonitorCog,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { ContentNavigation } from "@/components/layout/ContentNavigation"
import { isNavigationSectionActive } from "@/lib/content-navigation"

type NavLinkItem = { href: string; label: string; icon: LucideIcon }

const resourceLinks: NavLinkItem[] = [
  { href: "/", label: "首页", icon: Home },
  { href: "/cases", label: "案例", icon: BriefcaseBusiness },
  { href: "/articles", label: "知识图解", icon: FileText },
  { href: "/ai-workflows", label: "AI 工作流", icon: Sparkles },
  { href: "/design/material-standards", label: "代理素材", icon: MonitorCog },
  { href: "/templates", label: "模板库", icon: Library },
  { href: "/glossary", label: "术语库", icon: BookOpen },
]

export function MobileNav() {
  const pathname = usePathname()
  const inUpdates = pathname === "/updates" || pathname.startsWith("/updates/")
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close the menu if navigation happened outside this component.
  useEffect(() => setOpen(false), [pathname])

  function closeMenu(restoreFocus = false) {
    setOpen(false)
    if (restoreFocus) toggleRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return

    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const dialog = dialogRef.current
    const firstLink = dialog?.querySelector<HTMLElement>("a[href]")
    firstLink?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        closeMenu(true)
        return
      }
      if (event.key !== "Tab" || !dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length > 0)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = oldOverflow
    }
  }, [open])

  return (
    <div className="flex items-center gap-2 xl:hidden">
      <Link
        href="/updates"
        aria-current={pathname === "/updates" ? "page" : inUpdates ? "location" : undefined}
        className={`inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-md border px-3 text-sm font-medium hover:bg-paper ${inUpdates ? "border-brand-200 bg-brand-50 text-brand-700" : "border-line bg-white text-muted"}`}
      >
        更新记录
      </Link>
      <Link
        href="/search"
        aria-label="全站搜索"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-ink hover:border-brand-200"
      >
        <Search className="h-5 w-5" aria-hidden="true" />
      </Link>
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "关闭导航" : "打开导航"}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-ink hover:border-brand-200"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50">
          <button
            type="button"
            aria-label="关闭导航遮罩"
            className="absolute inset-0 cursor-default bg-ink/40"
            onClick={() => closeMenu(true)}
          />
          <div
            id="mobile-site-menu"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="知识库导航"
            className="absolute bottom-0 right-0 top-0 w-full max-w-md overflow-y-auto border-l border-line bg-white px-4 py-5 shadow-soft"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">知识库导航</h2>
              <button
                type="button"
                onClick={() => closeMenu(true)}
                className="flex h-10 w-10 items-center justify-center rounded-md text-muted hover:bg-paper"
                aria-label="关闭导航"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="移动端知识库导航" className="space-y-5">
              <section>
                <h3 className="text-xs font-semibold tracking-wide text-muted">常用入口</h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {resourceLinks.map((item) => (
                    <MobileLink
                      key={item.href}
                      {...item}
                      active={isNavigationSectionActive(pathname, item.href)}
                      current={pathname === item.href}
                      onClick={() => closeMenu()}
                    />
                  ))}
                </div>
              </section>

              <ContentNavigation pathname={pathname} onNavigate={() => closeMenu()} />

              <p className="text-xs leading-6 text-muted">选择案例、图解或素材，直接查看具体内容。</p>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MobileLink({
  href,
  label,
  icon: Icon,
  active,
  current,
  onClick,
}: NavLinkItem & { active: boolean; current: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : active ? "location" : undefined}
      onClick={onClick}
      className={[
        "flex min-h-11 min-w-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition",
        active ? "bg-ink text-white" : "bg-paper text-muted hover:bg-brand-50 hover:text-ink",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </Link>
  )
}
