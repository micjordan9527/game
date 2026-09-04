"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import type { SportsBettingSection } from "@/data/sports"

export function BettingExplanationBrowser({ sections }: { sections: SportsBettingSection[] }) {
  const [keyword, setKeyword] = useState("")
  const normalizedKeyword = keyword.trim().toLowerCase()

  const filteredSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          rows: section.rows.filter((row) => {
            const searchText = [section.title, section.description, row.playType, row.side, row.handicap, row.uiLabel, row.explanation].join(" ").toLowerCase()
            return normalizedKeyword.length === 0 || searchText.includes(normalizedKeyword)
          }),
        }))
        .filter((section) => section.rows.length > 0),
    [normalizedKeyword, sections]
  )

  const resultCount = filteredSections.reduce((total, section) => total + section.rows.length, 0)

  return (
    <>
      <div className="sticky top-16 z-30 mt-6 rounded-lg border border-line bg-white/95 p-2 shadow-sm backdrop-blur" aria-label="玩法解读搜索">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索：让球、角球、2.5、独赢、退回..."
              className="w-full rounded-md border border-line bg-paper py-2 pl-10 pr-10 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
            />
            {keyword ? (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-white hover:text-ink"
                aria-label="清空搜索"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <div className="shrink-0 rounded-md bg-paper px-2.5 py-2 text-xs font-medium text-muted">
            <span className="font-semibold text-ink">{resultCount}</span> 条
          </div>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {sections.map((section, index) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-line hover:bg-brand-50 hover:text-brand-700 hover:ring-brand-100"
            >
              {index + 1}. {section.title}
            </a>
          ))}
        </div>
      </div>

      <section className="mt-6 space-y-5">
        {filteredSections.map((section, index) => (
          <article key={section.id} id={section.id} className="scroll-mt-32 rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-50 px-2 text-sm font-semibold text-brand-700">{index + 1}</span>
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">{section.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">{section.rows.length} 条</span>
            </div>

            <div className="mt-4 hidden overflow-x-auto rounded-lg border border-line md:block">
              <table className="w-full min-w-[720px] border-collapse bg-white text-sm">
                <thead className="bg-paper text-left text-xs font-semibold text-muted">
                  <tr>
                    <th className="whitespace-nowrap border-b border-line px-3 py-3">玩法类型</th>
                    <th className="whitespace-nowrap border-b border-line px-3 py-3">方向</th>
                    <th className="whitespace-nowrap border-b border-line px-3 py-3">盘口</th>
                    <th className="whitespace-nowrap border-b border-line px-3 py-3">UI 展示</th>
                    <th className="border-b border-line px-3 py-3">解释</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row) => (
                    <tr key={`${row.uiLabel}-${row.explanation}`} className="border-b border-line last:border-b-0">
                      <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">{row.playType}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted">{row.side}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-muted">{row.handicap}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span className="rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-ink ring-1 ring-line">{row.uiLabel}</span>
                      </td>
                      <td className="min-w-[220px] px-3 py-3 leading-6 text-muted">{row.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid gap-3 md:hidden">
              {section.rows.map((row) => (
                <div key={`${row.uiLabel}-${row.explanation}`} className="rounded-lg border border-line bg-paper p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink ring-1 ring-line">{row.uiLabel}</span>
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-muted ring-1 ring-line">{row.playType}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
                    <div>
                      <span className="block font-semibold text-ink">方向</span>
                      {row.side}
                    </div>
                    <div>
                      <span className="block font-semibold text-ink">盘口</span>
                      {row.handicap}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-ink">{row.explanation}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
        {filteredSections.length === 0 ? <div className="rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">没有找到匹配的玩法。</div> : null}
      </section>
    </>
  )
}
