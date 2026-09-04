import type { GlossaryTerm } from "@/data/glossary"

export function MiniTermCard({ term }: { term: GlossaryTerm }) {
  return (
    <a href={`/glossary#${term.id}`} className="block rounded-lg border border-line bg-white p-4 hover:border-brand-100">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{term.term}</h3>
        <span className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">{term.category}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{term.shortDescription}</p>
    </a>
  )
}
