export type TopicGuide = {
  slug: string
  audience: string[]
  outcomes: string[]
  readingOrder: string[]
  termIds: string[]
  templateSlugs: string[]
  modules?: TopicGuideModule[]
}

export type TopicGuideModule = {
  title: string
  description: string
  articles: string[]
  id?: string
  learningObjectives?: string[]
  estimatedMinutes?: number
  difficulty?: "入门" | "进阶" | "提高"
  audienceHints?: string[]
  durationReason?: string
}

export type LearningPathTrack = {
  slug: string
  title: string
  description: string
  difficulty: "入门" | "进阶" | "提高"
  priorityHint: string
  audience: string[]
  articleSlugs: string[]
  href: string
}

export const learningPaths: LearningPathTrack[] = [
  {
    slug: "starter",
    title: "新手起步",
    description: "先把行业、平台角色和数据关系搭起，再进入模块解释。",
    difficulty: "入门",
    priorityHint: "先读这个：先打通认知边界，再进入具体模块。",
    audience: ["行业新人", "产品新人", "运营新人", "老板"],
    articleSlugs: ["how-gambling-platform-works", "what-is-white-label", "member-agent-platform", "sportsbook-basic"],
    href: "/industry",
  },
  {
    slug: "work",
    title: "结构展开",
    description: "再看钱包、活动、后台、代理和注单的业务组织逻辑，提升沟通效率。",
    difficulty: "进阶",
    priorityHint: "先读这个：你需要在基础认知后搭建系统结构。",
    audience: ["产品", "项目经理", "开发", "运营"],
    articleSlugs: ["wallet-center-vs-seamless", "admin-modules", "agent-system-design", "bet-ticket-status", "game-provider-api"],
    href: "/product",
  },
  {
    slug: "delivery",
    title: "交付复盘",
    description: "最后把上线检查、支付与风控、运营复盘打通，形成可持续交付节奏。",
    difficulty: "提高",
    priorityHint: "先读这个：从上线稳定性到复盘优化快速进入实操。",
    audience: ["老板", "运营", "项目经理", "运维", "风控"],
    articleSlugs: ["launch-checklist", "payment-channel-basic", "risk-rule-basic", "community-operations-governance", "campaign-risk-review"],
    href: "/devops-risk",
  },
]

export const beginnerPath = learningPaths.map((track) => ({
  title: track.title,
  description: track.description,
  href: track.href,
}))

