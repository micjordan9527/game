"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { isNavigationSectionActive } from "@/lib/content-navigation"

const links = [
  { href: "/cases", label: "案例" },
  { href: "/articles", label: "知识图解" },
  { href: "/ai-workflows", label: "AI 工作流" },
  { href: "/design/material-standards", label: "素材规范" },
  { href: "/glossary", label: "术语库" },
  { href: "/templates", label: "模板库" },
  { href: "/updates", label: "更新记录" },
  { href: "/search", label: "搜索" },
]

export function TopNavigation() {
  const pathname = usePathname()
  return (
    <nav aria-label="顶部导航" className="hidden items-center gap-1 xl:flex">
      {links.map((link) => {
        const current = pathname === link.href
        const active = isNavigationSectionActive(pathname, link.href)
        const utility = link.href === "/updates" || link.href === "/search"
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-label={link.href === "/search" ? "全站搜索" : undefined}
            aria-current={current ? "page" : active ? "location" : undefined}
            className={[
              "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700",
              active ? "bg-brand-50 text-brand-700" : "text-muted",
              utility ? "border border-line" : "",
              link.href === "/updates" ? "ml-3" : "",
            ].join(" ")}
          >
            {link.href === "/search" ? <Search className="h-4 w-4" aria-hidden="true" /> : null}
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
