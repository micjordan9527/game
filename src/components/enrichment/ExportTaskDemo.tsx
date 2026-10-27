"use client"

import { useEffect, useId, useRef, useState } from "react"
import { adminDemoRecords } from "@/data/adminDemoRecords"

type Job = { id: string; site: string; filter: string; rows: typeof adminDemoRecords; status: "排队中" | "生成中" | "可下载" | "生成失败" | "已过期" | "已取消"; reason: string }
const button = "rounded-md border border-line px-3 py-2 text-sm disabled:opacity-40"
export function ExportTaskDemo() {
  const uid = useId()
  const [site, setSite] = useState("站点A")
  const [filter, setFilter] = useState("全部")
  const [canCreate, setCanCreate] = useState(true)
  const [canDownload, setCanDownload] = useState(true)
  const [fail, setFail] = useState(false)
  const access = useRef({ site, canCreate, canDownload })
  const [job, setJob] = useState<Job | null>(null)
  const [notice, setNotice] = useState("")
  const [events, setEvents] = useState<string[]>([])
  const sequence = useRef(0)
  const lock = useRef(false)
  const queued = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const links = useRef(new Set<string>())
  const running = job?.status === "排队中" || job?.status === "生成中"
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); for (const url of links.current) URL.revokeObjectURL(url) }, [])
  function log(text: string) { setEvents((previous) => [...previous, text]) }
  function create() {
    if (!access.current.canCreate || running || lock.current || queued.current) return
    queued.current = true
    const next: Job = { id: `EXP-DEMO-${String(++sequence.current).padStart(3, "0")}`, site, filter, rows: adminDemoRecords.filter((item) => filter === "全部" || item.status === filter).map((item) => ({ ...item })), status: "排队中", reason: "筛选与字段范围已固定，等待生成。" }
    setJob(next); setNotice(""); log(`${next.id} · 创建任务 · ${next.site}／${next.filter}／${next.rows.length}条／M2`)
  }
  function generate() {
    if (!job || job.status !== "排队中" || lock.current) return
    const request = job; const simulate = fail
    lock.current = true; setJob({ ...request, status: "生成中", reason: "正在生成M2脱敏示例文件。" }); setNotice("")
    timer.current = setTimeout(() => {
      const denied = !access.current.canCreate || access.current.site !== request.site
      const status = denied ? "已取消" : simulate ? "生成失败" : "可下载"
      const reason = denied ? "创建权限或当前站点范围已变化，未提供文件。" : simulate ? "模拟生成失败，未提供文件；可按当前条件创建新任务。" : "示例文件已生成；下载时仍需核对当前权限、站点和有效期。"
      setJob({ ...request, status, reason }); log(`${request.id} · ${status} · ${reason}`); setFail(false); lock.current = false; queued.current = false
    }, 700)
  }
  function csv(record: Job) {
    const quote = (value: string) => `"${value.replaceAll('"', '""')}"`
    return "\ufeff" + [["工单编号", "状态", "更新时间（UTC+8）", "联系字段（虚构脱敏示例）"], ...record.rows.map((item) => [item.id, item.status, item.time, "[已脱敏]"])].map((row) => row.map(quote).join(",")).join("\r\n")
  }
  function download() {
    if (!job) return
    const reason = job.status !== "可下载" ? `任务${job.status}，当前不允许下载。` : !access.current.canDownload ? "当前账号没有下载权限。" : access.current.site !== job.site ? "当前站点与文件归属不一致。" : ""
    if (reason) { setNotice(reason); log(`${job.id} · 下载拒绝 · ${reason}`); return }
    const url = URL.createObjectURL(new Blob([csv(job)], { type: "text/csv;charset=utf-8" })); links.current.add(url)
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${job.id}.csv`; document.body.appendChild(anchor); anchor.click(); anchor.remove()
    setTimeout(() => { URL.revokeObjectURL(url); links.current.delete(url) }, 1000)
    setNotice("已下载虚构脱敏CSV，当前任务号与筛选快照保持不变。"); log(`${job.id} · 下载成功 · ${job.site}／${job.rows.length}条／M2`)
  }
  return (
    <section id="export-task-demo" aria-label="导出任务全过程演示" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
      <p className="text-xs font-semibold text-brand-700">可操作界面示意 · 虚构工单与脱敏字段 · 不连接真实后台</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">导出任务全过程演示</h2>
      <p className="mt-3 text-sm leading-7 text-muted">本例始终允许查看虚构列表，创建与下载权限分别控制。任务保存创建时的条件，下载重新核对当前访问范围。</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><div><label htmlFor={`${uid}-site`} className="text-sm font-semibold">当前站点</label><select id={`${uid}-site`} value={site} onChange={(event) => { setSite(event.target.value); access.current.site = event.target.value }} className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"><option>站点A</option><option>站点B</option></select></div><div><label htmlFor={`${uid}-filter`} className="text-sm font-semibold">下一任务的记录状态</label><select id={`${uid}-filter`} value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">{["全部", "待处理", "已关闭"].map((value) => <option key={value}>{value}</option>)}</select></div></div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={canCreate} onChange={(event) => { setCanCreate(event.target.checked); access.current.canCreate = event.target.checked }} />允许创建导出</label><label className="flex items-center gap-2"><input type="checkbox" checked={canDownload} onChange={(event) => { setCanDownload(event.target.checked); access.current.canDownload = event.target.checked }} />允许下载文件</label><label className="flex items-center gap-2"><input type="checkbox" checked={fail} disabled={job?.status === "生成中"} onChange={(event) => setFail(event.target.checked)} />模拟一次生成失败</label></div>
      {!canCreate ? <p className="mt-3 text-sm leading-7 text-muted">当前禁止创建新导出。已完成文件的下载仍按独立权限判断。</p> : null}
      <button type="button" disabled={!canCreate || running} onClick={create} className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">创建导出任务</button>
      {job ? <div className="mt-5 rounded-lg border border-line bg-paper p-4" data-export-state={job.status}><h3 className="font-semibold text-ink">{job.id}</h3><p role="status" className="mt-2 text-sm leading-7"><strong>{job.status}</strong> · {job.reason}</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-muted">固定筛选快照</dt><dd data-export-snapshot className="mt-1">{job.site} · {job.filter} · {job.rows.length}条 · UTC+8</dd></div><div><dt className="text-muted">字段与脱敏版本</dt><dd className="mt-1">编号／状态／时间／脱敏联系字段 · M2</dd></div></dl><p className="mt-3 text-xs leading-6 text-muted">有效期为演示创建时刻T到T＋10分钟，本页用“模拟链接过期”观察拒绝路径，不使用真实计时任务。</p><div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={job.status !== "排队中"} onClick={generate} className={button}>开始生成</button><button type="button" disabled={job.status !== "排队中"} onClick={() => { queued.current = false; setJob({ ...job, status: "已取消", reason: "本例已取消排队，未生成文件。" }); log(`${job.id} · 取消排队`) }} className={button}>取消排队</button><button type="button" disabled={!["可下载", "已过期"].includes(job.status)} onClick={download} className={button}>请求下载示例CSV</button><button type="button" disabled={job.status !== "可下载"} onClick={() => { setJob({ ...job, status: "已过期", reason: "本例下载有效期已结束，需按当前条件创建新任务。" }); log(`${job.id} · 链接过期`) }} className={button}>模拟链接过期</button></div>{job.status === "可下载" || job.status === "已过期" ? <details className="mt-4 rounded-md border border-line bg-white p-3"><summary className="cursor-pointer text-sm font-semibold">查看脱敏文件示例</summary><pre className="mt-3 overflow-x-auto whitespace-pre text-xs leading-6" tabIndex={0}>{csv(job).replace(/^\ufeff/, "")}</pre></details> : null}</div> : <p className="mt-5 text-sm text-muted">尚未创建任务。</p>}
      {notice ? <p role="alert" className="mt-4 rounded-md border border-line bg-white p-3 text-sm leading-7">{notice}</p> : null}
      <details className="mt-5 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold">查看本次演示事件记录 · {events.length} 条</summary><ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-6 text-muted">{events.map((event, index) => <li key={index}>{event}</li>)}</ol></details>
      <p className="mt-4 text-xs leading-6 text-muted">这是浏览器内的说明示例，事件记录不等同于真实服务端审计。已下载文件的保存和分享需另行管理。</p>
    </section>
  )
}
