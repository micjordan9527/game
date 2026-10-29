export type OperationScene = {
  slug: string
  title: string
  output: string
  description: string
  href: string
  image?: { src: string; alt: string; width: number; height: number }
}

export const operationScenes: OperationScene[] = [
  {
    slug: "tg-message",
    title: "TG推送",
    output: "消息预览",
    description: "查看顶部视频替换位置，对照原推送中的正文与按钮排布。",
    href: "/articles/tg-message-media#tg-message-demo",
    image: { src: "/images/operations/tg-message-poster.jpg", alt: "TG推送视频的静态画面", width: 1280, height: 720 },
  },
  {
    slug: "content-publication",
    title: "公告发布",
    output: "公告版本界面",
    description: "对照草稿、审核、生效与撤回时的内容版本。",
    href: "/articles/content-publication-versions#visual-guide",
  },
  {
    slug: "campaign-maintenance",
    title: "活动维护",
    output: "活动规则示例",
    description: "核对参与条件、奖励规则和异常处理边界。",
    href: "/articles/campaign-risk-review#scenario",
  },
  {
    slug: "report-reconciliation",
    title: "报表核对",
    output: "报表汇总与明细",
    description: "从汇总查看逐笔明细，核对人数、笔数与金额。",
    href: "/articles/data-report-metrics#visual-guide",
  },
]
