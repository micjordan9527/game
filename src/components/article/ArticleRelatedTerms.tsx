import type { GlossaryTerm } from "@/data/glossary"
import { SectionHeader } from "@/components/common/SectionHeader"

export function ArticleRelatedTerms({ terms }: { terms: GlossaryTerm[] }) {
  if (terms.length === 0) return null

  return (
    <section className="container-shell max-w-4xl py-8">
      <SectionHeader title="本文相关术语" description="读完文章后，可以直接在这里快速复习相关概念。" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {terms.map((term) => (
          <div key={term.id} className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">{term.term}</h3>
              <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">{term.category}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">{term.shortDescription}</p>
            <p className="mt-3 rounded-md bg-paper px-3 py-2 text-xs leading-5 text-muted">场景：{term.commonScene}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
