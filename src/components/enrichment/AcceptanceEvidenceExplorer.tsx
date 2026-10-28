"use client"

import { useState } from "react"
import { acceptanceExamples, acceptanceExampleText } from "@/data/acceptanceEvidence"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import Link from "next/link"

export function AcceptanceEvidenceExplorer() {
  const [index, setIndex] = useState(0)
  const item = acceptanceExamples[index]
  return <section id="acceptance-evidence" aria-label="验收证据对照" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
    <h2 className="text-2xl font-semibold">验收记录里，哪些能支持结论</h2><p className="mt-3 text-sm leading-7 text-muted">切换缺少证据、真实历史自动检查和只有截图的记录。预期结果与实际结果分别显示，不把示例当成本项目已通过。</p>
    <div aria-label="选择证据记录" className="mt-5 flex flex-wrap gap-2">{acceptanceExamples.map((x, i) => <button key={x.id} type="button" aria-pressed={i === index} onClick={() => setIndex(i)} className={`rounded-md border px-3 py-2 text-sm font-semibold ${i === index ? "border-ink bg-ink text-white" : "border-line"}`}>{x.title}</button>)}</div>
    <div data-evidence-record={item.id} className="mt-5 rounded-lg border border-line bg-paper p-4"><h3 className="font-semibold">{item.requirement}</h3><dl className="mt-4 grid gap-4 text-sm leading-7 sm:grid-cols-2"><div className="min-w-0"><dt className="font-semibold">版本</dt><dd className="mt-1 break-all">{item.build}</dd></div><div><dt className="font-semibold">环境与范围</dt><dd className="mt-1">{item.environment}</dd></div><div className="rounded-md border border-line bg-white p-3"><dt className="font-semibold">预期结果</dt><dd className="mt-2">{item.expected}</dd></div><div className="rounded-md border border-line bg-white p-3"><dt className="font-semibold">实际结果</dt><dd className="mt-2">{item.observed}</dd></div></dl><p role="status" className="mt-4 text-sm font-semibold">当前结论：{item.conclusion}</p><ul className="mt-3 space-y-2 text-sm leading-7">{item.evidence.map((e) => <li key={e.href}><Link href={e.href} className="font-semibold text-brand-700 underline">{e.title}</Link></li>)}</ul><p className="mt-4 border-l-2 border-brand-700 pl-3 text-sm leading-7">{item.boundary}</p></div>
    <div className="mt-4"><CopyPromptButton content={acceptanceExampleText(index)} label="复制当前证据记录" /></div>
  </section>
}
