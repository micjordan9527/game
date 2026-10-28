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
    description: "完整官网页面的服务展示与布局预览。",
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
    description: "直接体验角色看板、经营概览与异常入口。",
    status: "已接入",
    href: "/cases/admin-optimization",
    previewSrc: "/case-assets/admin-optimization/index.html",
    tags: ["后台", "原型", "优化方案"],
    learningGoal: "依据本地新版原型复盘角色任务、口径与异常路径，并用证据清单设计同条件对照测试。",
    estimatedMinutes: 25,
    difficulty: "进阶",
    audience: ["老板", "运营", "财务", "客服", "项目经理"],
  },
  {
    slug: "bm-optimization",
    title: "BM优化",
    description: "查看首页分类、状态与详情操作区三组局部，分别放大原界面与生成式方案。",
    status: "已接入",
    href: "/cases/bm-optimization",
    coverSrc: "/case-assets/bm-optimization/bm-home-optimization.png",
    coverSrcWebp: "/case-assets/bm-optimization/bm-home-optimization.webp",
    coverSrcAvif: "/case-assets/bm-optimization/bm-home-optimization.avif",
    coverAlt: "BM 首页优化信息图预览",
    coverWidth: 1600,
    coverHeight: 1160,
    tags: ["BM", "手机端", "首页", "详情页", "视觉提案", "案例评审"],
    learningGoal: "区分静态对照图的可见变化与尚需交互验证的问题，形成手机界面复核清单。",
    estimatedMinutes: 20,
    difficulty: "进阶",
    audience: ["产品", "设计", "运营", "前端"],
  },
  {
    slug: "competitor-analysis",
    title: "竞品分析",
    description: "查看U8首页入口、底部导航与个人中心三组局部，分别放大材料中的原界面与改版示意。",
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
