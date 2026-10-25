"use client"

import { useState } from "react"
import { adminTours } from "@/data/caseEnhancements"
import { assetPath } from "@/lib/assets"
import { LongImageGallery } from "@/components/cases/LongImageGallery"

export function AdminRoleGuide({ onOpen }: { onOpen: (role: string, page: string, step: number) => void }) {
  const [selected, setSelected] = useState(0)
  const tour = adminTours[selected]
  return (
    <section id="admin-role-tour" className="mt-8 scroll-mt-24" aria-label="后台三角色导览">
      <h2 className="text-2xl font-semibold text-ink">三种角色怎样查看同一套后台</h2>
      <p className="mt-3 text-sm leading-7 text-muted">现有交互演示截图，使用示例数据。看板中的查看按钮只展示本地反馈；进入列表使用页面选择器。</p>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="导览角色">
        {adminTours.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-4 py-2 text-sm font-semibold ${selected === index ? "border-ink bg-ink text-white" : "border-line bg-white text-muted"}`}>{item.role}</button>)}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-ink">{tour.title}</h3>
      <ol className="mt-4 grid items-start gap-4 lg:grid-cols-3">
        {tour.steps.map((step, index) => <li key={step.title} className="min-w-0 rounded-xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-brand-700">步骤 {index + 1}</p><h4 className="mt-2 font-semibold text-ink">{step.title}</h4>
          <img src={assetPath(step.image)} alt={`${tour.role}导览：${step.title}`} width={1440} height={900} loading="lazy" className="mt-3 h-auto w-full rounded-md border border-line" />
          <p className="mt-3 text-sm leading-7 text-ink">{step.action}</p><p className="mt-2 text-xs leading-6 text-muted">{step.observation}</p>
          <button type="button" onClick={() => onOpen(tour.role, step.page, index)} className="mt-3 rounded-md bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">在上方演示中查看</button>
        </li>)}
      </ol>
      <details className="mt-4 rounded-lg border border-line bg-white p-4"><summary className="cursor-pointer text-sm font-semibold text-brand-700">放大查看本组界面</summary><LongImageGallery label="界面截图" items={tour.steps.map((step, index) => ({ id: `${tour.id}-${index}`, title: step.title, description: step.observation, src: step.image, width: 1440, height: 900 }))} emptyMessage="界面截图暂时无法显示。" /></details>
    </section>
  )
}
