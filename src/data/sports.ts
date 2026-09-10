import { articles } from "@/data/articles"

export type SportsBettingRow = {
  playType: string
  side: string
  handicap: string
  uiLabel: string
  explanation: string
}

export type SportsBettingSection = {
  id: string
  title: string
  description: string
  rows: SportsBettingRow[]
}

export type SportsModuleItem = {
  slug: string
  title: string
  description: string
  href: string
  contentType: "玩法对照" | "专题阅读" | "基础导读"
  readingTitle?: string
  category: string
  domainId: string
  roleIds: string[]
  estimatedMinutes: number
  tags: string[]
}

export type SportsKnowledgeDomain = {
  id: string
  title: string
  description: string
  tags: string[]
}

export type SportsRolePath = {
  id: string
  title: string
  description: string
  steps: string[]
  domainIds: string[]
}

export const sportsKnowledgeDomains: SportsKnowledgeDomain[] = [
  { id: "basics", title: "体育基础", description: "赛事、盘口、赔率、水位、注单、结算、早盘和滚球。", tags: ["新人", "基础概念"] },
  { id: "rules", title: "玩法与规则", description: "让球、大小、独赢、波胆、角球、特殊玩法和规则说明。", tags: ["规则说明", "客服"] },
  { id: "product", title: "产品结构", description: "赛事列表、详情页、赔率盘、投注单、注单记录和后台配置。", tags: ["产品", "后台"] },
  { id: "operation", title: "运营与增长", description: "热门赛事、活动配置、用户分层、专题赛事和触达策略。", tags: ["运营", "活动"] },
  { id: "risk", title: "风控与合规", description: "异常投注、限额、赛事状态、延迟结算、审核和审计。", tags: ["风控", "审核"] },
  { id: "trading", title: "操盘与赔率", description: "初盘、即时盘、滚球盘、水位、封盘、调盘和盘口联动。", tags: ["操盘", "赔率"] },
  { id: "settlement", title: "数据与结算", description: "注单生命周期、赛果确认、派奖、退款、异常单和对账。", tags: ["结算", "数据"] },
  { id: "integration", title: "技术与接入", description: "体育数据源、赔率接口、注单接口、结算回调、缓存和推送。", tags: ["开发", "接口"] },
  { id: "admin", title: "后台与权限", description: "赛事管理、盘口配置、风控审核、报表、角色权限和操作日志。", tags: ["后台", "权限"] },
  { id: "experience", title: "设计与体验", description: "赛事信息层级、赔率按钮、投注单交互、多语言和移动端体验。", tags: ["设计", "体验"] },
]

export const sportsRolePaths: SportsRolePath[] = [
  {
    id: "product",
    title: "产品路径",
    description: "适合产品、项目经理和业务分析角色，重点看页面、状态和协作边界。",
    steps: ["玩法与规则", "产品结构", "后台与权限", "数据与结算", "风控与合规"],
    domainIds: ["rules", "product", "admin", "settlement", "risk"],
  },
  {
    id: "operation",
    title: "运营路径",
    description: "适合运营、客服和内容角色，重点看赛事运营、规则解释和用户问题处理。",
    steps: ["体育基础", "玩法与规则", "运营与增长", "设计与体验"],
    domainIds: ["basics", "rules", "operation", "experience"],
  },
  {
    id: "design",
    title: "设计路径",
    description: "适合设计和前端角色，重点看信息层级、赔率按钮、投注单和移动端规则表达。",
    steps: ["玩法与规则", "产品结构", "设计与体验"],
    domainIds: ["rules", "product", "experience"],
  },
  {
    id: "engineering",
    title: "开发路径",
    description: "适合开发、测试和架构角色，重点看接口、状态机、结算和异常处理。",
    steps: ["体育基础", "技术与接入", "数据与结算", "后台与权限"],
    domainIds: ["basics", "integration", "settlement", "admin"],
  },
  {
    id: "risk",
    title: "风控路径",
    description: "适合风控、运维和管理角色，重点看异常投注、限额、审核、监控和赔率变化。",
    steps: ["风控与合规", "操盘与赔率", "数据与结算", "后台与权限"],
    domainIds: ["risk", "trading", "settlement", "admin"],
  },
  {
    id: "management",
    title: "管理路径",
    description: "适合负责人和跨团队协作角色，重点看模块边界、关键指标、风险状态和交付优先级。",
    steps: ["产品结构", "运营与增长", "风控与合规", "数据与结算"],
    domainIds: ["product", "operation", "risk", "settlement"],
  },
]

