"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  FileText,
  FolderKanban,
  Home,
  Library,
  Menu,
  MonitorCog,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { articles } from "@/data/articles"
import { categories } from "@/data/categories"
import { caseNavItems } from "@/lib/site"

type NavLinkItem = { href: string; label: string; icon: LucideIcon }

const resourceLinks: NavLinkItem[] = [
  { href: "/", label: "首页", icon: Home },
  { href: "/cases", label: "案例", icon: BriefcaseBusiness },
  { href: "/ai-workflows", label: "AI 成果", icon: Sparkles },
  { href: "/articles", label: "功能图解", icon: FileText },
  { href: "/design/material-standards", label: "素材规范", icon: MonitorCog },
  { href: "/templates", label: "工作模板", icon: Library },
  { href: "/glossary", label: "术语库", icon: BookOpen },
]

const categoryIcons: Record<string, LucideIcon> = {
  industry: Compass,
  sportsbook: Trophy,
  "white-label": BriefcaseBusiness,
  product: FolderKanban,
  operation: Sparkles,
  design: MonitorCog,
  development: FileText,
  "devops-risk": ShieldCheck,
}

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const currentArticleSlug = pathname.startsWith("/articles/") ? pathname.split("/")[2] : undefined
  const currentArticle = articles.find((article) => article.slug === currentArticleSlug)
  const activeCategorySlug =
    currentArticle?.category ??
    (pathname.startsWith("/sports")
      ? "sportsbook"
      : categories.find((category) => pathname === "/" + category.slug)?.slug)

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
                      active={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"))}
                      onClick={() => closeMenu()}
                    />
                  ))}
                </div>
              </section>

              <NavGroup title="案例资料" defaultOpen={pathname.startsWith("/cases")}>
                {caseNavItems.map((item) => (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={BriefcaseBusiness}
                    active={pathname === item.href}
                    onClick={() => closeMenu()}
                  />
                ))}
              </NavGroup>

              <NavGroup title="知识栏目" defaultOpen={Boolean(activeCategorySlug)}>
                {categories.map((category) => (
                  <MobileLink
                    key={category.slug}
                    href={"/" + category.slug}
                    label={category.title}
                    icon={categoryIcons[category.slug] ?? FileText}
                    active={activeCategorySlug === category.slug}
                    onClick={() => closeMenu()}
                  />
                ))}
              </NavGroup>

              <p className="text-xs leading-6 text-muted">选择案例、图解或素材，直接查看具体内容。</p>
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function NavGroup({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen: boolean
  children: React.ReactNode
}) {
  return (
    <details open={defaultOpen} className="group rounded-lg border border-line bg-white">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="grid gap-2 border-t border-line p-3">{children}</div>
    </details>
  )
}

function MobileLink({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}: NavLinkItem & { active: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
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
