import "server-only"
import { articles } from "@/data/articles"
import { glossary } from "@/data/glossary"
import { templates } from "@/data/templates"
import { caseItems } from "@/data/cases"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"
import { sportsModules } from "@/data/sports"
import { sportsGuides } from "@/data/sportsGuides"
import { categories } from "@/data/categories"
import { materialStandards } from "@/data/materialStandards"
import { getMarkdownArticle } from "@/lib/articles"

export type SearchKind = "文章" | "术语" | "模板" | "案例" | "AI 工作流" | "体育专题" | "知识栏目" | "素材规范"

export type SearchRecord = {
  id: string
  kind: SearchKind
  title: string
  description: string
  href: string
  tags: string[]
  searchableText: string
}

export function buildSearchIndex(): SearchRecord[] {
  const records: SearchRecord[] = []
  const add = (record: Omit<SearchRecord, "searchableText">, body = "") => {
    records.push({
      ...record,
      searchableText: [record.title, record.description, ...record.tags, body].join(" ").toLowerCase(),
    })
  }

  articles.forEach((article) => {
    const markdown = getMarkdownArticle(article.slug)
    add({
      id: `article:${article.slug}`,
      kind: "文章",
      title: article.title,
      description: article.description,
      href: `/articles/${article.slug}`,
      tags: [...article.tags, ...article.audience, article.category],
    }, markdown?.content ?? "")
  })

  glossary.forEach((term) => add({
    id: `term:${term.id}`,
    kind: "术语",
    title: term.term,
    description: term.shortDescription,
    href: `/glossary#${term.id}`,
    tags: [term.category, ...term.relatedFeatures],
  }, [term.commonScene, term.misunderstanding ?? ""].join(" ")))

  templates.forEach((template) => add({
    id: `template:${template.slug}`,
    kind: "模板",
    title: template.title,
    description: template.description,
    href: `/templates/${template.slug}`,
    tags: [template.category, ...template.roles, ...template.useCases],
  }, template.sections.map((section) => [section.title, ...section.items].join(" ")).join(" ")))

  caseItems.forEach((item) => add({
    id: `case:${item.slug}`,
    kind: "案例",
    title: item.title,
    description: item.description,
    href: item.href,
    tags: [...item.tags, ...(item.audience ?? [])],
  }, item.learningGoal ?? ""))

  aiWorkflows.forEach((item) => add({
    id: `workflow:${item.slug}`,
    kind: "AI 工作流",
    title: item.title,
    description: item.summary,
    href: `/ai-workflows/${item.slug}`,
    tags: [item.scenario, ...item.tags],
  }, [item.prompt, item.referenceNote, item.extensionNote ?? ""].join(" ")))

  sportsModules.forEach((item) => {
    const guide = sportsGuides.find((entry) => entry.slug === item.slug)
    add({
      id: `sports:${item.slug}`,
      kind: "体育专题",
      title: item.title,
      description: item.description,
      href: item.href,
      tags: [item.contentType, ...item.tags],
    }, guide?.sections.map((section) => [section.title, ...section.paragraphs, ...section.checks].join(" ")).join(" ") ?? "")
  })

  categories.forEach((item) => add({
    id: `category:${item.slug}`,
    kind: "知识栏目",
    title: item.title,
    description: item.description,
    href: `/${item.slug}`,
    tags: [],
  }))

  materialStandards.forEach((item) => add({
    id: `material:${item.slug}`,
    kind: "素材规范",
    title: item.title,
    description: item.description,
    href: `/design/material-standards?module=${item.slug}`,
    tags: ["素材规范", item.category],
  }, item.keywords))

  return records
}
