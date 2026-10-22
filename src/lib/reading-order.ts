import { articles, type Article } from "@/data/articles"
import { categories } from "@/data/categories"
import { topicGuides } from "@/data/topicGuides"

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
