"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { articles } from "@/data/articles"
import { roleArticleContext, roleArticleHref } from "@/lib/role-navigation"
import { resumeOperationReturnTo } from "@/lib/operation-navigation"
import type { ArticleReadingNavigation } from "@/lib/reading-order"
import { ArticleBreadcrumbs } from "./ArticleBreadcrumbs"
import { ArticlePager } from "./ArticlePager"
import { DesignArticleBreadcrumbs, DesignArticlePager } from "./DesignArticleNavigation"

function useRoleContext(slug: string) {
  const params = useSearchParams(), context = roleArticleContext(slug, params)
  useEffect(() => { if (context && window.location.pathname.endsWith("/articles/" + slug)) { try { sessionStorage.setItem("wg-role-pending-return", context.returnTo) } catch { /* Explicit return remains available. */ } } }, [slug, context?.returnTo])
  return context
}
export function RoleArticleBreadcrumbs(props: { articleSlug: string; title: string; category: { slug: string; title: string } | undefined }) {
  const context = useRoleContext(props.articleSlug)
  if (!context) return <DesignArticleBreadcrumbs {...props} />
  const parents = [{ href: "/articles", label: "知识图解" }, { href: `/articles?role=${context.role.id}`, label: context.role.title }]
  if (context.group) {
    const target = new URL(context.returnTo, "https://knowledge.invalid"); target.searchParams.set("group", context.group.slug)
    parents.push({ href: target.pathname + "?" + target.searchParams, label: context.group.title })
  }
  return <ArticleBreadcrumbs title={props.title} parents={parents} />
}
export function RoleArticlePager(props: { articleSlug: string; category: string; navigation: ArticleReadingNavigation }) {
  const context = useRoleContext(props.articleSlug)
  if (!context) return <DesignArticlePager {...props} />
  const pathHref = resumeOperationReturnTo(context.returnTo)
  if (!context.group || context.reference) return <nav aria-label="连续阅读" className="container-shell max-w-4xl border-t border-line py-8"><p className="text-sm text-muted">{context.role.title} · 相关参考</p><Link href={pathHref} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700">返回角色目录 →</Link></nav>
  const ordered = context.group.entries.filter((entry) => !entry.reference).map((entry) => articles.find((article) => article.slug === entry.slug)!)
  const index = ordered.findIndex((article) => article.slug === props.articleSlug), previous = ordered[index - 1], next = ordered[index + 1]
  return <ArticlePager navigation={{ pathTitle: `${context.role.title} · ${context.group.title}`, pathHref, position: index + 1, total: ordered.length, previous, next }} previousHref={previous ? roleArticleHref(previous.slug, context.role, context.returnTo) : undefined} nextHref={next ? roleArticleHref(next.slug, context.role, context.returnTo) : undefined} returnLabel="返回角色目录" />
}
