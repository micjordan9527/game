export type WorkRole = {
  slug: string
  title: string
  summary: string
  goal: string
  steps: { title: string; description: string; href: string; kind: string }[]
  outputs: string[]
  nextRole: string
  handoff: string
}

export const workRoles: WorkRole[] = [
  {
    slug: "operation", title: "运营", summary: "复核规则与数据，整理有依据的业务问题。",
    goal: "把规则、数据和用户反馈组织成可追踪的问题与复盘记录。",
    steps: [
      { title: "明确运营问题", description: "区分流量来源、页面承接、业务路径与数据复盘，先确定问题范围。", href: "/articles/operation-product-conversion-model", kind: "文章" },
      { title: "检查活动规则", description: "核对参与条件、数据口径、审批和异常处理。", href: "/articles/campaign-risk-review", kind: "文章" },
      { title: "对照后台角色任务", description: "从本地原型观察查询与异常入口，区分演示内容和待验证能力。", href: "/cases/admin-optimization", kind: "案例" },
      { title: "整理活动需求", description: "使用活动 PRD 的规则与风险字段，补充适用范围和负责人。", href: "/templates/promotion-system-prd", kind: "模板" },
      { title: "形成可核对的报表口径", description: "写清周期、来源、筛选与排除规则，作为复盘依据。", href: "/templates/data-report-spec", kind: "模板" },
    ],
    outputs: ["业务问题与证据清单", "活动规则评审记录", "统一的数据口径"],
    nextRole: "product", handoff: "向产品交付问题背景、受影响角色、证据、优先级与期望结果。",
  },
  {
    slug: "product", title: "产品", summary: "把业务问题写成有状态、权限与验收标准的需求。",
    goal: "从业务概念进入状态、边界和异常，再形成可评审的需求资料。",
    steps: [
      { title: "梳理会员状态", description: "区分账号、验证、会话与权限，写清限制和恢复条件。", href: "/articles/member-account-states", kind: "文章" },
      { title: "核对资金业务边界", description: "用教学示例区分订单、账本与对账，列出未决和失败场景。", href: "/articles/wallet-payment-reconciliation", kind: "文章" },
      { title: "观察后台如何承接任务", description: "对照角色看板，检查需求是否交代对象、状态和下一步。", href: "/cases/admin-optimization", kind: "案例" },
      { title: "整理项目需求", description: "记录目标、业务模块、支付、权限与上线范围。", href: "/templates/white-label-requirement-form", kind: "模板" },
      { title: "评审状态与异常", description: "用账号状态评审表补齐进入条件、审批、反馈和验收证据。", href: "/templates/member-account-review", kind: "模板" },
    ],
    outputs: ["需求范围与业务规则", "状态、字段和权限说明", "异常场景与验收条件"],
    nextRole: "interaction", handoff: "向交互交付角色任务、状态转换、关键字段、限制条件和优先级。",
  },
  {
    slug: "interaction", title: "交互", summary: "把状态变化、异常回退和用户反馈连成操作路径。",
    goal: "明确进入、操作、等待、失败和返回的反馈，让流程可以被演练和验收。",
    steps: [
      { title: "从状态拆出操作路径", description: "以资料变更和账号恢复为例，梳理允许动作与用户可见结果。", href: "/articles/member-account-states", kind: "文章" },
      { title: "演练移动端与状态反馈", description: "操作现有反馈与边界状态工具，检查等待、失败和下一步。", href: "/design/mobile", kind: "专题" },
      { title: "对照 BM 视觉提案", description: "区分图片可见变化与吸顶、遮挡、焦点等需要样机验证的问题。", href: "/cases/bm-optimization", kind: "案例" },
      { title: "做一次体验评审", description: "使用评审练习和交付清单，把判断转成团队可核对的条件。", href: "/design/review", kind: "专题" },
      { title: "记录状态验收证据", description: "用账号评审表核对重复、失败、恢复和并发变更的反馈。", href: "/templates/member-account-review", kind: "模板" },
    ],
    outputs: ["正常与异常操作流程", "页面状态和提示文案", "可演练的交互验收步骤"],
    nextRole: "design", handoff: "向设计交付流程、页面状态、信息优先级、反馈文案与响应规则。",
  },
  {
    slug: "design", title: "设计", summary: "用信息层级、组件与素材规范表达业务判断。",
    goal: "将角色任务和状态要求落实为可阅读、可操作、可交付的界面方案。",
    steps: [
      { title: "确定信息优先级", description: "围绕列表、详情、状态与危险操作建立阅读顺序。", href: "/articles/admin-information-hierarchy", kind: "文章" },
      { title: "对照组件与密度", description: "使用现有组件、表格密度和响应优先级演示，比较布局取舍。", href: "/design/information", kind: "专题" },
      { title: "整理 UI 设计系统", description: "参考已有工作流的输入与图示，明确组件和状态样式的边界。", href: "/ai-workflows/ui-design-system", kind: "工作流" },
      { title: "核对手机方案", description: "阅读 BM 对照图中的观察、依据与建议验收，保持提案和实测结果分明。", href: "/cases/bm-optimization", kind: "案例" },
      { title: "查询制作规格", description: "核对品牌、首页和运营素材的 PC / H5 尺寸、格式和源稿。", href: "/design/material-standards", kind: "素材规范" },
    ],
    outputs: ["信息层级与页面方案", "组件、状态和响应说明", "素材规格与交付资料"],
    nextRole: "development", handoff: "向开发交付布局、组件状态、响应规则、素材与验收说明。",
  },
  {
    slug: "development", title: "开发", summary: "核对接口、状态、日志和上线前的关键路径。",
    goal: "把业务约定转为可核对的接口、异常处理和交付证据。",
    steps: [
      { title: "理解接口协作边界", description: "从登录、余额、注单和结算关系认识接口与日志需求。", href: "/articles/game-provider-api", kind: "文章" },
      { title: "核对幂等与对账", description: "区分超时、明确失败和结果未知，追踪重复通知与补偿。", href: "/articles/wallet-payment-reconciliation", kind: "文章" },
      { title: "核对会话与权限", description: "对照账号状态和恢复路径，明确服务端判断与审计证据。", href: "/articles/member-account-states", kind: "文章" },
      { title: "完成上线验收", description: "按现有检查清单验证用户、业务、后台与监控链路。", href: "/templates/launch-checklist", kind: "模板" },
      { title: "保留异常复盘记录", description: "记录影响、时间线、处理依据、责任人及改进结论。", href: "/templates/incident-review", kind: "模板" },
    ],
    outputs: ["接口字段与状态约定", "异常处理、日志和验证证据", "上线检查与回退安排"],
    nextRole: "operation", handoff: "向运营交付上线结果、适用范围、监控与问题反馈渠道、回退安排。",
  },
]

export function getWorkRole(slug: string) {
  return workRoles.find((role) => role.slug === slug)
}
