"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { RotateCcw, Search, X } from "lucide-react"
import { assetPath } from "@/lib/assets"
import type { SearchRecord } from "@/lib/search-index"

const filters = [
  "全部",
  "文章",
  "术语",
  "模板",
  "案例",
  "AI 工作流",
  "体育专题",
  "知识栏目",
  "设计专题",
  "素材规范",
  "角色精选",
] as const
const suggested = ["钱包", "注单", "风控", "后台", "设计", "工作流", "素材规范"]
const aliases: Record<string, string[]> = {
  免转钱包: ["seamless", "钱包"],
  中心钱包: ["central wallet", "钱包"],
  prd: ["需求文档", "产品需求"],
  api: ["接口", "技术接入"],
  ui: ["界面", "视觉", "设计"],
  sop: ["流程", "运营治理"],
}

function normalizeMaterialText(value: string) {
  return value.replace(/[×＊*]/g, "x").replace(/[\s_\-\/（）()]/g, "")
}

function scoreItem(record: SearchRecord, term: string) {
  const title = record.title.toLowerCase()
  const description = record.description.toLowerCase()
  const tags = record.tags.join(" ").toLowerCase()
  const related = aliases[term] ?? []
  const materialHit =
    record.kind === "素材规范" && normalizeMaterialText(record.searchableText).includes(normalizeMaterialText(term))
  const direct =
    title === term
      ? 120
      : title.includes(term)
        ? 70
        : tags.includes(term)
          ? 48
          : description.includes(term)
            ? 32
            : record.searchableText.includes(term) || materialHit
              ? 10
              : 0
  const relatedHit = related.some((keyword) => record.searchableText.includes(keyword.toLowerCase())) ? 7 : 0
  return direct + relatedHit
}

function Emphasize({ text, query }: { text: string; query: string }) {
  const term = query.trim()
  const index = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (index < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-brand-50 px-0.5 text-brand-700">{text.slice(index, index + term.length)}</mark>
      {text.slice(index + term.length)}
    </>
  )
}

