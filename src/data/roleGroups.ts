export type RoleArticleEntry = { slug: string; reference?: boolean }
export type RoleGroup = { slug: string; title: string; description: string; entries: RoleArticleEntry[] }
export type RoleDirectoryDefinition = {
  id: string
  audience: string
  title: string
  description: string
  groups: RoleGroup[]
  references: RoleArticleEntry[]
  simple?: boolean
}

const entries = (...slugs: string[]): RoleArticleEntry[] => slugs.map((slug) => ({ slug }))
const references = (...slugs: string[]): RoleArticleEntry[] => slugs.map((slug) => ({ slug, reference: true }))

// One primary group per article within each role. Other roles reuse the same article URLs.
export const roleDirectories: RoleDirectoryDefinition[] = [
  {
    id: "product", audience: "产品", title: "产品", description: "按负责的业务领域查看对象、规则、状态、权限和实际界面。",
    groups: [
      { slug: "accounts", title: "会员与账号", description: "注册登录、身份验证、资料、账号限制与恢复。", entries: entries(
        "member-account-states",
      ) },
      { slug: "games", title: "游戏与投注", description: "游戏目录、进入流程、投注受理、注单结果与外部服务边界。", entries: entries(
        "sportsbook-basic", "game-catalog-availability", "bet-ticket-status", "game-provider-api",
      ) },
      { slug: "wallet", title: "钱包与支付", description: "钱包模型、充值提现、账务记录、交易限额与费用。", entries: entries(
        "wallet-payment-reconciliation", "wallet-center-vs-seamless", "payment-channel-basic", "transaction-limits-fees",
      ) },
      { slug: "marketing", title: "营销与权益", description: "活动规则、奖励权益、内容承接与用户告知。", entries: entries(
        "operation-product-conversion-model", "campaign-risk-review", "tg-message-media",
      ) },
      { slug: "agents", title: "代理与渠道", description: "会员归属、代理层级、推广关系、佣金规则与结算。", entries: entries(
        "member-agent-platform", "agent-system-design",
      ) },
      { slug: "data", title: "数据与报表", description: "指标定义、统计范围、币种日期、明细与数据导出。", entries: entries(
        "data-report-metrics", "currency-timezone-reporting", "export-masking-audit",
      ) },
      { slug: "risk", title: "风控与安全", description: "风险规则、审批、权限限制与处理依据。", entries: entries(
        "risk-rule-basic", "access-approval-audit",
      ) },
      { slug: "platform", title: "平台与配置", description: "后台公共模块、多站点、配置、内容发布与通知能力。", entries: entries(
        "admin-modules", "multi-tenant-site-config", "content-publication-versions", "notification-support-tickets",
      ) },
    ],
    references: references(
      "what-is-white-label", "how-gambling-platform-works", "electronic-gaming-machine",
      "admin-information-hierarchy", "admin-filter-list-states", "admin-bulk-actions",
      "form-validation-submit-feedback", "mobile-page-layout", "api-idempotency-compensation",
      "requirements-release-acceptance", "launch-checklist", "monitoring-incident-recovery",
    ),
  },
  {
    id: "development", audience: "开发", title: "开发", description: "按实现范围查看界面、业务服务、外部接口、数据处理和交付验证。",
    groups: [
      { slug: "frontend", title: "前端界面", description: "页面层级、查询返回、表单反馈、批量操作与手机布局。", entries: entries(
        "admin-information-hierarchy", "admin-filter-list-states", "form-validation-submit-feedback",
        "admin-bulk-actions", "mobile-page-layout",
      ) },
      { slug: "services", title: "业务服务", description: "账号、权限、游戏、账务和内容服务中的状态与业务约束。", entries: entries(
        "admin-modules", "member-account-states", "access-approval-audit", "game-catalog-availability",
        "bet-ticket-status", "wallet-payment-reconciliation", "transaction-limits-fees", "agent-system-design",
        "content-publication-versions", "notification-support-tickets", "multi-tenant-site-config",
      ) },
      { slug: "integration", title: "接口集成", description: "外部服务职责、钱包接入、重复请求、乱序与补偿。", entries: entries(
        "game-provider-api", "wallet-center-vs-seamless", "api-idempotency-compensation",
      ) },
      { slug: "data", title: "数据处理", description: "金额精度、业务日期、统计口径、导出与脱敏。", entries: entries(
        "currency-timezone-reporting", "export-masking-audit",
      ) },
      { slug: "delivery", title: "工程交付", description: "版本变更、上线检查、监控告警与恢复验证。", entries: entries(
        "requirements-release-acceptance", "launch-checklist", "monitoring-incident-recovery", "backup-restore-verification",
      ) },
    ],
    references: references("what-is-white-label", "how-gambling-platform-works", "electronic-gaming-machine"),
  },
  {
    id: "test", audience: "测试", title: "测试", description: "按检查方向查看操作结果、业务约束、接口异常、权限和发布依据。",
    groups: [
      { slug: "functional", title: "业务功能", description: "正常与异常流程、输入校验、结果状态及页面返回。", entries: entries(
        "member-account-states", "game-catalog-availability", "transaction-limits-fees", "agent-system-design",
        "content-publication-versions", "currency-timezone-reporting", "admin-filter-list-states",
        "form-validation-submit-feedback", "admin-bulk-actions", "mobile-page-layout",
      ) },
      { slug: "integration", title: "接口联调", description: "支付与账务结果、重复通知、乱序事件和未知结果。", entries: entries(
        "wallet-payment-reconciliation", "api-idempotency-compensation",
      ) },
      { slug: "security", title: "权限安全", description: "角色权限、审批、数据隔离、脱敏和下载限制。", entries: entries(
        "access-approval-audit", "multi-tenant-site-config", "export-masking-audit",
      ) },
      { slug: "stability", title: "性能稳定", description: "稳定性、故障处理和恢复后的业务验证。", entries: entries(
        "monitoring-incident-recovery", "backup-restore-verification",
      ) },
      { slug: "regression", title: "回归验收", description: "变更范围、版本证据、上线检查与回退条件。", entries: entries(
        "requirements-release-acceptance", "launch-checklist",
      ) },
    ],
    references: references("electronic-gaming-machine"),
  },
  {
    id: "support", audience: "客服", title: "客服", description: "按用户问题查看账号限制、业务结果和服务处理记录。",
    groups: [
      { slug: "accounts", title: "账号问题", description: "注册登录、账号限制、资料核对与恢复。", entries: entries("member-account-states") },
      { slug: "results", title: "业务结果", description: "游戏可用状态、注单处理结果和用户可见提示。", entries: entries("game-catalog-availability", "bet-ticket-status") },
      { slug: "tickets", title: "工单与投诉", description: "问题分流、服务记录、申请审批、通知与内容版本。", entries: entries(
        "notification-support-tickets", "access-approval-audit", "content-publication-versions", "community-operations-governance",
      ) },
    ],
    references: references("electronic-gaming-machine"),
  },
  {
    id: "finance", audience: "财务", title: "财务", description: "按资金记录、对账口径与结算报表查看核对依据。",
    groups: [
      { slug: "funds", title: "资金流水", description: "余额变化、充值提现、交易限额与手续费。", entries: entries("wallet-payment-reconciliation", "transaction-limits-fees") },
      { slug: "reconciliation", title: "支付对账", description: "原币金额、币种、业务日期和跨日对账口径。", entries: entries("currency-timezone-reporting") },
      { slug: "settlement", title: "结算与报表", description: "佣金结算、统计指标、汇总和原始明细。", entries: entries("agent-system-design", "data-report-metrics") },
    ],
    references: references("access-approval-audit"),
  },
  {
    id: "project", audience: "项目经理", title: "项目管理", description: "按交付阶段查看范围、协作依赖、发布检查和版本变更。",
    groups: [
      { slug: "scope", title: "需求范围", description: "明确交付对象、目标、约束和需求边界。", entries: [] },
      { slug: "dependencies", title: "协作排期", description: "接入依赖、合作资料、协作职责和异常升级。", entries: entries(
        "game-provider-api", "payment-channel-basic", "channel-quality-review", "community-operations-governance",
      ) },
      { slug: "release", title: "上线验收", description: "上线范围、版本证据、恢复验证与交付检查。", entries: entries("launch-checklist", "backup-restore-verification") },
      { slug: "change-review", title: "变更复盘", description: "核对变更范围、版本影响、验收依据和回退边界。", entries: entries("requirements-release-acceptance") },
    ],
    references: references("api-idempotency-compensation"),
  },
  {
    id: "devops", audience: "运维", title: "运维", description: "按站点配置、故障处理和数据恢复查看现有图解。",
    groups: [
      { slug: "configuration", title: "配置部署", description: "站点与租户配置、发布范围、上线检查和回退。", entries: entries("multi-tenant-site-config", "launch-checklist") },
      { slug: "monitoring", title: "监控故障", description: "告警分派、故障定位、止损与恢复后的核对。", entries: entries("monitoring-incident-recovery") },
      { slug: "recovery", title: "备份恢复", description: "备份、隔离恢复、数据一致性和业务可用性验证。", entries: entries("backup-restore-verification") },
    ],
    references: [],
  },
  {
    id: "risk", audience: "风控", title: "风控", description: "查看风险规则、活动规则评审与敏感数据控制。", simple: true,
    groups: [{ slug: "all", title: "风控资料", description: "风险识别、审核依据、处理边界与数据权限。", entries: entries("risk-rule-basic", "campaign-risk-review", "export-masking-audit") }],
    references: [],
  },
  {
    id: "business", audience: "商务", title: "商务", description: "查看合作来源、渠道资料、沟通记录与合作边界。", simple: true,
    groups: [{ slug: "all", title: "商务资料", description: "围绕合作对象核对来源、资料、沟通和异常反馈。", entries: entries("channel-quality-review") }],
    references: [],
  },
  {
    id: "management", audience: "经营管理", title: "经营管理", description: "从平台职责、运营目标与报表依据查看经营问题。", simple: true,
    groups: [{ slug: "all", title: "经营管理资料", description: "平台交付边界、业务目标、数据汇总和核对依据。", entries: entries("what-is-white-label", "operation-product-conversion-model", "data-report-metrics") }],
    references: [],
  },
]
