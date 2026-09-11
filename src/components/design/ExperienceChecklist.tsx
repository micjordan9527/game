"use client"

import { useState } from "react"
import { Check, ClipboardCheck, RotateCcw } from "lucide-react"

const courseProgressEvent = "wg-course-module-progress"

const checks = [
  { title: "首屏能判断当前页面和关键状态", group: "信息层级" },
  { title: "重要金额、赔率或限额与操作位置相邻", group: "信息层级" },
  { title: "主操作在当前状态下只有一个明确含义", group: "操作路径" },
  { title: "危险操作在提交前展示影响范围并允许取消", group: "操作路径" },
  { title: "加载、处理中和完成状态都有持续可见的反馈", group: "状态反馈" },
  { title: "失败信息说明原因，并提供可执行的修复动作", group: "状态反馈" },
  { title: "手机端关键内容无需横向滚动或频繁缩放", group: "移动体验" },
  { title: "触控按钮和相邻操作保留足够间距", group: "移动体验" },
]

export function ExperienceChecklist() {
  const [completed, setCompleted] = useState<Record<number, boolean>>({})
  const count = Object.values(completed).filter(Boolean).length
  const missing = checks.filter((_, index) => !completed[index])

  function toggleCheck(index: number) {
    setCompleted((current) => {
      const next = { ...current, [index]: !current[index] }
      window.dispatchEvent(new CustomEvent(courseProgressEvent, { detail: { categorySlug: "design", moduleId: "design-module-1", completed: Boolean(next[0] && next[1]) } }))
      return next
    })
  }

  function resetChecks() {
    setCompleted({})
    window.dispatchEvent(new CustomEvent(courseProgressEvent, { detail: { categorySlug: "design", moduleId: "design-module-1", completed: false } }))
  }

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-sm font-semibold text-brand-700">上线前体验清单</p><h2 className="mt-2 text-2xl font-semibold text-ink">用八项检查完成一次页面评审</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-muted">依据实际页面逐项勾选。未完成项会汇总为本次评审的优先处理方向。</p></div>
          <div className="rounded-lg bg-brand-50 px-4 py-3 text-right"><p className="text-xs font-medium text-brand-700">完成度</p><p className="mt-1 text-2xl font-semibold text-brand-800">{count} / {checks.length}</p></div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {checks.map((item, index) => {
            const checked = Boolean(completed[index])
            return <button key={item.title} type="button" aria-pressed={checked} onClick={() => toggleCheck(index)} className={`flex min-h-20 items-center gap-3 rounded-lg border p-4 text-left transition ${checked ? "border-emerald-200 bg-emerald-50" : "border-line bg-white hover:bg-paper"}`}>
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-line bg-white"}`}>{checked ? <Check className="h-3.5 w-3.5" /> : null}</span>
              <span><span className="block text-xs font-medium text-brand-700">{item.group}</span><span className="mt-1 block text-sm font-medium leading-6 text-ink">{item.title}</span></span>
            </button>
          })}
        </div>

        <div className="mt-6 grid gap-4 rounded-lg bg-paper p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div><p className="inline-flex items-center gap-2 text-sm font-semibold text-ink"><ClipboardCheck className="h-4 w-4 text-brand-700" />本次优先处理</p><p className="mt-2 text-sm leading-7 text-muted">{missing.length === 0 ? "八项检查均已完成。可以进入视觉细节、边界场景和真实数据验证。" : `建议先处理：${missing.slice(0, 2).map((item) => item.title).join("；")}${missing.length > 2 ? "。" : ""}`}</p></div>
          {count > 0 ? <button type="button" onClick={resetChecks} className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-muted hover:bg-paper"><RotateCcw className="h-4 w-4" />重新检查</button> : null}
        </div>
      </div>
    </section>
  )
}
