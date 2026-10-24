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
import { designTopics } from "@/components/design/DesignExperienceHub"
import { getMarkdownArticle } from "@/lib/articles"
import { showcaseItems } from "@/data/showcase"
import { getImagePromptsForArticle } from "@/data/imagePrompts"
import { workRoles } from "@/data/workRoles"
import { resourceAudiences } from "@/lib/work-audiences"

export type SearchKind =
  | "文章"
  | "术语"
  | "模板"
  | "案例"
  | "AI 工作流"
  | "体育专题"
  | "知识栏目"
  | "设计专题"
  | "素材规范"
  | "角色精选"

export type SearchRecord = {
  id: string
  kind: SearchKind
  title: string
  description: string
  href: string
  tags: string[]
  previewImage?: string
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
    add(
      {
        id: `article:${article.slug}`,
        kind: "文章",
        title: article.title,
        description: article.description,
        href: `/articles/${article.slug}`,
        previewImage: getImagePromptsForArticle(article.slug)[0]?.imageSrc,
        tags: Array.from(
          new Set([
            ...article.tags,
            ...article.audience,
            ...resourceAudiences(`/articles/${article.slug}`, article.audience),
            article.category,
          ])
        ),
      },
      markdown?.content ?? ""
    )
  })

  glossary.forEach((term) =>
    add(
      {
        id: `term:${term.id}`,
        kind: "术语",
        title: term.term,
        description: term.shortDescription,
        href: `/glossary#${term.id}`,
        tags: [term.category, ...term.relatedFeatures],
      },
      [term.commonScene, term.misunderstanding ?? ""].join(" ")
    )
  )

  templates.forEach((template) =>
    add(
      {
        id: `template:${template.slug}`,
        kind: "模板",
        title: template.title,
        description: template.description,
        href: `/templates/${template.slug}`,
        tags: Array.from(
          new Set([
            template.category,
            ...template.roles,
            ...resourceAudiences(`/templates/${template.slug}`, template.roles),
            ...template.useCases,
          ])
        ),
      },
      template.sections.map((section) => [section.title, ...section.items].join(" ")).join(" ")
    )
  )

  caseItems.forEach((item) => {
    add(
      {
        id: `case:${item.slug}`,
        kind: "案例",
        title: item.title,
        description: item.description,
        href: item.href,
        previewImage: showcaseItems.find((work) => work.slug === item.slug)?.cover,
        tags: [...item.tags, ...(item.audience ?? [])],
      },
      item.slug === "admin-optimization"
        ? "老板 运营 产品 财务 客服 角色切换 经营看板 异常入口 钱包 充值 提现 资金流水 注单 风险审核"
        : item.tags.join(" ")
    )
  })

  aiWorkflows.forEach((item) =>
    add(
      {
        id: `workflow:${item.slug}`,
        kind: "AI 工作流",
        title: item.title,
        description: item.summary,
        href: `/ai-workflows/${item.slug}`,
        previewImage: item.outputs[0]?.image,
        tags: [item.scenario, ...item.tags],
      },
      [item.prompt, item.referenceNote, item.extensionNote ?? ""].join(" ")
    )
  )

  sportsModules.forEach((item) => {
    const guide = sportsGuides.find((entry) => entry.slug === item.slug)
    add(
      {
        id: `sports:${item.slug}`,
        kind: "体育专题",
        title: item.title,
        description: item.description,
        href: item.href,
        tags: [item.contentType, ...item.tags],
      },
      guide?.sections.map((section) => [section.title, ...section.paragraphs, ...section.checks].join(" ")).join(" ") ??
        ""
    )
  })

  categories.forEach((item) =>
    add({
      id: `category:${item.slug}`,
      kind: "知识栏目",
      title: item.title,
      description: item.description,
      href: `/${item.slug}`,
      tags: [],
    })
  )

  designTopics.forEach((item) =>
    add(
      {
        id: `design:${item.slug}`,
        kind: "设计专题",
        title: item.title,
        description: item.description,
        href: `/design/${item.slug}`,
        tags: ["设计", "页面体验"],
      },
      item.includes
    )
  )

  materialStandards.forEach((item) =>
    add(
      {
        id: `material:${item.slug}`,
        kind: "素材规范",
        title: item.title,
        description: item.description,
        href: `/design/material-standards?module=${item.slug}`,
        tags: ["素材规范", item.category],
      },
      item.keywords
    )
  )

  workRoles.forEach((role) =>
    add(
      {
        id: `role:${role.slug}`,
        kind: "角色精选",
        title: `${role.title}精选`,
        description: `从${role.title}视角查看作品、图解与工具。`,
        href: `/roles/${role.slug}`,
        tags: [role.title, "角色", "作品", "图解"],
      },
      role.steps.flatMap((step) => [step.title, step.description]).join(" ")
    )
  )

  return records
}
