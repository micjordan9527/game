"use client"

import Link from "next/link"
import { Suspense, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { getContentNavigation, knowledgeCategory, type ContentNavItem } from "@/lib/content-navigation"
import { articles } from "@/data/articles"
import type { OperationGroup } from "@/data/operationGroups"
import { articleOperationGroup, getOperationGroup, operationArticleContext, operationReturnTo } from "@/lib/operation-navigation"

export function ContentNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <Suspense fallback={<ContentNavigationView pathname={pathname} onNavigate={onNavigate} />}><ContentNavigationWithContext pathname={pathname} onNavigate={onNavigate} /></Suspense>
}

function ContentNavigationWithContext({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const params = useSearchParams()
  const slug = pathname.startsWith("/articles/") ? pathname.split("/")[2] : ""
  let operation = slug ? operationArticleContext(slug, params) ?? undefined : undefined
  if (!operation && !params.has("operation") && !params.has("returnTo") && articles.find((article) => article.slug === slug)?.category === "operation") {
    const group = articleOperationGroup(slug)
    operation = { group, returnTo: group ? `/operation?group=${group.slug}` : "/operation" }
  }
  if (pathname === "/operation" || (pathname === "/articles" && params.get("role") === "operation")) {
    operation = { group: getOperationGroup(params.get("group")), returnTo: operationReturnTo(pathname === "/operation" ? "topic" : "library", params) }
  }
  return <ContentNavigationView pathname={pathname} operation={operation} onNavigate={onNavigate} />
}

function ContentNavigationView({ pathname, operation, onNavigate }: { pathname: string; operation?: { group?: OperationGroup; returnTo: string }; onNavigate?: () => void }) {
  const category = operation ? "operation" : knowledgeCategory(pathname)
  const entry = (item: ContentNavItem, nested = false): ReactNode => {
    const current = pathname === item.href.split("?")[0]
    const parent = !current && item.href === "/" + category
    return <li key={item.href}>
      <Link href={item.href} onClick={onNavigate} aria-current={current ? "page" : parent ? "location" : undefined}
        className={`flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-md px-3 py-2 leading-6 transition ${nested ? "text-xs" : "text-sm"} ${current ? "bg-ink font-medium text-white" : parent ? "bg-brand-50 font-semibold text-brand-700" : "text-muted hover:bg-paper hover:text-ink"}`}>
        <span className="min-w-0">{item.label}</span>{item.meta ? <span className="shrink-0 text-xs opacity-70">{item.meta}</span> : null}
      </Link>
      {item.children?.length ? <ul className="my-1 ml-5 space-y-1 border-l border-line pl-2">{item.children.map((child) => entry(child, true))}</ul> : null}
    </li>
  }
  return <div data-context-navigation className="space-y-6">{getContentNavigation(pathname, operation).map((group) => <section key={group.title}>
    <h3 className="px-3 text-xs font-semibold text-muted">{group.title}</h3>
    <ul className="mt-3 space-y-1">{group.items.map((item) => entry(item))}</ul>
  </section>)}</div>
}
