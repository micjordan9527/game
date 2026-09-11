"use client"

import { useState } from "react"
import { AlertTriangle, Columns3, Eye, ShieldAlert } from "lucide-react"

const pages = [
  { name: "后台列表", purpose: "让一线人员快速判断哪些记录需要处理。", defaults: ["身份与对象", "当前状态", "金额或风险等级", "更新时间", "下一步操作"], fold: "低频备注、历史明细与扩展字段", risk: "批量操作、删除与状态变更要突出确认范围" },
  { name: "注单详情", purpose: "让客服与风控围绕同一张注单解释处理结果。", defaults: ["赛事与玩法", "受理时赔率", "注单状态", "赛果依据", "资金流水"], fold: "原始请求、完整日志与关联记录", risk: "复核、取消或结算调整应说明对资金的影响" },
  { name: "风控审核", purpose: "让审核人员先看到触发信号，再做处理决定。", defaults: ["风险等级", "命中信号", "账户与设备", "提交信息", "处理动作"], fold: "历史同源关系与扩展行为数据", risk: "拦截、解禁与人工放行需保留原因和操作人" },
  { name: "钱包流水", purpose: "让财务和客服确认资金动作是否唯一、可追溯。", defaults: ["流水状态", "金额与币种", "关联对象", "发生时间", "唯一标识"], fold: "请求报文、重试记录与技术字段", risk: "退款、冲正与人工调账需二次确认并展示前后余额" },
]

export function DesignReviewTool() {
  const [index, setIndex] = useState(0)
  const page = pages[index]
  return <section className="py-12"><div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-semibold text-brand-700">设计评审工具</p><h2 className="mt-2 text-2xl font-semibold text-ink">复杂后台页面，怎样做到一眼可判断？</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">选择一个页面，按默认信息、可折叠内容与风险操作三层完成体验评审。</p><div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="选择页面类型">{pages.map((item, i) => <button key={item.name} type="button" aria-pressed={index === i} onClick={() => setIndex(i)} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === i ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}</div><div className="mt-6 grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-lg bg-paper p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><Eye className="h-4 w-4 text-brand-700" />页面目标</p><p className="mt-3 text-sm leading-7 text-muted">{page.purpose}</p><p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink"><Columns3 className="h-4 w-4 text-brand-700" />默认展示</p><ul className="mt-3 space-y-2 text-sm text-muted">{page.defaults.map((item) => <li key={item} className="rounded-md border border-line bg-white px-3 py-2">{item}</li>)}</ul></div><div className="grid gap-4"><div className="rounded-lg border border-line p-5"><p className="text-sm font-semibold text-ink">适合折叠或筛选</p><p className="mt-2 text-sm leading-7 text-muted">{page.fold}</p></div><div className="rounded-lg border border-amber-200 bg-amber-50 p-5"><p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-800"><AlertTriangle className="h-4 w-4" />危险操作与反馈</p><p className="mt-2 text-sm leading-7 text-amber-900">{page.risk}</p></div><p className="border-l-2 border-brand-600 pl-4 text-sm leading-7 text-muted"><ShieldAlert className="mr-2 inline h-4 w-4 text-brand-700" />如果用户看见页面后仍无法判断下一步，通常不是颜色或间距问题，而是信息与业务状态还没有拆清楚。</p></div></div></div></section>
}
