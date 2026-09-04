import Link from "next/link"
import type { Article } from "@/data/articles"
import { getCategory } from "@/lib/site"
import { Badge } from "@/components/common/Badge"
import { Tag } from "@/components/common/Tag"

export function ArticleCard({ article }: { article: Article }) {
  const category = getCategory(article.category)

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {category ? <Badge tone="brand">{category.title}</Badge> : null}
        <Badge tone="blue">{article.difficulty}</Badge>
      </div>
      <h3 className="text-lg font-semibold leading-7 text-ink">
        <Link href={`/articles/${article.slug}`} className="hover:text-brand-700">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted">{article.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.slice(0, 3).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </article>
  )
}