export function SiteSearch({ items }: { items: SearchRecord[] }) {
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(urlQuery)

  useEffect(() => setQuery(urlQuery), [urlQuery])
  const requestedKind = searchParams.get("type") ?? "全部"
  const kind = filters.find((value) => value === requestedKind) ?? "全部"
  const normalized = query.trim().toLowerCase()

  function updateSearch(nextQuery: string, nextKind: (typeof filters)[number] = "全部") {
    setQuery(nextQuery)
    const params = new URLSearchParams(window.location.search)
    if (nextQuery) params.set("q", nextQuery)
    else params.delete("q")
    if (nextKind !== "全部") params.set("type", nextKind)
    else params.delete("type")
    // Next copies its router state and updates useSearchParams for native URL edits.
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`)
  }

  function rememberPosition() {
    window.history.replaceState({
      ...window.history.state,
      knowledgeSearchReturn: { url: window.location.pathname + window.location.search, top: window.scrollY },
    }, "")
  }

  useEffect(() => {
    let frame = 0
    const restore = () => {
      const saved = window.history.state?.knowledgeSearchReturn
      if (saved?.url !== window.location.pathname + window.location.search || !Number.isFinite(saved.top)) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => window.scrollTo({ top: saved.top, behavior: "instant" }))
      })
    }
    restore()
    window.addEventListener("popstate", restore)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("popstate", restore)
    }
  }, [searchParams])

  const ranked = useMemo(() => {
    if (!normalized) return []
    return items
      .map((record) => ({ record, score: scoreItem(record, normalized) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title, "zh-CN"))
      .map(({ record }) => record)
  }, [items, normalized])
  const counts = useMemo(() => {
    const result: Record<string, number> = { 全部: ranked.length }
    filters.slice(1).forEach((value) => {
      result[value] = ranked.filter((item) => item.kind === value).length
    })
    return result
  }, [ranked])
  const activeKind = (counts[kind] ?? 0) > 0 ? kind : "全部"
  const visible = activeKind === "全部" ? ranked : ranked.filter((item) => item.kind === activeKind)
  const recommendations = [
    { title: "案例", ids: ["case:admin-optimization", "case:bm-optimization"] },
    { title: "知识图解", ids: ["article:member-account-states", "article:wallet-payment-reconciliation"] },
    { title: "AI 工作流", ids: ["workflow:brand-visual-system", "workflow:ui-design-system"] },
  ]

  return (
    <div>
      <section className="rounded-xl border border-line bg-white p-4 shadow-sm md:p-6">
        <label htmlFor="site-search" className="text-sm font-semibold text-ink">
          搜索知识库
        </label>
        <div className="mt-3 flex items-center gap-3 rounded-md border border-line bg-paper px-4 focus-within:border-brand-600 focus-within:bg-white">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="site-search"
            name="q"
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="搜索文章、术语、案例、模板、工作流和设计专题"
            autoComplete="off"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
          {query ? (
            <button
              type="button"
              aria-label="清空搜索"
              onClick={() => updateSearch("")}
              className="rounded-md p-1 text-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">常用搜索：</span>
          {suggested.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => updateSearch(word)}
              className="rounded-full bg-paper px-3 py-1.5 text-xs text-muted hover:text-brand-700"
            >
              {word}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {normalized ? `找到 ${ranked.length} 条相关资料` : "输入关键词搜索全部资料，也可以点击常用搜索快速开始。"}
        </p>
      </section>

      {normalized && ranked.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="搜索结果类型">
          {filters.filter((value) => (counts[value] ?? 0) > 0).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => updateSearch(query, value)}
              aria-pressed={activeKind === value}
              className={`rounded-full px-3 py-2 text-sm ring-1 transition ${activeKind === value ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:text-ink"}`}
            >
              {value} ({counts[value] ?? 0})
            </button>
          ))}
        </div>
      ) : null}

      {normalized && visible.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2" aria-live="polite">
          {visible.map((record) => (
            <Link
              href={record.href}
              onClick={rememberPosition}
              key={record.id}
              className="group rounded-lg border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-soft"
            >
              {record.previewImage ? (
                <img
                  src={assetPath(record.previewImage)}
                  alt={`${record.title}预览`}
                  width={480}
                  height={240}
                  loading="lazy"
                  className="mb-4 h-36 w-full rounded-md bg-paper object-cover object-top"
                />
              ) : null}
              <span className="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{record.kind}</span>
              <h2 className="mt-3 text-lg font-semibold leading-7 text-ink group-hover:text-brand-700">
                <Emphasize text={record.title} query={query} />
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">
                <Emphasize text={record.description} query={query} />
              </p>
              {record.tags.length > 0 ? (
                <p className="mt-3 line-clamp-1 text-xs text-muted">{record.tags.slice(0, 4).join(" · ")}</p>
              ) : null}
            </Link>
          ))}
        </div>
      ) : normalized && ranked.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-white p-8 text-center">
          <p className="font-semibold text-ink">没有找到相关资料</p>
          <p className="mt-2 text-sm text-muted">试试更短的关键词，或从常用搜索中选择相关概念。</p>
          <button
            type="button"
            onClick={() => updateSearch("")}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
          >
            <RotateCcw className="h-4 w-4" /> 重置搜索
          </button>
        </div>
      ) : normalized ? (
        <div className="mt-6 rounded-lg bg-paper p-6 text-sm text-muted">
          这一类型没有匹配内容，可以切换到“全部”查看其他资料。
        </div>
      ) : (
        <section className="mt-8" aria-label="精选资料">
          <h2 className="text-lg font-semibold text-ink">案例、图解与 AI 工作流</h2>
          <p className="mt-2 text-sm text-muted">从实际界面、功能关系和视觉成果开始浏览。</p>
          {recommendations.map((group) => (
            <section key={group.title} className="mt-6" aria-label={`精选${group.title}`}>
              <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {group.ids.map((id) => items.find((record) => record.id === id)).filter((record): record is SearchRecord => Boolean(record)).map((record) => (
                  <Link href={group.title === "知识图解" ? `${record.href}#scenario` : record.href} onClick={rememberPosition} key={record.id} className="group overflow-hidden rounded-lg border border-line bg-white transition hover:border-brand-200">
                    {record.previewImage ? (
                      <img src={assetPath(record.previewImage)} alt={`${record.title}预览`} width={480} height={240} loading="lazy" className="h-36 w-full bg-paper object-cover object-top" />
                    ) : null}
                    <div className="p-4">
                      <h4 className="font-semibold text-ink group-hover:text-brand-700">{record.title}</h4>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{record.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </section>
      )}
    </div>
  )
}
