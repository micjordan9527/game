"use client"

import Link from "next/link"
import { useEffect, useId, useState, type KeyboardEvent } from "react"
import type { LinkedCase } from "@/data/businessCases"

export function LinkedCaseExplorer({ data }: { data: LinkedCase }) {
  const [stageIndex, setStageIndex] = useState(0)
  const [screenIndex, setScreenIndex] = useState(0)
  const uid = useId()
  const stage = data.stages[stageIndex]
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("caseStage")
    const index = data.stages.findIndex((item) => item.label === requested)
    setStageIndex(index < 0 ? 0 : index)
    setScreenIndex(0)
  }, [data.id, data.stages])
  const selectStage = (index: number) => {
    setStageIndex(index)
    const url = new URL(window.location.href)
    url.searchParams.set("caseStage", data.stages[index].label)
    window.history.replaceState(window.history.state, "", url)
  }
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number, group: "stage" | "screen") => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    const count = group === "stage" ? data.stages.length : data.screens.length
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + count) % count
    if (group === "stage") selectStage(next)
    else setScreenIndex(next)
    document.getElementById(`${uid}-${group}-${next}`)?.focus()
  }
  return <section id={data.id} aria-label={data.title} className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
    <p className="text-xs font-semibold text-brand-700">完整案例 · 交互示意与演示数据</p>
    <h2 className="mt-2 text-2xl font-semibold text-ink">{data.title}</h2>
    <p className="mt-3 text-sm leading-7 text-muted">{data.description}</p>
    <p className="mt-2 break-words text-xs text-muted">关联编号：{data.recordId}</p>
    <div role="tablist" aria-label="选择案例状态" className="mt-5 flex flex-wrap gap-2">{data.stages.map((item, index) => <button key={item.label} id={`${uid}-stage-${index}`} type="button" role="tab" aria-selected={index === stageIndex} aria-controls={`${uid}-panel`} tabIndex={index === stageIndex ? 0 : -1} onClick={() => selectStage(index)} onKeyDown={(event) => keyboard(event, index, "stage")} className={`rounded-md border px-3 py-2 text-sm font-semibold ${index === stageIndex ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>{item.label}</button>)}</div>
    <div role="tablist" aria-label="选择案例界面" className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">{data.screens.map((screen, index) => <button key={screen} id={`${uid}-screen-${index}`} type="button" role="tab" aria-selected={index === screenIndex} aria-controls={`${uid}-panel`} tabIndex={index === screenIndex ? 0 : -1} onClick={() => setScreenIndex(index)} onKeyDown={(event) => keyboard(event, index, "screen")} className={`rounded-md border p-3 text-left text-sm font-semibold ${index === screenIndex ? "border-brand-200 bg-brand-50 text-brand-700" : "border-line text-muted hover:bg-paper"}`}>{index + 1}. {screen}</button>)}</div>
    <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-stage-${stageIndex} ${uid}-screen-${screenIndex}`} tabIndex={0} className="mt-3 rounded-xl border border-line bg-paper p-4 md:p-5">
      <p className="text-xs text-muted">{stage.label}</p><h3 className="mt-1 text-lg font-semibold text-ink">{data.screens[screenIndex]}</h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">{stage.fields[screenIndex].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-white p-3 ring-1 ring-line"><dt className="text-xs text-muted">{label}</dt><dd className="mt-1 break-words text-sm font-semibold leading-6 text-ink">{value}</dd></div>)}</dl>
      <p className="mt-4 text-sm leading-7 text-muted"><strong className="text-ink">下一步：</strong>{stage.next}</p>
    </div>
    <details open className="mt-5 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold text-ink">查看核对依据</summary><ul className="mt-3 space-y-2 text-sm leading-7 text-muted">{data.notes.map((note) => <li key={note}>{note}</li>)}</ul></details>
    <nav aria-label="案例关联材料" className="mt-5 grid gap-3 sm:grid-cols-2">{data.related.map((item) => <Link key={item.href} href={item.href} className="rounded-lg border border-line p-4 text-sm font-semibold text-brand-700">{item.title} →</Link>)}</nav>
  </section>
}
