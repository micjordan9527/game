"use client"

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react"
import Link from "next/link"
import { Check, ChevronLeft, ChevronRight, LoaderCircle, Pause, Play, RotateCcw, X } from "lucide-react"
import styles from "./InterfaceMotionGuide.module.css"

type Scene = "submit" | "filter" | "drawer"
const scenes: { id: Scene; title: string; steps: string[]; notes: string[] }[] = [
  { id: "submit", title: "提交反馈", steps: ["可以提交", "等待响应", "确认结果"], notes: ["字段内容和提交动作放在一起。一次提交开始后，按钮立即暂停再次发送。", "按钮原位显示处理中，表单内容保留。转动图形只表示等待，不代表申请已经成功。", "用文字、记录号和下一步说明结果。失败时保留输入；成功时不再重复提交。"] },
  { id: "filter", title: "筛选更新", steps: ["选择条件", "保留旧列表", "替换为新结果"], notes: ["已选条件与已应用条件分别展示，修改选择还没有改变列表。", "加载时保留旧记录，明确提示它们仍属于原条件，暂停打开旧详情。", "查询完成后一起更新条件、数量和记录。让读者看出哪些结果发生了变化。"] },
  { id: "drawer", title: "弹层与返回", steps: ["原列表", "打开详情", "查看记录", "回到原位置"], notes: ["列表保留当前筛选与选中记录。点击某一条的详情按钮。", "详情从列表右侧进入，说明它属于当前记录；背景列表暂停操作。", "记录编号、标题和状态与选中项一致。关闭按钮和 Escape 都能返回。", "关闭后保留筛选、原列表和所选记录，焦点回到刚才的详情按钮。"] },
]
const records = [
  { id: "ANN-DEMO-101", title: "服务时间说明", status: "待审核" },
  { id: "ANN-DEMO-102", title: "帮助中心内容更新", status: "已发布" },
  { id: "ANN-DEMO-103", title: "联系方式说明", status: "待审核" },
]

