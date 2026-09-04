import type { Article } from "@/data/articles"
import { articles } from "@/data/articles"
import type { GlossaryTerm } from "@/data/glossary"
import { glossary } from "@/data/glossary"
import type { TemplateItem } from "@/data/templates"

function normalize(value: string) {
  return value.toLowerCase()
}

export function getTermsForArticle(article: Article, limit = 8): GlossaryTerm[] {
  const text = normalize([article.title, article.description, article.category, ...article.tags, ...article.audience].join(" "))

  return glossary
    .filter((term) => {
      const candidates = [term.term, term.category, ...term.relatedFeatures]
      return candidates.some((candidate) => text.includes(normalize(candidate)))
    })
    .slice(0, limit)
}

export function getArticlesForTerm(term: GlossaryTerm, limit = 3): Article[] {
  const candidates = [term.term, term.category, ...term.relatedFeatures].map(normalize)

  return articles
    .filter((article) => {
      const text = normalize([article.title, article.description, article.category, ...article.tags, ...article.audience].join(" "))
      return candidates.some((candidate) => text.includes(candidate))
    })
    .slice(0, limit)
}

export function formatTemplateAsMarkdown(template: TemplateItem) {
  return [
    `# ${template.title}`,
    "",
    template.description,
    "",
    "## 适用角色",
    "",
    ...template.roles.map((role) => `- ${role}`),
    "",
    "## 使用场景",
    "",
    ...template.useCases.map((useCase) => `- ${useCase}`),
    "",
    ...template.sections.flatMap((section) => [
      `## ${section.title}`,
      "",
      ...section.items.map((item) => `- [ ] ${item}`),
      "",
    ]),
    "## 注意事项",
    "",
    ...template.cautions.map((caution) => `- ${caution}`),
    "",
  ].join("\n")
}
