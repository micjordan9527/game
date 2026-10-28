"use client"

import { useId, useReducer, useState } from "react"

type Phase = "草稿" | "待审核" | "已驳回" | "已审核" | "待生效" | "发布失败" | "已生效" | "已撤回" | "已到期"
type Draft = { version: number; site: string; language: string; title: string; body: string; checked: boolean; correctionOf?: number; reason: string }
type Published = Omit<Draft, "checked"> & { state: "生效" | "历史" | "撤回" | "到期"; expires?: number }
type Task = { version: number; site: string; language: string; signature: string; due: number; status: "待执行" | "已完成" | "失败" | "已失效" }
type State = { draft: Draft; phase: Phase; approval: string | null; clock: number; task: Task | null; fail: boolean; published: Published[]; front: Record<string, Published>; reads: { scope: string; version: number }[]; events: string[]; notice: string }
type Event = { type: "change"; field: "site" | "language" | "title" | "body" | "checked" | "reason"; value: string | boolean } | { type: "submit" | "approve" | "reject" | "revise" | "schedule" | "publish" | "advance" | "withdraw" | "reset" } | { type: "fail"; value: boolean } | { type: "refresh" | "read"; site: string; language: string }
const scope = (item: { site: string; language: string }) => `${item.site} / ${item.language}`
const signature = (draft: Draft) => JSON.stringify(draft)
const text = { 中文: { title: "帮助中心订单说明", body: "查询订单时，请保留原申请号并核对当前状态。" }, English: { title: "Order help update", body: "Keep the original request ID and check the current order status." } }
function initial(): State {
  const published: Published[] = ["中文", "English"].map((language) => ({ version: 3, site: "站点A", language, ...text[language as keyof typeof text], reason: "", state: "生效" }))
  return { draft: { version: 4, site: "站点A", language: "中文", ...text.中文, checked: true, reason: "" }, phase: "草稿", approval: null, clock: 0, task: null, fail: false, published, front: Object.fromEntries(published.map((item) => [scope(item), { ...item }])), reads: [], events: [], notice: "编辑中文v4；站点A的中文与英文当前均为v3。" }
}
const liveFor = (s: State, target: { site: string; language: string }) => s.published.findLast((item) => scope(item) === scope(target) && item.state === "生效")
function record(s: State, message: string): State { return { ...s, notice: message, events: [...s.events, `T+${s.clock}分钟 · ${message}`] } }
function publish(s: State): State {
  if (s.approval !== signature(s.draft)) return record({ ...s, phase: "草稿", approval: null, task: s.task ? { ...s.task, status: "已失效" } : null }, "当前稿件与审核版本不一致，停止发布，请重新审核。")
  if (s.fail) return record({ ...s, phase: "发布失败", fail: false, task: s.task ? { ...s.task, status: "失败" } : null }, `v${s.draft.version}本次发布失败，原生效版本保留；未更新前台。`)
  const item: Published = { ...s.draft, state: "生效", expires: s.clock + 30 }
  const previous = s.published.map((old) => scope(old) === scope(item) && old.state === "生效" ? { ...old, state: "历史" as const } : old)
  return record({ ...s, phase: "已生效", published: [...previous, item], task: s.task ? { ...s.task, status: "已完成" } : null }, `${scope(item)}的v${item.version}已生效；前台快照需要单独刷新核对。`)
}
function reducer(s: State, event: Event): State {
  if (event.type === "reset") return initial()
  if (event.type === "fail") return { ...s, fail: event.value }
  if (event.type === "change") {
    if (!["草稿", "已驳回"].includes(s.phase)) return s
    let draft = { ...s.draft, [event.field]: event.value } as Draft
    if (event.field === "language") draft = { ...draft, ...text[draft.language as keyof typeof text], checked: false }
    return { ...s, draft, approval: null, phase: "草稿" }
  }
  if (event.type === "submit") {
    if (!["草稿", "已驳回"].includes(s.phase)) return s
    if (!s.draft.title.trim() || !s.draft.body.trim()) return record(s, "请填写标题和正文，尚未提交审核。")
    if (!s.draft.checked) return record(s, "请先核对目标语言内容，尚未提交审核。")
    if (s.draft.correctionOf && !s.draft.reason.trim()) return record(s, "请填写更正原因，原版本继续保留。")
    return record({ ...s, phase: "待审核" }, `v${s.draft.version}已送审；申请送审不等于内容发布。`)
  }
  if (event.type === "approve" || event.type === "reject") {
    if (s.phase !== "待审核") return s
    return event.type === "approve" ? record({ ...s, phase: "已审核", approval: signature(s.draft) }, `示例审核员批准v${s.draft.version}，范围为${scope(s.draft)}。`) : record({ ...s, phase: "已驳回", approval: null }, "审核驳回：请补充内容与适用范围，可修改后重新送审。")
  }
  if (event.type === "revise") {
    if (["草稿", "待审核", "已驳回"].includes(s.phase)) return s
    const published = s.published.find((item) => item.version === s.draft.version && scope(item) === scope(s.draft))
    const correctionOf = published?.version ?? s.draft.correctionOf
    return record({ ...s, draft: { ...s.draft, version: s.draft.version + 1, correctionOf, reason: correctionOf ? "修正帮助链接" : "" }, phase: "草稿", approval: null, task: s.task?.status === "待执行" ? { ...s.task, status: "已失效" } : s.task }, `建立v${s.draft.version + 1}草稿，原批准不沿用；待执行任务失效，已发布历史保留。`)
  }
  if (event.type === "schedule") {
    if (!["已审核", "发布失败"].includes(s.phase) || s.approval !== signature(s.draft)) return s
    return record({ ...s, phase: "待生效", task: { version: s.draft.version, site: s.draft.site, language: s.draft.language, signature: s.approval, due: s.clock + 10, status: "待执行" } }, `安排v${s.draft.version}于T+${s.clock + 10}分钟执行，仅由本页按钮推进演示时间。`)
  }
  if (event.type === "publish") return ["已审核", "发布失败"].includes(s.phase) ? publish(s) : s
  if (event.type === "advance") {
    let next = { ...s, clock: s.clock + 10 }
    const taskRan = next.task?.status === "待执行" && next.clock >= next.task.due
    if (next.task?.status === "待执行" && next.clock >= next.task.due) {
      next = next.task.version === next.draft.version && next.task.signature === signature(next.draft) && next.approval === next.task.signature ? publish(next) : record({ ...next, phase: "草稿", approval: null, task: { ...next.task, status: "已失效" } }, "计划任务版本或审核不匹配，未发布。")
    }
    let expired = false
    const published = next.published.map((item) => {
      if (item.state !== "生效" || item.expires === undefined || item.expires > next.clock) return item
      if (item.version === next.draft.version && scope(item) === scope(next.draft)) expired = true
      return { ...item, state: "到期" as const }
    })
    const advanced = { ...next, published, phase: expired ? "已到期" as const : next.phase }
    return expired ? record(advanced, "当前版本已到期，前台停止展示，历史与阅读记录保留。") : taskRan ? advanced : record(advanced, "演示时间已推进10分钟。")
  }
  if (event.type === "withdraw") {
    if (s.phase !== "已生效") return s
    return record({ ...s, phase: "已撤回", published: s.published.map((item) => scope(item) === scope(s.draft) && item.version === s.draft.version ? { ...item, state: "撤回" } : item) }, `撤回${scope(s.draft)}的v${s.draft.version}，前台停止展示；保留历史证据。`)
  }
  if (event.type === "refresh") {
    const item = liveFor(s, event), key = scope(event), front = { ...s.front }
    if (item) front[key] = { ...item }; else delete front[key]
    return record({ ...s, front }, item ? `前台快照刷新为${key}的v${item.version}。` : `${key}当前没有生效内容，前台不展示。`)
  }
  if (event.type === "read") {
    const key = scope(event), item = s.front[key]
    if (!item || !liveFor(s, event)) return record(s, "当前没有可展示内容，不补写阅读记录。")
    return record({ ...s, reads: [...s.reads, { scope: key, version: item.version }] }, `记录一次前台展示：${key}的v${item.version}；不表示用户理解或同意。`)
  }
  return s
}
const button = "rounded-md border border-line px-3 py-2 text-sm font-semibold disabled:opacity-40"
const input = "mt-2 block w-full rounded-md border border-line bg-white px-3 py-2 text-sm disabled:bg-paper"

