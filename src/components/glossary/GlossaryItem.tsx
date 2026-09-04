import Link from "next/link"
import type { GlossaryTerm } from "@/data/glossary"
import { Badge } from "@/components/common/Badge"
import { Tag } from "@/components/common/Tag"
import { getArticlesForTerm } from "@/lib/relations"

export function GlossaryItem({ term }: { term: GlossaryTerm }) {
  const relatedArticles = getArticlesForTerm(term)

  return (
    <article id={term.id} className="scroll-mt-24 rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-xl font-semibold text-ink">{term.term}</h3>
        <Badge tone="brand">{term.category}</Badge>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted">{term.shortDescription}</p>
      <div className="mt-4 rounded-md bg-paper p-4">
        <div className="text-sm font-semibold text-ink">常见场景</div>
        <p className="mt-2 text-sm leading-7 text-muted">{term.commonScene}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {term.relatedFeatures.map((feature) => (
          <Tag key={feature}>{feature}</Tag>
        ))}
      </div>
      {term.misunderstanding ? (
        <p className="mt-4 border-l-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900">
          容易误解：{term.misunderstanding}
        </p>
      ) : null}
      {relatedArticles.length > 0 ? (
        <div className="mt-4 border-t border-line pt-4">
          <div className="text-sm font-semibold text-ink">相关文章</div>
          <div className="mt-3 space-y-2">
            {relatedArticles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="block text-sm leading-6 text-muted hover:text-brand-700">
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}
