"use client"

import { useState } from "react"
import { ArrowRight, CircleAlert, LayoutDashboard, ListFilter, ShieldCheck, Ticket, WalletCards } from "lucide-react"

const tasks = [
  { type: "风险审核", title: "U-10428 疑似关联账户投注", meta: "高风险 · 2 笔待结算注单", time: "2 分钟前", tone: "rose", icon: ShieldCheck, action: "进入审核", target: "risk-review-prototype", detail: "先确认关联证据与影响范围，再决定限制或放行。" },
  { type: "资金核对", title: "DP-3201 充值到账待核对", meta: "¥500 · 回调已收到", time: "5 分钟前", tone: "amber", icon: WalletCards, action: "查看流水", target: "wallet-ledger-prototype", detail: "核对金额、订单状态、前后余额与回调编号是否一致。" },
  { type: "注单复核", title: "BT-240918-08 结算争议", meta: "¥186 派彩 · 用户发起复核", time: "12 分钟前", tone: "brand", icon: Ticket, action: "查看注单", target: "bet-ticket-detail-prototype", detail: "核对受理赔率、赛果依据、派彩流水和处理历史。" },
] as const

const toneClasses = { rose: "border-rose-200 bg-rose-50 text-rose-800", amber: "border-amber-200 bg-amber-50 text-amber-800", brand: "border-brand-200 bg-brand-50 text-brand-800" }

export function AdminWorkbenchPrototype() {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState<"all" | "urgent">("all")
  const task = tasks[active]
  const visibleTasks = filter === "urgent" ? tasks.slice(0, 2) : tasks

  function openRelatedPrototype() {
    const target = document.getElementById(task.target) ?? Array.from(document.querySelectorAll("section")).find((section) => section.textContent?.includes("完整页面原型 · 注单详情"))
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">完整页面原型 · 后台工作台</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">一线人员打开后台，先看到今天最该处理什么。</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">把风险、资金和注单任务放进同一个入口；列表只保留对象、优先级、影响和下一步，详情再展开证据。</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="rounded-xl border border-line bg-paper p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><LayoutDashboard className="h-4 w-4 text-brand-700" />待处理工作台</p><button type="button" onClick={() => setFilter((current) => current === "all" ? "urgent" : "all")} className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-xs font-medium text-muted hover:bg-paper"><ListFilter className="h-3.5 w-3.5" />{filter === "all" ? "仅看紧急" : "查看全部"}</button></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><Metric label="待处理" value="12" /><Metric label="高优先级" value="3" tone="rose" /><Metric label="即将超时" value="2" tone="amber" /></div>
            <div className="mt-4 space-y-3">{visibleTasks.map((item) => { const taskIndex = tasks.indexOf(item); const Icon = item.icon; const selected = taskIndex === active; return <button key={item.title} type="button" onClick={() => setActive(taskIndex)} className={`w-full rounded-lg border p-4 text-left transition ${selected ? "border-brand-300 bg-white shadow-sm" : "border-line bg-white hover:border-brand-100"}`}><div className="flex gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${toneClasses[item.tone]}`}><Icon className="h-4 w-4" /></span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold text-ink">{item.title}</span><span className="text-xs text-muted">{item.time}</span></span><span className="mt-1 block text-xs leading-5 text-muted">{item.type} · {item.meta}</span></span></div></button>})}</div>
          </div>
          <div className="rounded-xl border border-line bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold text-brand-700">当前待办</p><h3 className="mt-1 text-xl font-semibold text-ink">{task.title}</h3></div><span className={`rounded-full border px-2 py-1 text-xs font-medium ${toneClasses[task.tone]}`}>{task.type}</span></div><div className="mt-5 rounded-lg bg-paper p-4"><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><CircleAlert className="h-4 w-4 text-brand-700" />处理判断</p><p className="mt-2 text-sm leading-7 text-muted">{task.detail}</p></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Detail label="对象" value={active === 0 ? "U-10428" : active === 1 ? "DP-3201" : "BT-240918-08"} /><Detail label="影响" value={active === 0 ? "待结算 2 笔" : active === 1 ? "入账 ¥500" : "派彩 ¥186"} /><Detail label="SLA" value={active === 0 ? "28 分钟" : active === 1 ? "45 分钟" : "1 小时 12 分"} /></div><button type="button" onClick={openRelatedPrototype} className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">{task.action}<ArrowRight className="h-4 w-4" /></button><p className="mt-3 text-xs leading-6 text-muted">点击后会定位到当前页对应的审核、流水或注单原型。</p></div>
        </div>

        <div className="mt-6 rounded-xl border border-line bg-paper p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-ink">移动端工作台</p><p className="mt-1 text-xs leading-6 text-muted">小屏只保留优先级、对象、影响和一个主操作。</p></div><span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">小屏优先</span></div><div className="mt-4 max-w-sm rounded-[1.5rem] border-[5px] border-ink bg-white p-4 shadow-sm"><div className="flex items-center justify-between text-xs text-muted"><span>9:41</span><span>待办 12</span></div><p className="mt-4 text-base font-semibold text-ink">优先处理</p><button type="button" onClick={openRelatedPrototype} className="mt-3 w-full rounded-lg border border-rose-200 bg-rose-50 p-3 text-left"><span className="text-xs font-medium text-rose-700">高风险 · 28 分钟内处理</span><span className="mt-1 block text-sm font-semibold text-ink">{task.title}</span><span className="mt-1 block text-xs text-muted">{active === 0 ? "待结算 2 笔" : active === 1 ? "入账 ¥500" : "派彩 ¥186"} · {task.action}</span></button><div className="mt-3 grid grid-cols-2 gap-2 text-xs"><span className="rounded-md bg-paper px-3 py-2 text-muted">其他待办 11</span><span className="rounded-md bg-paper px-3 py-2 text-muted">即将超时 2</span></div></div></div>
      </div>
    </section>
  )
}

function Metric({ label, value, tone = "brand" }: { label: string; value: string; tone?: "brand" | "rose" | "amber" }) { const colors = { brand: "text-brand-700", rose: "text-rose-700", amber: "text-amber-700" }; return <div className="rounded-md border border-line bg-white p-3"><p className="text-xs text-muted">{label}</p><p className={`mt-1 text-xl font-semibold ${colors[tone]}`}>{value}</p></div> }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-md border border-line bg-paper p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-sm font-semibold text-ink">{value}</p></div> }
