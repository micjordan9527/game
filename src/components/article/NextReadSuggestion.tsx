import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Article } from "@/data/articles"

export function NextReadSuggestion({ article }: { article?: Article }) {
  if (!article) return null

  return (
    <section className="container-shell max-w-4xl py-8">
      <Link href={`/articles/${article.slug}`} className="group block rounded-xl border border-brand-100 bg-brand-50 p-6 hover:shadow-soft">
        <div className="text-sm font-semibold text-brand-700">下一步建议阅读</div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-8 text-ink">{article.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{article.description}</p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-brand-700 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </Link>
    </section>
  )
}
