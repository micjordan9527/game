import { topicScenarios } from "@/data/topicScenarios"
import { businessCaseEntries } from "@/data/caseLibrary"
import { stateExamples } from "@/data/stateExamples"
import { knowledgeContentUpdates } from "@/data/knowledgeContentUpdates"
import releaseHistory from "@/data/releaseHistory.json"
import { demonstrationEntries, demonstrationGroups } from "@/data/demonstrationEntries"
import { businessQuestions } from "@/data/businessQuestions"
import { templateExamples } from "@/data/templateExamples"
import { workflowProcesses } from "@/data/workflowProcess"
import { caseCardDetails, adminTours } from "@/data/caseEnhancements"
import { caseReadingGuides } from "@/data/caseReadingGuides"
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
  businessCaseEntries.forEach((item) => add({ id: `business-case:${item.id}`, kind: "案例", title: item.title, description: item.description, href: item.href, tags: item.tags }, item.keywords))
  add({ id: "knowledge:updates", kind: "知识栏目", title: "更新记录", description: "按版本查看变化、所在位置与直接入口。", href: "/updates", tags: ["更新", "版本", "链接", "功能", "知识内容", "配图"] }, JSON.stringify({ releaseHistory, knowledgeContentUpdates }))
  add({ id: "knowledge:demonstrations", kind: "知识栏目", title: "功能演示目录", description: "按六个业务问题找说明与演示，或按业务流程、界面设计、浏览与查找定位10个已有演示。", href: "/updates/demonstrations", tags: ["功能", "演示", "目录", "案例", ...demonstrationGroups.map((group) => group.title)] }, JSON.stringify({ entries: demonstrationEntries, groups: demonstrationGroups, questions: businessQuestions }))
  businessQuestions.forEach((item) => add({ id: `question:${item.id}`, kind: "知识栏目", title: item.title, description: item.summary, href: `/updates/demonstrations#question-${item.id}`, tags: [...item.keywords, "业务问题", "排查", "演示"] }, JSON.stringify(item)))
  add({ id: "design:states", kind: "设计专题", title: "界面状态对照", description: "加载、空结果、失败、受限、处理中与未知结果的界面反馈及实际演示入口。", href: "/design/states", tags: ["界面", "状态", "设计", "产品", "前端"] }, JSON.stringify(stateExamples))

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
      (markdown?.content ?? "") + " " + JSON.stringify(topicScenarios[article.slug] ?? {})
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
      template.sections.map((section) => [section.title, ...section.items].join(" ")).join(" ") + " " + JSON.stringify(templateExamples[template.slug] ?? {})
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
        tags: [...item.tags, ...(item.audience ?? []), ...(caseReadingGuides[item.slug] ? ["界面阅读说明"] : [])],
      },
      item.slug === "admin-optimization"
        ? "老板 运营 产品 财务 客服 角色切换 经营看板 异常入口 钱包 充值 提现 资金流水 注单 风险审核 " + JSON.stringify({ adminTours, guide: caseReadingGuides[item.slug] })
        : item.tags.join(" ") + " " + JSON.stringify({ details: caseCardDetails[item.slug] ?? {}, guide: caseReadingGuides[item.slug] })
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
      [item.prompt, item.referenceNote, item.extensionNote ?? "", JSON.stringify(workflowProcesses[item.slug as keyof typeof workflowProcesses] ?? {})].join(" ")
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
        description: `从${role.title}视角查看案例、图解与工具。`,
        href: `/roles/${role.slug}`,
        tags: [role.title, "角色", "案例", "图解"],
      },
      role.steps.flatMap((step) => [step.title, step.description]).join(" ")
    )
  )

  return records
}
