"use client"

import Link from "next/link"
import { useEffect, useRef, type MouseEvent } from "react"
import { useSearchParams } from "next/navigation"
import { FileText, ArrowUpRight } from "lucide-react"
import type { Article } from "@/data/articles"
import { designArticleEntries, designFormats, designObjects, designResources } from "@/data/designObjects"
import { ArticleCard } from "@/components/common/ArticleCard"
import { assetPath } from "@/lib/assets"
import { designArticleFormat, designArticleHref, designResourceHref, designReturnTo, getDesignDirection, getDesignFormat, getDesignObject } from "@/lib/design-navigation"

type SavedView = { url: string; top: number; tagsOpen: boolean; typesOpen: boolean }

export function DesignDirectory({ articles, source = "topic" }: { articles: Article[]; source?: "topic" | "library" }) {
  const params = useSearchParams(), root = useRef<HTMLElement>(null)
  const returnTo = designReturnTo(source, params)
  const object = getDesignObject(params.get("object")), direction = getDesignDirection(object, params.get("direction")), format = getDesignFormat(params.get("format"))
  const available = new Map(articles.map((article) => [article.slug, article]))
  const entries = designArticleEntries.filter((entry) => available.has(entry.slug))
  const resources = source === "topic" || !params.get("tag") ? designResources : []
  const matches = (item: { object: string; direction: string }) => (!object || item.object === object.slug) && (!direction || item.direction === direction.slug)
  const articleMatchesFormat = (slug: string) => !format || designArticleFormat(slug) === format.slug
  const counts = (slug?: string, area?: string) => entries.filter((entry) => (!slug || entry.object === slug) && (!area || entry.direction === area) && articleMatchesFormat(entry.slug)).length + resources.filter((resource) => (!slug || resource.object === slug) && (!area || resource.direction === area) && (!format || resource.format === format.slug)).length
  const objects = source === "library" && params.get("tag") ? designObjects.filter((item) => counts(item.slug)) : designObjects
  const shownObjects = object ? [object] : objects
  const known = new Set<string>(designArticleEntries.map((entry) => entry.slug))
  const other = !object && !direction ? articles.filter((article) => !known.has(article.slug) && articleMatchesFormat(article.slug)) : []

  function remember(event: MouseEvent<HTMLElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
    if (!anchor || anchor.origin !== window.location.origin) return
    const view: SavedView = { url: returnTo, top: scrollY, tagsOpen: document.querySelector<HTMLDetailsElement>("details[data-article-tags]")?.open === true, typesOpen: root.current?.querySelector<HTMLDetailsElement>("details[data-design-types]")?.open === true }
    window.history.replaceState({ ...window.history.state, designDirectoryReturn: view }, "")
    try { sessionStorage.setItem("wg-design-return:" + returnTo, JSON.stringify(view)); sessionStorage.setItem("wg-design-pending-return", returnTo) } catch { /* History still records the return position. */ }
  }

  useEffect(() => {
    if (!window.location.pathname.endsWith(source === "library" ? "/articles" : "/design")) return
    let frame = 0, saved = window.history.state?.designDirectoryReturn as SavedView | undefined
    try {
      if (params.get("resume") === "1" || sessionStorage.getItem("wg-design-pending-return") === returnTo) saved = JSON.parse(sessionStorage.getItem("wg-design-return:" + returnTo) ?? "null") ?? saved
    } catch { /* Filtering remains available when storage is blocked. */ }
    if (saved?.url === returnTo && Number.isFinite(saved.top)) {
      const tags = document.querySelector<HTMLDetailsElement>("details[data-article-tags]"), types = root.current?.querySelector<HTMLDetailsElement>("details[data-design-types]")
      if (tags) tags.open = saved.tagsOpen
      if (types) types.open = saved.typesOpen
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => {
        scrollTo({ top: saved!.top, behavior: "instant" })
        try { if (sessionStorage.getItem("wg-design-pending-return") === returnTo) sessionStorage.removeItem("wg-design-pending-return") } catch { /* The view is already restored. */ }
        const query = new URLSearchParams(window.location.search); query.delete("resume")
        window.history.replaceState({ ...window.history.state, designDirectoryReturn: null }, "", window.location.pathname + (query.size ? "?" + query : ""))
      }) })
    } else if (params.has("resume")) {
      const query = new URLSearchParams(window.location.search); query.delete("resume")
      window.history.replaceState(window.history.state, "", window.location.pathname + (query.size ? "?" + query : ""))
    }
    return () => cancelAnimationFrame(frame)
  }, [returnTo, params, source])

  function select(values: { object?: string; direction?: string; format?: string }) {
    const query = new URLSearchParams(window.location.search)
    for (const [key, value] of Object.entries(values)) { if (value) query.set(key, value); else query.delete(key) }
    query.delete("resume")
    window.history.pushState(null, "", window.location.pathname + (query.size ? "?" + query : ""))
    root.current?.scrollIntoView({ block: "start", behavior: "instant" })
  }
  const chip = (active: boolean) => `min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${active ? "bg-brand-700 text-white" : "bg-paper text-muted hover:text-ink"}`

  return <section ref={root} data-design-directory data-selected-object={object?.slug ?? "all"} data-selected-direction={direction?.slug ?? "all"} data-selected-format={format?.slug ?? "all"} aria-label="设计对象目录" className="scroll-mt-20" onClickCapture={remember}>
    <div role="group" aria-label="设计对象" className="sticky top-16 z-10 my-4 flex gap-2 overflow-x-auto border-b border-line bg-white/95 py-3 backdrop-blur">
      <button type="button" data-design-object="all" aria-pressed={!object} onClick={() => select({ object: undefined, direction: undefined })} className={chip(!object)}>全部<span className="ml-2 text-xs opacity-70">{counts() + other.length}</span></button>
      {objects.map((item) => <button key={item.slug} type="button" data-design-object={item.slug} aria-pressed={object?.slug === item.slug} onClick={() => select({ object: item.slug, direction: undefined })} className={chip(object?.slug === item.slug)}>{item.title}<span className="ml-2 text-xs opacity-70">{counts(item.slug)}</span></button>)}
    </div>
    {object ? <div role="group" aria-label="设计工作方向" className="mb-4 flex flex-wrap gap-2">
      <button type="button" data-design-direction="all" aria-pressed={!direction} onClick={() => select({ direction: undefined })} className={chip(!direction)}>全部方向</button>
      {object.directions.map((item) => <button key={item.slug} type="button" data-design-direction={item.slug} aria-pressed={direction?.slug === item.slug} onClick={() => select({ direction: item.slug })} className={chip(direction?.slug === item.slug)}>{item.title}<span className="ml-2 text-xs opacity-70">{counts(object.slug, item.slug)}</span></button>)}
    </div> : null}
    <details data-design-types className="mb-6 rounded-lg border border-line bg-white px-4 py-3">
      <summary className="cursor-pointer text-sm font-semibold text-muted">资料类型 · {format?.title ?? "全部"}</summary>
      <div role="group" aria-label="设计资料类型" className="mt-3 flex flex-wrap gap-2">
        <button type="button" data-design-format="all" aria-pressed={!format} className={chip(!format)} onClick={() => select({ format: undefined })}>全部类型</button>
        {designFormats.map((item) => <button key={item.slug} type="button" data-design-format={item.slug} aria-pressed={format?.slug === item.slug} className={chip(format?.slug === item.slug)} onClick={() => select({ format: item.slug })}>{item.title}</button>)}
      </div>
    </details>
    {shownObjects.map((item) => {
      const itemEntries = entries.filter((entry) => entry.object === item.slug && matches(entry) && articleMatchesFormat(entry.slug))
      const related = resources.filter((resource) => resource.object === item.slug && matches(resource) && (!format || resource.format === format.slug))
      return <section key={item.slug} data-design-section={item.slug} aria-labelledby={`design-${item.slug}-title`} className="mb-10">
        <h2 id={`design-${item.slug}-title`} className="text-xl font-semibold text-ink">{item.title}<span className="ml-3 text-sm font-normal text-muted">{itemEntries.length + related.length} 项资料</span></h2>
        <p className="mt-2 text-sm leading-7 text-muted">{direction ? direction.description : item.description}</p>
        {!object ? <div className="my-4 flex flex-wrap gap-2">{item.directions.map((area) => <button key={area.slug} type="button" onClick={() => select({ object: item.slug, direction: area.slug })} className="min-h-11 rounded-lg border border-line px-3 py-2 text-sm text-brand-700 hover:bg-brand-50">{area.title}</button>)}</div> : null}
        {itemEntries.length ? <div data-design-article-grid className="mt-4 grid gap-4 md:grid-cols-2">{itemEntries.map((entry) => <ArticleCard key={entry.slug} article={available.get(entry.slug)!} href={designArticleHref(entry.slug, returnTo)} stepLabel={`${getDesignDirection(item, entry.direction)?.title}${entry.reference ? " · 相关参考" : ""}`} />)}</div> : null}
        {related.length ? <ul data-design-resources className="mt-4 grid items-start gap-4 md:grid-cols-2">{related.map((resource) => <li key={resource.id} data-design-resource={resource.id} className="overflow-hidden rounded-xl border border-line bg-white">
          <Link href={designResourceHref(resource.href, resource.object, resource.direction, returnTo)} className="block">
            {resource.image ? <img src={assetPath(resource.image)} alt={resource.title} width={1600} height={1000} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" /> : null}
            <div className="p-5"><p className="flex items-center gap-2 text-xs font-semibold text-brand-700"><FileText size={15} aria-hidden="true" />{getDesignFormat(resource.format)?.title}</p><h3 className="mt-3 text-lg font-semibold text-ink">{resource.title}</h3><p className="mt-2 text-sm leading-7 text-muted">{resource.description}</p><span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">查看资料<ArrowUpRight size={15} aria-hidden="true" /></span></div>
          </Link>
        </li>)}</ul> : null}
        {!itemEntries.length && !related.length ? <p className="mt-4 rounded-lg border border-line bg-paper p-4 text-sm leading-7 text-muted" data-design-empty>{item.slug === "physical" ? "该分类暂无独立设计案例。设备结构图解在视觉传播设计中查看。" : "没有符合当前方向与类型的独立资料。"}</p> : null}
      </section>
    })}
    {other.length ? <section aria-label="其他相关参考" className="mb-6"><h2 className="font-semibold">其他相关参考 · {other.length} 篇</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{other.map((article) => <ArticleCard key={article.slug} article={article} href={designArticleHref(article.slug, returnTo)} stepLabel="相关参考" />)}</div></section> : null}
    {!shownObjects.length ? <p className="p-6 text-sm text-muted">没有符合当前筛选的设计资料。</p> : null}
  </section>
}
