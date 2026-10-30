export const operationGroups = [
  {
    slug: "website", title: "网站运营",
    description: "维护站内公告、帮助内容与游戏目录，确认发布范围和前台状态。",
    entries: [
      { slug: "content-publication-versions", step: "编辑、审核与发布" },
      { slug: "game-catalog-availability", step: "目录展示与维护状态" },
    ],
  },
  {
    slug: "user", title: "用户运营",
    description: "从会员状态与常用概念，查看消息、客服和社群中的处理方式。",
    entries: [
      { slug: "member-account-states", step: "会员与账号状态" },
      { slug: "first-deposit-retention-vip", step: "常用运营概念" },
      { slug: "notification-support-tickets", step: "消息与客服处理" },
      { slug: "community-operations-governance", step: "社群反馈与协作" },
    ],
  },
  {
    slug: "traffic", title: "流量运营",
    description: "查看渠道资料、推送素材和页面承接，区分素材展示与质量反馈。",
    entries: [
      { slug: "channel-quality-review", step: "渠道资料与质量" },
      { slug: "tg-message-media", step: "推送素材与消息预览" },
      { slug: "operation-product-conversion-model", step: "页面承接与反馈" },
    ],
  },
  {
    slug: "activity", title: "活动运营",
    description: "查看活动规则、数据口径与审批边界。",
    entries: [
      { slug: "campaign-risk-review", step: "规则与风险评审" },
    ],
  },
  {
    slug: "data", title: "数据运营",
    description: "从报表汇总进入明细，再核对账务与异常差异。",
    entries: [
      { slug: "data-report-metrics", step: "汇总、指标与明细" },
      { slug: "wallet-payment-reconciliation", step: "账务与差异处理" },
    ],
  },
] as const

export const operationReferenceSlugs = ["payment-channel-basic"]
export type OperationGroup = (typeof operationGroups)[number]
