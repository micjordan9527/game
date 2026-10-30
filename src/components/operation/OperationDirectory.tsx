"use client"

import Link from "next/link"
import { useEffect, useRef, type MouseEvent } from "react"
import { useSearchParams } from "next/navigation"
import type { Article } from "@/data/articles"
import { operationGroups } from "@/data/operationGroups"
import { ArticleCard } from "@/components/common/ArticleCard"
import { operationArticleHref, operationReturnTo } from "@/lib/operation-navigation"

type SavedView = { url: string; top: number; tagsOpen: boolean; rolesOpen?: boolean; referencesOpen: boolean }

export function OperationDirectory({ articles, source = "topic" }: { articles: Article[]; source?: "topic" | "library" }) {
  const params = useSearchParams()
  const root = useRef<HTMLElement>(null)
  const returnTo = operationReturnTo(source, params)
  const available = new Map(articles.map((article) => [article.slug, article]))
  const groups = operationGroups.map((group) => ({ ...group, entries: group.entries.filter((entry) => available.has(entry.slug)) })).filter((group) => group.entries.length)
  const selected = groups.find((group) => group.slug === params.get("group"))
  const groupedSlugs = new Set<string>(operationGroups.flatMap((group) => group.entries.map((entry) => entry.slug)))
  const references = articles.filter((article) => !groupedSlugs.has(article.slug))

  function rememberArticle(event: MouseEvent<HTMLElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
    if (!anchor || !new URL(anchor.href).pathname.includes("/articles/")) return
    const view: SavedView = { url: returnTo, top: window.scrollY, tagsOpen: document.querySelector<HTMLDetailsElement>("details[data-article-tags]")?.open === true, rolesOpen: document.querySelector<HTMLDetailsElement>("details[data-role-picker]")?.open === true, referencesOpen: root.current?.querySelector<HTMLDetailsElement>("details[data-operation-references]")?.open === true }
    window.history.replaceState({ ...window.history.state, operationDirectoryReturn: view }, "")
    try {
      sessionStorage.setItem("wg-operation-return:" + returnTo, JSON.stringify(view))
      sessionStorage.setItem("wg-operation-pending-return", returnTo)
    } catch { /* Browser history still keeps the return position. */ }
  }

  useEffect(() => {
    if (!window.location.pathname.endsWith(source === "library" ? "/articles" : "/operation")) return
    let frame = 0
    let saved = window.history.state?.operationDirectoryReturn as SavedView | undefined
    try {
      if (params.get("resume") === "1" || sessionStorage.getItem("wg-operation-pending-return") === returnTo) {
        saved = JSON.parse(sessionStorage.getItem("wg-operation-return:" + returnTo) ?? "null") ?? saved
      }
    } catch { /* The directory remains usable without storage. */ }
    if (saved?.url === returnTo && Number.isFinite(saved.top)) {
      const tags = document.querySelector<HTMLDetailsElement>("details[data-article-tags]")
      if (tags) tags.open = saved.tagsOpen
      const roles = document.querySelector<HTMLDetailsElement>("details[data-role-picker]"); if (roles && typeof saved.rolesOpen === "boolean") roles.open = saved.rolesOpen
      const references = root.current?.querySelector<HTMLDetailsElement>("details[data-operation-references]")
      if (references) references.open = saved.referencesOpen === true
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => {
        window.scrollTo({ top: saved!.top, behavior: "instant" })
        try { if (sessionStorage.getItem("wg-operation-pending-return") === returnTo) sessionStorage.removeItem("wg-operation-pending-return") } catch { /* Position restoration does not require storage writes. */ }
        const query = new URLSearchParams(window.location.search)
        query.delete("resume")
        window.history.replaceState({ ...window.history.state, operationDirectoryReturn: null }, "", window.location.pathname + (query.size ? "?" + query : ""))
      }) })
    } else if (params.has("resume")) {
      const query = new URLSearchParams(window.location.search)
      query.delete("resume")
      window.history.replaceState(window.history.state, "", window.location.pathname + (query.size ? "?" + query : ""))
    }
    return () => cancelAnimationFrame(frame)
  }, [returnTo, params, source])

  function selectGroup(group?: string) {
    const query = new URLSearchParams(window.location.search)
    if (group) query.set("group", group)
    else query.delete("group")
    query.delete("resume")
    window.history.pushState(null, "", window.location.pathname + (query.size ? "?" + query : ""))
    root.current?.scrollIntoView({ block: "start", behavior: "instant" })
  }

  return <section ref={root} data-operation-directory data-selected-group={selected?.slug ?? "all"} aria-label="运营工作目录" className="scroll-mt-20" onClickCapture={rememberArticle}>
    <div role="group" aria-label="运营分类" className="sticky top-16 z-10 mb-6 flex gap-2 overflow-x-auto border-b border-line bg-white/95 py-3 backdrop-blur">
      {[{ slug: "all", title: "全部", count: articles.length }, ...groups.map((group) => ({ slug: group.slug, title: group.title, count: group.entries.length }))].map((group) => <button key={group.slug} type="button" data-operation-filter={group.slug} aria-pressed={(selected?.slug ?? "all") === group.slug} onClick={() => selectGroup(group.slug === "all" ? undefined : group.slug)} className={`min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${((selected?.slug ?? "all") === group.slug) ? "bg-brand-700 text-white" : "bg-paper text-muted hover:text-ink"}`}>
        {group.title}<span className="ml-2 text-xs opacity-70">{group.count}</span>
      </button>)}
    </div>
    {(selected ? [selected] : groups).map((group) => <section key={group.slug} data-operation-group={group.slug} aria-labelledby={`operation-${group.slug}-title`} className="mb-10">
      <h2 id={`operation-${group.slug}-title`} className="text-xl font-semibold text-ink">{group.title}<span className="ml-3 text-sm font-normal text-muted">{group.entries.length} 篇图解</span></h2>
      <p className="mt-2 text-sm leading-7 text-muted">{group.description}</p>
      <ol aria-label={`${group.title}查看顺序`} className="my-4 flex flex-wrap gap-2">
        {group.entries.map((entry, index) => <li key={entry.slug}><Link href={operationArticleHref(entry.slug, returnTo)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-brand-700 hover:bg-brand-50"><span className="font-semibold">{index + 1}</span>{entry.step}</Link></li>)}
      </ol>
      <div className="grid gap-4 md:grid-cols-2">
        {group.entries.map((entry, index) => <ArticleCard key={entry.slug} article={available.get(entry.slug)!} href={operationArticleHref(entry.slug, returnTo)} stepLabel={`${index + 1} · ${entry.step}`} />)}
      </div>
    </section>)}
    {!selected && references.length ? <details data-operation-references className="mb-6 rounded-lg border border-line bg-white p-4">
      <summary className="cursor-pointer text-base font-semibold text-ink">相关参考 · {references.length} 篇</summary>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{references.map((article) => <ArticleCard key={article.slug} article={article} href={operationArticleHref(article.slug, returnTo)} />)}</div>
    </details> : null}
    {!articles.length ? <p className="rounded-lg border border-line bg-paper p-6 text-sm text-muted">没有符合筛选条件的运营图解。</p> : null}
  </section>
}