export const sportsModules: SportsModuleItem[] = [
  {
    slug: "betting-explanation",
    title: "玩法解读",
    description: "把常见体育玩法拆成玩法类型、方向、盘口、前端展示和用户理解说明，适合产品、运营、客服和规则页协作。",
    href: "/sports/betting-explanation",
    contentType: "玩法对照",
    category: "玩法基础",
    domainId: "rules",
    roleIds: ["product", "operation", "design"],
    estimatedMinutes: 12,
    tags: ["足球", "盘口", "规则说明", "H5 帮助中心"],
  },
  {
    slug: "sports-product",
    title: "体育产品结构",
    description: "理解赛事列表、详情页、赔率盘、投注单、注单记录、钱包和后台配置之间的产品关系。",
    href: "/sports/sports-product",
    contentType: "专题阅读",
    category: "产品",
    domainId: "product",
    roleIds: ["product", "design", "engineering"],
    estimatedMinutes: 5,
    tags: ["赛事", "赔率", "注单", "后台"],
  },
  {
    slug: "sports-odds-basics",
    title: "盘口与赔率基础",
    description: "区分玩法、方向与盘口，理解赔率格式、变化提示和封盘状态在页面中的表达。",
    href: "/sports/sports-odds-basics",
    contentType: "专题阅读",
    category: "赔率",
    domainId: "trading",
    roleIds: ["product", "operation", "risk"],
    estimatedMinutes: 5,
    tags: ["盘口", "水位", "封盘", "赔率"],
  },
  {
    slug: "bet-ticket-lifecycle",
    title: "注单生命周期",
    description: "从投注提交、确认、取消、结算、退款到异常处理，整理注单状态和各角色协作边界。",
    href: "/sports/bet-ticket-lifecycle",
    contentType: "专题阅读",
    category: "注单",
    domainId: "settlement",
    roleIds: ["product", "operation", "engineering", "risk", "management"],
    estimatedMinutes: 5,
    tags: ["注单状态", "结算", "退款", "异常单"],
  },
  {
    slug: "match-data-status",
    title: "赛事数据与状态",
    description: "跟着比赛从赛前走到赛果确认，观察盘口、投注、结算和数据延迟时的状态变化。",
    href: "/sports/match-data-status",
    contentType: "专题阅读",
    category: "赛事数据",
    domainId: "basics",
    roleIds: ["product", "operation", "engineering", "risk"],
    estimatedMinutes: 5,
    tags: ["赛事状态", "滚球", "赛果", "数据源"],
  },
  {
    slug: "sports-admin-config",
    title: "后台配置",
    description: "用后台配置台理解赛事开关、玩法封盘、限额、赔率调整和操作日志如何影响前台。",
    href: "/sports/sports-admin-config",
    contentType: "专题阅读",
    category: "后台",
    domainId: "admin",
    roleIds: ["product", "engineering", "risk", "management"],
    estimatedMinutes: 5,
    tags: ["后台", "权限", "限额", "操作日志"],
  },
  {
    slug: "sports-risk",
    title: "体育风控场景",
    description: "用普通投注、金额过高、赔率跳动、多账号同源和赛果冲突，看懂风控处理动作。",
    href: "/sports/sports-risk",
    contentType: "专题阅读",
    category: "风控",
    domainId: "risk",
    roleIds: ["risk", "product", "engineering"],
    estimatedMinutes: 5,
    tags: ["异常识别", "限额", "审核", "监控"],
  },
  {
    slug: "sports-trading",
    title: "操盘基础",
    description: "从赛前稳定到进球、红牌、集中下注和数据暂停，观察操盘动作如何影响赔率、前台状态与新提交。",
    href: "/sports/sports-trading",
    contentType: "专题阅读",
    category: "操盘",
    domainId: "trading",
    roleIds: ["risk", "product"],
    estimatedMinutes: 5,
    tags: ["盘口", "赔率", "赛事事件", "操盘"],
  },
  {
    slug: "sports-settlement-reconciliation",
    title: "结算与对账",
    description: "并排核对赛果、注单和钱包流水，理解正常派奖、等待确认、数据冲突和重复请求的处理区别。",
    href: "/sports/sports-settlement-reconciliation",
    contentType: "专题阅读",
    category: "结算",
    domainId: "settlement",
    roleIds: ["operation", "engineering", "risk", "management"],
    estimatedMinutes: 5,
    tags: ["派奖", "退款", "对账", "报表"],
  },
  {
    slug: "sports-operation-scenes",
    title: "运营场景",
    description: "围绕热门赛事推荐、新用户引导、专题活动和赛前提醒，理解运营触达、用户条件与状态边界。",
    href: "/sports/sports-operation-scenes",
    contentType: "专题阅读",
    category: "运营",
    domainId: "operation",
    roleIds: ["operation", "product", "design", "management"],
    estimatedMinutes: 5,
    tags: ["热门赛事", "活动", "推荐位", "用户分层"],
  },
  {
    slug: "sports-service-rules",
    title: "客服与规则说明",
    description: "从待结算、报价变化、复核中到已到账，用查单场景理解客服应如何核对记录与解释规则。",
    href: "/sports/sports-service-rules",
    contentType: "专题阅读",
    category: "客服",
    domainId: "rules",
    roleIds: ["operation", "product"],
    estimatedMinutes: 5,
    tags: ["客服", "规则说明", "争议处理", "帮助中心"],
  },
  {
    slug: "sports-design-experience",
    title: "设计体验",
    description: "通过投注单的正常确认、赔率变化、封盘和处理中状态，理解体育页面的信息层级与交互反馈。",
    href: "/sports/sports-design-experience",
    contentType: "专题阅读",
    category: "设计",
    domainId: "experience",
    roleIds: ["design", "product", "engineering"],
    estimatedMinutes: 5,
    tags: ["赔率按钮", "投注单", "移动端", "多语言"],
  },
  {
    slug: "sports-integration",
    title: "技术接入",
    description: "沿着赛事事件、行情更新、注单受理和赛果结算，理解体育数据接口的状态、版本和幂等处理。",
    href: "/sports/sports-integration",
    contentType: "专题阅读",
    category: "开发",
    domainId: "integration",
    roleIds: ["engineering", "product", "risk"],
    estimatedMinutes: 5,
    tags: ["数据源", "接口", "回调", "缓存"],
  },
  {
    slug: "sports-management-dashboard",
    title: "管理看板",
    description: "用赛事、待结算、风险复核和资金处理等状态卡，理解管理者如何发现问题并确定处理优先级。",
    href: "/sports/sports-management-dashboard",
    contentType: "专题阅读",
    category: "管理",
    domainId: "operation",
    roleIds: ["management", "product", "operation", "risk"],
    estimatedMinutes: 5,
    tags: ["指标", "看板", "风险状态", "协作"],
  },
]

