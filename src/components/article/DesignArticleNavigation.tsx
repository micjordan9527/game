"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { articles } from "@/data/articles"
import { designArticleEntries } from "@/data/designObjects"
import { designArticleContext, designArticleEntry, designArticleHref, getDesignDirection, getDesignObject, validDesignReturnTo } from "@/lib/design-navigation"
import { resumeOperationReturnTo } from "@/lib/operation-navigation"
import type { ArticleReadingNavigation } from "@/lib/reading-order"
import { ArticleBreadcrumbs } from "./ArticleBreadcrumbs"
import { ArticlePager } from "./ArticlePager"
import { OperationArticleBreadcrumbs, OperationArticlePager } from "./OperationArticleNavigation"

function useDesignContext(articleSlug: string, category: string) {
  const params = useSearchParams()
  let context = designArticleContext(articleSlug, params)
  if (!context && category === "design" && !params.has("design") && !params.has("operation") && !params.has("returnTo")) {
    const entry = designArticleEntry(articleSlug), object = getDesignObject(entry?.object), direction = getDesignDirection(object, entry?.direction)
    if (entry && object && direction) context = { object, direction, reference: entry.reference, returnTo: `/design?object=${object.slug}&direction=${direction.slug}` }
  }
  useEffect(() => {
    if (context && window.location.pathname.endsWith(`/articles/${articleSlug}`)) {
      try { sessionStorage.setItem("wg-design-pending-return", context.returnTo) } catch { /* Explicit directory links remain available. */ }
    }
  }, [articleSlug, context?.returnTo])
  return context
}

export function DesignArticleBreadcrumbs({ articleSlug, title, category }: { articleSlug: string; title: string; category: { slug: string; title: string } | undefined }) {
  const context = useDesignContext(articleSlug, category?.slug ?? "")
  if (!context) return <OperationArticleBreadcrumbs articleSlug={articleSlug} title={title} category={category} />
  const parents = [{ href: "/articles", label: "知识图解" }, { href: "/design", label: "设计体验" }]
  if (context.object) {
    const url = new URL(context.returnTo, "https://knowledge.invalid")
    url.searchParams.set("object", context.object.slug); url.searchParams.delete("direction"); url.searchParams.delete("format")
    parents.push({ href: url.pathname + "?" + url.searchParams, label: context.object.title })
    if (context.direction) { url.searchParams.set("direction", context.direction.slug); parents.push({ href: url.pathname + "?" + url.searchParams, label: context.direction.title }) }
  }
  return <ArticleBreadcrumbs title={title} parents={parents} />
}

export function DesignArticlePager({ articleSlug, category, navigation }: { articleSlug: string; category: string; navigation: ArticleReadingNavigation }) {
  const context = useDesignContext(articleSlug, category)
  if (!context) return <OperationArticlePager articleSlug={articleSlug} category={category} navigation={navigation} />
  const pathHref = resumeOperationReturnTo(context.returnTo)
  const label = ["设计体验", context.object?.title, context.direction?.title].filter(Boolean).join(" · ")
  if (context.reference) return <nav aria-label="连续阅读" className="container-shell max-w-4xl border-t border-line py-8"><p className="text-sm text-muted">{label} · 相关参考</p><Link href={pathHref} className="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700">返回设计目录 →</Link></nav>
  const ordered = designArticleEntries.filter((entry) => entry.object === context.object?.slug && entry.direction === context.direction?.slug && !entry.reference).map((entry) => articles.find((article) => article.slug === entry.slug)!)
  const position = ordered.findIndex((article) => article.slug === articleSlug), previous = ordered[position - 1], next = ordered[position + 1]
  return <ArticlePager navigation={{ pathTitle: label, pathHref, position: position + 1, total: ordered.length, previous, next }} previousHref={previous ? designArticleHref(previous.slug, context.returnTo) : undefined} nextHref={next ? designArticleHref(next.slug, context.returnTo) : undefined} returnLabel="返回设计目录" />
}

export function DesignDirectoryReturnLink() {
  const params = useSearchParams(), returnTo = validDesignReturnTo(params.get("returnTo"))
  useEffect(() => { if (returnTo) { try { sessionStorage.setItem("wg-design-pending-return", returnTo) } catch { /* Browser history remains available. */ } } }, [returnTo])
  return <Link href={returnTo ? resumeOperationReturnTo(returnTo) : "/design"} className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700">← 返回设计目录</Link>
}
