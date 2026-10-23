export type KnowledgeTopic = {
  slug: string
  title: string
  description: string
  articles: string[]
  cases: string[]
  templates: string[]
  workflows: string[]
}

// Each list is curated around a specific work task, rather than keyword matches.
export const knowledgeTopics: KnowledgeTopic[] = [
  {
    slug: "wallet",
    title: "钱包、支付与对账",
    description: "理解余额与支付状态，再用报表模板核对资金记录。",
    articles: ["wallet-payment-reconciliation", "wallet-center-vs-seamless", "payment-channel-basic", "data-report-metrics"],
    cases: ["admin-optimization"],
    templates: ["wallet-reconciliation-checklist", "data-report-spec", "launch-checklist"],
    workflows: [],
  },
  {
    slug: "member",
    title: "会员与账号状态",
    description: "区分账号、资料验证与会话权限，再检查受限和恢复路径。",
    articles: ["member-account-states", "member-agent-platform", "admin-modules"],
    cases: ["admin-optimization"],
    templates: ["member-account-review", "risk-rule-review"],
    workflows: [],
  },
  {
    slug: "agent",
    title: "代理与会员归属",
    description: "核对代理层级、归属生效区间、规则版本与结算复核，再用 PRD 逐项评审。",
    articles: ["member-agent-platform", "agent-system-design", "member-account-states"],
    cases: [],
    templates: ["agent-system-prd", "white-label-requirement-form"],
    workflows: [],
  },
  {
    slug: "admin",
    title: "后台与页面设计",
    description: "先拆模块与信息层级，再对照后台案例和 UI 设计系统。",
    articles: ["admin-modules", "admin-information-hierarchy"],
    cases: ["admin-optimization"],
    templates: ["data-report-spec"],
    workflows: ["ui-design-system"],
  },
  {
    slug: "campaign",
    title: "活动规则与评审",
    description: "理解活动概念，检查参与条件、奖励规则与数据口径。",
    articles: ["first-deposit-retention-vip", "campaign-risk-review"],
    cases: [],
    templates: ["promotion-system-prd", "risk-rule-review"],
    workflows: [],
  },
]
