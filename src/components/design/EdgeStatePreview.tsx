"use client"

import { useState } from "react"
import { Ban, FileQuestion, LockKeyhole, WifiOff } from "lucide-react"

const states = [
  { name: "暂无数据", icon: FileQuestion, title: "还没有符合条件的记录", description: "调整筛选条件，或清除当前筛选后再查看。", action: "清除筛选", note: "空状态要说明为什么为空，并保留继续查找的路径。" },
  { name: "权限不足", icon: LockKeyhole, title: "你没有查看此记录的权限", description: "如需处理该事项，请联系所属负责人申请相应权限。", action: "查看权限说明", note: "权限提示应界定不能做什么，以及用户可以通过谁解决。" },
  { name: "网络中断", icon: WifiOff, title: "连接暂时不可用", description: "已展示上次成功加载的内容。恢复连接后可重新刷新。", action: "重新加载", note: "不要直接清空用户已看到的信息；说明数据是否仍是最新。" },
  { name: "操作不可用", icon: Ban, title: "当前状态不能执行此操作", description: "订单正在处理中，完成后才可继续发起调整。", action: "查看订单状态", note: "禁用操作也需要解释原因、解除条件和替代路径。" },
]

export function EdgeStatePreview() {
  const [index, setIndex] = useState(0)
  const state = states[index]
  const Icon = state.icon

  return (
    <section className="py-12">
      <div className="rounded-xl border border-line bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold text-brand-700">边界状态预览</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">页面无法正常推进时，用户还找得到路吗？</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">空数据、权限不足、网络中断和不可用操作，都是设计稿中容易遗漏但真实业务必然遇到的状态。</p>
        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="选择边界状态">{states.map((item, itemIndex) => <button key={item.name} type="button" role="tab" aria-selected={index === itemIndex} onClick={() => setIndex(itemIndex)} className={`rounded-md border px-3 py-2 text-sm font-medium ${index === itemIndex ? "border-brand-600 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{item.name}</button>)}</div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="mx-auto flex min-h-64 w-full max-w-md flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper p-6 text-center"><span className="rounded-full bg-white p-4 shadow-sm"><Icon className="h-7 w-7 text-brand-700" /></span><h3 className="mt-4 text-base font-semibold text-ink">{state.title}</h3><p className="mt-2 max-w-xs text-sm leading-7 text-muted">{state.description}</p><button type="button" className="mt-5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-brand-700">{state.action}</button></div>
          <div className="rounded-lg bg-paper p-5"><p className="text-sm font-semibold text-ink">设计检查</p><p className="mt-3 text-sm leading-7 text-muted">{state.note}</p><div className="mt-5 space-y-3">{["状态标题是否一眼可懂？", "是否说明了发生原因或当前限制？", "是否保留一个可执行的下一步？"].map((item) => <div key={item} className="rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink">{item}</div>)}</div></div>
        </div>
      </div>
    </section>
  )
}
