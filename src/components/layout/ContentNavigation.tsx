"use client"

import Link from "next/link"
import { Suspense, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { getContentNavigation, knowledgeCategory, type ContentNavItem, type DesignNavContext, type RoleNavContext } from "@/lib/content-navigation"
import { articles } from "@/data/articles"
import type { OperationGroup } from "@/data/operationGroups"
import { articleOperationGroup, getOperationGroup, operationArticleContext, operationReturnTo } from "@/lib/operation-navigation"
import { designArticleContext, designArticleEntry, designReturnTo, getDesignDirection, getDesignObject, validDesignReturnTo } from "@/lib/design-navigation"
import { getRoleDirectory, getRoleGroup, roleArticleContext, roleReturnTo } from "@/lib/role-navigation"
import { getRoleIdentity } from "@/lib/role-identities"

export function ContentNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return <Suspense fallback={<ContentNavigationView pathname={pathname} onNavigate={onNavigate} />}><ContentNavigationWithContext pathname={pathname} onNavigate={onNavigate} /></Suspense>
}

function ContentNavigationWithContext({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const params = useSearchParams()
  const slug = pathname.startsWith("/articles/") ? pathname.split("/")[2] : ""
  let work: RoleNavContext | undefined = slug ? roleArticleContext(slug, params) ?? undefined : undefined
  const libraryRole = pathname === "/product" ? getRoleDirectory("product") : pathname === "/articles" ? getRoleDirectory(params.get("role")) : undefined
  if (libraryRole) work = { role: libraryRole, group: getRoleGroup(libraryRole, params.get("group")), returnTo: roleReturnTo(libraryRole, pathname === "/product" ? "topic" : "library", params) }
  let design: DesignNavContext | undefined = slug ? designArticleContext(slug, params) ?? undefined : undefined
  if (!design && !params.has("operation") && !params.has("returnTo") && articles.find((article) => article.slug === slug)?.category === "design") {
    const entry = designArticleEntry(slug), object = getDesignObject(entry?.object)
    design = { object, direction: getDesignDirection(object, entry?.direction), returnTo: `/design?object=${object?.slug}&direction=${entry?.direction}` }
  }
  if (pathname === "/design" || (pathname === "/articles" && ["design", "interaction"].includes(getRoleIdentity(params.get("role"))?.slug ?? ""))) {
    const interaction = getRoleIdentity(params.get("role"))?.slug === "interaction"
    const object = getDesignObject(interaction ? "digital" : params.get("object"))
    design = { object, direction: getDesignDirection(object, interaction ? "interaction" : params.get("direction")), returnTo: designReturnTo(pathname === "/design" ? "topic" : "library", params) }
  } else if (pathname.startsWith("/design/") && pathname !== "/design/material-standards" && params.has("design")) {
    const object = getDesignObject(params.get("design"))
    if (object) design = { object, direction: getDesignDirection(object, params.get("direction")), returnTo: validDesignReturnTo(params.get("returnTo")) ?? `/design?object=${object.slug}` }
  }
  let operation = !design && slug ? operationArticleContext(slug, params) ?? undefined : undefined
  if (!design && !operation && !params.has("operation") && !params.has("returnTo") && articles.find((article) => article.slug === slug)?.category === "operation") {
    const group = articleOperationGroup(slug)
    operation = { group, returnTo: group ? `/operation?group=${group.slug}` : "/operation" }
  }
  if (pathname === "/operation" || (pathname === "/articles" && getRoleIdentity(params.get("role"))?.slug === "operation")) {
    operation = { group: getOperationGroup(params.get("group")), returnTo: operationReturnTo(pathname === "/operation" ? "topic" : "library", params) }
  }
  return <ContentNavigationView pathname={pathname} operation={operation} design={design} work={work} onNavigate={onNavigate} />
}

function ContentNavigationView({ pathname, operation, design, work, onNavigate }: { pathname: string; operation?: { group?: OperationGroup; returnTo: string }; design?: DesignNavContext; work?: RoleNavContext; onNavigate?: () => void }) {
  const category = design ? "design" : operation ? "operation" : knowledgeCategory(pathname)
  const entry = (item: ContentNavItem, nested = false): ReactNode => {
    const target = new URL(item.href, "https://knowledge.invalid")
    const current = pathname === target.pathname && (!work || target.pathname.startsWith("/articles/") || (target.searchParams.has("group") ? target.searchParams.get("group") === work.group?.slug : item.href !== "/articles" && !work.group))
    const parent = !current && (item.href === "/" + category || !!work && target.pathname === new URL(work.returnTo, "https://knowledge.invalid").pathname && !target.searchParams.has("group") && item.href !== "/articles")
    return <li key={item.href}>
      <Link href={item.href} onClick={onNavigate} aria-current={current ? "page" : parent ? "location" : undefined}
        className={`flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-md px-3 py-2 leading-6 transition ${nested ? "text-xs" : "text-sm"} ${current ? "bg-ink font-medium text-white" : parent ? "bg-brand-50 font-semibold text-brand-700" : "text-muted hover:bg-paper hover:text-ink"}`}>
        <span className="min-w-0">{item.label}</span>{item.meta ? <span className="shrink-0 text-xs opacity-70">{item.meta}</span> : null}
      </Link>
      {item.children?.length ? <ul className="my-1 ml-5 space-y-1 border-l border-line pl-2">{item.children.map((child) => entry(child, true))}</ul> : null}
    </li>
  }
  return <div data-context-navigation className="space-y-6">{getContentNavigation(pathname, operation, design, work).map((group) => <section key={group.title}>
    <h3 className="px-3 text-xs font-semibold text-muted">{group.title}</h3>
    <ul className="mt-3 space-y-1">{group.items.map((item) => entry(item))}</ul>
  </section>)}</div>
}
