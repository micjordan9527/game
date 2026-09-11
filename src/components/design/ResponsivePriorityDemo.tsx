"use client"

import { useState } from "react"
import { Monitor, Smartphone, Tablet } from "lucide-react"

const devices = [
  { name: "桌面", icon: Monitor, width: "max-w-3xl", description: "信息用于交叉核对，可同时展示状态、资金、赛果和处理历史。", visible: ["注单状态", "赛事与玩法", "金额与赔率", "资金流水", "处理历史", "关联记录"] },
  { name: "平板", icon: Tablet, width: "max-w-xl", description: "保留判断和处理所需内容，将关联信息放进可展开区域。", visible: ["注单状态", "赛事与玩法", "金额与赔率", "资金流水", "展开：处理历史"] },
  { name: "手机", icon: Smartphone, width: "max-w-sm", description: "先让用户确认当前结果与下一步；详情按需展开，避免长页面掩盖主要动作。", visible: ["注单状态", "赛事与玩法", "金额与赔率", "展开更多详情"] },
]

export function ResponsivePriorityDemo() {
  const [index, setIndex] = useState(0)
  const device = devices[index]

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">响应式优先级演示</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">屏幕变小后，哪些信息仍必须留下？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">切换设备尺寸，观察同一张注单详情如何保持关键判断信息，而不是简单把桌面页面等比例缩小。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择设备尺寸">{devices.map((item, itemIndex) => { const Icon = item.icon; return <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}><Icon className="h-4 w-4" />{item.name}</button> })}</div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.18fr_0.82fr] lg:items-center"><div className="rounded-xl bg-paper p-4 md:p-6"><div className={`mx-auto overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-all ${device.width}`}><div className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-sm font-semibold text-ink">注单详情</span><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">已结算</span></div><div className="grid gap-3 p-4 sm:grid-cols-2"><Info label="赛事与玩法" value="皇家马德里胜" /><Info label="金额与赔率" value="¥100 · 1.86" />{index < 2 ? <Info label="资金流水" value="已扣款 ¥100" /> : null}{index === 0 ? <><Info label="赛果" value="2 : 1 · 主队获胜" /><Info label="处理历史" value="已受理 → 已结算" /><Info label="关联记录" value="钱包流水 #WF-2418" /></> : null}</div>{index > 0 ? <button type="button" className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-md border border-line px-3 py-2 text-sm font-medium text-brand-700">展开更多详情</button> : null}</div></div><div><p className="text-sm font-semibold text-ink">{device.name}端的设计判断</p><p className="mt-3 text-sm leading-7 text-muted">{device.description}</p><p className="mt-5 text-sm font-semibold text-ink">默认保留</p><div className="mt-3 flex flex-wrap gap-2">{device.visible.map((item) => <span key={item} className="rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-800">{item}</span>)}</div></div></div>
      </div>
    </section>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-line p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-sm font-medium text-ink">{value}</p></div>
}
