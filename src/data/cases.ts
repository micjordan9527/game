export type CaseItem = {
  slug: string
  title: string
  description: string
  status: "已接入" | "待补充"
  href: string
  previewSrc?: string
  coverSrc?: string
  coverSrcWebp?: string
  coverSrcAvif?: string
  coverAlt?: string
  coverWidth?: number
  coverHeight?: number
  tags: string[]
  learningGoal?: string
  estimatedMinutes?: number
  difficulty?: "入门" | "进阶" | "提高"
  audience?: string[]
}

export const caseItems: CaseItem[] = [
  {
    slug: "white-label-official",
    title: "包网官网",
    description: "你上传的官网静态页，作为包网官网案例预览入口。",
    status: "已接入",
    href: "/cases/white-label-official",
    previewSrc: "/case-assets/white-label-official/index.html",
    tags: ["官网", "落地页", "静态 HTML"],
    learningGoal: "理解官网如何组织服务能力说明、咨询路径和交付可信度。",
    estimatedMinutes: 12,
    difficulty: "入门",
    audience: ["老板", "商务", "运营", "客服"],
  },
  {
    slug: "admin-optimization",
    title: "后台优化",
    description: "以老板、运营、财务、客服等角色视角重组后台，让数据更清晰、路径更短，并支持原版与新版对比。",
    status: "已接入",
    href: "/cases/admin-optimization",
    previewSrc: "/case-assets/admin-optimization/index.html",
    tags: ["后台", "原型", "优化方案"],
    learningGoal: "对照原版与新版工作台，理解角色视角下的数据组织和异常处理流程。",
    estimatedMinutes: 25,
    difficulty: "进阶",
    audience: ["老板", "运营", "财务", "客服", "项目经理"],
  },
  {
    slug: "bm-optimization",
    title: "BM优化",
    description: "B优化项目里的首页与详情页优化信息图，展示移动端体育页面的结构梳理和体验改版方向。",
    status: "已接入",
    href: "/cases/bm-optimization",
    coverSrc: "/case-assets/bm-optimization/bm-home-optimization.png",
    coverSrcWebp: "/case-assets/bm-optimization/bm-home-optimization.webp",
    coverSrcAvif: "/case-assets/bm-optimization/bm-home-optimization.avif",
    coverAlt: "BM 首页优化信息图预览",
    coverWidth: 1600,
    coverHeight: 1160,
    tags: ["BM", "首页", "详情页", "优化方案"],
    learningGoal: "把移动端体育页面的入口、信息层级和用户路径形成可执行改版检查清单。",
    estimatedMinutes: 20,
    difficulty: "进阶",
    audience: ["产品", "设计", "运营", "前端"],
  },
  {
    slug: "competitor-analysis",
    title: "竞品分析",
    description: "沉淀竞品页面拆解、优化方案和信息图，当前已接入 U8 首页与个人中心优化图。",
    status: "已接入",
    href: "/cases/competitor-analysis",
    coverSrc: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.jpg",
    coverSrcWebp: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.webp",
    coverSrcAvif: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif",
    coverAlt: "U8 首页优化信息图预览",
    coverWidth: 2160,
    coverHeight: 5696,
    tags: ["U8", "拆解", "优化方案", "信息图"],
    learningGoal: "基于竞品页面提炼可复用结构点，再按自身用户场景做优先级取舍。",
    estimatedMinutes: 18,
    difficulty: "提高",
    audience: ["产品", "运营", "设计", "商务"],
  },
]

export function getCaseItem(slug: string) {
  return caseItems.find((item) => item.slug === slug)
}
