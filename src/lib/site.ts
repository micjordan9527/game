import { articles } from "@/data/articles"
import { caseItems } from "@/data/cases"
import { categories } from "@/data/categories"
import { glossary } from "@/data/glossary"
import { templates } from "@/data/templates"

export const siteName = "包网知识库"

export const navItems = [
  { href: "/", label: "首页" },
  { href: "/articles", label: "文章资料" },
  ...categories.map((category) => ({
    href: `/${category.slug}`,
    label: category.title,
  })),
  { href: "/cases", label: "案例模块" },
  { href: "/glossary", label: "术语库" },
  { href: "/templates", label: "模板库" },
]

export const caseNavItems = caseItems.map((item) => ({
  href: item.href,
  label: item.title,
  status: item.status,
}))

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug)
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.category === slug)
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug)
}

export function getFeaturedArticles(limit = 4) {
  return articles.slice(0, limit)
}

export function getGlossaryPreview(limit = 6) {
  return glossary.slice(0, limit)
}

export function getTemplateCategories() {
  return Array.from(new Set(templates.map((template) => template.category)))
}
