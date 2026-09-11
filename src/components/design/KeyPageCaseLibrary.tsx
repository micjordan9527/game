"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, CircleAlert, WalletCards } from "lucide-react"

const cases = [
  {
    name: "会员列表",
    task: "客服要快速判断哪些会员需要跟进。",
    badTitle: "字段都放上去，但看不出重点",
    goodTitle: "先显示状态与下一步动作",
    badRows: ["ID  ·  昵称  ·  手机号  ·  注册时间  ·  最后登录", "等级  ·  来源  ·  代理  ·  标签  ·  备注  ·  状态", "金额  ·  积分  ·  设备  ·  IP  ·  关联账号  ·  更多"],
    goodRows: ["U-20841  ·  王*  ·  VIP 3", "待人工复核  ·  设备关联  ·  2 分钟前", "余额 ¥8,000", "查看审核原因"],
    issues: ["状态埋在长字段列表中", "客服要横向扫读才能找到要处理的人", "下一步操作没有和状态放在一起"],
    fixes: ["把当前状态、风险信号和更新时间放入默认列", "低频字段收进详情与筛选", "对待处理记录给出明确入口"],
  },
  {
    name: "注单详情",
    task: "客服和风控需要解释一张注单为什么是当前结果。",
    badTitle: "过程信息混在一起，无法核对结果",
    goodTitle: "先确认结果，再追溯依据",
    badRows: ["赛事  ·  比分  ·  赔率  ·  时间  ·  渠道  ·  日志", "金额  ·  玩法  ·  状态  ·  市场  ·  请求参数", "取消原因  ·  赛果来源  ·  订单号  ·  结算记录"],
    goodRows: ["已结算  ·  派彩 ¥186", "皇家马德里胜  ·  赔率 1.86  ·  投注 ¥100", "赛果 2 : 1  ·  赛果已确认", "展开：资金流水、原始请求、处理历史"],
    issues: ["状态、资金与赛果被分散", "用户不知道应该先看哪一项", "技术字段抢占主要视线"],
    fixes: ["结果、金额、玩法放在同一判断区域", "用时间线表达受理到结算的过程", "日志和请求参数只在复核时展开"],
  },
  {
    name: "钱包流水",
    task: "财务需要确认资金是否准确且可追溯。",
    badTitle: "流水看起来完整，但无法快速核对",
    goodTitle: "把金额、方向、状态和关联对象放一起",
    badRows: ["流水号  ·  用户  ·  货币  ·  请求时间  ·  回调时间", "请求报文  ·  通道  ·  状态码  ·  订单号  ·  金额", "余额前  ·  余额后  ·  重试次数  ·  操作人"],
    goodRows: ["入账成功  ·  + ¥500", "U-10428  ·  充值订单 DP-3201", "余额 ¥1,260 → ¥1,760", "展开：回调记录、重试、请求报文"],
    issues: ["金额正负与状态不够突出", "关联订单不易找到", "人工调整和普通流水长得一样"],
    fixes: ["用方向、金额和状态构成首行", "前后余额与关联对象直接可见", "人工调整增加原因、操作人和确认记录"],
  },
  {
    name: "风控审核",
    task: "审核员需要先判断风险，再决定放行或拦截。",
    badTitle: "所有行为数据同时出现，难以做决定",
    goodTitle: "风险证据与决策动作成对出现",
    badRows: ["设备  ·  IP  ·  登录时间  ·  下注记录  ·  标签", "注册信息  ·  行为日志  ·  设备指纹  ·  备注", "等级  ·  关联用户  ·  订单  ·  历史审核"],
    goodRows: ["高风险  ·  等待审核", "命中：同设备关联 3 个账户", "证据：设备  ·  登录记录  ·  相似投注", "放行  ·  拦截  ·  要求补充资料"],
    issues: ["风险等级不够醒目", "证据和动作距离太远", "放行或拦截缺少影响提示"],
    fixes: ["风险等级固定在首屏", "按命中信号组织证据，不按数据库字段排列", "操作前说明账户、订单和资金影响"],
  },
]

export function KeyPageCaseLibrary() {
  const [caseIndex, setCaseIndex] = useState(0)
  const [version, setVersion] = useState<"bad" | "good">("bad")
  const item = cases[caseIndex]
  const isGood = version === "good"
  const rows = isGood ? item.goodRows : item.badRows

  return (
    <section className="py-12">
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="p-6 md:p-8"><p className="text-sm font-semibold text-brand-700">关键页面案例库</p><h2 className="mt-2 text-2xl font-semibold text-ink">同一任务，问题版和优化版差在哪里？</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">选择页面后切换两种版本。先看用户任务，再看信息、状态和操作是如何重排的。</p><div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择页面案例">{cases.map((current, index) => <button key={current.name} type="button" role="tab" aria-selected={caseIndex === index} onClick={() => { setCaseIndex(index); setVersion("bad") }} className={`rounded-md border px-3 py-2 text-sm font-medium ${caseIndex === index ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{current.name}</button>)}</div></div>
        <div className="border-y border-line bg-paper p-4 md:p-6"><div className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-line bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3"><span className="text-sm font-semibold text-ink">{item.name}</span><div className="flex gap-1 rounded-md bg-paper p-1" role="tablist" aria-label="选择案例版本"><button type="button" role="tab" aria-selected={!isGood} onClick={() => setVersion("bad")} className={`rounded px-2.5 py-1.5 text-xs font-medium ${!isGood ? "bg-white text-rose-700 shadow-sm" : "text-muted"}`}>问题版</button><button type="button" role="tab" aria-selected={isGood} onClick={() => setVersion("good")} className={`rounded px-2.5 py-1.5 text-xs font-medium ${isGood ? "bg-white text-emerald-700 shadow-sm" : "text-muted"}`}>优化版</button></div></div><div className={`p-4 ${isGood ? "bg-white" : "bg-slate-50"}`}><p className={`text-sm font-semibold ${isGood ? "text-emerald-800" : "text-rose-800"}`}>{isGood ? item.goodTitle : item.badTitle}</p><div className="mt-4 space-y-2">{rows.map((row, index) => <div key={row} className={`rounded-md border px-3 py-2.5 text-sm ${isGood && index < 3 ? "border-brand-100 bg-brand-50 font-medium text-ink" : "border-line bg-white text-muted"}`}>{row}</div>)}</div></div></div></div>
        <div className="grid gap-5 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8"><div><p className="text-sm font-semibold text-ink">用户正在做什么？</p><p className="mt-2 text-sm leading-7 text-muted">{item.task}</p><button type="button" onClick={() => setVersion(isGood ? "bad" : "good")} className="mt-5 inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-brand-700 hover:bg-paper">{isGood ? "查看问题版" : "查看优化版"}<ArrowRight className="h-4 w-4" /></button></div><div className={`rounded-lg border p-5 ${isGood ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}><p className={`inline-flex items-center gap-2 text-sm font-semibold ${isGood ? "text-emerald-800" : "text-rose-800"}`}>{isGood ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}{isGood ? "优化后的设计原则" : "问题版会造成什么"}</p><ul className={`mt-3 space-y-2 text-sm leading-7 ${isGood ? "text-emerald-900" : "text-rose-900"}`}>{(isGood ? item.fixes : item.issues).map((point) => <li key={point}>• {point}</li>)}</ul></div></div>
      </div>
    </section>
  )
}
