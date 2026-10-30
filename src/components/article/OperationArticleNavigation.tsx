"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { articles } from "@/data/articles"
import { ArticleBreadcrumbs } from "./ArticleBreadcrumbs"
import { ArticlePager } from "./ArticlePager"
import { articleOperationGroup, operationArticleContext, operationArticleHref, resumeOperationReturnTo } from "@/lib/operation-navigation"
import type { ArticleReadingNavigation } from "@/lib/reading-order"

function useOperationContext(articleSlug: string, category: string) {
  const params = useSearchParams()
  const requested = operationArticleContext(articleSlug, params)
  let context = requested
  if (!context && !params.has("operation") && !params.has("returnTo") && category === "operation") {
    const group = articleOperationGroup(articleSlug)
    context = { group, returnTo: group ? `/operation?group=${group.slug}` : "/operation" }
  }
  useEffect(() => {
    if (context && window.location.pathname.endsWith(`/articles/${articleSlug}`)) {
      try { sessionStorage.setItem("wg-operation-pending-return", context.returnTo) } catch { /* Explicit return links still work without storage. */ }
    }
  }, [articleSlug, context?.returnTo])
  return context
}

export function OperationArticleBreadcrumbs({ articleSlug, title, category }: { articleSlug: string; title: string; category: { slug: string; title: string } | undefined }) {
  const context = useOperationContext(articleSlug, category?.slug ?? "")
  const parents = [{ href: "/articles", label: "知识图解" }]
  if (context) {
    parents.push({ href: "/operation", label: "运营场景" })
    if (context.group) {
      const target = new URL(context.returnTo, "https://knowledge.invalid")
      target.searchParams.set("group", context.group.slug)
      parents.push({ href: target.pathname + "?" + target.searchParams, label: context.group.title })
    }
  } else if (category) parents.push({ href: "/" + category.slug, label: category.title })
  return <ArticleBreadcrumbs title={title} parents={parents} />
}

export function OperationArticlePager({ articleSlug, category, navigation }: { articleSlug: string; category: string; navigation: ArticleReadingNavigation }) {
  const context = useOperationContext(articleSlug, category)
  if (!context) return <ArticlePager navigation={navigation} />
  const pathHref = resumeOperationReturnTo(context.returnTo)
  if (!context.group) return <nav aria-label="连续阅读" className="container-shell max-w-4xl border-t border-line py-8"><p className="text-sm text-muted">运营场景 · 相关参考</p><Link href={pathHref} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700">返回运营目录 →</Link></nav>
  const group = context.group
  const ordered = group.entries.map((entry) => articles.find((article) => article.slug === entry.slug)!)
  const position = ordered.findIndex((article) => article.slug === articleSlug)
  const previous = ordered[position - 1], next = ordered[position + 1]
  return <ArticlePager navigation={{ pathTitle: `运营场景 · ${group.title}`, pathHref, position: position + 1, total: ordered.length, previous, next }}
    previousHref={previous ? operationArticleHref(previous.slug, context.returnTo) : undefined}
    nextHref={next ? operationArticleHref(next.slug, context.returnTo) : undefined}
    returnLabel="返回运营目录" />
}
