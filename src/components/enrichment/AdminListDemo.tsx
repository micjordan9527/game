"use client"

import { useEffect, useId, useRef, useState } from "react"

import { adminDemoRecords as records } from "@/data/adminDemoRecords"

const initial = { query: "", status: "全部", order: "newest" }

export function AdminListDemo() {
  const uid = useId()
  const [draft, setDraft] = useState(initial)
  const [applied, setApplied] = useState(initial)
  const [page, setPage] = useState(1)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [detail, setDetail] = useState<(typeof records)[number] | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const returnTop = useRef<number | null>(null)
  const busy = useRef(false)
  const returnLink = useRef<HTMLButtonElement>(null)
  const restoreFocus = useRef<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (detail || returnTop.current === null) return
    const top = returnTop.current
    const frame = requestAnimationFrame(() => {
      const button = listRef.current?.querySelector<HTMLButtonElement>(`[data-record="${restoreFocus.current}"]`)
      button?.focus({ preventScroll: true })
      window.scrollTo({ top, behavior: "instant" })
      returnTop.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [detail])
  const filtered = records.filter((record) => (applied.status === "全部" || record.status === applied.status) && `${record.id} ${record.title}`.toLowerCase().includes(applied.query.trim().toLowerCase()))
    .sort((a, b) => applied.order === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id))
  const pages = Math.max(1, Math.ceil(filtered.length / 3))
  function query(fail = false) {
    if (busy.current) return
    busy.current = true
    setPending(true); setFailed(false)
    const next = { ...draft }
    timer.current = setTimeout(() => {
      if (fail) setFailed(true)
      else { setApplied(next); setPage(1) }
      setPending(false); busy.current = false
    }, 650)
  }
  return (
    <section id="list-demo" aria-label="后台筛选与列表演示" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
      <p className="text-xs font-semibold text-brand-700">可操作界面示意 · 虚构记录 · 时间为 UTC+8</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">后台筛选与列表演示</h2>
      <p className="mt-3 text-sm leading-7 text-muted">修改条件后点击查询。试着查询不存在的编号、模拟失败，或翻页后打开详情再返回。</p>
      {detail ? <div role="region" aria-label="记录详情" className="mt-5 rounded-lg border border-line bg-paper p-5">
        <button ref={returnLink} type="button" className="text-sm font-semibold text-brand-700" onClick={() => setDetail(null)}>← 返回原列表</button>
        <h3 className="mt-4 font-semibold text-ink">{detail.id} · {detail.title}</h3>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted">当前状态</dt><dd className="mt-1">{detail.status}</dd></div><div><dt className="text-muted">更新时间（UTC+8）</dt><dd className="mt-1">{detail.time}</dd></div></dl>
        <p className="mt-4 text-sm leading-7 text-muted">这是同一条虚构记录的详情。返回时保留已应用条件、排序、页码和原记录位置。</p>
      </div> : <div ref={listRef}>
        <form className="mt-5 grid items-end gap-3 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); query() }}>
          <label className="text-sm font-semibold text-ink">编号或标题<input type="search" value={draft.query} disabled={pending} onChange={(event) => setDraft({ ...draft, query: event.target.value })} placeholder="例如 DEMO-T008" className="mt-2 w-full rounded-md border border-line px-3 py-2 font-normal" /></label>
          <div><label htmlFor={`${uid}-status`} className="text-sm font-semibold text-ink">记录状态</label><select id={`${uid}-status`} value={draft.status} disabled={pending} onChange={(event) => setDraft({ ...draft, status: event.target.value })} className="mt-2 w-full rounded-md border border-line px-3 py-2 font-normal">{["全部", "待处理", "已关闭"].map((value) => <option key={value}>{value}</option>)}</select></div>
          <div><label htmlFor={`${uid}-sort`} className="text-sm font-semibold text-ink">排序</label><select id={`${uid}-sort`} value={draft.order} disabled={pending} onChange={(event) => setDraft({ ...draft, order: event.target.value })} className="mt-2 w-full rounded-md border border-line px-3 py-2 font-normal"><option value="newest">更新时间从新到旧</option><option value="oldest">更新时间从旧到新</option></select></div>
          <div className="flex flex-wrap gap-2"><button type="submit" disabled={pending} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{pending ? "查询中…" : "查询"}</button><button type="button" disabled={pending} onClick={() => { setDraft(initial); setApplied(initial); setPage(1); setFailed(false) }} className="rounded-md border border-line px-4 py-2 text-sm disabled:opacity-50">清空条件</button><button type="button" disabled={pending} onClick={() => query(true)} className="rounded-md border border-line px-3 py-2 text-sm disabled:opacity-50">模拟查询失败</button></div>
        </form>
        {failed ? <div role="alert" className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm leading-7 text-ink">查询失败，下面仍是上次成功的结果，不代表当前输入条件的结果。<button type="button" disabled={pending} onClick={() => query()} className="ml-2 font-semibold underline">重试当前条件</button></div> : null}
        <div aria-busy={pending} className="mt-5">
          <p role="status" className="text-sm leading-7 text-muted">{pending ? "正在查询，暂时保留上次成功结果。" : `已应用：${applied.query.trim() || "不限关键词"} · ${applied.status} · ${applied.order === "newest" ? "更新时间从新到旧" : "更新时间从旧到新"}；共 ${filtered.length} 条。`}</p>
          {filtered.length ? <ul className={`mt-3 space-y-3 ${pending ? "opacity-50" : ""}`}>{filtered.slice((page - 1) * 3, page * 3).map((record) => <li key={record.id} className="rounded-lg border border-line p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-ink">{record.id}</h3><span className="rounded bg-paper px-2 py-1 text-xs font-semibold">{record.status}</span></div><p className="mt-2 text-sm">{record.title}</p><p className="mt-2 text-xs leading-6 text-muted">更新时间（UTC+8）：{record.time}</p><button type="button" data-record={record.id} disabled={pending} className="mt-3 text-sm font-semibold text-brand-700 disabled:opacity-50" onClick={() => { returnTop.current = window.scrollY; restoreFocus.current = record.id; setDetail(record); requestAnimationFrame(() => returnLink.current?.focus({ preventScroll: true })) }}>查看 {record.id} 详情 →</button></li>)}</ul> : <div className="mt-3 rounded-lg border border-line bg-paper p-5"><h3 className="font-semibold text-ink">没有匹配记录</h3><p className="mt-2 text-sm leading-7 text-muted">当前条件已查询成功。可修改编号或状态，也可清空条件查看全部 8 条示例。</p></div>}
          <nav aria-label="示例列表分页" className="mt-4 flex flex-wrap items-center gap-3 text-sm"><button type="button" disabled={page === 1 || pending} onClick={() => setPage(page - 1)} className="rounded border border-line px-3 py-2 disabled:opacity-40">上一页</button><span>第 {page} / {pages} 页</span><button type="button" disabled={page >= pages || pending} onClick={() => setPage(page + 1)} className="rounded border border-line px-3 py-2 disabled:opacity-40">下一页</button></nav>
        </div>
      </div>}
    </section>
  )
}
