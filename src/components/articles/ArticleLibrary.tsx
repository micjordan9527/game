"use client"

import { useMemo, useState } from "react"
import { Filter, RotateCcw } from "lucide-react"
import type { Article } from "@/data/articles"
import { ArticleCard } from "@/components/common/ArticleCard"

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
  const tags = useMemo(() => collectOptions(articles.flatMap((article) => article.tags)), [articles])
  const difficulties = useMemo(() => collectOptions(articles.map((article) => article.difficulty)), [articles])
  const audiences = useMemo(
    () => collectOptions(articles.flatMap((article) => article.audience)),
    [articles]
  )
  const [tag, setTag] = useState(allOption)
  const [difficulty, setDifficulty] = useState(allOption)
  const [audience, setAudience] = useState(allOption)

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const matchTag = tag === allOption || article.tags.includes(tag)
        const matchDifficulty = difficulty === allOption || article.difficulty === difficulty
        const matchAudience = audience === allOption || article.audience.includes(audience)
        return matchTag && matchDifficulty && matchAudience
      }),
    [articles, audience, difficulty, tag]
  )

  function resetFilters() {
    setTag(allOption)
    setDifficulty(allOption)
    setAudience(allOption)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr]">
      <aside className="rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:self-start" aria-label="文章筛选">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
            <Filter className="h-4 w-4 text-brand-700" aria-hidden="true" />
            筛选资料
          </div>
          <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted hover:bg-paper hover:text-ink">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            重置
          </button>
        </div>

        <FilterGroup label="难度" options={difficulties} active={difficulty} onChange={setDifficulty} />
        <FilterGroup label="人群" options={audiences} active={audience} onChange={setAudience} />
        <FilterGroup label="标签" options={tags} active={tag} onChange={setTag} />
      </aside>

      <section aria-label="文章列表">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            共 <span className="font-semibold text-ink">{filteredArticles.length}</span> 篇资料
          </p>
          <p className="text-xs text-muted">可按标签、难度、人群组合查询</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        {filteredArticles.length === 0 ? <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">没有符合筛选条件的文章。</div> : null}
      </section>
    </div>
  )
}

function FilterGroup({ label, options, active, onChange }: { label: string; options: FilterOption[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="mt-5 border-t border-line pt-4">
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={[
              "group min-h-8 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition",
              active === option.value ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
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
