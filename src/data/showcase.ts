import { getCasePresentation } from "./cases"

export type ShowcaseItem = {
  slug: string
  title: string
  description: string
  href: string
  cover: string
  kind: string
}

export const showcaseItems: ShowcaseItem[] = [
  getCasePresentation("admin-optimization"),
  getCasePresentation("bm-optimization"),
  {
    slug: "brand-visual-system",
    title: "品牌视觉系统",
    description: "从 Logo 到品牌规范、网页、手机界面与应用物料。",
    href: "/ai-workflows/brand-visual-system",
    cover: "/case-assets/ai-workflows/brand-visual-system/output-01-brand-overview.webp",
    kind: "AI 成果",
  },
  {
    slug: "ui-design-system",
    title: "UI 设计系统",
    description: "网页、移动端、卡片与控件的完整视觉输出。",
    href: "/ai-workflows/ui-design-system",
    cover: "/case-assets/ai-workflows/ui-design-system/output-01-overview.webp",
    kind: "AI 成果",
  },
  getCasePresentation("white-label-official"),
  getCasePresentation("competitor-analysis"),
]