export function PublicationLifecycleDemo() {
  const [s, dispatch] = useReducer(reducer, undefined, initial)
  const [view, setView] = useState({ site: "站点A", language: "中文" })
  const uid = useId(), editable = ["草稿", "已驳回"].includes(s.phase), approved = ["已审核", "发布失败"].includes(s.phase)
  const live = liveFor(s, view), front = live ? s.front[scope(view)] : undefined
  const change = (field: "site" | "language" | "title" | "body" | "checked" | "reason", value: string | boolean) => dispatch({ type: "change", field, value })
  return <section id="publication-demo" aria-label="公告审核与发布演示" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
    <p className="text-sm font-semibold text-brand-700">可操作示例 · 虚构内容 · 浏览器本页状态</p><h2 className="mt-2 text-2xl font-semibold">公告审核与发布演示</h2><p className="mt-3 text-sm leading-7 text-muted">先送审、审核，再立即发布或安排定时。时间只由“推进10分钟”按钮改变，不会自动向真实网站发布。示例审核员不代表实际鉴权与独立审批服务。</p>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <div className="min-w-0 rounded-lg border border-line p-4"><h3 className="font-semibold">编辑端 · CNT-DEMO-001</h3><p data-publication-phase className="mt-2 text-sm font-semibold">v{s.draft.version} · {s.phase}</p>
        <fieldset disabled={!editable} className="mt-4 space-y-3"><legend className="text-sm font-semibold">本次稿件与范围</legend><div className="block text-sm"><label htmlFor={`${uid}-draft-site`}> 发布站点</label><select id={`${uid}-draft-site`} className={input} value={s.draft.site} onChange={(e) => change("site", e.target.value)}><option>站点A</option><option>站点B</option></select></div><div className="block text-sm"><label htmlFor={`${uid}-draft-language`}> 稿件语言</label><select id={`${uid}-draft-language`} className={input} value={s.draft.language} onChange={(e) => change("language", e.target.value)}><option>中文</option><option>English</option></select></div><label className="block text-sm">内容标题<input className={input} value={s.draft.title} onChange={(e) => change("title", e.target.value)} /></label><label className="block text-sm">内容正文<textarea className={input} rows={3} value={s.draft.body} onChange={(e) => change("body", e.target.value)} /></label><label className="flex items-start gap-2 text-sm leading-7"><input type="checkbox" checked={s.draft.checked} onChange={(e) => change("checked", e.target.checked)} className="mt-2" />已核对本次目标语言内容（演示确认）</label>{s.draft.correctionOf ? <><p className="text-sm">更正来源：v{s.draft.correctionOf}</p><label className="block text-sm">更正原因<input className={input} value={s.draft.reason} onChange={(e) => change("reason", e.target.value)} /></label></> : null}</fieldset>
        <p className="mt-3 text-sm leading-7 text-muted">规则R7 · 本例每次生效后有效30分钟；站点和语言分别发布。</p>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className={button} disabled={!editable} onClick={() => dispatch({ type: "submit" })}>提交审核</button><button type="button" className={button} disabled={s.phase !== "待审核"} onClick={() => dispatch({ type: "approve" })}>审核通过（示例审核员）</button><button type="button" className={button} disabled={s.phase !== "待审核"} onClick={() => dispatch({ type: "reject" })}>审核驳回</button><button type="button" className={button} disabled={["草稿", "待审核", "已驳回"].includes(s.phase)} onClick={() => dispatch({ type: "revise" })}>{["已生效", "已撤回", "已到期"].includes(s.phase) ? "建立更正版本" : "修改稿件并重新审核"}</button></div>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className={button} disabled={!approved} onClick={() => dispatch({ type: "publish" })}>立即发布已审核版本</button><button type="button" className={button} disabled={!approved} onClick={() => dispatch({ type: "schedule" })}>安排10分钟后生效</button><button type="button" className={button} disabled={s.phase !== "已生效"} onClick={() => dispatch({ type: "withdraw" })}>撤回当前版本</button></div>
      </div>
      <div className="min-w-0 space-y-4"><div className="rounded-lg border border-line bg-paper p-4"><h3 className="font-semibold">演示时间与计划任务</h3><p data-publication-clock className="mt-2 text-lg font-semibold">T+{s.clock}分钟</p><p data-publication-task className="mt-2 text-sm leading-7">{s.task ? `v${s.task.version} · ${s.task.site} / ${s.task.language} · T+${s.task.due}分钟 · ${s.task.status}` : "尚无计划任务"}</p><button type="button" className={button + " mt-3"} onClick={() => dispatch({ type: "advance" })}>推进10分钟</button><label htmlFor={uid} className="mt-3 flex items-start gap-2 text-sm leading-7"><input id={uid} type="checkbox" checked={s.fail} onChange={(e) => dispatch({ type: "fail", value: e.target.checked })} className="mt-2" />模拟下一次发布失败</label></div>
        <div className="rounded-lg border border-line p-4"><h3 className="font-semibold">前台查看与版本核对</h3><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="text-sm"><label htmlFor={`${uid}-front-site`}> 前台站点</label><select id={`${uid}-front-site`} className={input} value={view.site} onChange={(e) => setView({ ...view, site: e.target.value })}><option>站点A</option><option>站点B</option></select></div><div className="text-sm"><label htmlFor={`${uid}-front-language`}> 前台语言</label><select id={`${uid}-front-language`} className={input} value={view.language} onChange={(e) => setView({ ...view, language: e.target.value })}><option>中文</option><option>English</option></select></div></div><p data-publication-live className="mt-4 text-sm font-semibold">后台生效：{live ? `v${live.version}` : "无"}</p><div data-publication-front className="mt-3 rounded-md border border-line bg-paper p-3 text-sm leading-7"><strong>前台可见：{front ? `v${front.version}` : "无"}</strong>{front ? <><h4 className="mt-2 font-semibold">{front.title}</h4><p className="mt-2">{front.body}</p></> : <p>当前无可见内容；撤回和到期不会自动恢复旧历史版本。</p>}</div><div className="mt-3 flex flex-wrap gap-2"><button type="button" className={button} onClick={() => dispatch({ type: "refresh", ...view })}>刷新前台快照</button><button type="button" className={button} disabled={!front} onClick={() => dispatch({ type: "read", ...view })}>记录当前可见版本</button></div><p className="mt-3 text-sm leading-7 text-muted">前台快照是刻意保留的本地旧版本示例。真实系统需验证缓存失效、访问校验和目标页面；这里的撤回与到期在本页展示时直接拦截。</p></div>
      </div>
    </div>
    <p role="status" className="mt-5 rounded-md bg-brand-50 p-4 text-sm leading-7">{s.notice}</p>
    <details className="mt-4 rounded-lg border border-line p-4"><summary className="cursor-pointer text-sm font-semibold">查看版本、阅读与本次操作记录</summary><h3 className="mt-4 text-sm font-semibold">版本历史</h3><ul data-publication-history className="mt-2 space-y-2 text-sm leading-7">{s.published.map((item) => <li key={`${scope(item)}-${item.version}`}>{scope(item)} · v{item.version} · {item.state}{item.correctionOf ? ` · 更正v${item.correctionOf}：${item.reason}` : ""}</li>)}</ul><h3 className="mt-4 text-sm font-semibold">阅读记录（仅表示本例记录了展示）</h3><ul data-publication-reads className="mt-2 space-y-2 text-sm leading-7">{s.reads.map((item, i) => <li key={i}>{item.scope} · v{item.version}</li>)}</ul><h3 className="mt-4 text-sm font-semibold">本次操作</h3><ol className="mt-2 space-y-2 text-sm leading-7">{s.events.map((item, i) => <li key={i}>{item}</li>)}</ol></details>
    <button type="button" className={button + " mt-4"} onClick={() => { dispatch({ type: "reset" }); setView({ site: "站点A", language: "中文" }) }}>重置发布演示</button>
    <p className="mt-3 text-sm leading-7 text-muted">刷新页面会重置；不提供真实定时任务、访问授权、翻译审核、缓存服务或持久审计。</p>
  </section>
}
