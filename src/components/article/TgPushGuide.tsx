"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ExternalLink, Maximize2, Pause, Play, X } from "lucide-react"
import { assetPath } from "@/lib/assets"
import styles from "./TgPushGuide.module.css"

const videoSrc = "/videos/operations/tg-message-demo.mp4"
const posterSrc = "/images/operations/tg-message-poster.jpg"
export const tgArticleGuides = { "tg-message-media": { demo: "#tg-message-demo" } }
type Region = "media" | "body" | "buttons"
const explanations: Record<Region, string> = {
  media: "这里放宣传图片或视频。切换媒体后，正文与按钮仍在同一条消息下面。视频保持16:9完整显示。",
  body: "正文说明这条消息的主题、读者能看到的内容和下一步。画面与正文要指向同一份素材。",
  buttons: "每个按钮分别写清名称和目标。这里展示按钮布局；示意按钮不会打开外部频道。",
}

function ExampleBody({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? styles.compactBody : styles.messageBody}>
    <strong>海洋主题素材更新</strong>
    <p>左侧为标题，右侧展示鱼群、金币与炮台。播放视频，观察鱼群与金币的移动，以及炮台附近的画面变化。</p>
    <p>查看完整画面，再核对海洋主题、静态封面与下方入口。</p>
  </div>
}

