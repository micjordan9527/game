"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BookOpen,
  Braces,
  ChartNoAxesCombined,
  Compass,
  FileSearch,
  FileText,
  FolderKanban,
  Home,
  Library,
  Menu,
  MonitorCog,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { articles } from "@/data/articles"
import { categories } from "@/data/categories"
import { sportsModules } from "@/data/sports"
import { caseNavItems } from "@/lib/site"

const categoryIcons: Record<string, LucideIcon> = {
  industry: Compass,
  sportsbook: ChartNoAxesCombined,
  "white-label": Package,
  product: FolderKanban,
  operation: Sparkles,
  design: MonitorCog,
  development: Braces,
  "devops-risk": ShieldCheck,
}

type NavLinkItem = {
  href: string
  label: string
  icon: LucideIcon
  suffix?: string
}

const resourceLinks: NavLinkItem[] = [
  { href: "/", label: "首页", icon: Home },
  { href: "/articles", label: "文章资料库", icon: FileText },
  { href: "/ai-workflows", label: "AI 工作流库", icon: Sparkles },
  { href: "/search", label: "全站搜索", icon: Search },
  { href: "/glossary", label: "术语库", icon: BookOpen },
  { href: "/templates", label: "模板库", icon: Library },
]

const learningPathLinks = [
  { href: "/industry", label: "新手起步", icon: Compass },
  { href: "/product", label: "结构展开", icon: FolderKanban },
  { href: "/devops-risk", label: "交付复盘", icon: ShieldCheck },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentArticleSlug = pathname.startsWith("/articles/") ? pathname.split("/").filter(Boolean)[1] : undefined
  const currentArticle = currentArticleSlug ? articles.find((article) => article.slug === currentArticleSlug) : undefined
  const activeCategorySlug = currentArticle?.category ?? (pathname.startsWith("/sports") ? "sportsbook" : categories.find((category) => pathname === `/${category.slug}`)?.slug)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "关闭导航" : "打开导航"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-ink"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-white shadow-soft">
          <nav className="container-shell space-y-5 py-4" aria-label="移动端知识库导航">
            <section>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">资料入口</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {resourceLinks.map((item) => (
                  <MobileLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} suffix={item.suffix} onClick={closeMenu} />
                ))}
              </div>
            </section>

            <section>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">学习路径</p>
              <div className="mt-2 grid gap-2">
                {learningPathLinks.map((item) => (
                  <MobileLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href} onClick={closeMenu} />
                ))}
              </div>
            </section>

            <section>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">案例模块</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {caseNavItems.map((item) => (
                  <MobileLink key={item.href} href={item.href} label={item.label} icon={FileSearch} active={pathname === item.href} onClick={closeMenu} />
                ))}
              </div>
            </section>

            <section>
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">知识栏目</p>
              <div className="mt-2 space-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.slug] ?? FileText
                  const categoryArticles = articles.filter((article) => article.category === category.slug)
                  const categorySportsModules = category.slug === "sportsbook" ? sportsModules : []
                  const expanded = activeCategorySlug === category.slug
                  const categoryCount = categoryArticles.length + categorySportsModules.length

                  return (
                    <div key={category.slug}>
                      <MobileLink
                        href={`/${category.slug}`}
                        label={category.title}
                        icon={Icon}
                        active={pathname === `/${category.slug}` || (category.slug === "sportsbook" && pathname.startsWith("/sports"))}
                        suffix={categoryCount > 0 ? String(categoryCount) : undefined}
                        onClick={closeMenu}
                      />
                      {expanded && categoryCount > 0 ? (
                        <div className="ml-5 mt-1 space-y-1 border-l border-line pl-3">
                          {categoryArticles.map((article) => {
                            const active = pathname === `/articles/${article.slug}`

                            return (
                              <Link
                                key={article.slug}
                                href={`/articles/${article.slug}`}
                                aria-current={active ? "page" : undefined}
                                onClick={closeMenu}
                                className={[
                                  "block rounded-md px-2 py-2 text-xs leading-5 transition",
                                  active ? "bg-brand-50 font-medium text-brand-700" : "text-muted hover:bg-paper hover:text-ink",
                                ].join(" ")}
                              >
                                <span className="line-clamp-2">{article.title}</span>
                              </Link>
                            )
                          })}
                          {categorySportsModules.map((module) => {
                            const active = pathname === module.href

                            return (
                              <Link
                                key={module.slug}
                                href={module.href}
                                aria-current={active ? "page" : undefined}
                                onClick={closeMenu}
                                className={[
                                  "flex items-center gap-2 rounded-md px-2 py-2 text-xs leading-5 transition",
                                  active ? "bg-brand-50 font-medium text-brand-700" : "text-muted hover:bg-paper hover:text-ink",
                                  module.status === "待开放" ? "pointer-events-none opacity-60" : "",
                                ].join(" ")}
                              >
                                <Trophy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span className="min-w-0 flex-1 truncate">{module.title}</span>
                                <span className="text-[10px] text-muted/70">{module.status}</span>
                              </Link>
                            )
                          })}
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </section>
          </nav>
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
  onClick,
  suffix,
}: {
  href: string
  label: string
  icon: LucideIcon
  active: boolean
  onClick: () => void
  suffix?: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={[
        "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition",
        active ? "bg-ink text-white shadow-soft" : "bg-white text-muted ring-1 ring-line hover:bg-paper hover:text-ink",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {suffix ? <span className={active ? "text-xs text-white/75" : "text-xs text-muted/70"}>{suffix}</span> : null}
    </Link>
  )
}
