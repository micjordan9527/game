import { getCategory } from "@/lib/site"
import { Badge } from "@/components/common/Badge"
import { Tag } from "@/components/common/Tag"

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

export function ArticleHero({ title, description, category, tags, audience, difficulty, date, updatedAt }: ArticleHeroProps) {
  const categoryInfo = getCategory(category)

  return (
    <header className="border-b border-line bg-white">
      <div className="container-shell max-w-4xl py-12">
        <div className="flex flex-wrap gap-2">
          {categoryInfo ? <Badge tone="brand">{categoryInfo.title}</Badge> : null}
          <Badge tone="blue">{difficulty}</Badge>
          {audience.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-normal text-ink md:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-9 text-muted">{description}</p>
        {date ? (
          <p className="mt-4 text-sm text-muted">
            发布于 {date}
            {updatedAt ? ` · 更新于 ${updatedAt}` : ""}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </header>
  )
}
