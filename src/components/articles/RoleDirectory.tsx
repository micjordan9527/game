"use client"

import { useEffect, useRef, type MouseEvent } from "react"
import { useSearchParams } from "next/navigation"
import type { Article } from "@/data/articles"
import type { RoleDirectoryDefinition } from "@/data/roleGroups"
import { ArticleCard } from "@/components/common/ArticleCard"
import { getRoleGroup, roleArticleHref, roleReturnTo } from "@/lib/role-navigation"

type SavedView = { url: string; top: number; tagsOpen: boolean; rolesOpen?: boolean }
export function RoleDirectory({ definition, articles, source = "library" }: { definition: RoleDirectoryDefinition; articles: Article[]; source?: "topic" | "library" }) {
  const params = useSearchParams(), root = useRef<HTMLElement>(null)
  const returnTo = roleReturnTo(definition, source, params), selected = getRoleGroup(definition, params.get("group"))
  const available = new Map(articles.map((article) => [article.slug, article]))
  const groups = definition.groups.map((group) => ({ ...group, entries: group.entries.filter((entry) => available.has(entry.slug)) }))
  const assigned = new Set(definition.groups.flatMap((group) => group.entries.map((entry) => entry.slug)))
  const referenceOrder = [...definition.references.map((entry) => entry.slug), ...articles.filter((article) => !assigned.has(article.slug)).map((article) => article.slug)]
  const references = [...new Set(referenceOrder)].filter((slug) => available.has(slug) && !assigned.has(slug))
  const shown = selected ? groups.filter((group) => group.slug === selected.slug) : groups.filter((group) => group.entries.length)
  function remember(event: MouseEvent<HTMLElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
    if (!anchor || anchor.origin !== window.location.origin) return
    const view: SavedView = { url: returnTo, top: scrollY, tagsOpen: document.querySelector<HTMLDetailsElement>("details[data-article-tags]")?.open === true, rolesOpen: document.querySelector<HTMLDetailsElement>("details[data-role-picker]")?.open === true }
    window.history.replaceState({ ...window.history.state, roleDirectoryReturn: view }, "")
    try { sessionStorage.setItem("wg-role-return:" + returnTo, JSON.stringify(view)); sessionStorage.setItem("wg-role-pending-return", returnTo) } catch { /* Browser history still keeps the view. */ }
  }
  useEffect(() => {
    if (!window.location.pathname.endsWith(source === "topic" ? "/product" : "/articles")) return
    let frame = 0, saved = window.history.state?.roleDirectoryReturn as SavedView | undefined
    try { if (params.get("resume") === "1" || sessionStorage.getItem("wg-role-pending-return") === returnTo) saved = JSON.parse(sessionStorage.getItem("wg-role-return:" + returnTo) ?? "null") ?? saved } catch { /* A blocked store does not affect filtering. */ }
    if (saved?.url === returnTo && Number.isFinite(saved.top)) {
      const tags = document.querySelector<HTMLDetailsElement>("details[data-article-tags]"); if (tags) tags.open = saved.tagsOpen
      const roles = document.querySelector<HTMLDetailsElement>("details[data-role-picker]"); if (roles && typeof saved.rolesOpen === "boolean") roles.open = saved.rolesOpen
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => {
        scrollTo({ top: saved!.top, behavior: "instant" })
        try { if (sessionStorage.getItem("wg-role-pending-return") === returnTo) sessionStorage.removeItem("wg-role-pending-return") } catch { /* The view has already been restored. */ }
        const query = new URLSearchParams(window.location.search); query.delete("resume")
        window.history.replaceState({ ...window.history.state, roleDirectoryReturn: null }, "", window.location.pathname + (query.size ? "?" + query : ""))
      }) })
    } else if (params.has("resume")) {
      const query = new URLSearchParams(window.location.search); query.delete("resume")
      window.history.replaceState(window.history.state, "", window.location.pathname + (query.size ? "?" + query : ""))
      try { if (sessionStorage.getItem("wg-role-pending-return") === returnTo) sessionStorage.removeItem("wg-role-pending-return") } catch { /* There is no stored view to restore. */ }
    }
    return () => cancelAnimationFrame(frame)
  }, [returnTo, params, source])
  function select(group: string) {
    const query = new URLSearchParams(window.location.search)
    if (group) query.set("group", group); else query.delete("group")
    query.delete("resume")
    window.history.pushState(null, "", window.location.pathname + (query.size ? "?" + query : ""))
    root.current?.scrollIntoView({ block: "start", behavior: "instant" })
  }
  const chip = (active: boolean) => `min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-brand-700 text-white" : "bg-paper text-muted hover:text-ink"}`
  return <section ref={root} aria-label="角色资料目录" data-role-directory={definition.id} data-selected-group={selected?.slug ?? "all"} className="min-w-0 scroll-mt-20" onClickCapture={remember}>
    <p className="mb-4 text-sm leading-7 text-muted">{definition.description}</p>
    {definition.groups.length > 1 ? <div role="group" aria-label="工作分类" className="sticky top-16 z-10 mb-6 flex gap-2 overflow-x-auto border-b border-line bg-white/95 py-3 backdrop-blur">
      <button type="button" data-role-group-filter="all" aria-pressed={!selected} onClick={() => select("")} className={chip(!selected)}>全部<span className="ml-2 text-xs opacity-70">{articles.length}</span></button>
      {groups.filter((group) => !params.get("tag") || group.entries.length || selected?.slug === group.slug).map((group) => <button key={group.slug} type="button" data-role-group-filter={group.slug} aria-pressed={selected?.slug === group.slug} onClick={() => select(group.slug)} className={chip(selected?.slug === group.slug)}>{group.title}<span className="ml-2 text-xs opacity-70">{group.entries.length}</span></button>)}
    </div> : null}
    {shown.map((group) => <section key={group.slug} data-role-group={group.slug} className="mb-8">
      <h2 className="text-xl font-semibold text-ink">{group.title}<span className="ml-3 text-sm font-normal text-muted">{group.entries.length} 篇图解</span></h2>
      <p className="mt-2 text-sm leading-7 text-muted">{group.description}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{group.entries.map((entry) => <ArticleCard key={entry.slug} article={available.get(entry.slug)!} href={roleArticleHref(entry.slug, definition, returnTo)} stepLabel={entry.reference ? "相关参考" : group.title} />)}</div>
      {!group.entries.length ? <p className="mt-4 rounded-lg border border-line bg-paper p-4 text-sm text-muted">当前分类没有符合筛选的图解。</p> : null}
    </section>)}
    {!selected && references.length ? <section data-role-references className="mb-8"><h2 className="text-xl font-semibold text-ink">相关参考<span className="ml-3 text-sm font-normal text-muted">{references.length} 篇图解</span></h2><div className="mt-4 grid gap-4 md:grid-cols-2">{references.map((slug) => <ArticleCard key={slug} article={available.get(slug)!} href={roleArticleHref(slug, definition, returnTo)} stepLabel="相关参考" />)}</div></section> : null}
    {!articles.length ? <p className="rounded-lg border border-line bg-white p-6 text-sm text-muted">没有符合当前筛选的图解。</p> : null}
  </section>
}
