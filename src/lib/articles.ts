import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { getArticle } from "@/lib/site"

const articlesDirectory = path.join(process.cwd(), "content/articles")

export type MarkdownArticle = {
  slug: string
  content: string
  headings: ArticleHeading[]
  readingMinutes: number
  meta: {
    title: string
    description: string
    category: string
    tags: string[]
    audience: string[]
    difficulty: string
    date?: string
    updatedAt?: string
  }
}

export type ArticleHeading = {
  id: string
  level: 2 | 3
  text: string
}

export function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
}

function getHeadings(content: string): ArticleHeading[] {
  return content
    .split("\n")
    .map((line) => {
      const match = /^(##|###)\s+(.+)$/.exec(line)

      if (!match) return null

      const text = match[2].trim()

      return {
        id: slugifyHeading(text),
        level: match[1] === "##" ? 2 : 3,
        text,
      } satisfies ArticleHeading
    })
    .filter((heading): heading is ArticleHeading => Boolean(heading))
}

function getReadingMinutes(content: string) {
  const words = content.replace(/```[\s\S]*?```/g, "").replace(/\s+/g, "")
  return Math.max(1, Math.ceil(words.length / 500))
}

export function getMarkdownArticle(slug: string): MarkdownArticle | null {
  const filePath = path.join(articlesDirectory, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  const articleContent = content.replace(/^# .+\n+/, "")

  return {
    slug,
    content: articleContent,
    headings: getHeadings(articleContent),
    readingMinutes: getReadingMinutes(articleContent),
    meta: {
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      category: String(data.category ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      audience: Array.isArray(data.audience) ? data.audience.map(String) : [],
      difficulty: String(data.difficulty ?? ""),
      date: data.date ? String(data.date) : getArticle(slug)?.date,
      updatedAt: data.updatedAt ? String(data.updatedAt) : getArticle(slug)?.updatedAt,
    },
  }
}
