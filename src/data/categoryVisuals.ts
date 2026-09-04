export type CategoryVisual = {
  categorySlug: string
  title: string
  description: string
  imageSrc: string
  imageSrcWebp?: string
  imageSrcAvif?: string
  width: number
  height: number
  pillars: {
    title: string
    description: string
  }[]
  workflow: {
    title: string
    description: string
  }[]
  deliverables: string[]
}

export const categoryVisuals: CategoryVisual[] = [
  {
    categorySlug: "operation",
    title: "运营与产品协作地图",
    description: "先理解运营提供流量、产品承接需求，再把活动评审、社群协作、渠道质量、数据口径和异常复盘放进同一套闭环。",
    imageSrc: "/images/articles/operation-governance-map.png",
    imageSrcWebp: "/images/articles/operation-governance-map.webp",
    imageSrcAvif: "/images/articles/operation-governance-map.avif",
    width: 864,
    height: 1821,
    pillars: [
      {
        title: "流量来源",
        description: "渠道、内容、社群和合作入口要能说明来源、质量、成本和稳定性。",
      },
      {
        title: "产品载体",
        description: "官网、H5、App、活动页、客服入口和后台工具共同承接用户需求。",
      },
      {
        title: "数据口径",
        description: "注册、支付、活跃、留存、异常和反馈都要有统一统计口径。",
      },
      {
        title: "闭环改进",
        description: "问题不是处理完就结束，还要回到页面、规则、权限和流程里修正。",
      },
    ],
    workflow: [
      {
        title: "识别运营目标",
        description: "先判断目标是流量承接、用户理解、服务分流、数据观察还是风险治理。",
      },
      {
        title: "选择承接载体",
        description: "把目标落到官网、页面、功能、后台看板、客服入口或内容资料中。",
      },
      {
        title: "配置规则与数据",
        description: "明确参与条件、状态流转、权限边界、数据来源和异常处理方式。",
      },
      {
        title: "复盘产品改进",
        description: "用数据、客服反馈、异常记录和协作成本反推产品结构优化。",
      },
    ],
    deliverables: ["运营目标拆解表", "产品承接路径图", "活动规则评审表", "数据口径说明", "异常复盘报告"],
  },
]

export function getCategoryVisual(categorySlug: string) {
  return categoryVisuals.find((visual) => visual.categorySlug === categorySlug)
}
