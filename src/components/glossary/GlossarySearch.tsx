"use client"

import { useMemo, useState } from "react"
import type { GlossaryTerm } from "@/data/glossary"
import { GlossaryItem } from "@/components/glossary/GlossaryItem"
import { GlossaryCategoryFilter } from "@/components/glossary/GlossaryCategoryFilter"

export function GlossarySearch({ terms }: { terms: GlossaryTerm[] }) {
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("全部")
  const categories = useMemo(() => ["全部", ...Array.from(new Set(terms.map((term) => term.category)))], [terms])

  const filteredTerms = terms.filter((term) => {
    const searchText = [
      term.term,
      term.category,
      term.shortDescription,
      term.commonScene,
      term.relatedFeatures.join(" "),
      term.misunderstanding ?? "",
    ].join(" ")
    const matchKeyword = searchText.toLowerCase().includes(keyword.trim().toLowerCase())
    const matchCategory = category === "全部" || term.category === category
    return matchKeyword && matchCategory
  })

  return (
    <div>
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm md:p-5">
        <label htmlFor="glossary-search" className="text-sm font-semibold text-ink">
          搜索术语
        </label>
        <input
          id="glossary-search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="输入：包网、代理、钱包、盘口..."
          className="mt-3 w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-600 focus:bg-white"
        />
        <GlossaryCategoryFilter categories={categories} active={category} onChange={setCategory} />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filteredTerms.map((term) => (
          <GlossaryItem key={term.id} term={term} />
        ))}
      </div>
      {filteredTerms.length === 0 ? <p className="mt-8 text-center text-sm text-muted">没有找到匹配术语。</p> : null}
    </div>
  )
}