export function TgPushGuide() {
  const [mode, setMode] = useState<"static" | "dynamic">("static")
  const [region, setRegion] = useState<Region>("media")
  const [expanded, setExpanded] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const expandTriggerRef = useRef<HTMLButtonElement>(null)
  const savedTimeRef = useRef(0)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) { videoRef.current?.pause(); expandedVideoRef.current?.pause() }
    }
    update()
    preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (mode !== "dynamic" || !video) return
    video.currentTime = savedTimeRef.current
    const bounds = video.getBoundingClientRect()
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.hidden && bounds.bottom > 0 && bounds.top < window.innerHeight) {
      void video.play().catch(() => { /* Native controls remain available when autoplay is unavailable. */ })
    }
    const pauseWhenHidden = () => { if (document.hidden) { video.pause(); expandedVideoRef.current?.pause() } }
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause() }, { threshold: 0 })
    observer.observe(video)
    document.addEventListener("visibilitychange", pauseWhenHidden)
    return () => {
      savedTimeRef.current = video.currentTime
      video.pause()
      observer.disconnect()
      document.removeEventListener("visibilitychange", pauseWhenHidden)
    }
  }, [mode])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!expanded || !dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.showModal()
    return () => {
      expandedVideoRef.current?.pause()
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      expandTriggerRef.current?.focus({ preventScroll: true })
    }
  }, [expanded])

  const selectRegion = (next: Region) => setRegion(next)
  const selectMode = (next: "static" | "dynamic") => {
    setMediaError(false)
    setMode(next)
    setRegion("media")
  }
  const openPreview = () => {
    if (videoRef.current) {
      savedTimeRef.current = videoRef.current.currentTime
      videoRef.current.pause()
    }
    setExpanded(true)
  }
  const finishPreview = () => {
    const video = expandedVideoRef.current
    if (video && Number.isFinite(video.currentTime)) {
      savedTimeRef.current = video.currentTime
      if (videoRef.current) videoRef.current.currentTime = video.currentTime
      video.pause()
    }
    setExpanded(false)
  }

  return <section className={`container-shell mb-8 max-w-6xl ${styles.guide}`} aria-label="TG推送场景图解">
    <div className={styles.heading}>
      <p>运营场景 · 推送内容</p>
      <h2>先看一条消息怎样放媒体、正文与按钮</h2>
      <p>上方媒体位可切换静态封面与动态视频。下方为中性说明文案和按钮布局示意，不代表已经在TG发布。</p>
    </div>
    <nav className={styles.readingNav} aria-label="本文阅读入口">
      <a href="#tg-message-demo">看推送效果</a><a href="#tg-output-examples">看运营产出</a><a href="#tg-check-points">看问题对照</a><a href="#tg-materials">查看素材规格</a><a href="#article-details">查看详细说明</a>
    </nav>

    <section id="tg-message-demo" className={styles.demo} aria-labelledby="tg-message-title">
      <div className={styles.demoTop}>
        <div><h3 id="tg-message-title">TG消息结构示意</h3><p>同一份视频的封面与播放效果</p></div>
        <div role="group" aria-label="媒体展示方式" className={styles.modeButtons}>
          <button type="button" aria-pressed={mode === "static"} onClick={() => selectMode("static")}><Pause size={16} aria-hidden="true" />静态封面</button>
          <button type="button" aria-pressed={mode === "dynamic"} onClick={() => selectMode("dynamic")}><Play size={16} aria-hidden="true" />动态视频</button>
        </div>
      </div>

      <div className={styles.previewLayout}>
        <div className={styles.telegram}>
          <div className={styles.channel}><span aria-hidden="true">TG</span><div><strong>运营素材示例</strong><small>消息结构预览</small></div></div>
          <div className={styles.message}>
            <div className={styles.region} data-selected={region === "media"}>
              <div className={styles.regionBar}><button type="button" aria-pressed={region === "media"} onClick={() => selectRegion("media")}>1 · 媒体位</button><button ref={expandTriggerRef} type="button" onClick={openPreview}><Maximize2 size={16} aria-hidden="true" />放大查看</button></div>
              <div className={styles.media}>
                {mode === "static" ? <img src={assetPath(posterSrc)} width={1280} height={720} alt="视频首帧：蓝色海洋主题素材，左侧为标题，右侧为画面主体" /> : <video ref={videoRef} src={assetPath(videoSrc)} poster={assetPath(posterSrc)} aria-label="TG推送动态视频示例" width={1280} height={720} controls muted loop playsInline preload="metadata" onError={() => setMediaError(true)} />}
              </div>
              {region === "media" ? <p className={styles.inlineNote} role="status">{explanations.media}</p> : null}
              {mediaError ? <p className={styles.error} role="alert">视频暂时无法播放，可在下方下载原文件后查看。</p> : null}
              {mode === "dynamic" && reducedMotion ? <p className={styles.inlineNote}>当前减少动态效果，视频保持暂停；可通过播放器手动播放。</p> : null}
            </div>
            <div className={styles.region} data-selected={region === "body"}>
              <div className={styles.regionBar}><button type="button" aria-pressed={region === "body"} onClick={() => selectRegion("body")}>2 · 正文</button><span>示例文案</span></div>
              <ExampleBody />
              {region === "body" ? <p className={styles.inlineNote} role="status">{explanations.body}</p> : null}
            </div>
            <div className={styles.region} data-selected={region === "buttons"}>
              <div className={styles.regionBar}><button type="button" aria-pressed={region === "buttons"} onClick={() => selectRegion("buttons")}>3 · 按钮区</button><span>示意按钮</span></div>
              <div className={styles.messageButtons}>
                {["素材规格", "使用说明", "内容记录"].map((label) => <button key={label} type="button" onClick={() => selectRegion("buttons")}>{label}<ExternalLink size={16} aria-hidden="true" /></button>)}
              </div>
              {region === "buttons" ? <p className={styles.inlineNote} role="status">{explanations.buttons}</p> : null}
            </div>
          </div>
        </div>

        <aside className={styles.observations} aria-label="推送画面观察">
          <h3>在这个示例里看什么</h3>
          <div className={styles.mediaDiagram} role="img" aria-label="16比9画面内，左侧标题、右侧主体和底部说明共同组成完整媒体">
            <span>16:9 完整画面</span><div><strong>标题区</strong><strong>主体区</strong></div><p>底部说明</p>
          </div>
          <dl>
            <div><dt>媒体</dt><dd>1280×720视频，按16:9完整显示；放大查看画面文字与边缘。</dd></div>
            <div><dt>正文</dt><dd>这里描述同一份海洋主题素材，不能沿用另一活动的介绍。</dd></div>
            <div><dt>按钮</dt><dd>按钮名称、数量和顺序需要与实际目标逐一核对。</dd></div>
          </dl>
          <p className={styles.smallPrint}>静态封面取自视频首帧，用于比较同一份素材的展示方式。</p>
        </aside>
      </div>
    </section>

    <section id="tg-output-examples" className={styles.outputs} aria-labelledby="tg-output-title">
      <h3 id="tg-output-title">一条推送对应的三份运营产出</h3>
      <p>把文件、正文和按钮目标放在一起核对，交付时就能看到完整消息。</p>
      <div className={styles.outputGrid}>
        <article className={styles.outputCard}>
          <h4>1 · 媒体文件与封面</h4>
          <img src={assetPath(posterSrc)} width={1280} height={720} alt="同一视频首帧的完整16比9画面" loading="lazy" />
          <div className={styles.fileRows}><span><strong>视频文件</strong><b>MP4 · 9秒</b></span><span><strong>封面文件</strong><b>同一视频首帧</b></span></div>
          <p>文件能播放、封面能显示，并保持同一画面比例。</p>
        </article>
        <article className={styles.outputCard}>
          <h4>2 · 与画面对应的正文</h4>
          <div className={styles.copySheet}><span>本条主题</span><strong>海洋主题素材更新</strong><hr /><span>正文说明</span><p>左侧标题，右侧鱼群、金币与炮台；查看完整画面，再核对静态封面与入口。</p><span className={styles.matchLabel}>画面与正文：同一海洋主题</span></div>
          <p>主题、说明和下一步写具体，不混入另一活动的介绍。</p>
        </article>
        <article className={styles.outputCard}>
          <h4>3 · 按钮名称与目标</h4>
          <div className={styles.buttonSheet}><div><strong>素材规格 ↗</strong><span>本页 · 素材规格区</span></div><div><strong>使用说明 ↗</strong><span>公告、帮助内容与发布版本</span></div><div><strong>内容记录 ↗</strong><span>本次内容版本与核对记录</span></div></div>
          <p>这里是目标对照示例；交付时应提供可核对的实际地址。</p>
        </article>
      </div>
    </section>

    <section id="tg-check-points" className={styles.checks} aria-labelledby="tg-check-title">
      <h3 id="tg-check-title">用同一画面核对两类常见问题</h3>
      <p>下面是排版与主题对照示意，视频原文件没有被裁切或修改。</p>
      <h4>画面是否完整</h4>
      <div className={styles.comparisonGrid}>
        <figure className={styles.comparisonCard}>
          <div className={`${styles.comparisonLabel} ${styles.problemLabel}`}>裁切示意 · 边缘内容缺失</div>
          <div className={styles.croppedExample}><img src={assetPath(posterSrc)} width={1280} height={720} alt="裁切问题示意：同一视频首帧偏向右侧显示，左侧标题被截去一部分" loading="lazy" /></div>
          <figcaption>强行填满不同的画幅，会把左侧标题与边缘内容裁掉。</figcaption>
        </figure>
        <figure className={styles.comparisonCard}>
          <div className={`${styles.comparisonLabel} ${styles.correctLabel}`}>完整示例 · 保持16:9</div>
          <div className={styles.completeExample}><img src={assetPath(posterSrc)} width={1280} height={720} alt="完整画面示例：同一视频首帧保持16比9，左侧标题、右侧主体和底部说明均可见" loading="lazy" /></div>
          <figcaption>按原比例显示，标题、主体和底部说明一起保留。</figcaption>
        </figure>
      </div>
      <h4>画面与正文是否说同一件事</h4>
      <div className={styles.comparisonGrid}>
        <figure className={styles.comparisonCard}>
          <div className={`${styles.comparisonLabel} ${styles.problemLabel}`}>主题不一致 · 需要更正文案</div>
          <div className={styles.themeExample}><img src={assetPath(posterSrc)} width={1280} height={720} alt="海洋主题视频首帧" loading="lazy" /><div><span>画面：鱼群与炮台</span><strong>正文：双狮主题内容更新</strong></div></div>
          <figcaption>媒体已经换成海洋主题，正文却仍是另一主题的内容。</figcaption>
        </figure>
        <figure className={styles.comparisonCard}>
          <div className={`${styles.comparisonLabel} ${styles.correctLabel}`}>主题一致 · 继续核对入口</div>
          <div className={styles.themeExample}><img src={assetPath(posterSrc)} width={1280} height={720} alt="与海洋主题正文对应的视频首帧" loading="lazy" /><div><span>画面：鱼群与炮台</span><strong>正文：海洋主题素材更新</strong></div></div>
          <figcaption>正文与画面指向同一主题，再核对按钮名称和实际目标。</figcaption>
        </figure>
      </div>
    </section>

    <section id="tg-materials" className={styles.materials} aria-labelledby="tg-materials-title">
      <div><h3 id="tg-materials-title">本例素材与使用规格</h3><p>视频示例与上方预览使用同一文件。</p></div>
      <dl className={styles.specs}><div><dt>视频尺寸</dt><dd>1280×720 · 16:9</dd></div><div><dt>时长与大小</dt><dd>约9秒 · 约1.6 MB</dd></div><div><dt>文件格式</dt><dd>MP4 · H.264视频</dd></div><div><dt>网页显示</dt><dd>640×360为等比显示示例</dd></div></dl>
      <div className={styles.materialLinks}><a href={assetPath(videoSrc)} download="tg-message-demo.mp4">下载视频 MP4</a><a href={assetPath(posterSrc)} download="tg-message-poster.jpg">下载静态封面</a><Link href="/design/material-standards?module=tg-assets">查看TG素材规范 →</Link><Link href="/articles/content-publication-versions#visual-guide">对照公告发布与版本 →</Link></div>
      <p className={styles.smallPrint}>网站预览不会发送TG消息。TG客户端是否自动播放，由客户端设置决定；实际发布状态需在对应频道核对。</p>
    </section>

    <dialog ref={dialogRef} className={styles.dialog} aria-label="TG素材放大预览" onClose={finishPreview} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close() }}>
      <div className={styles.dialogPanel}>
        <div className={styles.dialogHeader}><div><strong>{mode === "static" ? "静态封面" : "动态视频"}</strong><p>16:9完整画面 · 视频示例</p></div><button type="button" aria-label="关闭放大预览" onClick={() => dialogRef.current?.close()}><X size={20} aria-hidden="true" />关闭</button></div>
        {expanded ? mode === "dynamic" ? <video ref={expandedVideoRef} src={assetPath(videoSrc)} poster={assetPath(posterSrc)} controls muted loop playsInline preload="metadata" aria-label="放大的TG动态视频示例" onLoadedMetadata={(event) => { event.currentTarget.currentTime = savedTimeRef.current }} /> : <img src={assetPath(posterSrc)} width={1280} height={720} alt="放大的视频首帧，完整显示标题、主体和底部说明" /> : null}
      </div>
    </dialog>
  </section>
}
