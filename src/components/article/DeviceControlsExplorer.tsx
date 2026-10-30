"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { CheckCircle2, CircleHelp, Monitor, MousePointer2, Printer, RotateCcw, TriangleAlert } from "lucide-react"
import styles from "./DeviceControlsExplorer.module.css"

type Part = "screen" | "controls" | "printer"
type Scenario = "normal" | "busy" | "separated" | "paperout"
type Phase = "ready" | "running" | "done" | "confirm" | "paperout" | "retry" | "printed"
const ticketId = "DC-DEMO-T001"
const parts: { id: Part; label: string; observation: string }[] = [
  { id: "screen", label: "显示屏", observation: "当前状态、不能操作的原因和处理入口一起显示；文字不只依赖灯色。" },
  { id: "controls", label: "主按钮", observation: "主操作与票据操作分区。执行中暂停主按钮，完成后显示结果。" },
  { id: "printer", label: "票据出口", observation: "缺纸提示对应票据出口；补纸后重试原记录，不能新建第二张票据。" },
]
const scenarios: { id: Scenario; label: string; part: Part; phase: Phase }[] = [
  { id: "normal", label: "正常操作", part: "controls", phase: "ready" },
  { id: "busy", label: "处理中禁用", part: "controls", phase: "running" },
  { id: "separated", label: "误触隔离", part: "controls", phase: "ready" },
  { id: "paperout", label: "出票缺纸", part: "printer", phase: "paperout" },
]
const phases: Record<Phase, { title: string; message: string }> = {
  ready: { title: "就绪 · 可操作", message: "按下主按钮，观察请求与处理状态。" },
  running: { title: "正在执行 · 主按钮暂停", message: "请求已受理，请等待当前操作结束。再次按下不会新建请求。" },
  done: { title: "执行完成", message: "结果已显示。票据操作在独立区域，可按需查看。" },
  confirm: { title: "确认输出示例票据", message: "确认后才创建票据记录；取消会回到原状态。" },
  paperout: { title: "缺纸 · 原票据待处理", message: "票据尚未打印。请联系工作人员补纸，再重试原记录。" },
  retry: { title: "纸张已补充 · 可重试", message: "保留原票据号，继续完成这一次输出。" },
  printed: { title: "原票据已打印", message: "从出口取走同一张示例票据。本例输出不含金额。" },
}