export function InterfaceMotionGuide() {
  const uid = useId()
  const [scene, setScene] = useState<Scene>("submit")
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [animated, setAnimated] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [outcome, setOutcome] = useState("success")
  const [draftFilter, setDraftFilter] = useState("待审核")
  const [selectedId, setSelectedId] = useState("ANN-DEMO-102")
  const stageRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const fallbackOpener = useRef<HTMLButtonElement | null>(null)
  const busyRef = useRef(false)
  const clockRef = useRef({ key: "", remaining: 0 })
  const current = scenes.find((item) => item.id === scene)!
  const lastStep = current.steps.length - 1
  const running = playing && visible && pageVisible && !reduced
  const duration = step === 0 ? 1100 : step === 1 ? 1900 : 1500
  const selected = records.find((item) => item.id === selectedId)!
  const drawerOpen = scene === "drawer" && (step === 1 || step === 2)
  const canAdvance = step < lastStep

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => { setReduced(preference.matches); if (preference.matches) setPlaying(false) }
    const onVisibility = () => setPageVisible(!document.hidden)
    update(); onVisibility()
    preference.addEventListener("change", update)
    document.addEventListener("visibilitychange", onVisibility)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    if (stageRef.current) observer.observe(stageRef.current)
    return () => { preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", onVisibility); observer.disconnect() }
  }, [])

  useEffect(() => {
    const key = `${scene}-${step}`
    if (clockRef.current.key !== key) clockRef.current = { key, remaining: duration }
    if (!running || !canAdvance) return
    const started = performance.now()
    const timer = window.setTimeout(() => {
      clockRef.current.remaining = 0
      setStep((value) => value + 1)
      busyRef.current = false
      if (step + 1 === lastStep) setPlaying(false)
    }, clockRef.current.remaining)
    return () => {
      window.clearTimeout(timer)
      clockRef.current.remaining = Math.max(0, clockRef.current.remaining - (performance.now() - started))
    }
  }, [scene, step, running, canAdvance, duration, lastStep])

  useEffect(() => {
    if (scene !== "drawer") return
    if (step === 1) closeRef.current?.focus({ preventScroll: true })
    if (step === 3) (openerRef.current ?? fallbackOpener.current)?.focus({ preventScroll: true })
  }, [scene, step])

  function choose(next: Scene) {
    setScene(next); setStep(0); setPlaying(false); setAnimated(false); busyRef.current = false; openerRef.current = null; clockRef.current.key = ""
  }
  function visit(next: number) {
    setPlaying(false); setAnimated(false); setStep(Math.max(0, Math.min(lastStep, next))); busyRef.current = false; clockRef.current.key = ""
  }
  function play() {
    if (playing) { setPlaying(false); return }
    if (step === lastStep) { setStep(0); busyRef.current = false }
    setAnimated(true); setPlaying(true)
  }
  function begin() {
    if (busyRef.current || step !== 0) return
    busyRef.current = true; setStep(1); setAnimated(!reduced); setPlaying(!reduced)
  }
  function openRecord(id: string, trigger: HTMLButtonElement) {
    openerRef.current = trigger; setSelectedId(id); setStep(1); setAnimated(!reduced); setPlaying(!reduced)
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === "ArrowRight" ? (index + 1) % scenes.length : event.key === "ArrowLeft" ? (index + scenes.length - 1) % scenes.length : event.key === "Home" ? 0 : event.key === "End" ? scenes.length - 1 : null
    if (next === null) return
    event.preventDefault(); choose(scenes[next].id)
    document.getElementById(`${uid}-tab-${scenes[next].id}`)?.focus()
  }

  return <section id="interface-motion-demo" className={`container-shell my-6 max-w-6xl scroll-mt-24 ${styles.guide}`} aria-labelledby={`${uid}-heading`}>
    <div className={styles.heading}><p>可操作界面示意 · 示例数据</p><h2 id={`${uid}-heading`}>看清一次操作怎样改变界面</h2><p>选择一组界面，播放过程或逐步查看。暂停会同时停下计时与动画。</p></div>
    <div className={styles.explorer} data-interface-motion data-scene={scene} data-step={step} data-motion-running={running} data-motion-animated={animated} data-reduced-motion={reduced}>
      <div role="tablist" aria-label="界面动效场景" className={styles.tabs}>
        {scenes.map((item, index) => <button key={item.id} id={`${uid}-tab-${item.id}`} role="tab" aria-selected={scene === item.id} aria-controls={`${uid}-panel`} tabIndex={scene === item.id ? 0 : -1} onClick={() => choose(item.id)} onKeyDown={(event) => tabKey(event, index)}>{index + 1}. {item.title}</button>)}
      </div>
      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${scene}`}>
        <div className={styles.stage} ref={stageRef}>
          <div className={styles.browserBar}><span /><span /><span /><strong>{scene === "submit" ? "公告申请" : "公告列表"}</strong><small>界面示意</small></div>
          {scene === "submit" ? <div className={styles.submitLayout} data-motion-screen="submit">
            <div className={styles.form} aria-busy={step === 1}>
              <div className={styles.recordHeader}><h3>提交公告审核</h3><span className={styles.badge}>站点A · 中文</span></div>
              <label>公告标题<input value="帮助中心内容更新" readOnly aria-label="演示公告标题" /></label>
              <label>内容摘要<textarea readOnly rows={2} value="补充服务时间与联系方式，其他内容保持原版本。" aria-label="演示公告摘要" /></label>
              <div className={styles.formBottom}><button data-motion-submit className={styles.primary} disabled={step !== 0} onClick={begin}>{step === 1 ? <LoaderCircle className={styles.spinner} size={17} aria-hidden="true" /> : step === 2 && outcome === "success" ? <Check size={17} aria-hidden="true" /> : null}{step === 0 ? "提交审核" : step === 1 ? "提交中…" : outcome === "success" ? "已受理" : "本次未受理"}</button><span>{step > 0 ? "本轮演示提交 1 次" : "本轮尚未提交"}</span></div>
              {step === 2 && outcome === "failure" ? <button className={styles.textButton} onClick={() => visit(0)}>保留内容，回到填写</button> : null}
            </div>
            <aside className={styles.result} data-motion-result={step === 2 ? outcome : step === 1 ? "waiting" : "ready"} aria-label="本次提交结果">
              <span className={styles.resultLabel}>本次申请</span>
              <strong>{step === 0 ? "尚未发送" : step === 1 ? "等待服务端响应" : outcome === "success" ? "申请已受理" : "明确未受理"}</strong>
              <p>{step === 0 ? "点击提交，观察按钮与结果区的同步反馈。" : step === 1 ? "当前输入保留，提交按钮暂停使用。" : outcome === "success" ? "ANN-DEMO-102 · 待审核。受理不等于公告已发布。" : "摘要缺少生效范围。补充内容后才重新提交；本例原输入仍保留。"}</p>
              {step === 1 ? <div className={styles.loadingDots} aria-hidden="true"><i /><i /><i /></div> : null}
              {step === 2 ? <div className={styles.receipt}><span>界面反馈</span><b>{outcome === "success" ? "保留申请号，等待审核" : "保留输入，说明修改位置"}</b></div> : null}
            </aside>
          </div> : null}
          {scene === "filter" ? <div className={styles.listLayout} data-motion-screen="filter">
            <div className={styles.filterBar}><label htmlFor={`${uid}-status`}>公告状态<select id={`${uid}-status`} aria-label="公告状态" value={draftFilter} disabled={step !== 0} onChange={(event) => setDraftFilter(event.target.value)}><option>待审核</option><option>已发布</option></select></label><button className={styles.primary} disabled={step !== 0} onClick={begin}>{step === 1 ? "查询中…" : "应用条件"}</button></div>
            <div className={styles.applied}><span>已应用：<strong data-motion-applied>{step === 2 ? draftFilter : "全部状态"}</strong></span><span>{step === 2 ? records.filter((item) => item.status === draftFilter).length : records.length} 条记录</span></div>
            <div className={styles.listRows} aria-busy={step === 1} data-loading={step === 1}>
              {(step === 2 ? records.filter((item) => item.status === draftFilter) : records).map((item) => <div className={styles.record} key={item.id} data-motion-record={item.id}><div><strong>{item.title}</strong><small>{item.id}</small></div><span className={styles.badge}>{item.status}</span></div>)}
            </div>
            <p className={styles.listStatus} role="status">{step === 0 ? `已选“${draftFilter}”，列表仍按全部状态显示。` : step === 1 ? "正在查询新条件；上方仍是全部状态的旧记录，暂停打开详情。" : `查询完成：已应用“${draftFilter}”，条件、数量和列表一起更新。`}</p>
            {step === 1 ? <div key="query-progress" className={styles.queryProgress} style={{ "--motion-duration": `${duration}ms` } as CSSProperties} aria-hidden="true"><i /></div> : null}
          </div> : null}
          {scene === "drawer" ? <div className={styles.drawerStage} data-motion-screen="dialog" onKeyDown={(event) => { if (event.key === "Escape" && drawerOpen) { event.preventDefault(); visit(3) } }}>
            <div className={styles.drawerBackground} data-muted={drawerOpen} inert={drawerOpen}>
              <div className={styles.applied}><span>已应用：<strong>全部状态</strong></span><span>第 1 页 · 3 条</span></div>
              {records.map((item, index) => <div className={styles.record} data-selected={selectedId === item.id} data-motion-record={item.id} key={item.id}><div><strong>{item.title}</strong><small>{item.id} · {item.status}</small></div><button ref={(element) => { if (index === 1) fallbackOpener.current = element }} className={styles.detailButton} onClick={(event) => openRecord(item.id, event.currentTarget)}>详情</button></div>)}
            </div>
            {drawerOpen ? <div className={styles.drawerShade} aria-hidden="true" /> : null}
            {drawerOpen ? <div className={styles.drawer} role="dialog" aria-label="公告详情示意" data-opening={step === 1}>
              <div className={styles.drawerHeader}><h3>公告详情</h3><button ref={closeRef} onClick={() => visit(3)} aria-label="关闭公告详情"><X size={20} aria-hidden="true" /></button></div>
              <p className={styles.recordId}>{selected.id}</p><h4>{selected.title}</h4><span className={styles.badge}>{selected.status}</span>
              <dl><div><dt>发布范围</dt><dd>站点A · 中文</dd></div><div><dt>内容版本</dt><dd>v3</dd></div><div><dt>更新内容</dt><dd>补充服务时间与联系方式</dd></div></dl>
              <button className={styles.secondary} onClick={() => visit(3)}>关闭，返回原记录</button>
            </div> : null}
            {step === 3 ? <p className={styles.returnNotice} role="status"><Check size={17} aria-hidden="true" />筛选和所选记录已保留；焦点回到原详情按钮。</p> : null}
          </div> : null}
        </div>
        <div className={styles.caption}><strong>{step + 1} / {current.steps.length} · {current.steps[step]}</strong><p>{current.notes[step]}</p></div>
      </div>
      <div className={styles.controls}>
        <div className={styles.stepButtons}><button onClick={() => visit(step - 1)} disabled={step === 0} aria-label="查看上一步"><ChevronLeft size={17} aria-hidden="true" />上一步</button><button onClick={() => visit(step + 1)} disabled={!canAdvance} aria-label="查看下一步">下一步<ChevronRight size={17} aria-hidden="true" /></button></div>
        <div className={styles.playButtons}><button data-motion-play onClick={play} disabled={reduced} aria-pressed={playing}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? "暂停" : step === lastStep ? "重播" : "播放"}</button><button onClick={() => visit(0)}><RotateCcw size={16} aria-hidden="true" />从头看</button></div>
      </div>
      {scene === "submit" ? <div className={styles.outcome}><label htmlFor={`${uid}-outcome`}>响应示例</label><select id={`${uid}-outcome`} value={outcome} disabled={step !== 0} onChange={(event) => setOutcome(event.target.value)}><option value="success">明确已受理</option><option value="failure">明确未受理</option></select></div> : null}
      <p className={styles.playbackStatus} aria-live="polite">{reduced ? "已按设备设置减少动态效果；使用上一步、下一步查看静态状态。" : playing && !running ? "画面不在可见区域，过程已暂停。" : playing ? "正在播放本组过程，到最后一步停止。" : "已暂停，可逐步查看。"}</p>
    </div>
    <div className={styles.references}><p>这里的移动、淡入与加载反馈只解释界面变化；申请和查询均为本页演示，不连接后台。</p><Link href="/articles/form-validation-submit-feedback#form-demo">操作表单完整示例 →</Link><Link href="/articles/admin-filter-list-states#list-demo">查看筛选与返回规则 →</Link></div>
  </section>
}
