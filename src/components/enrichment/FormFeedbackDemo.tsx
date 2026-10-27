"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"

type Phase = "editing" | "submitting" | "unknown" | "querying" | "rejected" | "accepted"
export function FormFeedbackDemo() {
  const uid = useId()
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [errors, setErrors] = useState({ title: "", summary: "" })
  const [outcome, setOutcome] = useState("unknown")
  const [phase, setPhase] = useState<Phase>("editing")
  const [attempts, setAttempts] = useState(0)
  const titleRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLTextAreaElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busy = useRef(false)
  const locked = phase !== "editing" && phase !== "rejected"
  const pending = phase === "submitting" || phase === "querying"
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  function submit(event: FormEvent) {
    event.preventDefault()
    if (busy.current || locked) return
    const next = {
      title: title.trim().length < 4 || title.trim().length > 40 ? "标题需要 4–40 个字符。" : "",
      summary: summary.trim().length < 10 || summary.trim().length > 120 ? "摘要需要 10–120 个字符。" : "",
    }
    setErrors(next)
    if (next.title || next.summary) { (next.title ? titleRef : summaryRef).current?.focus(); return }
    busy.current = true
    setAttempts((value) => value + 1); setPhase("submitting")
    timer.current = setTimeout(() => { setPhase(outcome === "accepted" ? "accepted" : outcome === "rejected" ? "rejected" : "unknown"); busy.current = false }, 750)
  }
  return (
    <section id="form-demo" aria-label="表单校验与提交演示" className="container-shell mb-8 max-w-6xl scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
      <p className="text-xs font-semibold text-brand-700">可操作界面示意 · 虚构申请 · 不发布真实公告</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">表单校验与提交演示</h2>
      <p className="mt-3 text-sm leading-7 text-muted">本例填写公告申请。先空白提交查看字段反馈，再填写内容并选择响应情形，观察可执行动作。</p>
      <div className="mt-5"><label htmlFor={`${uid}-outcome`} className="text-sm font-semibold text-ink">演示响应</label><select id={`${uid}-outcome`} value={outcome} disabled={locked} onChange={(event) => setOutcome(event.target.value)} className="mt-2 block w-full rounded-md border border-line px-3 py-2 font-normal disabled:bg-paper"><option value="unknown">响应超时，结果未知</option><option value="accepted">明确已受理</option><option value="rejected">明确未受理</option></select></div>
      <form noValidate onSubmit={submit} className="mt-5 space-y-4" aria-busy={pending}>
        <div><label htmlFor={`${uid}-title`} className="text-sm font-semibold text-ink">公告标题</label><p id={`${uid}-title-help`} className="mt-1 text-xs leading-6 text-muted">本例要求 4–40 个字符，例如“帮助中心内容更新”。</p><input ref={titleRef} id={`${uid}-title`} value={title} disabled={locked} required aria-invalid={!!errors.title} aria-describedby={`${uid}-title-help${errors.title ? ` ${uid}-title-error` : ""}`} onChange={(event) => { setTitle(event.target.value); if (errors.title) setErrors({ ...errors, title: "" }) }} className="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm disabled:bg-paper" />{errors.title ? <p id={`${uid}-title-error`} className="mt-2 text-sm font-semibold text-red-800">{errors.title}</p> : null}</div>
        <div><label htmlFor={`${uid}-summary`} className="text-sm font-semibold text-ink">内容摘要</label><p id={`${uid}-summary-help`} className="mt-1 text-xs leading-6 text-muted">本例要求 10–120 个字符，说明内容范围与变化。</p><textarea ref={summaryRef} id={`${uid}-summary`} value={summary} rows={3} disabled={locked} required aria-invalid={!!errors.summary} aria-describedby={`${uid}-summary-help${errors.summary ? ` ${uid}-summary-error` : ""}`} onChange={(event) => { setSummary(event.target.value); if (errors.summary) setErrors({ ...errors, summary: "" }) }} className="mt-2 w-full resize-y rounded-md border border-line px-3 py-2 text-sm disabled:bg-paper" />{errors.summary ? <p id={`${uid}-summary-error`} className="mt-2 text-sm font-semibold text-red-800">{errors.summary}</p> : null}</div>
        {errors.title || errors.summary ? <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm leading-7 text-red-800">请修改标出的字段后提交。当前填写内容已保留，尚未发送申请。</p> : null}
        <div className="flex flex-wrap gap-3"><button type="submit" disabled={locked} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{phase === "submitting" ? "提交中…" : "提交演示申请"}</button>{phase === "unknown" || phase === "querying" ? <button type="button" disabled={pending} onClick={() => { if (busy.current) return; busy.current = true; setPhase("querying"); timer.current = setTimeout(() => { setPhase("accepted"); busy.current = false }, 650) }} className="rounded-md border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-700 disabled:opacity-50">{phase === "querying" ? "查询中…" : "查询原申请结果"}</button> : null}<button type="button" disabled={pending} onClick={() => { setTitle(""); setSummary(""); setErrors({ title: "", summary: "" }); setPhase("editing"); setAttempts(0); setOutcome("unknown"); requestAnimationFrame(() => titleRef.current?.focus()) }} className="rounded-md border border-line px-4 py-2 text-sm disabled:opacity-50">重置演示</button></div>
      </form>
      <div role="status" data-form-phase={phase} className="mt-5 rounded-lg border border-line bg-paper p-4 text-sm leading-7 text-ink">
        <p className="font-semibold">{({ editing: "填写中：尚未发送申请", submitting: "提交中：等待本次响应", unknown: "响应超时：提交结果未知", querying: "查询中：核对原申请", rejected: "明确未受理：内容范围需要补充", accepted: "已受理：等待审核" })[phase]}</p>
        {attempts > 0 ? <p className="mt-2">原申请号：<strong>DEMO-ANN-001</strong> · 提交次数：<strong data-submit-attempts>{attempts}</strong></p> : null}
        <p className="mt-2 text-muted">{phase === "unknown" ? "保留原内容和申请号，暂停再次提交。查询原申请结果后再决定下一步。重置仅用于重新体验演示，不是业务重试。" : phase === "accepted" ? "申请已受理，公告尚未发布。查询原申请不会增加提交次数；审核与发布状态需独立跟踪。" : phase === "rejected" ? "本例已明确没有受理。原内容保留，可补充摘要后再次提交；真实系统仍需重新校验权限和业务状态。" : pending ? "当前操作完成前暂停提交和重置，避免同一动作重复发送。" : "字段校验只判断本例的格式要求。实际权限、内容规则和业务状态由服务端再次检查。"}</p>
      </div>
    </section>
  )
}
