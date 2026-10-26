export const adminTours = [
  { id: "operation", role: "运营", title: "从活动概览查看一条活动记录", steps: [
    { title: "查看运营看板", page: "dataCenter-overview", image: "/images/enrichment/admin-operation-01.jpg", action: "在角色切换中选择运营，先对照看板上的指标与待处理事项。", observation: "看板给出概览；金额、人数与统计时间需要使用同一口径。" },
    { title: "进入活动记录", page: "promotion-activity-record-activityRecord", image: "/images/enrichment/admin-operation-02.jpg", action: "通过演示中的“选择后台页面”进入活动记录，查看列表字段。", observation: "先看记录标识与状态，再查看明细；演示中未填写的字段保留为 --。" },
    { title: "打开记录详情", page: "promotion-activity-record-activityRecord", image: "/images/enrichment/admin-operation-03.jpg", action: "打开列表第一条记录的详情，对照列表与详情里的信息。", observation: "详情抽屉展示当前材料提供的字段，不能把缺失信息推断成已完成的审核。" },
  ] },
  { id: "finance", role: "财务", title: "从资金概览核对一条充值记录", steps: [
    { title: "查看财务看板", page: "dataCenter-overview", image: "/images/enrichment/admin-finance-01.jpg", action: "选择财务角色，查看充提与资金相关指标。", observation: "看板用于发现需要核对的范围，不能仅凭汇总金额认定逐笔对账一致。" },
    { title: "进入充值记录", page: "finance-fundsRecords-depositRecord", image: "/images/enrichment/admin-finance-02.jpg", action: "通过页面选择器进入充值记录，定位订单与状态字段。", observation: "订单号、外部编号、金额与币种是继续查找支付记录和账本的依据。" },
    { title: "核对订单明细", page: "finance-fundsRecords-depositRecord", image: "/images/enrichment/admin-finance-03.jpg", action: "打开第一条记录详情，查看状态、编号与备注。", observation: "本地详情用于展示信息分组；真实核对还需要对应通道回执和账本证据。" },
  ] },
  { id: "support", role: "客服", title: "从会员概览查询一条账号记录", steps: [
    { title: "查看客服看板", page: "dataCenter-overview", image: "/images/enrichment/admin-support-01.jpg", action: "选择客服角色，查看与会员查询相关的入口和提示。", observation: "先确定查询目标和时间范围，避免把资金状态与账号状态混为一谈。" },
    { title: "进入会员列表", page: "management-index", image: "/images/enrichment/admin-support-02.jpg", action: "通过页面选择器进入会员列表，定位演示会员。", observation: "列表先呈现识别信息与状态；敏感资料只在授权范围内展示。" },
    { title: "查看会员详情", page: "management-index", image: "/images/enrichment/admin-support-03.jpg", action: "打开第一条会员详情，查看分组信息与状态。", observation: "查询、资料变更与解除限制是不同操作，查看详情不意味着获得审核权限。" },
  ] },
]