export const topicGuides: TopicGuide[] = [
  {
    slug: "industry",
    audience: ["行业新人", "产品新人", "运营新人", "项目经理"],
    outcomes: ["理解平台、会员、代理、厂商和支付之间的关系", "能用统一语言和产品、运营、技术团队沟通", "知道后续应该继续读哪些专题"],
    readingOrder: ["how-gambling-platform-works", "member-agent-platform", "what-is-white-label"],
    termIds: ["agent", "white-label", "turnover", "bet-ticket"],
    templateSlugs: ["white-label-requirement-form"],
    modules: [
      {
        id: "industry-module-1",
        title: "模块 1：建立全局认知",
        description: "先把平台角色、资金关系和需求边界说清，让后续设计有共同语言。",
        learningObjectives: ["理解平台角色（会员、代理、厂商）与资金流关系", "明确上线沟通中的共识口径", "能用 1 页文档描述问题背景"],
        estimatedMinutes: 18,
        difficulty: "入门",
        audienceHints: ["行业新人", "项目经理"],
        durationReason: "按本文档阅读量和关键流程理解深度测算，建议结合 1 次复盘对齐。",
        articles: ["how-gambling-platform-works", "member-agent-platform", "what-is-white-label"],
      },
      {
        id: "industry-module-2",
        title: "模块 2：理解业务场景",
        description: "用体育视角回看赛事、交易和参与者行为，建立行业语境。",
        learningObjectives: ["理解体育赛事内容对用户路径的影响", "识别早盘与滚球在决策逻辑上的区别", "把业务场景转成可沟通的问题清单"],
        estimatedMinutes: 14,
        difficulty: "入门",
        audienceHints: ["行业新人", "运营"],
        durationReason: "以概念理解与对照阅读为主，内容结构偏认知导向。",
        articles: ["sportsbook-basic"],
      },
    ],
  },
  {
    slug: "sportsbook",
    audience: ["体育产品", "运营", "行业新人"],
    outcomes: ["理解赛事、盘口、赔率、注单和结算的基础关系", "知道早盘和滚球为什么对数据和状态要求不同", "能看懂体育注单生命周期"],
    readingOrder: ["sportsbook-basic"],
    termIds: ["pre-match", "live-betting", "handicap", "odds-line", "parlay", "bet-ticket"],
    templateSlugs: ["launch-checklist"],
    modules: [
      {
        id: "sportsbook-module-1",
        title: "模块 1：赛事与赔率理解",
        description: "先把盘口、赔率和玩法关系理顺，后面再看运营动作会更快对齐。",
        learningObjectives: ["理解赛事信息如何进入赔率与注单流程", "识别早盘、滚球、串关对用户行为的影响", "梳理常见赔率异常的业务解释路径"],
        estimatedMinutes: 16,
        difficulty: "入门",
        audienceHints: ["体育产品", "运营", "行业新人"],
        durationReason: "按核心术语和 3 个关键概念链路估算，强调先看“为什么”。",
        articles: ["sportsbook-basic"],
      },
      {
        id: "sportsbook-module-2",
        title: "模块 2：注单生命周期",
        description: "从下单到结算，建立完整的状态认知，减少沟通和验收误差。",
        learningObjectives: ["理解注单从生成到结算的关键状态", "能把“未结算/异常/已支付”变成可追踪动作", "知道哪些状态字段最值得用于沟通与复盘"],
        estimatedMinutes: 14,
        difficulty: "进阶",
        audienceHints: ["运营", "技术", "项目经理"],
        durationReason: "结合注单生命周期与状态演进场景估算，偏复盘训练。",
        articles: ["bet-ticket-status", "risk-rule-basic"],
      },
    ],
  },
  {
    slug: "white-label",
    audience: ["老板", "项目经理", "产品", "售前"],
    outcomes: ["理解包网不是只买页面，而是一整套平台系统", "能初步评估包网与自建的差异", "知道需求收集时要问哪些问题"],
    readingOrder: ["what-is-white-label", "how-gambling-platform-works", "launch-checklist"],
    termIds: ["white-label", "agent", "central-wallet", "seamless-wallet"],
    templateSlugs: ["white-label-requirement-form", "launch-checklist"],
    modules: [
      {
        id: "white-label-module-1",
        title: "模块 1：明确合作与交付边界",
        description: "先把白牌业务中的角色职责讲清，再谈功能清单才不容易反复。",
        learningObjectives: ["区分厂商、代理、平台方各自责任", "能基于目标用户定义首版验收范围", "形成清晰的交付里程碑表达方式"],
        estimatedMinutes: 18,
        difficulty: "入门",
        audienceHints: ["老板", "项目经理", "售前"],
        durationReason: "按交付对齐与范围澄清所需阅读强度估算，适合前置梳理。",
        articles: ["what-is-white-label", "member-agent-platform"],
      },
      {
        id: "white-label-module-2",
        title: "模块 2：搭建上线执行结构",
        description: "把需求从“要做什么”转成“如何上线、如何验收”。",
        learningObjectives: ["基于平台主链条定义上线前需确认项", "识别上线后最容易触发问题的关键节点", "建立首版复盘与优化输入项"],
        estimatedMinutes: 20,
        difficulty: "进阶",
        audienceHints: ["项目经理", "产品", "运营"],
        durationReason: "以上线流程闭环和交付动作为主，包含复盘框架与实践步骤。",
        articles: ["how-gambling-platform-works", "launch-checklist"],
      },
    ],
  },
  {
    slug: "product",
    audience: ["产品经理", "业务分析", "项目经理", "开发"],
    outcomes: ["拆清楚钱包、代理、后台、活动和权限模块", "能把业务概念转成 PRD 结构", "知道哪些状态和日志必须保留"],
    readingOrder: ["wallet-center-vs-seamless", "agent-system-design", "admin-modules", "bet-ticket-status"],
    termIds: ["central-wallet", "seamless-wallet", "agent", "bet-ticket", "payout", "admin-permission"],
    templateSlugs: ["promotion-system-prd", "agent-system-prd", "data-report-spec"],
    modules: [
      {
        id: "product-module-1",
        title: "模块 1：梳理系统骨架",
        description: "从钱包、会员、代理和注单主链条出发，先搭出产品骨架。",
        learningObjectives: ["明确各系统模块边界与职责", "建立钱包、会员、代理之间的依赖关系", "梳理从“需求”到“交付”间的关键接口"],
        estimatedMinutes: 30,
        difficulty: "进阶",
        audienceHints: ["产品经理", "开发", "项目经理"],
        durationReason: "按“主链条+边界条件”阅读量测算，适合拆解后输出 PRD 草稿。",
        articles: ["wallet-center-vs-seamless", "admin-modules", "bet-ticket-status"],
      },
      {
        id: "product-module-2",
        title: "模块 2：定义经营机制",
        description: "把任务分配、权限、推广和接口对齐成可交付内容，减少返工。",
        learningObjectives: ["定义任务与权限的最小闭环", "写出活动与代理协同的执行要点", "形成可复用的 PRD 检查清单"],
        estimatedMinutes: 24,
        difficulty: "提高",
        audienceHints: ["产品经理", "运营", "项目经理"],
        durationReason: "结合权限、活动与任务联动场景估算，适合产出项目执行文档。",
        articles: ["agent-system-design", "game-provider-api", "first-deposit-retention-vip"],
      },
    ],
  },
  {
    slug: "operation",
    audience: ["产品", "运营", "客服", "商务", "老板"],
    outcomes: ["理解运营提供流量，产品作为载体承接需求并形成可复盘路径", "把活动、社群、渠道、支付反馈和数据复盘串成治理闭环", "能把运营问题沉淀成 SOP、清单、看板和复盘报告"],
    readingOrder: ["operation-product-conversion-model", "first-deposit-retention-vip", "payment-channel-basic", "data-report-metrics", "community-operations-governance", "channel-quality-review", "campaign-risk-review"],
    termIds: ["first-deposit", "redeposit", "rebate", "vip", "turnover", "payment-channel", "data-report"],
    templateSlugs: ["promotion-system-prd", "data-report-spec", "incident-review"],
    modules: [
      {
        id: "operation-module-1",
        title: "模块 1：从入口到转化",
        description: "先把流量来源、载体与首轮转化环节拆清，再谈活动策略。",
        learningObjectives: ["用模型描述“获取-承接-转化”路径", "识别运营动作对产品路径的影响", "能给运营活动设定最少但完整的观察指标"],
        estimatedMinutes: 19,
        difficulty: "进阶",
        audienceHints: ["运营", "产品", "商务"],
        durationReason: "按运营模型和活动策略结合阅读，兼顾“数据观察-动作执行”。",
        articles: ["operation-product-conversion-model", "payment-channel-basic", "first-deposit-retention-vip"],
      },
      {
        id: "operation-module-2",
        title: "模块 2：复盘与治理",
        description: "把社群、渠道、活动风险问题变成可追踪的治理流程。",
        learningObjectives: ["用统一模板组织活动复盘与责任分工", "建立渠道协同与风控提醒机制", "将治理动作连接到数据与客服反馈"],
        estimatedMinutes: 22,
        difficulty: "提高",
        audienceHints: ["运营", "风控", "项目经理"],
        durationReason: "偏治理闭环与跨团队对齐，适合复盘会议前快速拉齐。",
        articles: ["community-operations-governance", "channel-quality-review", "campaign-risk-review"],
      },
    ],
  },
  {
    slug: "design",
    audience: ["设计师", "产品经理", "前端", "业务负责人"],
    outcomes: ["理解复杂业务页面为什么要强调信息层级", "能从后台、表格、状态和流程角度审视体验", "为后续补充设计专题建立入口"],
    readingOrder: ["admin-modules", "wallet-center-vs-seamless"],
    termIds: ["bet-ticket", "central-wallet", "seamless-wallet", "vip"],
    templateSlugs: ["promotion-system-prd"],
    modules: [
      {
        id: "design-module-1",
        title: "模块 1：信息层级重组",
        description: "先把复杂列表和状态信息抽象清楚，再做视觉与布局优化。",
        learningObjectives: ["识别用户最关心的信息优先级", "建立状态优先展示与异常提示规则", "把后台页从“看得见”变成“可决策”"],
        estimatedMinutes: 17,
        difficulty: "入门",
        audienceHints: ["设计师", "产品经理", "前端"],
        durationReason: "聚焦页面信息密度与层级优化，阅读后可直接对齐排版修改方向。",
        articles: ["admin-modules", "bet-ticket-status"],
      },
      {
        id: "design-module-2",
        title: "模块 2：流程化体验细节",
        description: "把关键操作链路的反馈和提示设计成可追踪路径。",
        learningObjectives: ["定义用户在关键动作中的确认与回退点", "避免关键字段遗漏造成的误操作", "建立视觉规范和异常引导标准"],
        estimatedMinutes: 16,
        difficulty: "进阶",
        audienceHints: ["设计师", "前端", "产品"],
        durationReason: "以流程体验评估为中心，适合在任务设计前做一次专项复盘。",
        articles: ["wallet-center-vs-seamless", "launch-checklist"],
      },
    ],
  },
  {
    slug: "development",
    audience: ["开发", "技术负责人", "项目经理", "产品"],
    outcomes: ["理解厂商 API 对接不是只拿一个链接", "知道登录、余额、注单、结算和对账的关系", "能提前识别接口日志和补偿机制的重要性"],
    readingOrder: ["game-provider-api", "wallet-center-vs-seamless", "launch-checklist"],
    termIds: ["seamless-wallet", "central-wallet", "bet-ticket", "payout"],
    templateSlugs: ["launch-checklist", "incident-review"],
    modules: [
      {
        id: "development-module-1",
        title: "模块 1：支付与钱包链路",
        description: "建立钱包与支付状态认知后，接口异常处理才有抓手。",
        learningObjectives: ["理解无缝钱包与中央钱包的联动关系", "识别支付链路的关键失败点", "设计接口补偿的最小逻辑"],
        estimatedMinutes: 24,
        difficulty: "进阶",
        audienceHints: ["开发", "技术负责人", "产品"],
        durationReason: "按支付/钱包链路难点和异常场景估算，适合梳理接口排障清单。",
        articles: ["wallet-center-vs-seamless", "game-provider-api"],
      },
      {
        id: "development-module-2",
        title: "模块 2：上线与对账闭环",
        description: "把日志、对账、风控规则接在同一条流程里，减少“上线即补课”。",
        learningObjectives: ["按顺序搭建上线前检查清单", "把日志字段与业务状态绑定", "把对账差异转化为可修复问题清单"],
        estimatedMinutes: 21,
        difficulty: "提高",
        audienceHints: ["开发", "项目经理", "运维"],
        durationReason: "从上线前准备到对账复盘的闭环阅读，强调可执行的排障步骤。",
        articles: ["launch-checklist", "bet-ticket-status", "risk-rule-basic"],
      },
    ],
  },
  {
    slug: "devops-risk",
    audience: ["运维", "风控", "项目经理", "产品"],
    outcomes: ["知道上线前要验收哪些核心链路", "理解权限、日志、监控和复盘的作用", "能把事故处理沉淀为清单和流程"],
    readingOrder: ["launch-checklist", "risk-rule-basic", "admin-modules"],
    termIds: ["risk-rule", "admin-permission", "bet-ticket", "payout", "make-up-order"],
    templateSlugs: ["launch-checklist", "risk-rule-review", "incident-review"],
    modules: [
      {
        id: "devops-module-1",
        title: "模块 1：上线前清单",
        description: "把上线前的流程与风险边界按时间线逐项核对，避免“上线即返工”。",
        learningObjectives: ["梳理上线前最小安全清单", "识别高频误区与遗漏项", "通过顺序化步骤降低沟通摩擦"],
        estimatedMinutes: 20,
        difficulty: "进阶",
        audienceHints: ["运维", "项目经理", "风控"],
        durationReason: "按上线前检查覆盖率和异常场景复杂度估算，适合推进上线节奏。",
        articles: ["launch-checklist", "payment-channel-basic", "risk-rule-basic"],
      },
      {
        id: "devops-module-2",
        title: "模块 2：运行与复盘",
        description: "将常见治理问题、活动规则与合作流程变成可复用的复盘动作。",
        learningObjectives: ["用固定框架处理异常和活动风险", "建立复盘动作与责任人分工", "沉淀可迁移的治理 SOP 草稿"],
        estimatedMinutes: 22,
        difficulty: "提高",
        audienceHints: ["运营", "运维", "项目经理"],
        durationReason: "围绕治理节奏与跨团队协作读取，偏复盘动作与流程落地。",
        articles: ["community-operations-governance", "campaign-risk-review", "channel-quality-review"],
      },
    ],
  },
]

export function getTopicGuide(slug: string) {
  return topicGuides.find((guide) => guide.slug === slug)
}
