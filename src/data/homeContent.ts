// Homepage selections are explicit; adding a resource does not change the homepage.
export const homeContent = {
  caseSlugs: ["admin-optimization", "bm-optimization"],
  diagrams: [
    { slug: "member-account-overview", title: "会员与账号状态", description: "账号、验证、会话与权限的关系。" },
    { slug: "wallet-payment-overview", title: "钱包、支付与对账", description: "订单、支付通道与账本的状态对照。" },
  ],
  workflowSlugs: ["brand-visual-system", "ui-design-system"],
  topics: [
    {
      title: "会员与账号",
      description: "注册、登录、账号状态",
      href: "/articles/member-account-states",
      icon: "member",
    },
    {
      title: "钱包与支付",
      description: "充值、提现、对账",
      href: "/articles/wallet-payment-reconciliation",
      icon: "wallet",
    },
    { title: "代理系统", description: "层级、归属、结算", href: "/articles/agent-system-design", icon: "agent" },
    { title: "活动运营", description: "参与条件、奖励、规则", href: "/operation", icon: "campaign" },
    { title: "后台设计", description: "信息层级、组件、页面", href: "/design", icon: "admin" },
    { title: "体育业务", description: "赛事、玩法、注单", href: "/sports", icon: "sports" },
  ],
  quickLinks: [
    { title: "素材规范", href: "/design/material-standards" },
    { title: "模板库", href: "/templates" },
    { title: "术语库", href: "/glossary" },
  ],
} as const