export function DeviceControlsExplorer({ art, overview, zoom }: { art: ReactNode; overview: ReactNode; zoom: Record<Part, string> }) {
  const [part, setPart] = useState<Part>("controls")
  const [scenario, setScenario] = useState<Scenario>("normal")
  const [phase, setPhase] = useState<Phase>("ready")
  const [beforeConfirm, setBeforeConfirm] = useState<Phase>("ready")
  const [requests, setRequests] = useState(0)
  const [hasTicket, setHasTicket] = useState(false)
  const [hint, setHint] = useState("选择上方情景，或试按下面板的主按钮。")
  const benchRef = useRef<HTMLDivElement>(null)
  const mainArtRef = useRef<HTMLDivElement>(null)
  const overviewRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const mainButtonRef = useRef<HTMLButtonElement>(null)
  const ticketButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)
  const recoveryButtonRef = useRef<HTMLButtonElement>(null)
  const selected = parts.find((item) => item.id === part)!
  const current = phases[phase]
  const fault = phase === "paperout" || phase === "retry"

  useEffect(() => {
    const svg = mainArtRef.current?.querySelector("svg")
    if (svg) svg.setAttribute("viewBox", zoom[part])
    for (const root of [mainArtRef.current, overviewRef.current]) {
      root?.querySelectorAll<SVGGElement>("[data-machine-part]").forEach((el) => {
        el.dataset.controlActive = String(el.dataset.machinePart === part)
      })
    }
  }, [part, zoom])

  function alignBench() {
    requestAnimationFrame(() => {
      const panel = benchRef.current
      if (!panel) return
      const top = (document.querySelector("header")?.getBoundingClientRect().height ?? 64) + 12
      const bounds = panel.getBoundingClientRect()
      if (bounds.height <= window.innerHeight - top - 12 && (bounds.top < top || bounds.bottom > window.innerHeight)) {
        window.scrollBy({ top: bounds.top - top, behavior: "instant" })
      }
    })
  }

  function choosePart(next: Part) { setPart(next); setHint(parts.find((item) => item.id === next)!.observation); alignBench() }
  function chooseScenario(next: Scenario) {
    const scene = scenarios.find((item) => item.id === next)!
    setScenario(next); setPart(scene.part); setPhase(scene.phase)
    setRequests(next === "busy" ? 1 : 0); setHasTicket(next === "paperout")
    setHint(next === "separated" ? "主操作和票据操作分开；点击票据按钮后仍需确认。" : next === "paperout" ? "原票据保留。按下补纸，再重试同一记录。" : "试按操作面板，查看请求与屏幕如何对应。")
    alignBench()
  }

  function begin() {
    if (phase !== "ready") return
    setRequests(1); setPhase("running"); setPart("screen")
    setHint("主按钮已暂停，已受理请求仍为1次。点击下方“查看完成状态”继续。")
  }
  function requestTicket() {
    if (phase !== "ready" && phase !== "done") return
    setBeforeConfirm(phase); setPhase("confirm"); setPart("printer")
    setHint("当前只有确认提示，还没有创建票据。可以取消并返回。")
    requestAnimationFrame(() => confirmButtonRef.current?.focus({ preventScroll: true }))
  }
  function confirmTicket() {
    setHasTicket(true); setPhase("printed"); setHint("只创建并打印一次示例票据，编号保持一致。")
    requestAnimationFrame(() => screenRef.current?.focus({ preventScroll: true }))
  }
  function cancelTicket() {
    setPhase(beforeConfirm); setHint("已取消，票据记录没有增加。")
    requestAnimationFrame(() => ticketButtonRef.current?.focus({ preventScroll: true }))
  }
  function complete() {
    setPhase("done"); setHint("执行结果已经显示，主操作不会再次发送同一个请求。")
    requestAnimationFrame(() => screenRef.current?.focus({ preventScroll: true }))
  }
  function recover() {
    if (phase === "paperout") { setPhase("retry"); setHint("已模拟补纸，原票据号不变。下一步重试原票据。") }
    else if (phase === "retry") { setPhase("printed"); setHint("重试完成；仍为原票据，没有新增第二张。") }
    requestAnimationFrame(() => (phase === "paperout" ? recoveryButtonRef.current : screenRef.current)?.focus({ preventScroll: true }))
  }

  return <section id="device-controls-demo" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.guide}`} aria-labelledby="device-controls-title">
    <div className={styles.heading}><p>设备人机操作 · 通用示意</p><h2 id="device-controls-title">看清操作位置，再看设备怎样回应</h2><p>选择屏幕、主按钮或票据出口，再切换四种情景。下方面板可以操作，机柜局部同步高亮。</p></div>
    <p className={styles.notice}>机柜复用现有结构示意；面板、提示和记录为独立演示，不对应具体设备型号或工程尺寸。</p>
    <div ref={benchRef} id="device-controls-view" className={styles.workbench} data-device-phase={phase} data-device-scenario={scenario}>
      <nav className={styles.scenarios} aria-label="设备操作情景">{scenarios.map((item) => <button key={item.id} type="button" aria-pressed={scenario === item.id} onClick={() => chooseScenario(item.id)}>{item.label}</button>)}</nav>
      <div className={styles.partButtons} role="group" aria-label="查看设备部位">{parts.map((item) => <button key={item.id} type="button" aria-pressed={part === item.id} onClick={() => choosePart(item.id)}>{item.id === "screen" ? <Monitor size={16} aria-hidden="true" /> : item.id === "printer" ? <Printer size={16} aria-hidden="true" /> : <MousePointer2 size={16} aria-hidden="true" />}{item.label}</button>)}</div>
      <div className={styles.layout}>
        <figure className={styles.figure}>
          <div className={styles.figureTitle}><strong>{selected.label} · 局部位置</strong><span>点击图中部件可切换</span></div>
          <div ref={mainArtRef} className={styles.art} data-device-main-art onClick={(event) => {
            const group = (event.target as Element).closest<SVGGElement>("[data-machine-part]")
            const next = group?.dataset.machinePart
            if (next === "screen" || next === "controls" || next === "printer") choosePart(next)
          }}>{art}</div>
          <figcaption className={styles.figureCaption}><div ref={overviewRef} className={`${styles.art} ${styles.overview}`} aria-hidden="true">{overview}</div><p>{selected.observation}</p></figcaption>
        </figure>
        <div className={styles.panel} aria-label="可操作的设备面板示意" data-device-panel>
          <div className={styles.panelLabel}>操作面板 · 示例设备</div>
          <div ref={screenRef} tabIndex={-1} className={styles.screen} data-device-screen data-fault={fault} aria-live="polite" aria-atomic="true">
            <div className={styles.screenState}>{fault ? <TriangleAlert size={18} aria-hidden="true" /> : phase === "done" || phase === "printed" ? <CheckCircle2 size={18} aria-hidden="true" /> : <Monitor size={18} aria-hidden="true" />}<strong>{current.title}</strong></div>
            <p>{current.message}</p>
            <dl><div><dt>操作请求</dt><dd>{requests} 次</dd></div><div><dt>票据记录</dt><dd>{hasTicket ? "1 张" : "0 张"}</dd></div></dl>
            {hasTicket ? <div className={styles.ticketRecord}><span>{ticketId}</span><b>{phase === "printed" ? "已打印" : "待打印"}</b></div> : null}
          </div>
          {phase === "confirm" ? <div className={styles.confirm} role="group" aria-label="确认示例票据"><strong>输出一张无金额样张？</strong><p>取消不会创建票据记录。</p><div><button type="button" ref={confirmButtonRef} onClick={confirmTicket}>确认输出</button><button type="button" onClick={cancelTicket}>取消</button></div></div> : <div className={styles.controlDeck}>
            <div className={styles.mainArea}><span>主操作区</span><button ref={mainButtonRef} type="button" className={styles.mainButton} onClick={begin} disabled={phase !== "ready"}>{phase === "running" ? "执行中 · 请等待" : phase === "done" ? "本次已完成" : phase === "ready" ? "开始演示" : "主操作暂停"}</button></div>
            <div className={styles.outputArea}><span>票据操作区</span><button ref={ticketButtonRef} type="button" onClick={requestTicket} disabled={phase !== "ready" && phase !== "done"}>输出示例票据</button><div className={styles.outputSlot} data-ticket-visible={phase === "printed"}><span>{phase === "printed" ? "示例票据" : "票据出口"}</span></div></div>
          </div>}
        </div>
      </div>
      <div className={styles.footer}><p role="status" data-device-explanation>{hint}</p><div className={styles.actions} data-device-actions>
        {phase === "running" ? <button type="button" className={styles.primary} onClick={complete}>查看完成状态</button> : fault ? <button type="button" ref={recoveryButtonRef} className={styles.primary} onClick={recover}>{phase === "paperout" ? "模拟补纸" : "重试原票据"}</button> : <button type="button" className={styles.primary} onClick={() => chooseScenario("normal")}><RotateCcw size={15} aria-hidden="true" />从就绪重看</button>}
        <button type="button" onClick={() => { setPart("screen"); setHint("状态、原因与可执行动作都在屏幕附近；图中高亮显示屏位置。") }}><CircleHelp size={15} aria-hidden="true" />提示在哪里</button>
      </div></div>
    </div>
    <div className={styles.takeaways}><div><strong>位置对应</strong><p>屏幕讲状态，主按钮执行操作，票据出口交付纸张。提示应让人知道下一步看哪里。</p></div><div><strong>操作分区</strong><p>主操作与票据操作分开，额外输出需要确认；取消后保留原状态。</p></div><div><strong>异常可恢复</strong><p>缺纸时保留原票据号，补纸与打印分开表达，恢复后完成同一条记录。</p></div></div>
    <div className={styles.links}><Link href="/articles/electronic-gaming-machine#machine-view">查看完整机柜与工作过程 →</Link><a href="#article-details">查看详细说明 ↓</a></div>
  </section>
}
