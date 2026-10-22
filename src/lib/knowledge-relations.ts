import { articles } from "@/data/articles"
import { templates } from "@/data/templates"
import { caseItems } from "@/data/cases"
import { aiWorkflows } from "@/data/aiWorkflowLibrary"

export type RelatedResource = {
  kind: "文章" | "案例" | "模板" | "AI 工作流"
  title: string
  description: string
  href: string
}

// Explicit editorial associations avoid speculative recommendations.
const articleRelations: Record<string, { cases?: string[]; templates?: string[]; workflows?: string[] }> = {
  "what-is-white-label": { cases: ["white-label-official"], templates: ["white-label-requirement-form"] },
  "how-gambling-platform-works": { cases: ["white-label-official"], templates: ["white-label-requirement-form"] },
  "member-agent-platform": { templates: ["agent-system-prd", "white-label-requirement-form"] },
  "admin-modules": { cases: ["admin-optimization"], templates: ["agent-system-prd", "data-report-spec"] },
  "admin-information-hierarchy": { cases: ["admin-optimization", "competitor-analysis"], workflows: ["ui-design-system"] },
  "wallet-center-vs-seamless": { cases: ["admin-optimization"], templates: ["white-label-requirement-form"] },
  "bet-ticket-status": { cases: ["admin-optimization", "bm-optimization"], templates: ["launch-checklist"] },
  "sportsbook-basic": { cases: ["bm-optimization"], templates: ["launch-checklist"] },
  "agent-system-design": { templates: ["agent-system-prd"] },
  "operation-product-conversion-model": { cases: ["competitor-analysis"], templates: ["promotion-system-prd", "data-report-spec"] },
  "first-deposit-retention-vip": { templates: ["promotion-system-prd"] },
  "game-provider-api": { templates: ["launch-checklist"] },
  "launch-checklist": { templates: ["launch-checklist", "incident-review"], cases: ["white-label-official"] },
  "payment-channel-basic": { templates: ["launch-checklist", "data-report-spec"] },
  "risk-rule-basic": { templates: ["risk-rule-review"] },
  "data-report-metrics": { templates: ["data-report-spec"], cases: ["admin-optimization"] },
  "community-operations-governance": { templates: ["incident-review"] },
  "channel-quality-review": { templates: ["risk-rule-review"] },
  "campaign-risk-review": { templates: ["promotion-system-prd", "risk-rule-review"] },
}

function toArticle(slug: string): RelatedResource | null {
  const a = articles.find((item) => item.slug === slug)
  return a ? { kind: "文章", title: a.title, description: a.description, href: "/articles/" + a.slug } : null
}
function toCase(slug: string): RelatedResource | null {
  const c = caseItems.find((item) => item.slug === slug)
  return c ? { kind: "案例", title: c.title, description: c.description, href: c.href } : null
}
function toTemplate(slug: string): RelatedResource | null {
  const t = templates.find((item) => item.slug === slug)
  return t ? { kind: "模板", title: t.title, description: t.description, href: "/templates/" + t.slug } : null
}
function toWorkflow(slug: string): RelatedResource | null {
  const w = aiWorkflows.find((item) => item.slug === slug)
  return w ? { kind: "AI 工作流", title: w.title, description: w.summary, href: "/ai-workflows/" + w.slug } : null
}
export function resourcesForArticle(slug: string): RelatedResource[] {
  const links = articleRelations[slug]
  if (!links) return []
  return [
    ...(links.cases ?? []).map(toCase),
    ...(links.templates ?? []).map(toTemplate),
    ...(links.workflows ?? []).map(toWorkflow),
  ].filter((item): item is RelatedResource => item !== null)
}
export function articlesForResource(kind: "案例" | "模板" | "AI 工作流", slug: string): RelatedResource[] {
  return Object.entries(articleRelations)
    .filter(([, links]) => {
      const candidates = kind === "案例" ? links.cases : kind === "模板" ? links.templates : links.workflows
      return candidates?.includes(slug)
    })
    .map(([articleSlug]) => toArticle(articleSlug))
    .filter((item): item is RelatedResource => item !== null)
}
