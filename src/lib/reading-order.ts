import { articles, type Article } from "@/data/articles"
import { categories } from "@/data/categories"
import { topicGuides } from "@/data/topicGuides"
import { articleOperationGroup } from "@/lib/operation-navigation"
import { designArticleEntry } from "@/lib/design-navigation"
import { designArticleEntries } from "@/data/designObjects"

export type ArticleReadingNavigation = {
  pathTitle: string
  pathHref: string
  position: number
  total: number
  previous?: Article
  next?: Article
}

// Use the published course module order, then the guide's reading order.
// Other articles in the same category follow without jumping to unrelated topics.
export function getArticleReadingNavigation(article: Article): ArticleReadingNavigation {
  if (article.category === "design") {
    const entry = designArticleEntry(article.slug)
    if (entry) {
      const ordered = designArticleEntries.filter((item) => item.object === entry.object && item.direction === entry.direction && !item.reference).map((item) => articles.find((article) => article.slug === item.slug)!)
      const position = ordered.findIndex((item) => item.slug === article.slug)
      return { pathTitle: "设计体验", pathHref: `/design?object=${entry.object}&direction=${entry.direction}`, position: position + 1, total: ordered.length, previous: ordered[position - 1], next: ordered[position + 1] }
    }
  }
  if (article.category === "operation") {
    const group = articleOperationGroup(article.slug)
    const ordered = group ? group.entries.map((entry) => articles.find((item) => item.slug === entry.slug)!) : [article]
    const position = ordered.findIndex((item) => item.slug === article.slug)
    return { pathTitle: group ? `运营场景 · ${group.title}` : "运营场景 · 相关参考", pathHref: group ? `/operation?group=${group.slug}` : "/operation", position: position + 1, total: ordered.length, previous: ordered[position - 1], next: ordered[position + 1] }
  }
  const guide = topicGuides.find((item) => item.slug === article.category)
  const moduleSlugs = guide?.modules?.flatMap((module) => module.articles) ?? []
  const categorySlugs = articles.filter((item) => item.category === article.category).map((item) => item.slug)
  const slugs = [...new Set([...moduleSlugs, ...(guide?.readingOrder ?? []), ...categorySlugs])]
  const ordered = slugs
    .map((slug) => articles.find((item) => item.slug === slug))
    .filter((item): item is Article => Boolean(item))
  const position = ordered.findIndex((item) => item.slug === article.slug)
  const category = categories.find((item) => item.slug === article.category)

  return {
    pathTitle: category?.title ?? "知识专题",
    pathHref: "/" + article.category,
    position: position >= 0 ? position + 1 : 1,
    total: Math.max(ordered.length, 1),
    previous: position > 0 ? ordered[position - 1] : undefined,
    next: position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : undefined,
  }
}