export const bettingExplanationSections: SportsBettingSection[] = [
  {
    id: "handicap",
    title: "让球玩法",
    description: "核心是给主队或客队加减虚拟进球，再判断押注方向是否成立。",
    rows: [
      { playType: "让球", side: "主", handicap: "0", uiLabel: "让球 · 主 0", explanation: "主队赢则赢，平局退回本金" },
      { playType: "让球", side: "客", handicap: "0", uiLabel: "让球 · 客 0", explanation: "客队赢则赢，平局退回本金" },
      { playType: "让球", side: "主", handicap: "-0.5", uiLabel: "让球 · 主 -0.5", explanation: "主队必须赢才算赢" },
      { playType: "让球", side: "客", handicap: "+0.5", uiLabel: "让球 · 客 +0.5", explanation: "客队不输（赢或平）就赢" },
      { playType: "让球", side: "主", handicap: "-1", uiLabel: "让球 · 主 -1", explanation: "主队赢 1 球退回，赢 2 球及以上才赢" },
      { playType: "让球", side: "客", handicap: "+1", uiLabel: "让球 · 客 +1", explanation: "客队输 1 球退回，不输则赢" },
      { playType: "让球", side: "主", handicap: "-0/0.5", uiLabel: "让球 · 主 -0/0.5", explanation: "平局输一半，主队赢全赢" },
      { playType: "让球", side: "客", handicap: "+0/0.5", uiLabel: "让球 · 客 +0/0.5", explanation: "平局赢一半，不输则全赢" },
      { playType: "让球", side: "主", handicap: "-0.5/1", uiLabel: "让球 · 主 -0.5/1", explanation: "赢 1 球赢一半，赢 2 球全赢" },
      { playType: "让球", side: "客", handicap: "+0.5/1", uiLabel: "让球 · 客 +0.5/1", explanation: "输 1 球输一半，不输全赢" },
      { playType: "让球", side: "主", handicap: "-1/1.5", uiLabel: "让球 · 主 -1/1.5", explanation: "赢 1 球输一半，赢 2 球全赢" },
      { playType: "让球", side: "客", handicap: "+1/1.5", uiLabel: "让球 · 客 +1/1.5", explanation: "输 1 球赢一半，输 2 球才输" },
    ],
  },
  {
    id: "totals",
    title: "大小玩法",
    description: "核心是看总进球数，大于盘口叫“大”，小于盘口叫“小”。",
    rows: [
      { playType: "全场大小", side: "大", handicap: "2", uiLabel: "全场大小 · 大 2", explanation: "进球 >= 3 赢，= 2 退回" },
      { playType: "全场大小", side: "小", handicap: "2", uiLabel: "全场大小 · 小 2", explanation: "进球 <= 1 赢，= 2 退回" },
      { playType: "全场大小", side: "大", handicap: "2.5", uiLabel: "全场大小 · 大 2.5", explanation: "进球 >= 3 才赢" },
      { playType: "全场大小", side: "小", handicap: "2.5", uiLabel: "全场大小 · 小 2.5", explanation: "进球 <= 2 才赢" },
      { playType: "全场大小", side: "大", handicap: "3", uiLabel: "全场大小 · 大 3", explanation: ">= 4 赢，= 3 退回" },
      { playType: "全场大小", side: "小", handicap: "3", uiLabel: "全场大小 · 小 3", explanation: "<= 2 赢，= 3 退回" },
      { playType: "全场大小", side: "大", handicap: "2/2.5", uiLabel: "全场大小 · 大 2/2.5", explanation: "2 球输一半，>= 3 全赢" },
      { playType: "全场大小", side: "小", handicap: "2/2.5", uiLabel: "全场大小 · 小 2/2.5", explanation: "2 球赢一半，<= 1 全赢" },
      { playType: "全场大小", side: "大", handicap: "2.5/3", uiLabel: "全场大小 · 大 2.5/3", explanation: "3 球赢一半，>= 4 全赢" },
      { playType: "全场大小", side: "小", handicap: "2.5/3", uiLabel: "全场大小 · 小 2.5/3", explanation: "3 球输一半，<= 2 全赢" },
    ],
  },
  {
    id: "one-x-two",
    title: "独赢（1X2）",
    description: "不看让球，直接判断全场赛果。",
    rows: [
      { playType: "独赢", side: "主", handicap: "-", uiLabel: "独赢 · 主", explanation: "主队赢比赛就赢" },
      { playType: "独赢", side: "客", handicap: "-", uiLabel: "独赢 · 客", explanation: "客队赢比赛就赢" },
      { playType: "独赢", side: "和", handicap: "-", uiLabel: "独赢 · 和", explanation: "比赛打平就赢" },
    ],
  },
  {
    id: "correct-score",
    title: "波胆（比分）",
    description: "必须精确猜中最终比分，差一个球都不算赢。",
    rows: [
      { playType: "波胆", side: "比分", handicap: "1:0", uiLabel: "波胆 · 比分 1:0", explanation: "必须猜中 1:0 才赢" },
      { playType: "波胆", side: "比分", handicap: "2:0", uiLabel: "波胆 · 比分 2:0", explanation: "必须猜中 2:0 才赢" },
      { playType: "波胆", side: "比分", handicap: "2:1", uiLabel: "波胆 · 比分 2:1", explanation: "必须猜中 2:1 才赢" },
      { playType: "波胆", side: "比分", handicap: "0:0", uiLabel: "波胆 · 比分 0:0", explanation: "必须猜中 0:0 才赢" },
      { playType: "波胆", side: "比分", handicap: "1:1", uiLabel: "波胆 · 比分 1:1", explanation: "必须猜中 1:1 才赢" },
      { playType: "波胆", side: "比分", handicap: "0:1", uiLabel: "波胆 · 比分 0:1", explanation: "必须猜中 0:1 才赢" },
      { playType: "波胆", side: "比分", handicap: "1:2", uiLabel: "波胆 · 比分 1:2", explanation: "必须猜中 1:2 才赢" },
    ],
  },
  {
    id: "double-chance",
    title: "双重机会",
    description: "给用户两个结果兜底，比独赢更容易理解。",
    rows: [
      { playType: "双重机会", side: "主/和", handicap: "-", uiLabel: "双重机会 · 主/和", explanation: "主队不输（赢或平）就赢" },
      { playType: "双重机会", side: "客/和", handicap: "-", uiLabel: "双重机会 · 客/和", explanation: "客队不输（赢或平）就赢" },
      { playType: "双重机会", side: "主/客", handicap: "-", uiLabel: "双重机会 · 主/客", explanation: "比赛必须分胜负（无平局）" },
    ],
  },
  {
    id: "half-full-time",
    title: "半全场",
    description: "需要同时猜中半场结果和全场结果。",
    rows: [
      { playType: "半全场", side: "主/主", handicap: "-", uiLabel: "半全场 · 主/主", explanation: "半场主胜 + 全场主胜" },
      { playType: "半全场", side: "主/和", handicap: "-", uiLabel: "半全场 · 主/和", explanation: "半场主胜 + 全场平局" },
      { playType: "半全场", side: "和/主", handicap: "-", uiLabel: "半全场 · 和/主", explanation: "半场平局 + 全场主胜" },
      { playType: "半全场", side: "和/和", handicap: "-", uiLabel: "半全场 · 和/和", explanation: "半场平局 + 全场平局" },
      { playType: "半全场", side: "客/客", handicap: "-", uiLabel: "半全场 · 客/客", explanation: "半场客胜 + 全场客胜" },
    ],
  },
  {
    id: "corners",
    title: "角球盘口",
    description: "规则和进球盘口类似，只是判断对象换成角球总数或角球差。",
    rows: [
      { playType: "角球大小", side: "大", handicap: "9.5", uiLabel: "角球大小 · 大 9.5", explanation: "总角球 >= 10 才赢" },
      { playType: "角球大小", side: "小", handicap: "9.5", uiLabel: "角球大小 · 小 9.5", explanation: "总角球 <= 9 才赢" },
      { playType: "角球让球", side: "主", handicap: "-1.5", uiLabel: "角球让球 · 主 -1.5", explanation: "主队角球数需多 2 个以上" },
      { playType: "角球让球", side: "客", handicap: "+1.5", uiLabel: "角球让球 · 客 +1.5", explanation: "客队少 1 个以内或更多都赢" },
    ],
  },
]

export const bettingExplanationRowCount = bettingExplanationSections.reduce((total, section) => total + section.rows.length, 0)
