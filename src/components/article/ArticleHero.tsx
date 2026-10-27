import { getCategory } from "@/lib/site"
import { Badge } from "@/components/common/Badge"
import { Tag } from "@/components/common/Tag"
import Link from "next/link"

type ArticleHeroProps = {
  title: string
  description: string
  category: string
  tags: string[]
  audience: string[]
  difficulty: string
  date?: string
  updatedAt?: string
}

export function ArticleHero({
  title,
  description,
  category,
  tags,
  audience,
  difficulty,
  date,
  updatedAt,
}: ArticleHeroProps) {
  const categoryInfo = getCategory(category)

  return (
    <header className="border-b border-line bg-white">
      <div className="container-shell max-w-4xl py-6 md:py-8">
        <nav aria-label="文章位置" className="mb-4 text-xs leading-6 text-muted">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link href="/articles" className="font-semibold text-brand-700">知识图解</Link></li>
            {categoryInfo ? <><li aria-hidden="true">/</li><li><Link href={`/${categoryInfo.slug}`} className="font-semibold text-brand-700">{categoryInfo.title}</Link></li></> : null}
            <li aria-hidden="true">/</li><li className="min-w-0 max-w-full"><span aria-current="page" className="line-clamp-1">{title}</span></li>
          </ol>
        </nav>
        <div className="flex flex-wrap gap-2">
          {categoryInfo ? <Badge tone="brand">{categoryInfo.title}</Badge> : null}
          {audience.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
        {date ? (
          <p className="mt-4 text-sm text-muted">
            发布于 {date}
            {updatedAt ? ` · 更新于 ${updatedAt}` : ""}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </header>
  )
}
