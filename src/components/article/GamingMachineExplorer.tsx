"use client"

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { machineParts, machineSteps, machineSnapshot, type MachinePart, type MachineScenario } from "@/data/gamingMachine"
import { machineMotion, restingPaperPosition, restingTicketPosition } from "./gamingMachineMotion"
import styles from "./GamingMachineExplorer.module.css"

export function GamingMachineExplorer({ art, zoom }: { art: ReactNode; zoom: Record<string, string> }) {
  const root = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [part, setPart] = useState<MachinePart>("screen")
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [scenario, setScenario] = useState<MachineScenario>("normal")
  const [recovered, setRecovered] = useState(false)
  const [closeUp, setCloseUp] = useState(false)
  const [showPartInfo, setShowPartInfo] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageActive, setPageActive] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [motionRevision, setMotionRevision] = useState(0)
  const [motionComplete, setMotionComplete] = useState(true)
  const [motionPaused, setMotionPaused] = useState(false)
  const motionAnimation = useRef<Animation | null>(null)
  const activity = useRef({ visible: false, pageActive: true, paused: false })
  activity.current = { visible, pageActive, paused: motionPaused }
  const state = machineSnapshot(step, scenario, recovered)
  const motion = useMemo(() => machineMotion(state.step, scenario), [state.step, scenario])
  // Transitional readouts use the preceding fixed snapshot, then confirm once.
  // Replaying only changes the view; it never posts another credit or ticket.
  const ledger = !motionComplete && (state.step === 2 || state.step === 7) ? machineSnapshot(state.step - 1, scenario, recovered) : state
  const paperPosition = motion && !motionComplete ? motion.paperDuring : restingPaperPosition(state.step, scenario)
  const ticketPosition = motion && !motionComplete ? motion.ticketDuring : restingTicketPosition(state.step, state.paperOut)
  const status = !motionComplete && state.step === 2 ? "纸币送入收纳箱" : !motionComplete && state.step === 7 ? "原票据正在打印" : !motionComplete && state.rejected ? "纸币识别后退回" : state.status
  const selected = machineParts.find((item) => item.id === part)!
  const explanation = state.rejected ? "这张示例纸币未被接受，已退回。余额没有增加，纸币也没有进入收纳箱。" : state.paperOut ? "原出票记录已保存105，但打印机缺纸。保留原票据号和待处理金额；补纸后处理这张票据，不再扣一次余额。" : machineSteps[state.step].explanation
  const brief = !motionComplete && state.step === 2 ? "纸币正在进入收纳通道；动作完成后，本步确认余额100。" : !motionComplete && state.step === 7 ? "原票据正在送出；105暂列待处理，完成后转为已打印。" : state.rejected ? "纸币未被接受，退回入口外；余额仍为0。" : state.paperOut ? "缺纸，105保留在原票据中；补纸后继续处理原票据。" : [
    "设备等待输入，尚未接受纸币或开始游戏。",
    "面值100的纸币正在识别，尚未入账，余额仍为0。",
    "确认接受100，纸币进入收纳箱，余额增加到100。",
    "开始请求被接受，扣除10，可用余额为90。",
    "固定示例返还15尚未入账，余额仍为90。",
    "返还15入账：100 − 10 + 15 = 105。",
    "105转入原票据，可用余额为0；记录已保存，待打印。",
    "原票据已打印105，尚未兑付。",
  ][state.step]

  function alignPanel() {
    const node = panel.current
    if (!node) return
    const box = node.getBoundingClientRect()
    const top = (document.querySelector("body > header")?.getBoundingClientRect().bottom ?? 64) + 16
    if (box.height <= window.innerHeight - top - 8 && (box.top < top - 1 || box.bottom > window.innerHeight - 8)) {
      window.scrollTo({ top: window.scrollY + box.top - top, behavior: "instant" })
    }
  }

  function choosePart(next: MachinePart) { setPlaying(false); setPart(next); setShowPartInfo(true); alignPanel() }

  const visit = useCallback((target: number) => {
    const next = machineSnapshot(target, scenario, recovered).step
    setStep(next); setReached((old) => Math.max(old, next)); setPart(machineSteps[next].part); setShowPartInfo(false)
    if (machineMotion(next, scenario) && window.innerWidth < 768) setCloseUp(true)
    setMotionPaused(false); setMotionComplete(reducedMotion || !machineMotion(next, scenario)); setMotionRevision((old) => old + 1)
  }, [scenario, recovered, reducedMotion])

  useEffect(() => {
    const svg = root.current?.querySelector("[data-machine-art]")
    svg?.setAttribute("viewBox", closeUp ? zoom[part] : "0 0 560 640")
    root.current?.querySelectorAll<SVGGElement>("[data-machine-part]").forEach((node) => node.setAttribute("data-active", String(node.dataset.machinePart === part)))
  }, [part, closeUp, zoom])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => setVisible(entries[entries.length - 1].isIntersecting), { threshold: 0.1 })
    if (panel.current) observer.observe(panel.current)
    const hide = () => { setPageActive(!document.hidden); if (document.hidden) setPlaying(false) }
    hide()
    document.addEventListener("visibilitychange", hide)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide) }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => { setReducedMotion(preference.matches); if (preference.matches) setPlaying(false) }
    update(); preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    motionAnimation.current?.cancel()
    motionAnimation.current = null
    root.current?.querySelectorAll<SVGElement>("[data-machine-moving]").forEach((node) => { node.style.transform = "" })
    if (!motion) { setMotionComplete(true); return }
    const node = root.current?.querySelector<SVGElement>(`[data-machine-moving="${motion.target}"]`)
    if (!node) { setMotionComplete(true); return }
    if (reducedMotion || typeof node.animate !== "function") {
      node.style.transform = motion.finalTransform
      setMotionComplete(true)
      return
    }
    setMotionComplete(false)
    const animation = node.animate(motion.frames, { duration: motion.duration, easing: "cubic-bezier(.35,0,.2,1)", fill: "both" })
    motionAnimation.current = animation
    if (!activity.current.visible || !activity.current.pageActive || activity.current.paused) animation.pause()
    void animation.finished.then(() => {
      node.style.transform = motion.finalTransform
      if (motionAnimation.current === animation) motionAnimation.current = null
      animation.cancel()
      setMotionComplete(true)
    }).catch(() => { /* A changed step cancels the old visual, without changing records. */ })
    return () => { animation.cancel(); if (motionAnimation.current === animation) motionAnimation.current = null }
  }, [motion, motionRevision, reducedMotion])

  useEffect(() => {
    const animation = motionAnimation.current
    if (!animation) return
    if (visible && pageActive && !motionPaused) animation.play()
    else animation.pause()
  }, [visible, pageActive, motionPaused, motion, motionRevision, reducedMotion])

  useEffect(() => {
    if (!state.canAdvance) { setPlaying(false); return }
    if (!playing || !visible || !pageActive || reducedMotion) return
    const timer = window.setTimeout(() => visit(state.step + 1), 4000)
    return () => window.clearTimeout(timer)
  }, [playing, visible, pageActive, reducedMotion, state.canAdvance, state.step, visit])

  function changeScenario(next: MachineScenario) {
    const first = next === "rejected" ? 1 : next === "paper-out" ? 6 : 0
    setPlaying(false); setScenario(next); setRecovered(false); setStep(first); setReached(first); setPart(machineSteps[first].part); setShowPartInfo(false)
    setCloseUp(first > 0 && window.innerWidth < 768)
    setMotionPaused(false); setMotionComplete(reducedMotion || !machineMotion(first, next)); setMotionRevision((old) => old + 1)
    window.requestAnimationFrame(alignPanel)
  }
  function restart() { setPlaying(false); setRecovered(false); setStep(0); setReached(0); setPart("screen"); setShowPartInfo(false); setCloseUp(false); setMotionPaused(false); setMotionComplete(true); alignPanel() }
  function replayMotion() {
    setPlaying(false); setShowPartInfo(false); setPart(machineSteps[state.step].part); setMotionPaused(false)
    if (window.innerWidth < 768) setCloseUp(true)
    setMotionComplete(reducedMotion || !motion); setMotionRevision((old) => old + 1); alignPanel()
  }

  return <section ref={root} id="machine-demo" aria-labelledby="machine-demo-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.explorer}`} data-step={state.step} data-rejected={state.rejected} data-machine-motion={motionComplete || !motion ? "idle" : visible && pageActive && !motionPaused ? "running" : "paused"} data-machine-motion-type={motion?.type ?? "none"}>
    <div className={styles.heading}><p>设备图解 · 通用原理示意</p><h2 id="machine-demo-title">先看部件，再看一笔示例怎样经过设备</h2><p>点击机柜内的部件或名称查看作用，按“下一步”观察当前处理位置、余额与票据变化。</p></div>
    <nav className={styles.links} aria-label="本文阅读入口"><a href="#machine-view">操作设备图解</a><a href="#machine-boundaries">看示意范围与资料来源</a><a href="#article-details">查看详细说明 ↓</a></nav>
    <p className={styles.notice}>这是生成式SVG通用示意，侧面打开仅为便于观察，不能对应真实型号或用作拆机图。数值均为固定虚构演示单位，不涉及真实游戏、资金或设备控制。</p>

    <div ref={panel} id="machine-view" className={styles.workbench} data-machine-panel>
      <div className={styles.panelHeader}>
        <div className={styles.figureBar}><span className={styles.panelTitle}>设备剖视 · <strong>{selected.name}</strong></span><label className={styles.mobilePart}>部件<select aria-label="选择主要部件" value={part} onChange={(event) => choosePart(event.target.value as MachinePart)}>{machineParts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><button type="button" aria-pressed={closeUp} onClick={() => { setPlaying(false); setCloseUp(!closeUp); alignPanel() }}>{closeUp ? "返回整体" : "放大当前部件"}</button></div>
        <div className={styles.partButtons} role="group" aria-label="选择主要部件" data-part-buttons>{machineParts.map((item) => <button type="button" key={item.id} aria-pressed={part === item.id} onClick={() => choosePart(item.id)}>{item.name}</button>)}</div>
      </div>
      <div className={styles.layout}>
      <div className={styles.visual}>
        <div className={`${styles.art} iso`} data-theme="light" onClick={(event) => {
          const node = (event.target as Element).closest<SVGElement>("[data-machine-part]")
          if (node && machineParts.some((item) => item.id === node.dataset.machinePart)) choosePart(node.dataset.machinePart as MachinePart)
        }}>{art}</div>
        <div className={styles.physicalTrace} aria-label="纸币位置与票据状态"><p><span data-machine-paper-position>纸币：{paperPosition}</span><span data-machine-ticket-position>票据：{ticketPosition}</span></p><button type="button" disabled={!motion} onClick={replayMotion} data-machine-replay>重播动作</button></div>
      </div>
      <div className={styles.explanation}>
        <div className={styles.readout} aria-label="当前步骤与余额" data-machine-readout data-reader-mode={showPartInfo ? "part" : "step"}>
          <div className={styles.statusLine}><span className={styles.stepLabel}>{showPartInfo ? "部件作用" : `${state.step + 1} / 8`}</span>
          <p role="status" aria-live="polite" aria-atomic="true" className={styles.status}>{showPartInfo ? selected.name : status}</p>
          </div>
          <p className={styles.stepExplanation} data-step-explanation>{showPartInfo ? selected.purpose : brief}</p>
          <dl className={styles.metrics} aria-label="余额与票据，数值为虚构演示单位"><div><dt>可用余额</dt><dd data-machine-available>{ledger.available}</dd></div><div><dt>票据待处理</dt><dd data-machine-pending>{ledger.pending}</dd></div><div><dt>已打印票据</dt><dd data-machine-printed>{ledger.printed}</dd></div></dl>
          <p className={styles.result}>本局结果：{state.result === null ? "尚未确认" : `固定示例返还 ${state.result}${state.step === 4 ? "，尚未入账" : ""}`}</p>
          {state.ticketId ? <div className={styles.ticket} data-machine-ticket><span>{state.ticketId}</span><strong>105 · {ledger.printed ? "已打印，未兑付" : state.step === 7 ? "正在打印" : "待打印"}</strong></div> : <p className={styles.unitNote}>数值均为固定虚构演示单位。</p>}
          {state.paperOut ? <div className={styles.fault} role="alert"><button type="button" onClick={() => { setRecovered(true); setPlaying(false); setShowPartInfo(false); alignPanel() }}>补纸并重试原票据</button></div> : scenario === "paper-out" && recovered && state.step === 6 ? <p className={styles.recovered} role="status">缺纸已解除，可继续打印原票据。</p> : null}
        </div>
      </div>
      </div>
      <div className={styles.panelFooter}>
        <p className={styles.footerSummary}>{state.step + 1} / 8 · {machineSteps[state.step].title}<span>固定虚构单位</span></p>
        <div className={styles.controls} data-step-controls><button type="button" disabled={state.step === 0} onClick={() => { setPlaying(false); visit(state.step - 1); alignPanel() }}>前一步</button><button type="button" className={styles.primary} disabled={!state.canAdvance} onClick={() => { setPlaying(false); visit(state.step + 1); alignPanel() }}>{state.canAdvance ? `下一步：${machineSteps[state.step + 1].title}` : state.rejected ? "本例止于退回" : state.paperOut ? "补纸后继续" : "过程已结束"}</button><button type="button" disabled={!state.canAdvance || reducedMotion} aria-pressed={playing} onClick={() => { setMotionPaused(playing); setPlaying(!playing); alignPanel() }}>{playing ? "暂停播放" : "自动播放"}</button><button type="button" onClick={restart}>从头再看</button></div>
      </div>
    </div>

    <div className={styles.partDetail} data-part-description={part}><h3>{selected.name}的作用</h3><p>{selected.purpose}</p><p className={styles.observation}>{selected.observation}</p></div>

    <div className={styles.process}>
      <div className={styles.processHeading}><h3>工作过程与异常对照</h3><span>选择已看过的步骤，回到设备面板查看</span></div>
      <ol className={styles.steps} aria-label="工作过程步骤">{machineSteps.map((item, index) => <li key={item.title}><button type="button" disabled={index > reached || (scenario === "rejected" && index > 1) || (scenario === "paper-out" && !recovered && index > 6)} aria-current={state.step === index ? "step" : undefined} onClick={() => { setPlaying(false); visit(index); window.requestAnimationFrame(alignPanel) }}><span>{index + 1}</span>{item.title}</button></li>)}</ol>
      <p className={styles.fullExplanation}>{explanation}</p>
      <fieldset className={styles.scenarios}><legend>对照另外两种情况</legend>{([{ id: "normal", label: "正常过程" }, { id: "rejected", label: "纸币退回" }, { id: "paper-out", label: "出票缺纸" }] as const).map((item) => <label key={item.id}><input type="radio" name="machine-scenario" value={item.id} checked={scenario === item.id} onChange={() => changeScenario(item.id)} />{item.label}</label>)}<p><a href="#machine-view">回到设备与步骤操作 ↑</a></p><p>选择异常会直接定位发生位置；“从头再看”可以回看前置步骤。“重播动作”只回放本步，不新增入账或票据。自动播放每4秒推进，遇异常或结束停止；选择部件或放大时暂停推进。减少动态效果时直接展示完成状态。</p></fieldset>
      <div className={styles.accounting}><h3>同一组数值，核对一次</h3><p>已接受 {ledger.accepted} + 已入账返还 {ledger.returned} = 可用 {ledger.available} + 本局扣除 {ledger.spent} + 票据待处理 {ledger.pending} + 已打印票据 {ledger.printed}</p><p>“确认结果”时的15尚未入账；“生成票据”时的105仍保留在待处理记录中。这里表示演示单位的去向，不是会计凭证或真实钱包账本。</p></div>
    </div>

    <div id="machine-boundaries" className={styles.boundaries}><h3>示意范围与资料来源</h3><p>本例选择本机游戏逻辑、纸币识别和纸质票据的讲解路径。联网、无现金、机械转轴及服务器决定结果等设备，需要各自的架构和协议资料。返还15是固定讲解值，不是概率模型、RTP或真实RNG输出。</p><p>部件功能参考 GLI-11 v3.0（2016）的控制区域、输入设备、识钞器、支付设备与票据章节，以及JCM识钞器、打印机产品说明；这些资料不证明本图结构或交易顺序对应某个型号。</p><div className={styles.links}><a href="https://gaminglabs.com/wp-content/uploads/2018/09/GLI-11-Gaming-Devices-V3-0.pdf" target="_blank" rel="noreferrer">GLI-11 v3.0 设备标准</a><a href="https://jcmglobal.com/product/ivizion/" target="_blank" rel="noreferrer">JCM 纸币识别器</a><a href="https://jcmglobal.com/product/gen5/" target="_blank" rel="noreferrer">JCM 票据打印机</a><a href="https://github.com/wheresryan22/anatomy" target="_blank" rel="noreferrer">绘图工具 Anatomy · Ryan · MIT</a></div></div>
  </section>
}
