"use client"

import { useState } from "react"
import { Code2, FileCheck2, LayoutPanelTop, ScanSearch } from "lucide-react"

const roles = [
  {
    name: "产品", icon: LayoutPanelTop, title: "把业务规则变成可判断的页面任务", input: ["目标用户与使用场景", "状态、规则与例外情况", "操作后对订单或资金的影响"], handoff: "用例与状态清单", done: "每个关键操作都有触发条件、结果和可回退边界。",
  },
  {
    name: "设计", icon: ScanSearch, title: "把任务转成可理解的操作路径", input: ["默认信息与优先级", "空、加载、失败、完成等状态", "桌面与移动端的操作方式"], handoff: "页面稿与交互说明", done: "用户无需猜测当前状态、下一步操作和异常处理方式。",
  },
  {
    name: "前端", icon: Code2, title: "让界面行为与规则保持一致", input: ["字段与接口状态的映射", "按钮可用条件和防重复提交", "响应式布局与错误兜底"], handoff: "可验证的页面实现", done: "视觉、交互和真实数据状态都能被稳定还原。",
  },
  {
    name: "验收", icon: FileCheck2, title: "从真实任务验证用户能否走通", input: ["正常、异常和边界案例", "关键金额与状态的正确性", "移动端与弱网环境表现"], handoff: "验收记录与问题清单", done: "核心路径可完成，异常时用户仍知道发生什么和如何处理。",
  },
]

export function DesignDeliveryBoard() {
  const [index, setIndex] = useState(0)
  const role = roles[index]
  const Icon = role.icon

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">设计交付协作</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">一个页面，怎样从规则走到可验收的体验？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">按角色查看所需输入、交付内容和完成标准，减少设计稿、实现与实际业务状态之间的偏差。</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="选择协作角色">{roles.map((item, itemIndex) => { const ItemIcon = item.icon; return <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}><ItemIcon className="h-4 w-4" />{String(itemIndex + 1).padStart(2, "0")} {item.name}</button> })}</div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="rounded-lg bg-brand-50 p-5"><div className="flex items-center gap-3"><span className="rounded-lg bg-white p-2.5"><Icon className="h-5 w-5 text-brand-700" /></span><div><p className="text-sm font-semibold text-brand-700">{role.name}视角</p><p className="mt-1 text-base font-semibold text-ink">{role.title}</p></div></div><p className="mt-5 text-sm font-semibold text-ink">需要先拿到</p><ul className="mt-3 space-y-2">{role.input.map((item) => <li key={item} className="rounded-md border border-brand-100 bg-white px-3 py-2 text-sm leading-6 text-muted">{item}</li>)}</ul></div>
          <div className="grid gap-4"><div className="rounded-lg border border-line p-5"><p className="text-sm font-semibold text-ink">交给下一位协作者</p><p className="mt-2 text-sm leading-7 text-muted">{role.handoff}</p></div><div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5"><p className="text-sm font-semibold text-emerald-800">完成标准</p><p className="mt-2 text-sm leading-7 text-emerald-900">{role.done}</p></div><div className="flex flex-wrap gap-2 text-xs text-muted">{roles.map((item, itemIndex) => <span key={item.name} className={`rounded-full px-2.5 py-1 ${itemIndex === index ? "bg-brand-100 font-medium text-brand-700" : "bg-paper"}`}>{itemIndex < index ? "✓ " : ""}{item.name}</span>)}</div></div>
        </div>
      </div>
    </section>
  )
}
