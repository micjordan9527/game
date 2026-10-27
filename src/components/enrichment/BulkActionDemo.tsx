"use client"

import { useEffect, useId, useRef, useState } from "react"
import { adminDemoRecords } from "@/data/adminDemoRecords"

type Result = { id: string; status: "已关闭" | "失败" | "已跳过"; reason: string }
const button = "rounded-md border border-line px-3 py-2 text-sm disabled:opacity-40"
export function BulkActionDemo() {
  const uid = useId()
  const [records, setRecords] = useState(() => adminDemoRecords.map((item) => ({ ...item })))
  const current = useRef(records)
  const [filter, setFilter] = useState("全部")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [scope, setScope] = useState("当前页手动选择")
  const [snapshot, setSnapshot] = useState<{ ids: string[]; filter: string; scope: string } | null>(null)
  const [failOnce, setFailOnce] = useState(true)
  const [busy, setBusy] = useState(false)
  const lock = useRef(false)
  const [results, setResults] = useState<Result[] | null>(null)
  const [runs, setRuns] = useState<{ id: string; results: Result[] }[]>([])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const cancel = useRef<HTMLButtonElement>(null)
  const [changed, setChanged] = useState(false)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (snapshot && !dialog.current?.open) { dialog.current?.showModal(); cancel.current?.focus() }
    if (!snapshot && dialog.current?.open) dialog.current.close()
  }, [snapshot])
  const filtered = records.filter((item) => filter === "全部" || item.status === filter)
  const pages = Math.max(1, Math.ceil(filtered.length / 3))
  const shown = filtered.slice((page - 1) * 3, page * 3)
  function update(next: typeof records) { current.current = next; setRecords(next) }
  function execute() {
    if (!snapshot || lock.current) return
    lock.current = true; setBusy(true)
    const request = snapshot
    const simulate = failOnce
    timer.current = setTimeout(() => {
      let injected = false
      const result: Result[] = request.ids.map((id) => {
        const item = current.current.find((row) => row.id === id)
        if (!item || item.status !== "待处理") return { id, status: "已跳过", reason: "当前已不满足待处理条件，未重复关闭。" }
        if (simulate && !injected) { injected = true; return { id, status: "失败", reason: "本次模拟处理失败，可单独选择失败项。" } }
        return { id, status: "已关闭", reason: "本例待处理工单已关闭。" }
      })
      update(current.current.map((item) => result.some((row) => row.id === item.id && row.status === "已关闭") ? { ...item, status: "已关闭" } : item))
      setResults(result); setRuns((previous) => [...previous, { id: `BULK-DEMO-${String(previous.length + 1).padStart(2, "0")}`, results: result }])
      setSelected([]); setPage(1); setFailOnce(false); setBusy(false); lock.current = false
    }, 650)
  }
  return (
    <section id="bulk-action-demo" aria-label="后台批量操作演示" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
      <p className="text-xs font-semibold text-brand-700">可操作界面示意 · 8条虚构工单 · 仅影响本页演示</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">后台批量操作演示</h2>
      <p className="mt-3 text-sm leading-7 text-muted">先选择当前页，再明确扩展到全部匹配记录。执行前查看范围；结果分别显示成功、失败和跳过。</p>
      <div className="mt-5 flex flex-wrap items-center gap-3"><label htmlFor={`${uid}-filter`} className="text-sm font-semibold">记录状态</label><select id={`${uid}-filter`} value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); setSelected([]); setScope("当前页手动选择") }} className="rounded-md border border-line px-3 py-2 text-sm">{["全部", "待处理", "已关闭"].map((value) => <option key={value}>{value}</option>)}</select><span className="text-sm text-muted">匹配 {filtered.length} 条</span></div>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setSelected(shown.map((item) => item.id)); setScope("当前页") }} className={button} disabled={!shown.length}>选择当前页 {shown.length} 条</button><button type="button" onClick={() => { setSelected(filtered.map((item) => item.id)); setScope("全部匹配记录") }} className={button} disabled={!filtered.length}>选择全部匹配 {filtered.length} 条</button><button type="button" onClick={() => setSelected([])} className={button}>清除选择</button></div>
      <ul className="mt-4 space-y-2">{shown.map((item) => <li key={item.id} className="rounded-lg border border-line p-3"><label className="flex items-start gap-3 text-sm leading-7"><input type="checkbox" aria-label={`选择 ${item.id}`} checked={selected.includes(item.id)} onChange={(event) => { setScope("手动选择"); setSelected(event.target.checked ? [...selected, item.id] : selected.filter((id) => id !== item.id)) }} className="mt-2" /><span className="min-w-0"><strong>{item.id}</strong> · {item.status}<span className="block text-muted">{item.title}</span></span></label></li>)}</ul>
      {!shown.length ? <p className="mt-4 text-sm text-muted">当前条件没有匹配工单。</p> : null}
      <nav aria-label="批量示例分页" className="mt-4 flex flex-wrap items-center gap-3 text-sm"><button type="button" className={button} disabled={page === 1} onClick={() => { setPage(page - 1); setSelected([]) }}>上一页</button><span>第 {page} / {pages} 页</span><button type="button" className={button} disabled={page >= pages} onClick={() => { setPage(page + 1); setSelected([]) }}>下一页</button><span className="text-xs text-muted">翻页或改变筛选会清除本例选择。</span></nav>
      <p role="status" data-bulk-selection className="mt-4 text-sm leading-7 text-muted">范围：{scope} · 已选 {selected.length} 条 · 条件：{filter}</p>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={failOnce} onChange={(event) => setFailOnce(event.target.checked)} />模拟一条处理失败（仅下一次执行）</label>
      <button type="button" disabled={!selected.length} className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" onClick={() => { setResults(null); setChanged(false); setSnapshot({ ids: [...selected], filter, scope }) }}>批量关闭工单</button>
      <dialog ref={dialog} aria-labelledby={`${uid}-title`} onCancel={(event) => { event.preventDefault(); if (!lock.current) setSnapshot(null) }} className="fixed inset-0 m-auto max-h-[85vh] w-[92vw] max-w-xl overflow-auto rounded-xl border border-line p-5 backdrop:bg-ink/60">
        {snapshot ? <><h3 id={`${uid}-title`} className="text-xl font-semibold text-ink">确认批量关闭范围</h3><p className="mt-3 text-sm leading-7">范围：{snapshot.scope} · 条件：{snapshot.filter} · 对象 {snapshot.ids.length} 条</p><p className="mt-2 break-words text-xs leading-6 text-muted">{snapshot.ids.join("、")}</p><p className="mt-3 text-sm leading-7 text-muted">本例仅关闭仍为待处理的工单，其他记录跳过。关闭会改变工单状态，不能把全部对象视为全部成功。</p>
          {!results ? <><button type="button" disabled={busy || changed || !snapshot.ids.some((id) => current.current.find((item) => item.id === id)?.status === "待处理")} className={button + " mt-3"} onClick={() => { const id = snapshot.ids.find((value) => current.current.find((item) => item.id === value)?.status === "待处理"); update(current.current.map((item) => item.id === id ? { ...item, status: "已关闭" } : item)); setChanged(true) }}>模拟一条状态变化</button>{changed ? <p role="status" className="mt-2 text-sm text-muted">一条记录已提前关闭，执行时将重新判断。</p> : null}<div className="mt-5 flex flex-wrap gap-3"><button ref={cancel} type="button" disabled={busy} className={button} onClick={() => setSnapshot(null)}>取消</button><button type="button" disabled={busy} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40" onClick={execute}>{busy ? "执行中…" : "确认执行"}</button></div></> : <><p role="status" data-bulk-result className="mt-4 rounded-md bg-paper p-3 text-sm leading-7">成功 {results.filter((item) => item.status === "已关闭").length} 条 · 失败 {results.filter((item) => item.status === "失败").length} 条 · 跳过 {results.filter((item) => item.status === "已跳过").length} 条</p><ul className="mt-3 space-y-2 text-sm leading-7">{results.map((item) => <li key={item.id}><strong>{item.id} · {item.status}</strong><p className="text-xs text-muted">{item.reason}</p></li>)}</ul><div className="mt-4 flex flex-wrap gap-3"><button type="button" className={button} onClick={() => setSnapshot(null)}>返回列表</button><button type="button" disabled={!results.some((item) => item.status === "失败")} className={button} onClick={() => { setSelected(results.filter((item) => item.status === "失败").map((item) => item.id)); setScope("上次失败项"); setSnapshot(null) }}>仅选择失败项</button></div></>}
        </> : null}
      </dialog>
      <details className="mt-5 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold">查看本次演示操作记录 · {runs.length} 批</summary><ul className="mt-3 space-y-2 text-xs leading-6 text-muted">{runs.map((run) => <li key={run.id}>{run.id} · 对象 {run.results.length} 条 · 成功 {run.results.filter((item) => item.status === "已关闭").length}／失败 {run.results.filter((item) => item.status === "失败").length}／跳过 {run.results.filter((item) => item.status === "已跳过").length}</li>)}</ul></details>
    </section>
  )
}
