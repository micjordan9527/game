export const demonstrationEntries = [
  { group: "interface-design", location: "知识图解 · 后台批量操作", title: "后台批量操作", href: "/articles/admin-bulk-actions#bulk-action-demo", description: "区分当前页和全部匹配，确认对象范围，模拟状态变化、部分失败、跳过和仅选择失败项。" },
  { group: "business-process", location: "知识图解 · 数据导出、脱敏与下载审计", title: "导出任务全过程", href: "/articles/export-masking-audit#export-task-demo", description: "固定筛选快照，观察排队、生成、失败、取消、下载、过期与权限变化，可下载虚构脱敏CSV。" },
  { group: "interface-design", location: "知识图解 · 后台筛选与列表状态", title: "后台筛选与列表", href: "/articles/admin-filter-list-states#list-demo", description: "编辑与应用条件、翻页、无匹配结果、查询失败与重试；从详情返回保留条件、排序、页码和位置。" },
  { group: "interface-design", location: "知识图解 · 表单校验与提交反馈", title: "表单校验与提交", href: "/articles/form-validation-submit-feedback#form-demo", description: "空白与字段错误、提交中、明确未受理、未知结果及原申请查询；区分已受理与已发布。" },

  { group: "business-process", location: "钱包文章 · 对账联动案例", title: "钱包对账", href: "/articles/wallet-payment-reconciliation#reconciliation-case", description: "同一演示订单的订单列表、详情、通道、账务与差异；切换一致、缺流水、重复通知和未知结果。" },
  { group: "business-process", location: "钱包文章 · 提现异常案例", title: "提现异常", href: "/articles/wallet-payment-reconciliation#withdrawal-case", description: "按原业务号查看审核、处理中、未知、退回和完成；区分可用、冻结与已付款金额。" },
  { group: "business-process", location: "会员与账号文章 · 受限恢复案例", title: "账号受限与恢复", href: "/articles/member-account-states#account-recovery-case", description: "从查询到复核、补充资料和恢复，分别观察账号、会话、资料与资金状态。" },
  { group: "business-process", location: "代理系统文章 · 跨期结算案例", title: "代理跨期结算", href: "/articles/agent-system-design#agent-settlement-case", description: "查看会员归属、规则版本、结算批次和跨期调整，区分原记录与更正明细。" },
  { group: "interface-design", location: "案例 · BM 优化 · 手机原型", title: "BM 手机原型", href: "/cases/bm-optimization#bm-mobile-prototype", description: "切换运动与赛事状态、打开详情并返回，观察筛选保留和底部操作反馈。" },
  { group: "interface-design", location: "案例 · 竞品分析 · 个人中心原型", title: "U8 个人中心原型", href: "/cases/competitor-analysis#u8-profile-prototype", description: "切换账号、资产、订单和服务，查看正常、加载、空结果、失败和受限五种状态。" },
  { group: "interface-design", location: "案例 · 包网官网 · 桌面与手机对照", title: "官网模块与响应式对照", href: "/cases/white-label-official#official-responsive-comparison", description: "服务展示、页面结构和咨询入口三组模块的桌面／手机实际页面截图，可打开大图。" },
  { group: "browse-search", location: "案例 · BM 优化 · 案例长图组", title: "BM、U8 长图浏览", href: "/cases/bm-optimization", description: "在案例图集中打开大图，适应屏幕按可用宽度显示并纵向浏览；可切换原尺寸、上下张与缩略图。" },
  { group: "interface-design", location: "设计体验 · 界面状态对照", title: "六种界面状态", href: "/design/states", description: "并列查看加载、空结果、失败、受限、处理中和未知结果，跳转到对应演示。" },
  { group: "browse-search", location: "顶部搜索 · 搜索结果页", title: "搜索与详情往返", href: "/search", description: "按关键词与类型查资料；空搜索显示精选案例、图解与AI工作流；从详情返回保留查询和位置。" },
]

export const demonstrationGroups = [
  { id: "business-process", title: "业务流程", description: "沿同一业务记录查看资金、账号与代理的状态和处理过程。" },
  { id: "interface-design", title: "界面设计", description: "对照手机原型、官网响应式页面与不同界面状态。" },
  { id: "browse-search", title: "浏览与查找", description: "查看长图细节，搜索资料并验证详情往返。" },
] as const
