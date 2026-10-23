"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { RotateCcw, Search, X } from "lucide-react"
import type { SearchRecord } from "@/lib/search-index"

const filters = ["全部", "文章", "术语", "模板", "案例", "AI 工作流", "体育专题", "知识栏目", "设计专题", "素材规范"] as const
const suggested = ["钱包", "注单", "风控", "后台", "设计", "工作流", "素材规范"]
const aliases: Record<string, string[]> = {
  "免转钱包": ["seamless", "钱包"],
  "中心钱包": ["central wallet", "钱包"],
  "prd": ["需求文档", "产品需求"],
  "api": ["接口", "技术接入"],
  "ui": ["界面", "视觉", "设计"],
  "sop": ["流程", "运营治理"],
}

function normalizeMaterialText(value: string) {
  return value.replace(/[×＊*]/g, "x").replace(/[\s_\-\/（）()]/g, "")
}

function scoreItem(record: SearchRecord, term: string) {
  const title = record.title.toLowerCase()
  const description = record.description.toLowerCase()
  const tags = record.tags.join(" ").toLowerCase()
  const related = aliases[term] ?? []
  const materialHit = record.kind === "素材规范" && normalizeMaterialText(record.searchableText).includes(normalizeMaterialText(term))
  const direct = title === term ? 120
    : title.includes(term) ? 70
    : tags.includes(term) ? 48
    : description.includes(term) ? 32
    : record.searchableText.includes(term) || materialHit ? 10
    : 0
  const relatedHit = related.some((keyword) => record.searchableText.includes(keyword.toLowerCase())) ? 7 : 0
  return direct + relatedHit
}

function Emphasize({ text, query }: { text: string; query: string }) {
  const term = query.trim()
  const index = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1
  if (index < 0) return <>{text}</>
  return <>{text.slice(0, index)}<mark className="rounded bg-brand-50 px-0.5 text-brand-700">{text.slice(index, index + term.length)}</mark>{text.slice(index + term.length)}</>
}

export function SiteSearch({ items }: { items: SearchRecord[] }) {
  const searchParams = useSearchParams()
  const initial = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(initial)
  const [kind, setKind] = useState<(typeof filters)[number]>("全部")
  const normalized = query.trim().toLowerCase()

  useEffect(() => {
    const onPopState = () => setQuery(new URLSearchParams(window.location.search).get("q") ?? "")
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (normalized) params.set("q", query.trim())
      else params.delete("q")
      const url = params.size ? `${window.location.pathname}?${params.toString()}` : window.location.pathname
      window.history.replaceState(window.history.state, "", url)
    }, 300)
    return () => window.clearTimeout(timeout)
  }, [normalized, query])

  const ranked = useMemo(() => {
    if (!normalized) return []
    return items
      .map((record) => ({ record, score: scoreItem(record, normalized) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title, "zh-CN"))
      .map(({ record }) => record)
  }, [items, normalized])
  const counts = useMemo(() => {
    const result: Record<string, number> = { "全部": ranked.length }
    filters.slice(1).forEach((value) => { result[value] = ranked.filter((item) => item.kind === value).length })
    return result
  }, [ranked])
  const visible = kind === "全部" ? ranked : ranked.filter((item) => item.kind === kind)
  const popular = items.filter((item) => ["文章", "术语", "模板", "案例", "AI 工作流"].includes(item.kind)).slice(0, 8)

  return (
    <div>
      <section className="rounded-xl border border-line bg-white p-4 shadow-sm md:p-6">
        <label htmlFor="site-search" className="text-sm font-semibold text-ink">搜索知识库</label>
        <div className="mt-3 flex items-center gap-3 rounded-md border border-line bg-paper px-4 focus-within:border-brand-600 focus-within:bg-white">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <input id="site-search" name="q" value={query} onChange={(event) => { setQuery(event.target.value); setKind("全部") }}
            placeholder="搜索文章、术语、案例、模板、工作流和设计专题" autoComplete="off"
            className="w-full bg-transparent py-3 text-sm outline-none" />
          {query ? <button type="button" aria-label="清空搜索" onClick={() => { setQuery(""); setKind("全部") }} className="rounded-md p-1 text-muted hover:text-ink"><X className="h-4 w-4" /></button> : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">常用搜索：</span>
          {suggested.map((word) => <button key={word} type="button" onClick={() => { setQuery(word); setKind("全部") }}
            className="rounded-full bg-paper px-3 py-1.5 text-xs text-muted hover:text-brand-700">{word}</button>)}
        </div>
        <p className="mt-4 text-sm text-muted" aria-live="polite">
          {normalized ? `找到 ${ranked.length} 条相关资料` : "输入关键词搜索全部资料，也可以点击常用搜索快速开始。"}
        </p>
      </section>

      {normalized && ranked.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2" aria-label="搜索结果类型">
          {filters.map((value) => <button key={value} type="button" onClick={() => setKind(value)}
            aria-pressed={kind === value}
            className={`rounded-full px-3 py-2 text-sm ring-1 transition ${kind === value ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:text-ink"}`}>
            {value} ({counts[value] ?? 0})
          </button>)}
        </div>
      ) : null}

      {normalized && visible.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2" aria-live="polite">
          {visible.map((record) => <Link href={record.href} key={record.id}
            className="group rounded-lg border border-line bg-white p-5 transition hover:border-brand-200 hover:shadow-soft">
            <span className="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{record.kind}</span>
            <h2 className="mt-3 text-lg font-semibold leading-7 text-ink group-hover:text-brand-700"><Emphasize text={record.title} query={query} /></h2>
            <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted"><Emphasize text={record.description} query={query} /></p>
            {record.tags.length > 0 ? <p className="mt-3 line-clamp-1 text-xs text-muted">{record.tags.slice(0, 4).join(" · ")}</p> : null}
          </Link>)}
        </div>
      ) : normalized && ranked.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-white p-8 text-center">
          <p className="font-semibold text-ink">没有找到相关资料</p>
          <p className="mt-2 text-sm text-muted">试试更短的关键词，或从常用搜索中选择相关概念。</p>
          <button type="button" onClick={() => { setQuery(""); setKind("全部") }} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
            <RotateCcw className="h-4 w-4" /> 重置搜索
          </button>
        </div>
      ) : normalized ? (
        <div className="mt-6 rounded-lg bg-paper p-6 text-sm text-muted">这一类型没有匹配内容，可以切换到“全部”查看其他资料。</div>
      ) : (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-ink">常用资料入口</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {popular.map((record) => <Link href={record.href} key={record.id} className="rounded-lg border border-line bg-white p-4 hover:border-brand-200">
              <span className="text-xs text-brand-700">{record.kind}</span>
              <h3 className="mt-1 text-sm font-semibold text-ink">{record.title}</h3>
            </Link>)}
          </div>
        </section>
      )}
    </div>
  )
}
