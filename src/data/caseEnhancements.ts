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

export type FocusCrop = { x: number; y: number; width: number; height: number }
export type ImageFocus = { id: string; title: string; src: string; width: number; height: number; crop?: FocusCrop; caption: string; note: string; comparison?: { before: { crop: FocusCrop; label: string; caption: string }; after: { crop: FocusCrop; label: string; caption: string }; demoHref: string; demoLabel: string } }
export const bmFocus: ImageFocus[] = [
  { id: "categories", title: "首页分类", src: "/case-assets/bm-optimization/bm-home-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 250, width: 1600, height: 360 }, caption: "把同一张首页材料中的顶部入口拆开对照。", note: "先看每排回答什么：专题、日期条件和球类分别辨认。原型可组合选择球类与比赛状态，静态方案不证明真实筛选已经实现。", comparison: { before: { crop: { x: 110, y: 317, width: 310, height: 115 }, label: "原界面局部", caption: "上排有热门、滚球、今日、早盘等入口，下排是球类图标。" }, after: { crop: { x: 875, y: 350, width: 295, height: 132 }, label: "方案局部 · 生成示意", caption: "顶部增加专题入口，球类图标单独一排，下方继续提供筛选。" }, demoHref: "#bm-mobile-prototype", demoLabel: "在手机原型组合球类与状态筛选" } },
  { id: "status", title: "状态层级", src: "/case-assets/bm-optimization/bm-home-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 530, width: 1600, height: 350 }, caption: "把队名、时间、比分与多列数字放在同一阅读范围内看。", note: "方案把比分放到队名旁的小块，其他数字按列排列。颜色辅助阅读；是否进行中、是否已结束仍需文字和业务状态说明。", comparison: { before: { crop: { x: 110, y: 433, width: 310, height: 181 }, label: "原界面局部", caption: "同一条记录里有时间、双方名称及多列数字，需逐项辨认。" }, after: { crop: { x: 875, y: 488, width: 295, height: 207 }, label: "方案局部 · 生成示意", caption: "队名旁显示小比分块，右侧数字按不同列分组。" }, demoHref: "#bm-mobile-prototype", demoLabel: "在手机原型对照未开始、进行中和已结束" } },
  { id: "actions", title: "详情操作区", src: "/case-assets/bm-optimization/bm-detail-optimization.avif", width: 1600, height: 1160, crop: { x: 0, y: 810, width: 1600, height: 330 }, caption: "只看详情底部的记录、汇总与操作位置。", note: "原图这个局部是连续记录，方案增加底部汇总栏，右侧仍有悬浮图标。遮挡、固定位置和手机安全区需要实际操作核对，图片不能证明这些行为。", comparison: { before: { crop: { x: 110, y: 775, width: 310, height: 183 }, label: "原界面局部", caption: "详情底部继续排列记录，截图中没有展示同样的底部汇总栏。" }, after: { crop: { x: 875, y: 775, width: 295, height: 183 }, label: "方案局部 · 生成示意", caption: "底部增加数量、金额与操作区域，右侧仍能看到悬浮图标。" }, demoHref: "#bm-mobile-prototype", demoLabel: "在手机原型打开详情并核对当前记录" } },
]
export const u8Focus: ImageFocus[] = [
  { id: "home-entry", title: "首页入口", src: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 0, width: 2160, height: 1850 }, caption: "从分析图中分别取出首页原界面与改版示意的首屏。", note: "材料中的改版示意把登录／注册放成整行按钮，辅助服务另排一行。图中变化只说明布局，不能据此判断真实点击率；下方原型展示的是个人中心分组。", comparison: { before: { crop: { x: 200, y: 595, width: 410, height: 650 }, label: "材料中的原界面", caption: "未登录提示、服务入口和多块宣传内容同时出现在首屏。" }, after: { crop: { x: 200, y: 2725, width: 410, height: 650 }, label: "材料中的改版示意", caption: "登录／注册变成整行按钮，辅助服务保持独立一排。" }, demoHref: "#u8-profile-prototype", demoLabel: "在个人中心原型对照入口分组" } },
  { id: "home-groups", title: "首页分组", src: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 1850, width: 2160, height: 1850 }, caption: "只看首页下部的内容分类、浮条与底部导航。", note: "对照可见结构：原界面的分类下方有蓝色浮条，改版示意这个局部不再展示相同浮条。滚动时是否遮挡、浮层是否可关闭，仍需实际设备检查。", comparison: { before: { crop: { x: 200, y: 1245, width: 410, height: 355 }, label: "材料中的原界面", caption: "内容分类、蓝色浮条和底部图标出现在相邻区域。" }, after: { crop: { x: 200, y: 3375, width: 410, height: 355 }, label: "材料中的改版示意", caption: "内容分类与底部导航分区显示，该局部没有相同蓝色浮条。" }, demoHref: "#u8-profile-prototype", demoLabel: "在个人中心原型切换账号、资产、订单和服务" } },
  { id: "profile", title: "个人中心", src: "/case-assets/competitor-analysis/u8/u8-profile-optimization.avif", width: 2160, height: 5696, crop: { x: 0, y: 0, width: 2160, height: 2100 }, caption: "把钱包主卡、资金入口与收益区拆出来对照。", note: "方案把钱包主卡、充值／提现和收益区分组。真实余额、单笔订单和账号状态仍要分别判断；原型可切换四类分组与五种界面状态。", comparison: { before: { crop: { x: 200, y: 720, width: 410, height: 660 }, label: "材料中的原界面", caption: "余额、充提入口、今日收益和更多服务连续排列。" }, after: { crop: { x: 200, y: 2845, width: 410, height: 780 }, label: "材料中的改版示意", caption: "钱包主卡与两个资金入口成组，收益和常用服务另设区域。" }, demoHref: "#u8-profile-prototype", demoLabel: "在个人中心原型对照资产、订单与异常状态" } },
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
  "bm-optimization": { screens: "赛事身份、赛况与盘口；长队名与18px文字；分类和返回原型", material: "现有材料局部标注 · 同内容结构示意 · 独立交互原型" },
  "competitor-analysis": { screens: "首页入口、内容分组；个人中心与五种界面状态", material: "分析信息图 · 3组可放大局部对照 · 个人中心交互示意" },
  "white-label-official": { screens: "服务卡片、架构说明、咨询表单；桌面与手机对照", material: "网站演示 · 3 张界面标注 · 6 张响应式实际截图" },
}
