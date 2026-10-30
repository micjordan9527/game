"use client"

import { useEffect, useMemo, useRef, type MouseEvent } from "react"
import { useSearchParams } from "next/navigation"
import { Filter, RotateCcw } from "lucide-react"
import type { Article } from "@/data/articles"
import { ArticleCard } from "@/components/common/ArticleCard"
import { OperationDirectory } from "@/components/operation/OperationDirectory"
import { DesignDirectory } from "@/components/design/DesignDirectory"
import { resourceAudiences } from "@/lib/work-audiences"
import { libraryAudience, libraryRoleParam } from "@/lib/article-library-filters"
import { getOperationGroup } from "@/lib/operation-navigation"
import { visibleDesignArticles } from "@/lib/design-navigation"

const allOption = "全部"
const allOptionLabel = "全部"

type FilterOption = {
  value: string
  count: number
}

function collectOptions(items: string[]) {
  const counter = new Map<string, number>()
  items.forEach((item) => counter.set(item, (counter.get(item) ?? 0) + 1))
  return [
    { value: allOption, count: items.length },
    ...Array.from(counter.entries())
      .sort((a, b) => a[0].localeCompare(b[0], "zh-CN"))
      .map(([value, count]) => ({ value, count })),
  ]
}

export function ArticleLibrary({ articles }: { articles: Article[] }) {
  const searchParams = useSearchParams()
  const tagDetailsRef = useRef<HTMLDetailsElement>(null)
  const tags = useMemo(() => collectOptions(articles.flatMap((article) => article.tags)), [articles])
  const audiences = useMemo(
    () =>
      collectOptions(articles.flatMap((article) => resourceAudiences(`/articles/${article.slug}`, article.audience))),
    [articles]
  )
  const audience = libraryAudience(searchParams.get("role") ?? "", audiences.map((item) => item.value))
  const requestedTag = searchParams.get("tag") ?? allOption
  const tag = tags.some((item) => item.value === requestedTag) ? requestedTag : allOption
  const filterKey = searchParams.toString()

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const matchTag = tag === allOption || article.tags.includes(tag)
        const matchAudience =
          audience === allOption || resourceAudiences(`/articles/${article.slug}`, article.audience).includes(audience)
        return matchTag && matchAudience
      }),
    [articles, audience, tag]
  )
  const operationGroup = audience === "运营" ? getOperationGroup(searchParams.get("group")) : undefined
  const groupCount = operationGroup ? filteredArticles.filter((article) => operationGroup.entries.some((entry) => entry.slug === article.slug)).length : 0
  const visibleCount = audience === "设计" ? visibleDesignArticles(filteredArticles, searchParams).length : groupCount || filteredArticles.length

  function rememberPosition() {
    window.history.replaceState({ ...window.history.state, knowledgeArticleLibraryReturn: {
      url: window.location.pathname + window.location.search, top: window.scrollY, tagsOpen: tagDetailsRef.current?.open === true,
    } }, "")
  }

  function updateFilters(nextAudience: string, nextTag: string) {
    const params = new URLSearchParams(window.location.search)
    if (nextAudience === allOption) params.delete("role")
    else params.set("role", libraryRoleParam(nextAudience))
    if (nextTag === allOption) params.delete("tag")
    else params.set("tag", nextTag)
    if (nextAudience !== audience || nextTag !== tag || nextAudience === allOption) {
      for (const key of ["group", "object", "direction", "format"]) params.delete(key)
    }
    params.delete("resume")
    const url = window.location.pathname + (params.size ? "?" + params : "")
    if (url === window.location.pathname + window.location.search) return
    rememberPosition()
    // Let Next synchronize its search parameters while retaining ordinary back/forward history.
    window.history.pushState(null, "", url)
  }

  useEffect(() => {
    let frame = 0
    const saved = window.history.state?.knowledgeArticleLibraryReturn
    if (saved?.url === window.location.pathname + window.location.search && Number.isFinite(saved.top)) {
      if (tagDetailsRef.current) tagDetailsRef.current.open = saved.tagsOpen === true
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          window.scrollTo({ top: saved.top, behavior: "instant" })
          window.history.replaceState({ ...window.history.state, knowledgeArticleLibraryReturn: null }, "")
        })
      })
    }
    return () => window.cancelAnimationFrame(frame)
  }, [filterKey, filteredArticles.length])

  function rememberArticle(event: MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
    if (anchor?.origin === window.location.origin) rememberPosition()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]" onClickCapture={rememberArticle}>
      <aside
        className="rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:self-start"
        aria-label="文章筛选"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <Filter className="h-4 w-4 text-brand-700" aria-hidden="true" />
            筛选资料
          </div>
          <button
            type="button"
            onClick={() => updateFilters(allOption, allOption)}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-paper hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            重置
          </button>
        </div>

        <FilterGroup label="角色" options={audiences} active={audience} onChange={(value) => updateFilters(value, tag)} />
        <details ref={tagDetailsRef} data-article-tags className="mt-5 border-t border-line pt-4">
          <summary className="cursor-pointer text-sm font-semibold leading-7 text-ink">标签筛选 · {tag}</summary>
          <FilterGroup label="标签" options={tags} active={tag} onChange={(value) => updateFilters(audience, value)} />
        </details>
      </aside>

      <section id="article-results" aria-label="文章列表" data-selected-role={audience} data-selected-tag={tag}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p role="status" data-library-summary className="text-sm leading-7 text-muted">
            <span className="mr-3 font-semibold text-brand-700">角色：{audience}</span>
            {tag !== allOption ? <span className="mr-3">标签：{tag}</span> : null}
            共 <span className="font-semibold text-ink">{visibleCount}</span> 篇图解
          </p>
          <p className="text-xs text-muted">按主题与角色查找图解</p>
        </div>
        {audience === "运营" ? <OperationDirectory articles={filteredArticles} source="library" /> : audience === "设计" ? <DesignDirectory articles={filteredArticles} source="library" /> : <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>}
        {filteredArticles.length === 0 && audience !== "运营" && audience !== "设计" ? (
          <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">
            没有符合筛选条件的文章。
          </div>
        ) : null}
      </section>
    </div>
  )
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string
  options: FilterOption[]
  active: string
  onChange: (value: string) => void
}) {
  return (
    <div role="group" aria-label={`${label}筛选`} className="mt-5 border-t border-line pt-4">
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            data-filter-value={option.value}
            onClick={() => onChange(option.value)}
            aria-pressed={active === option.value}
            className={[
              "group min-h-8 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
              active === option.value
                ? "bg-ink text-white ring-ink"
                : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
            ].join(" ")}
          >
            {option.value}
            {option.value !== allOptionLabel ? (
              <span
                className={[
                  "ml-2 inline-flex min-w-5 justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold",
                  active === option.value ? "bg-white/20 text-white/90" : "bg-paper text-muted group-hover:bg-white",
                ].join(" ")}
              >
                {option.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
