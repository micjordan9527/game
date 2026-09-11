"use client"

import { useState } from "react"
import { AlertTriangle, ListFilter, TableProperties } from "lucide-react"

const modes = [
  {
    name: "默认查看",
    title: "日常查询：信息完整，但先看核心列",
    description: "适合客服或运营按条件查找单条记录。状态、金额和最近更新时间保持在无需横向滚动的位置。",
    columns: ["用户", "状态", "金额", "更新时间", "更多"],
    emphasis: "状态与金额",
  },
  {
    name: "风险优先",
    title: "异常处理：先把需要处理的记录浮出来",
    description: "适合风控审核或排查高优先级事项。风险等级和触发原因进入首屏，普通记录仍可查询但不抢占注意力。",
    columns: ["风险", "用户", "触发原因", "金额", "操作"],
    emphasis: "风险等级与触发原因",
  },
  {
    name: "紧凑浏览",
    title: "批量核对：提高单位屏的可比较性",
    description: "适合有经验的用户在大批量记录中做交叉对照。低频字段收进详情，避免横向滚动和重复扫读。",
    columns: ["用户", "状态", "金额", "时间", "…"],
    emphasis: "行间对比与筛选",
  },
]

const rows = [
  { user: "U-20841", status: "待审核", amount: "¥ 8,000", time: "2 分钟前", risk: "高", reason: "设备关联", dot: "bg-rose-500" },
  { user: "U-19752", status: "已完成", amount: "¥ 300", time: "8 分钟前", risk: "低", reason: "—", dot: "bg-emerald-500" },
  { user: "U-20406", status: "处理中", amount: "¥ 1,200", time: "14 分钟前", risk: "中", reason: "频次异常", dot: "bg-amber-500" },
]

export function AdminTableDensityDemo() {
  const [index, setIndex] = useState(0)
  const mode = modes[index]

  return (
    <section className="py-12">
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm">
        <div className="p-6 md:p-8"><p className="text-sm font-semibold text-brand-700">后台列表演示</p><h2 className="mt-2 text-2xl font-semibold text-ink">一张表，不同任务该怎样排信息？</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">切换查看目标，观察同一批数据如何改变默认列、重点信息和操作入口。</p><div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择列表展示方式">{modes.map((item, itemIndex) => <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}</div></div>

        <div className="border-t border-line bg-paper p-4 md:p-6">
          <div className="overflow-hidden rounded-lg border border-line bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3"><p className="text-sm font-semibold text-ink">订单记录 <span className="ml-2 text-xs font-normal text-muted">共 1,248 条</span></p><button type="button" className="inline-flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5 text-xs text-muted"><ListFilter className="h-3.5 w-3.5" />筛选</button></div>
            <div className="min-w-[600px]"><div className="grid grid-cols-5 gap-3 border-b border-line bg-paper px-4 py-2.5 text-xs font-medium text-muted">{mode.columns.map((column) => <span key={column}>{column}</span>)}</div>{rows.map((row) => <div key={row.user} className="grid grid-cols-5 items-center gap-3 border-b border-line px-4 py-3 last:border-0 text-sm">{index === 1 ? <><span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${row.risk === "高" ? "bg-rose-50 text-rose-700" : row.risk === "中" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}><span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />{row.risk}风险</span><span className="font-medium text-ink">{row.user}</span><span className="text-muted">{row.reason}</span><span className="font-medium text-ink">{row.amount}</span><button type="button" className="w-fit rounded border border-line px-2 py-1 text-xs text-muted">查看</button></> : <><span className="font-medium text-ink">{row.user}</span><span className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${row.status === "待审核" ? "bg-amber-50 text-amber-800" : row.status === "处理中" ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700"}`}>{row.status}</span><span className="font-medium text-ink">{row.amount}</span><span className="text-muted">{row.time}</span><button type="button" className="w-fit text-xs text-brand-700">详情</button></>}</div>)}</div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-[auto_1fr] md:items-start md:p-8"><div className="rounded-lg bg-brand-50 p-3"><TableProperties className="h-5 w-5 text-brand-700" /></div><div><p className="text-lg font-semibold text-ink">{mode.title}</p><p className="mt-2 text-sm leading-7 text-muted">{mode.description}</p><p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ink"><AlertTriangle className="h-4 w-4 text-brand-700" />当前应优先识别：{mode.emphasis}</p></div></div>
      </div>
    </section>
  )
}
