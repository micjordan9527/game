"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { machineParts, machineSteps, machineSnapshot, type MachinePart, type MachineScenario } from "@/data/gamingMachine"
import styles from "./GamingMachineExplorer.module.css"

export function GamingMachineExplorer({ art, zoom }: { art: ReactNode; zoom: Record<string, string> }) {
  const root = useRef<HTMLElement>(null)
  const [part, setPart] = useState<MachinePart>("screen")
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [scenario, setScenario] = useState<MachineScenario>("normal")
  const [recovered, setRecovered] = useState(false)
  const [closeUp, setCloseUp] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const state = machineSnapshot(step, scenario, recovered)
  const selected = machineParts.find((item) => item.id === part)!
  const explanation = state.rejected ? "这张示例纸币未被接受，已退回。余额没有增加，纸币也没有进入收纳箱。" : state.paperOut ? "原出票记录已保存105，但打印机缺纸。保留原票据号和待处理金额；补纸后处理这张票据，不再扣一次余额。" : machineSteps[state.step].explanation

  const visit = useCallback((target: number) => {
    const next = machineSnapshot(target, scenario, recovered).step
    setStep(next); setReached((old) => Math.max(old, next)); setPart(machineSteps[next].part)
  }, [scenario, recovered])

  useEffect(() => {
    const svg = root.current?.querySelector("[data-machine-art]")
    svg?.setAttribute("viewBox", closeUp ? zoom[part] : "0 0 560 640")
    root.current?.querySelectorAll<SVGGElement>("[data-machine-part]").forEach((node) => node.setAttribute("data-active", String(node.dataset.machinePart === part)))
  }, [part, closeUp, zoom])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    if (root.current) observer.observe(root.current)
    const hide = () => { if (document.hidden) setPlaying(false) }
    document.addEventListener("visibilitychange", hide)
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hide) }
  }, [])

  useEffect(() => {
    if (!state.canAdvance) { setPlaying(false); return }
    if (!playing || !visible) return
    const timer = window.setTimeout(() => visit(state.step + 1), 4000)
    return () => window.clearTimeout(timer)
  }, [playing, visible, state.canAdvance, state.step, visit])

  function changeScenario(next: MachineScenario) {
    const first = next === "rejected" ? 1 : next === "paper-out" ? 6 : 0
    setPlaying(false); setScenario(next); setRecovered(false); setStep(first); setReached(first); setPart(machineSteps[first].part)
  }
  function restart() { setPlaying(false); setRecovered(false); setStep(0); setReached(0); setPart("screen") }

  return <section ref={root} id="machine-demo" aria-labelledby="machine-demo-title" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.explorer}`} data-step={state.step} data-rejected={state.rejected}>
    <div className={styles.heading}><p>设备图解 · 通用原理示意</p><h2 id="machine-demo-title">先看部件，再看一笔示例怎样经过设备</h2><p>点击机柜内的部件或名称查看作用，按“下一步”观察当前处理位置、余额与票据变化。</p></div>
    <nav className={styles.links} aria-label="本文阅读入口"><a href="#machine-demo">操作设备图解</a><a href="#machine-boundaries">看示意范围与资料来源</a><a href="#article-details">查看详细说明 ↓</a></nav>
    <p className={styles.notice}>这是生成式SVG通用示意，侧面打开仅为便于观察，不能对应真实型号或用作拆机图。数值均为固定虚构演示单位，不涉及真实游戏、资金或设备控制。</p>

    <div className={styles.layout}>
      <div id="machine-view" className={styles.visual}>
        <div className={styles.figureBar}><span>01 · 设备剖视</span><button type="button" aria-pressed={closeUp} onClick={() => setCloseUp(!closeUp)}>{closeUp ? "返回整体" : "放大当前部件"}</button></div>
        <div className={styles.partButtons} role="group" aria-label="选择主要部件">{machineParts.map((item) => <button type="button" key={item.id} aria-pressed={part === item.id} onClick={() => setPart(item.id)}>{item.name}</button>)}</div>
        <div className={`${styles.art} iso`} data-theme="light" onClick={(event) => {
          const node = (event.target as Element).closest<SVGElement>("[data-machine-part]")
          if (node && machineParts.some((item) => item.id === node.dataset.machinePart)) setPart(node.dataset.machinePart as MachinePart)
        }}>{art}</div>
        <p className={styles.figureCaption}>当前高亮：<strong>{selected.name}</strong> · {closeUp ? "局部放大" : "整体视图"}<br />部件位置与比例为示意；省略线束和完整维修结构。</p>
        <div className={styles.inlineState}><strong>{state.step + 1} / 8 · {machineSteps[state.step].title}</strong><span>可用 {state.available} · 票据待处理 {state.pending}</span></div>
      <div className={styles.controls} data-step-controls><button type="button" disabled={state.step === 0} onClick={() => { setPlaying(false); visit(state.step - 1) }}>前一步</button><button type="button" className={styles.primary} disabled={!state.canAdvance} onClick={() => { setPlaying(false); visit(state.step + 1) }}>{state.canAdvance ? `下一步：${machineSteps[state.step + 1].title}` : state.rejected ? "本例止于退回" : state.paperOut ? "补纸后继续" : "过程已结束"}</button><button type="button" disabled={!state.canAdvance} aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? "暂停播放" : "自动播放"}</button><button type="button" onClick={restart}>从头再看</button></div>
      {state.paperOut ? <div className={styles.fault} role="alert"><p><strong>缺纸，保留原票据。</strong>本例采用“记录已保存、打印未完成”的条件，真实设备的处理顺序需核对厂家协议。</p><button type="button" onClick={() => { setRecovered(true); setPlaying(false) }}>补纸并重试原票据</button></div> : scenario === "paper-out" && recovered && state.step === 6 ? <p className={styles.recovered} role="status">缺纸已解除，仍处理 EGM-DEMO-T001。点击“下一步：打印完成”查看交付。</p> : null}
      </div>

      <div className={styles.explanation}>
        <div className={styles.partDetail} data-part-description={part}><h3>{selected.name}</h3><p>{selected.purpose}</p><p className={styles.observation}>{selected.observation}</p></div>
        <div className={styles.readout} aria-label="当前步骤与余额" data-machine-readout>
          <div className={styles.stepLabel}>步骤 {state.step + 1} / 8 · {machineSteps[state.step].title}</div>
          <p role="status" aria-live="polite" aria-atomic="true" className={styles.status}>{state.status}</p>
          <p className={styles.stepExplanation}>{explanation}</p>
          <dl className={styles.metrics}><div><dt>可用余额</dt><dd data-machine-available>{state.available}<small>演示单位</small></dd></div><div><dt>票据待处理</dt><dd data-machine-pending>{state.pending}<small>演示单位</small></dd></div><div><dt>已打印票据</dt><dd data-machine-printed>{state.printed}<small>演示单位</small></dd></div></dl>
          <p className={styles.result}>本局结果：{state.result === null ? "尚未确认" : `固定示例返还 ${state.result}${state.step === 4 ? "，尚未入账" : ""}`}</p>
          {state.candidate ? <p className={styles.result}>正在识别：面值 {state.candidate}，尚未入账。</p> : null}
          {state.ticketId ? <div className={styles.ticket} data-machine-ticket><strong>示例票据 · 非有效凭证</strong><span>{state.ticketId}</span><b>105 演示单位</b><span>{state.step === 7 ? "已打印 · 未兑付" : "已保存 · 待打印"}</span><p>不含可扫描条码，不可兑换。</p></div> : null}
        </div>
      </div>
    </div>

    <div className={styles.process}>
      <div className={styles.processHeading}><h3>按步骤查看工作过程</h3><span>手动查看 · 每一步对应同一组示例记录</span></div>
      <ol className={styles.steps} aria-label="工作过程步骤">{machineSteps.map((item, index) => <li key={item.title}><button type="button" disabled={index > reached || (scenario === "rejected" && index > 1) || (scenario === "paper-out" && !recovered && index > 6)} aria-current={state.step === index ? "step" : undefined} onClick={() => { setPlaying(false); visit(index) }}><span>{index + 1}</span>{item.title}</button></li>)}</ol>
      <fieldset className={styles.scenarios}><legend>对照另外两种情况</legend>{([{ id: "normal", label: "正常过程" }, { id: "rejected", label: "纸币退回" }, { id: "paper-out", label: "出票缺纸" }] as const).map((item) => <label key={item.id}><input type="radio" name="machine-scenario" value={item.id} checked={scenario === item.id} onChange={() => changeScenario(item.id)} />{item.label}</label>)}<p><a href="#machine-view">回到设备与步骤操作 ↑</a></p><p>选择异常会直接定位发生位置；“从头再看”可以回看该情况的前置步骤。自动播放每4秒推进一次，遇异常或结束时停止。</p></fieldset>
      <div className={styles.accounting}><h3>同一组数值，核对一次</h3><p>已接受 {state.accepted} + 已入账返还 {state.returned} = 可用 {state.available} + 本局扣除 {state.spent} + 票据待处理 {state.pending} + 已打印票据 {state.printed}</p><p>“确认结果”时的15尚未入账；“生成票据”时的105仍保留在待处理记录中。这里表示演示单位的去向，不是会计凭证或真实钱包账本。</p></div>
    </div>

    <div id="machine-boundaries" className={styles.boundaries}><h3>示意范围与资料来源</h3><p>本例选择本机游戏逻辑、纸币识别和纸质票据的讲解路径。联网、无现金、机械转轴及服务器决定结果等设备，需要各自的架构和协议资料。返还15是固定讲解值，不是概率模型、RTP或真实RNG输出。</p><p>部件功能参考 GLI-11 v3.0（2016）的控制区域、输入设备、识钞器、支付设备与票据章节，以及JCM识钞器、打印机产品说明；这些资料不证明本图结构或交易顺序对应某个型号。</p><div className={styles.links}><a href="https://gaminglabs.com/wp-content/uploads/2018/09/GLI-11-Gaming-Devices-V3-0.pdf" target="_blank" rel="noreferrer">GLI-11 v3.0 设备标准</a><a href="https://jcmglobal.com/product/ivizion/" target="_blank" rel="noreferrer">JCM 纸币识别器</a><a href="https://jcmglobal.com/product/gen5/" target="_blank" rel="noreferrer">JCM 票据打印机</a><a href="https://github.com/wheresryan22/anatomy" target="_blank" rel="noreferrer">绘图工具 Anatomy · Ryan · MIT</a></div></div>
  </section>
}
