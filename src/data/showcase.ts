export type ShowcaseItem = {
  slug: string
  title: string
  description: string
  href: string
  cover: string
  kind: string
}

export const showcaseItems: ShowcaseItem[] = [
  {
    slug: "admin-optimization",
    title: "后台优化",
    description: "角色看板、经营概览与异常入口，直接操作查看。",
    href: "/cases/admin-optimization",
    cover: "/images/showcase/admin-overview.jpg",
    kind: "交互演示",
  },
  {
    slug: "bm-optimization",
    title: "BM 手机端优化",
    description: "首页与详情页的分类、状态和操作区对照。",
    href: "/cases/bm-optimization",
    cover: "/case-assets/bm-optimization/bm-home-optimization.avif",
    kind: "改版对照",
  },
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
  {
    slug: "white-label-official",
    title: "包网官网",
    description: "完整官网页面，查看服务展示与页面布局。",
    href: "/cases/white-label-official",
    cover: "/images/showcase/official-home.jpg",
    kind: "网站预览",
  },
  {
    slug: "competitor-analysis",
    title: "U8 页面优化",
    description: "首页与个人中心的设计拆解和改版方向。",
    href: "/cases/competitor-analysis",
    cover: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif",
    kind: "信息图",
  },
]