export type ImageFocus = { id: string; title: string; src: string; width: number; height: number; crop?: { x: number; y: number; width: number; height: number }; caption: string; note: string }
export const bmFocus: ImageFocus[] = [
  { id: "categories", title: "首页分类", src: "/case-assets/bm-optimization/bm-home-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 250, width: 1600, height: 360 }, caption: "对照原图与生成式方案的顶部分类、入口与首组内容。", note: "分类要表达稳定的内容范围；即时比分和比赛阶段属于状态信息，不宜混用。" },
  { id: "status", title: "状态层级", src: "/case-assets/bm-optimization/bm-home-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 530, width: 1600, height: 350 }, caption: "对照列表中比赛、比分和信息块的排布。", note: "用文字与分组表达状态，颜色作为辅助；不能只靠颜色判断是否可操作。" },
  { id: "actions", title: "详情操作区", src: "/case-assets/bm-optimization/bm-detail-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 810, width: 1600, height: 330 }, caption: "查看详情页下部与操作区域的对照。", note: "重要操作与当前对象、金额及状态保持关联；生成式方案中的文字与间距仍需逐项核对。" },
]
export const u8Focus: ImageFocus[] = [
  { id: "home-entry", title: "首页入口", src: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 0, width: 2160, height: 1850 }, caption: "从原首页和问题拆解中查看首屏目标、入口数量与内容关系。", note: "入口多并不等于路径清楚；先确认用户当前要找的功能，再检查同类入口是否集中。" },
  { id: "home-groups", title: "首页分组", src: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 1850, width: 2160, height: 1850 }, caption: "继续查看首页信息分组与改版方向的局部材料。", note: "区分常用功能、活动信息与帮助服务，减少同一区域中的目标竞争。" },
  { id: "profile", title: "个人中心", src: "/case-assets/competitor-analysis/u8/u8-profile-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 0, width: 2160, height: 2100 }, caption: "定位个人中心的账号信息、资产与服务入口。", note: "账号身份、资产状态、操作入口分别表达；余额显示不应代替订单状态说明。" },
]
export const officialFocus: ImageFocus[] = [
  { id: "services", title: "服务卡片", src: "/images/enrichment/official-services.jpg", width: 1320, height: 800, caption: "现有官网演示的服务方案模块截图。", note: "用相同卡片层级对照服务范围，再把方案差异放进标题与条目，便于横向比较。" },
  { id: "structure", title: "架构与内容", src: "/images/enrichment/official-structure.jpg", width: 1320, height: 800, caption: "现有官网产品能力区，架构图与能力说明共同组织内容。", note: "主图回答模块怎样连接，旁侧说明回答各组负责什么，避免把所有内容放进同一张图。" },
  { id: "contact", title: "表单字段", src: "/images/enrichment/official-contact.jpg", width: 1320, height: 800, caption: "现有官网的联系方式与需求表单截图，填写不发送数据。", note: "联系方式、需求概述和提交反馈各自明确。示例联系方式不能作为实际咨询渠道。" },
]

export const caseReadingLinks = {
  "admin-optimization": [
    { kind: "文章", title: "会员与账号状态", href: "/articles/member-account-states#scenario", description: "用账号状态场景对照客服导览中的查询与恢复边界。" },
    { kind: "文章", title: "钱包、支付与对账", href: "/articles/wallet-payment-reconciliation#scenario", description: "接着财务导览核对订单、通道与账本，查看差异示例。" },
    { kind: "模板", title: "钱包对账检查表", href: "/templates/wallet-reconciliation-checklist", description: "把逐笔差异、证据、负责人和复核结论填进同一份记录。" },
  ],
  "bm-optimization": [
    { kind: "文章", title: "注单状态", href: "/articles/bet-ticket-status#scenario", description: "对照详情页中的受理、取消、结算与重算状态。" },
    { kind: "文章", title: "后台信息层级", href: "/articles/admin-information-hierarchy#scenario", description: "把分类、状态和操作区的观察转成页面分层方法。" },
    { kind: "AI 工作流", title: "UI 设计系统", href: "/ai-workflows/ui-design-system#workflow-process", description: "查看页面参考如何展开为组件和控件方案。" },
  ],
  "competitor-analysis": [
    { kind: "文章", title: "会员与账号状态", href: "/articles/member-account-states#scenario", description: "对照个人中心需要表达的账号状态与允许操作。" },
    { kind: "文章", title: "后台信息层级", href: "/articles/admin-information-hierarchy#scenario", description: "查看入口、列表、详情与异常信息怎样分层。" },
    { kind: "AI 工作流", title: "UI 设计系统", href: "/ai-workflows/ui-design-system#workflow-process", description: "从页面分组继续查看组件、状态与多端布局。" },
  ],
  "white-label-official": [
    { kind: "文章", title: "什么是包网", href: "/articles/what-is-white-label", description: "对应服务方案与架构图，区分前台、后台和外部服务。" },
    { kind: "模板", title: "包网项目需求表", href: "/templates/white-label-requirement-form", description: "用填写示例把官网服务范围转成项目范围与验收条件。" },
    { kind: "AI 工作流", title: "品牌视觉系统", href: "/ai-workflows/brand-visual-system#workflow-process", description: "查看品牌规范如何应用到网页与移动端。" },
  ],
} as const

export const caseCardDetails: Record<string, { screens: string; material: string }> = {
  "admin-optimization": { screens: "运营看板、活动记录；充值列表与详情；会员列表与详情", material: "可操作演示 · 示例数据 · 9 张步骤截图" },
  "bm-optimization": { screens: "首页分类、比赛状态、详情操作区；可操作手机原型", material: "原截图与生成式方案对照 · 局部标注 · 虚构记录交互示意" },
  "competitor-analysis": { screens: "首页入口、内容分组；个人中心与五种界面状态", material: "分析信息图 · 局部定位 · 个人中心交互示意" },
  "white-label-official": { screens: "服务卡片、架构说明、咨询表单；桌面与手机对照", material: "网站演示 · 3 张界面标注 · 6 张响应式实际截图" },
}
