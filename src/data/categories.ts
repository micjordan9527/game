export type Category = {
  slug: string
  title: string
  description: string
  icon?: string
  color?: string
  articleCount?: number
}

export const categories: Category[] = [
  {
    slug: "industry",
    title: "行业入门",
    description: "从零理解博彩、体育和包网的基本关系。",
  },
  {
    slug: "sportsbook",
    title: "体育博彩",
    description: "解释早盘、滚球、串关、盘口、水位、注单和结算。",
  },
  {
    slug: "white-label",
    title: "包网科普",
    description: "理解包网平台的组成、交付流程、适用场景和风险。",
  },
  {
    slug: "product",
    title: "产品设计",
    description: "拆解会员、钱包、活动、代理、报表和后台系统。",
  },
  {
    slug: "operation",
    title: "运营治理",
    description: "从流量、产品载体、用户路径、数据口径和异常复盘理解运营目标如何落到系统里。",
  },
  {
    slug: "design",
    title: "设计体验",
    description: "让复杂页面变得更清楚、更容易操作。",
  },
  {
    slug: "development",
    title: "技术开发",
    description: "用图解方式理解系统架构、API、数据流和状态流转。",
  },
  {
    slug: "devops-risk",
    title: "运维风控",
    description: "关注稳定性、权限、异常、监控和风险识别。",
  },
]
