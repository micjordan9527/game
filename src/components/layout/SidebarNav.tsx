"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Braces,
  ChartNoAxesCombined,
  Compass,
  FileSearch,
  FileText,
  FolderKanban,
  Library,
  MonitorCog,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { articles } from "@/data/articles"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
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
  { href: "/articles", label: "文章资料库", icon: FileText, suffix: String(articles.length) },
  { href: "/ai-workflows", label: "AI 工作流库", icon: Sparkles, suffix: String(aiWorkflows.length) },
  { href: "/search", label: "全站搜索", icon: Search },
  { href: "/glossary", label: "术语库", icon: BookOpen },
  { href: "/templates", label: "模板库", icon: Library },
]

export function SidebarNav() {
  const pathname = usePathname()
  const currentArticleSlug = pathname.startsWith("/articles/") ? pathname.split("/").filter(Boolean)[1] : undefined
  const currentArticle = currentArticleSlug ? articles.find((article) => article.slug === currentArticleSlug) : undefined
  const activeCategorySlug = currentArticle?.category ?? (pathname.startsWith("/sports") ? "sportsbook" : categories.find((category) => pathname === `/${category.slug}`)?.slug)

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line/80 bg-white/75 px-4 py-5 backdrop-blur lg:block">
      <nav className="flex h-full flex-col gap-6 overflow-y-auto pr-1" aria-label="知识库导航">
        <section>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted">资料入口</p>
          <div className="mt-3 space-y-1">
            {resourceLinks.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} icon={item.icon} active={pathname === item.href || pathname.startsWith(`${item.href}/`)} suffix={item.suffix} />
            ))}
          </div>
        </section>

        <section>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted">案例模块</p>
          <div className="mt-3 space-y-1">
            {caseNavItems.map((item) => (
              <SidebarLink key={item.href} href={item.href} label={item.label} icon={FileSearch} active={pathname === item.href} />
            ))}
          </div>
        </section>

        <section>
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted">知识栏目</p>
          <div className="mt-3 space-y-1">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] ?? FileText
              const categoryArticles = articles.filter((article) => article.category === category.slug)
              const categorySportsModules = category.slug === "sportsbook" ? sportsModules : []
              const expanded = activeCategorySlug === category.slug
              const categoryCount = categoryArticles.length + categorySportsModules.length

              return (
                <div key={category.slug}>
                  <SidebarLink
                    href={`/${category.slug}`}
                    label={category.title}
                    icon={Icon}
                    active={pathname === `/${category.slug}` || (category.slug === "sportsbook" && pathname.startsWith("/sports"))}
                    suffix={categoryCount > 0 ? String(categoryCount) : undefined}
                  />
                  {expanded && categoryCount > 0 ? (
                    <div className="ml-6 mt-1 space-y-1 border-l border-line pl-3">
                      {categoryArticles.map((article) => {
                        const active = pathname === `/articles/${article.slug}`

                        return (
                          <Link
                            key={article.slug}
                            href={`/articles/${article.slug}`}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "block rounded-md px-2 py-1.5 text-xs leading-5 transition",
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
                            className={[
                              "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs leading-5 transition",
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
    </aside>
  )
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  active,
  suffix,
}: {
  href: string
  label: string
  icon: LucideIcon
  active: boolean
  suffix?: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition",
        active ? "bg-ink text-white shadow-soft" : "text-muted hover:bg-paper hover:text-ink",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {suffix ? (
        <span className={active ? "text-xs text-white/75" : "text-xs text-muted/70"}>{suffix}</span>
      ) : null}
    </Link>
  )
}
