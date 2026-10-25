"use client"

import Link from "next/link"
import { useId, useState } from "react"
import type { TopicScenario } from "@/data/topicScenarios"
import { assetPath } from "@/lib/assets"
import { LongImageGallery } from "@/components/cases/LongImageGallery"

export function ScenarioExplorer({ scenario }: { scenario: TopicScenario }) {
  const [selected, setSelected] = useState(0)
  const uid = useId()
  const state = scenario.states[selected]
  return (
    <section id="scenario" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6" aria-label="业务场景示例">
      <p className="text-xs font-semibold text-brand-700">业务场景 · 界面示意与示例数据</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{scenario.title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{scenario.description}</p>
      <ol aria-label="场景流程" className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {scenario.steps.map((step, index) => <li key={step} className="rounded-lg bg-brand-50 p-3 text-sm text-ink"><span className="mr-2 font-semibold text-brand-700">{index + 1} →</span>{step}</li>)}
      </ol>
      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="场景状态切换">
        {scenario.states.map((item, index) => <button key={item.label} type="button" role="tab" id={`${uid}-${index}`} aria-selected={index === selected} aria-controls={`${uid}-panel`} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
          event.preventDefault()
          const next = event.key === "Home" ? 0 : event.key === "End" ? scenario.states.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + scenario.states.length) % scenario.states.length
          setSelected(next); document.getElementById(`${uid}-${next}`)?.focus()
        }} className={`rounded-md border px-3 py-2 text-sm font-semibold ${index === selected ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>{item.label}</button>)}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${selected}`} className="mt-4 rounded-lg border border-line bg-paper p-4">
        <p className="text-xs text-muted">当前示意状态</p><h3 className="mt-1 text-lg font-semibold text-ink">{state.status}</h3>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">{state.fields.map(([label, value]) => <div key={label} className="min-w-0 rounded-md bg-white p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 break-words text-sm font-semibold leading-6 text-ink">{value}</dd></div>)}</dl>
        <p className="mt-4 text-sm leading-7 text-ink"><strong>界面反馈：</strong>{state.feedback}</p>
        <p className="mt-2 text-sm leading-7 text-muted"><strong>下一步：</strong>{state.next}</p>
      </div>
      <details className="mt-4 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold text-brand-700">查看完整状态对照表</summary>
        <div role="region" aria-label="状态对照表，可横向滚动" tabIndex={0} className="mt-4 overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left text-sm"><thead><tr>{["场景", "状态", "界面反馈", "下一步"].map((heading) => <th key={heading} scope="col" className="border-b border-line p-3">{heading}</th>)}</tr></thead><tbody>{scenario.states.map((item) => <tr key={item.label}>{[item.label, item.status, item.feedback, item.next].map((value, index) => <td key={index} className="border-b border-line p-3 align-top leading-7">{value}</td>)}</tr>)}</tbody></table></div>
      </details>
      <details className="mt-4 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold text-brand-700">对照站内界面材料</summary><img src={assetPath(scenario.evidence)} alt={`${scenario.title}的站内界面参考`} width={1440} height={900} loading="lazy" className="mt-4 h-auto w-full rounded-md border border-line" /><p className="mt-2 text-xs leading-6 text-muted">现有站内演示材料。本节 DEMO 记录是独立的说明示例，不是截图中的实际业务记录。</p></details>
      {scenario.diagram ? <><p className="mt-5 text-xs leading-6 text-muted">GPT 生成流程示意，使用示例数据；准确字段与状态以本页文字对照为准。</p><LongImageGallery label="流程图" items={[{ id: "reconciliation-diagram", title: "钱包对账：三份记录如何核对", description: "支付成功与账本入账分别核对。", src: scenario.diagram, width: 1536, height: 1024 }]} emptyMessage="图解暂时无法显示。" /></> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{scenario.related.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-line p-4 hover:border-brand-200"><h3 className="text-sm font-semibold text-brand-700">{item.title} →</h3><p className="mt-2 text-xs leading-6 text-muted">{item.reason}</p></Link>)}</div>
    </section>
  )
}
