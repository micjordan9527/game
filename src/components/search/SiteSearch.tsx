"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import type { Article } from "@/data/articles"
import type { GlossaryTerm } from "@/data/glossary"
import type { TemplateItem } from "@/data/templates"
import { Badge } from "@/components/common/Badge"

type SiteSearchProps = {
  articles: Article[]
  terms: GlossaryTerm[]
  templates: TemplateItem[]
  initialQuery?: string
}

export function SiteSearch({ articles, terms, templates, initialQuery = "" }: SiteSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const normalizedQuery = query.trim().toLowerCase()
  const hotKeywords = ["钱包", "代理", "注单", "支付", "风控", "上线", "数据报表"]

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "")
  }, [searchParams])

  function updateQuery(value: string) {
    setQuery(value)
    const params = new URLSearchParams()
    if (value.trim()) params.set("q", value.trim())
    router.replace(params.toString() ? `/search?${params.toString()}` : "/search", { scroll: false })
  }

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return {
        articles: articles.slice(0, 6),
        terms: terms.slice(0, 6),
        templates: templates.slice(0, 4),
      }
    }

    return {
      articles: articles
        .filter((article) =>
          [article.title, article.description, article.category, ...article.tags, ...article.audience].join(" ").toLowerCase().includes(normalizedQuery)
        )
        .sort((a, b) => scoreArticle(b, normalizedQuery) - scoreArticle(a, normalizedQuery)),
      terms: terms.filter((term) =>
        [term.term, term.category, term.shortDescription, term.commonScene, ...term.relatedFeatures, term.misunderstanding ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      ),
      templates: templates
        .filter((template) =>
          [template.title, template.description, template.category, ...template.roles, ...template.useCases, ...template.sections.flatMap((section) => [section.title, ...section.items])]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        )
        .sort((a, b) => scoreText([b.title, b.description, b.category, ...b.roles].join(" "), normalizedQuery) - scoreText([a.title, a.description, a.category, ...a.roles].join(" "), normalizedQuery)),
    }
  }, [articles, normalizedQuery, templates, terms])

  const resultCount = results.articles.length + results.terms.length + results.templates.length

  return (
    <div>
      <div className="rounded-xl border border-line bg-white p-4 shadow-sm md:p-5">
        <label htmlFor="site-search" className="text-sm font-semibold text-ink">
          搜索全站内容
        </label>
        <div className="mt-3 flex items-center gap-3 rounded-md border border-line bg-paper px-4 focus-within:border-brand-600 focus-within:bg-white">
          <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            id="site-search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索文章、术语、模板..."
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {hotKeywords.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => updateQuery(keyword)}
              className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-muted hover:text-brand-700"
            >
              {keyword}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{normalizedQuery ? `找到 ${resultCount} 个结果` : "先展示一部分常用内容，输入关键词后会实时筛选。"}</p>
      </div>

      {resultCount === 0 ? (
        <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center">
          <div className="text-lg font-semibold text-ink">没有找到相关内容</div>
          <p className="mt-2 text-sm leading-7 text-muted">可以换成更短的关键词，例如“钱包”“代理”“注单”“上线”。</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-8">
          <SearchGroup title="文章" count={results.articles.length}>
            {results.articles.map((article) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} className="block rounded-lg border border-line bg-white p-5 hover:border-brand-100 hover:shadow-soft">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="brand">{article.category}</Badge>
                  <Badge tone="blue">{article.difficulty}</Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-ink"><Highlight text={article.title} query={query} /></h3>
                <p className="mt-2 text-sm leading-7 text-muted"><Highlight text={article.description} query={query} /></p>
              </Link>
            ))}
          </SearchGroup>
          <SearchGroup title="术语" count={results.terms.length}>
            {results.terms.map((term) => (
              <Link key={term.id} href={`/glossary#${term.id}`} className="block rounded-lg border border-line bg-white p-5 hover:border-brand-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink"><Highlight text={term.term} query={query} /></h3>
                  <Badge tone="brand">{term.category}</Badge>
                </div>
                <p className="mt-2 text-sm leading-7 text-muted"><Highlight text={term.shortDescription} query={query} /></p>
              </Link>
            ))}
          </SearchGroup>
          <SearchGroup title="模板" count={results.templates.length}>
            {results.templates.map((template) => (
              <Link key={template.slug} href={`/templates/${template.slug}`} className="block rounded-lg border border-line bg-white p-5 hover:border-brand-100">
                <Badge tone="brand">{template.category}</Badge>
                <h3 className="mt-3 text-lg font-semibold text-ink"><Highlight text={template.title} query={query} /></h3>
                <p className="mt-2 text-sm leading-7 text-muted"><Highlight text={template.description} query={query} /></p>
              </Link>
            ))}
          </SearchGroup>
        </div>
      )}
    </div>
  )
}

function scoreArticle(article: Article, query: string) {
  return scoreText(article.title, query) * 4 + scoreText(article.tags.join(" "), query) * 3 + scoreText(article.description, query)
}

function scoreText(text: string, query: string) {
  const normalizedText = text.toLowerCase()
  if (!query) return 0
  if (normalizedText === query) return 10
  if (normalizedText.includes(query)) return 3
  return 0
}

function Highlight({ text, query }: { text: string; query: string }) {
  const value = query.trim()
  if (!value) return text

  const index = text.toLowerCase().indexOf(value.toLowerCase())
  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-brand-50 px-0.5 text-brand-700">{text.slice(index, index + value.length)}</mark>
      {text.slice(index + value.length)}
    </>
  )
}

function SearchGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null

  return (
    <section>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <span className="rounded-full bg-paper px-3 py-1 text-xs text-muted">{count}</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  )
}
