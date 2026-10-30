import { getCategory } from "@/lib/site"
import { Badge } from "@/components/common/Badge"
import { Tag } from "@/components/common/Tag"
import { Suspense } from "react"
import { ArticleBreadcrumbs } from "./ArticleBreadcrumbs"
import { OperationArticleBreadcrumbs } from "./OperationArticleNavigation"

type ArticleHeroProps = {
  articleSlug: string
  title: string
  description: string
  category: string
  tags: string[]
  audience: string[]
  difficulty: string
  date?: string
  updatedAt?: string
  compact?: boolean
}

export function ArticleHero({
  articleSlug,
  title,
  description,
  category,
  tags,
  audience,
  difficulty,
  date,
  updatedAt,
  compact = false,
}: ArticleHeroProps) {
  const categoryInfo = getCategory(category)

  return (
    <header className="border-b border-line bg-white">
      <div className={`container-shell max-w-4xl ${compact ? "py-5" : "py-6 md:py-8"}`}>
        <Suspense fallback={<ArticleBreadcrumbs title={title} parents={[{ href: "/articles", label: "知识图解" }, ...(categoryInfo ? [{ href: "/" + categoryInfo.slug, label: categoryInfo.title }] : [])]} />}>
          <OperationArticleBreadcrumbs articleSlug={articleSlug} title={title} category={categoryInfo} />
        </Suspense>
        {!compact ? <div className="flex flex-wrap gap-2">
          {categoryInfo ? <Badge tone="brand">{categoryInfo.title}</Badge> : null}
          {audience.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div> : null}
        <h1 className={`${compact ? "" : "mt-5 "}text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl`}>{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
        {compact ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted">
            <span>适用角色：{audience.join("、")}</span>
            {updatedAt || date ? <span>更新于 {updatedAt ?? date}</span> : null}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  )
}
