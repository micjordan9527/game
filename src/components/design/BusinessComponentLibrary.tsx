"use client"

import { useState } from "react"
import { AlertTriangle, CircleCheck, CircleX, Ellipsis, FileQuestion, LoaderCircle } from "lucide-react"

const components = [
  { name: "状态标签", purpose: "状态不仅说明结果，还要说明处理优先级。", rule: "颜色只做辅助；必须有清晰状态文字，异常状态还要带出原因或入口。" },
  { name: "金额展示", purpose: "金额要能被快速核对，不应该藏在普通说明文字里。", rule: "金额、方向、币种和相关状态保持相邻；涉及余额变化时同时显示前后值。" },
  { name: "确认弹窗", purpose: "危险操作要在提交前让用户看见影响。", rule: "明确对象范围、不可逆影响和取消入口；高风险操作不能只写“确认”。" },
  { name: "空状态", purpose: "没有内容时，用户仍应知道页面为何为空及接下来能做什么。", rule: "包含当前状态、可能原因和一个可执行动作，不要只放空白插图。" },
]

export function BusinessComponentLibrary() {
  const [index, setIndex] = useState(0)
  const item = components[index]

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">业务组件规范</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">高频组件，怎样既统一又不丢业务含义？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">选择一个组件，查看推荐界面、使用场景和设计规则。它们适合在后台、订单、钱包与审核页面中复用。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择业务组件">{components.map((component, componentIndex) => <button key={component.name} type="button" role="tab" aria-selected={index === componentIndex} onClick={() => setIndex(componentIndex)} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === componentIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{component.name}</button>)}</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"><ComponentPreview index={index} /><div><p className="text-sm font-semibold text-brand-700">{item.name}</p><h3 className="mt-2 text-xl font-semibold text-ink">{item.purpose}</h3><div className="mt-5 rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-7 text-brand-900"><span className="font-semibold">使用规则：</span>{item.rule}</div><div className="mt-4 rounded-lg bg-paper p-4"><p className="text-sm font-semibold text-ink">交付时至少标注</p><p className="mt-2 text-sm leading-7 text-muted">默认状态、异常状态、禁用条件、文本上限，以及移动端的显示方式。</p></div></div></div>
      </div>
    </section>
  )
}

function ComponentPreview({ index }: { index: number }) {
  if (index === 0) return <PreviewShell title="订单状态"><div className="space-y-3"><Status icon={CircleCheck} text="已结算 · 派彩已入账" tone="emerald" /><Status icon={LoaderCircle} text="处理中 · 正在确认投注" tone="blue" /><Status icon={CircleX} text="未完成 · 金额超过限额" tone="rose" /></div></PreviewShell>
  if (index === 1) return <PreviewShell title="钱包流水"><div className="rounded-lg border border-line p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-medium text-ink">充值到账</p><p className="mt-1 text-xs text-muted">订单 DP-3201 · 已完成</p></div><p className="text-lg font-semibold text-emerald-700">+ ¥500.00</p></div><div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm"><span className="text-muted">余额变化</span><span className="font-medium text-ink">¥1,260.00 <span className="mx-1 text-muted">→</span> ¥1,760.00</span></div></div></PreviewShell>
  if (index === 2) return <PreviewShell title="人工调整确认"><div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900"><AlertTriangle className="h-4 w-4" />确认退款 ¥500？</p><p className="mt-3 text-sm leading-7 text-amber-900">将对订单 DP-3201 发起退款，用户余额会增加 ¥500。该操作需要保留处理原因。</p><div className="mt-4 flex justify-end gap-2"><button type="button" className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm font-medium text-amber-900">取消</button><button type="button" className="rounded-md bg-amber-700 px-3 py-2 text-sm font-medium text-white">确认退款</button></div></div></PreviewShell>
  return <PreviewShell title="筛选结果"><div className="flex min-h-48 flex-col items-center justify-center text-center"><span className="rounded-full bg-paper p-3"><FileQuestion className="h-6 w-6 text-brand-700" /></span><p className="mt-3 text-sm font-semibold text-ink">没有符合条件的记录</p><p className="mt-2 text-sm text-muted">当前筛选为“待审核 · 今天”，可调整条件后重新查询。</p><button type="button" className="mt-4 rounded-md border border-line px-3 py-2 text-sm font-medium text-brand-700">清除筛选</button></div></PreviewShell>
}

function PreviewShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-line bg-paper p-4 md:p-6"><div className="mx-auto max-w-md overflow-hidden rounded-lg border border-line bg-white shadow-sm"><div className="flex items-center justify-between border-b border-line px-4 py-3"><span className="text-sm font-semibold text-ink">{title}</span><Ellipsis className="h-4 w-4 text-muted" /></div><div className="p-4">{children}</div></div></div>
}

function Status({ icon: Icon, text, tone }: { icon: typeof CircleCheck; text: string; tone: "emerald" | "blue" | "rose" }) {
  const classes = { emerald: "border-emerald-200 bg-emerald-50 text-emerald-800", blue: "border-sky-200 bg-sky-50 text-sky-800", rose: "border-rose-200 bg-rose-50 text-rose-800" }
  return <div className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium ${classes[tone]}`}><Icon className={`h-4 w-4 ${tone === "blue" ? "animate-spin" : ""}`} />{text}</div>
}
