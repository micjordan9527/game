"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Maximize2, Pause, Play, X } from "lucide-react"
import { assetPath } from "@/lib/assets"
import styles from "./TgPushGuide.module.css"

const videoSrc = "/videos/operations/tg-message-demo.mp4"
const posterSrc = "/images/operations/tg-message-poster.jpg"
const channelVideoSrc = "/videos/operations/tg-channel-preview.mp4"
const channelPosterSrc = "/images/operations/tg-channel-preview-poster.jpg"
export const tgArticleGuides = { "tg-message-media": { demo: "#tg-message-demo" } }
type OriginalScreenshot = { src: string; width: number; height: number }
type PreviewTarget = "video" | "poster" | "channel" | "original"

export function TgPushGuide({ originalScreenshot, children }: { originalScreenshot?: OriginalScreenshot; children?: ReactNode }) {
  const [mode, setMode] = useState<"static" | "dynamic">("dynamic")
  const [previewTarget, setPreviewTarget] = useState<PreviewTarget | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mediaError, setMediaError] = useState(false)
  const [channelError, setChannelError] = useState(false)
  const [expandedPlaying, setExpandedPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const channelVideoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null)
  const savedTimeRef = useRef(0)
  const channelTimeRef = useRef(0)
  const autoplayAttemptedRef = useRef(false)
  const channelAutoplayAttemptedRef = useRef(false)
  const modalOpenRef = useRef(false)

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => {
      setReducedMotion(preference.matches)
      if (preference.matches) { videoRef.current?.pause(); channelVideoRef.current?.pause(); expandedVideoRef.current?.pause() }
    }
    update()
    preference.addEventListener("change", update)
    return () => preference.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (mode !== "dynamic" || !video) return
    let visible = false
    video.currentTime = savedTimeRef.current
    const tryAutoplayOnce = () => {
      if (!visible || document.hidden || modalOpenRef.current || autoplayAttemptedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      // One attempt per media selection; scrolling cannot restart a manual pause.
      autoplayAttemptedRef.current = true
      void video.play().catch(() => { /* Native playback controls stay available. */ })
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0
      if (visible) tryAutoplayOnce()
      else video.pause()
    }, { threshold: 0 })
    observer.observe(video)
    const visibilityChanged = () => {
      if (document.hidden) { video.pause(); expandedVideoRef.current?.pause() }
      else tryAutoplayOnce()
    }
    document.addEventListener("visibilitychange", visibilityChanged)
    return () => {
      savedTimeRef.current = video.currentTime
      video.pause()
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibilityChanged)
    }
  }, [mode])

  useEffect(() => {
    const video = channelVideoRef.current
    if (!video) return
    let visible = false
    const tryAutoplayOnce = () => {
      if (!visible || document.hidden || modalOpenRef.current || channelAutoplayAttemptedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      channelAutoplayAttemptedRef.current = true
      void video.play().catch(() => { /* Native playback controls stay available. */ })
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio > 0
      if (visible) tryAutoplayOnce()
      else video.pause()
    }, { threshold: 0 })
    observer.observe(video)
    const visibilityChanged = () => {
      if (document.hidden) video.pause()
      else tryAutoplayOnce()
    }
    document.addEventListener("visibilitychange", visibilityChanged)
    return () => {
      video.pause()
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibilityChanged)
    }
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!previewTarget || !dialog) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialog.showModal()
    return () => {
      expandedVideoRef.current?.pause()
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      previewTriggerRef.current?.focus({ preventScroll: true })
    }
  }, [previewTarget])

  const selectMode = (next: "static" | "dynamic") => {
    if (mode === next) return
    setMediaError(false)
    if (videoRef.current) savedTimeRef.current = videoRef.current.currentTime
    if (next === "dynamic") autoplayAttemptedRef.current = false
    setMode(next)
  }
  const openPreview = (target: PreviewTarget, trigger: HTMLButtonElement) => {
    previewTriggerRef.current = trigger
    modalOpenRef.current = true
    if (videoRef.current) {
      savedTimeRef.current = videoRef.current.currentTime
      videoRef.current.pause()
    }
    if (channelVideoRef.current) {
      channelTimeRef.current = channelVideoRef.current.currentTime
      channelVideoRef.current.pause()
    }
    setPreviewTarget(target)
  }
  const finishPreview = () => {
    const video = expandedVideoRef.current
    if (video && previewTarget === "video" && Number.isFinite(video.currentTime)) {
      savedTimeRef.current = video.currentTime
      if (videoRef.current) videoRef.current.currentTime = video.currentTime
    } else if (video && previewTarget === "channel" && Number.isFinite(video.currentTime)) {
      channelTimeRef.current = video.currentTime
      if (channelVideoRef.current) channelVideoRef.current.currentTime = video.currentTime
    }
    video?.pause()
    setExpandedPlaying(false)
    modalOpenRef.current = false
    setPreviewTarget(null)
  }
  const original = originalScreenshot
  const previewTitle = previewTarget === "original" ? "原TG截图" : previewTarget === "poster" ? "视频首帧" : previewTarget === "channel" ? "TG推送预览" : "素材视频"

  return <section className={`container-shell mb-8 max-w-4xl ${styles.guide}`} aria-label="TG频道推送展示">
    <nav className={styles.readingNav} aria-label="本文阅读入口">
      <a href="#tg-message-demo">视频</a>{original ? <a href="#tg-original-post">原TG截图</a> : null}<a href="#tg-case-details">截图</a><a href="#tg-materials">素材下载</a>
    </nav>

    <section id="tg-message-demo" className={styles.demo} aria-labelledby="tg-message-title">
      <div className={styles.demoTop}>
        <h2 id="tg-message-title">视频与TG推送预览</h2>
      </div>
      <div className={styles.previewLayout}>
        <figure className={styles.mediaCard} data-tg-source-video>
          <div className={styles.cardHeader}>
            <h3>素材视频</h3>
            <button type="button" aria-label="放大素材视频" onClick={(event) => openPreview(mode === "dynamic" ? "video" : "poster", event.currentTarget)}><Maximize2 size={16} aria-hidden="true" />放大查看</button>
          </div>
          <div className={styles.media}>
            {mode === "static" ? <img src={assetPath(posterSrc)} width={1280} height={720} alt="视频首帧：海洋主题画面，左侧标题，右侧鱼群、金币与炮台" /> : <video ref={videoRef} src={assetPath(videoSrc)} poster={assetPath(posterSrc)} aria-label="TG推送动态视频示例" width={1280} height={720} controls muted loop playsInline preload="metadata" onPlay={() => { autoplayAttemptedRef.current = true }} onError={() => setMediaError(true)} />}
          </div>
          <div role="group" aria-label="媒体展示方式" className={styles.modeButtons}>
            <button type="button" aria-pressed={mode === "dynamic"} onClick={() => selectMode("dynamic")}><Play size={16} aria-hidden="true" />动态视频</button>
            <button type="button" aria-pressed={mode === "static"} onClick={() => selectMode("static")}><Pause size={16} aria-hidden="true" />静态封面</button>
          </div>
          {mediaError ? <p className={styles.error} role="alert">视频暂时无法播放，可在下方下载后查看。</p> : null}
          {mode === "dynamic" && reducedMotion ? <p className={styles.inlineNote}>视频保持暂停，可手动播放。</p> : null}
        </figure>
        <figure className={styles.mediaCard} data-tg-channel-preview>
          <div className={styles.cardHeader}>
            <h3>TG推送预览</h3>
            <button type="button" aria-label="放大TG推送预览" onClick={(event) => openPreview("channel", event.currentTarget)}><Maximize2 size={16} aria-hidden="true" />放大查看</button>
          </div>
          <video ref={channelVideoRef} className={styles.channelVideo} src={assetPath(channelVideoSrc)} poster={assetPath(channelPosterSrc)} aria-label="TG推送消息预览视频" width={736} height={1624} controls muted loop playsInline preload="metadata" onPlay={() => { channelAutoplayAttemptedRef.current = true }} onError={() => setChannelError(true)} />
          {channelError ? <p className={styles.error} role="alert">预览暂时无法播放，可在下方下载后查看。</p> : null}
          <figcaption>频道消息效果示意，视频与正文来自不同素材。</figcaption>
        </figure>
      </div>
      {original ? <section id="tg-original-post" className={styles.original} aria-labelledby="tg-original-title">
        <div className={styles.originalHeader}><div><h3 id="tg-original-title">原TG截图</h3><p>原图完整展示，不折叠</p></div><button type="button" onClick={(event) => openPreview("original", event.currentTarget)}><Maximize2 size={16} aria-hidden="true" />放大原TG截图</button></div>
        <figure><img src={assetPath(original.src)} width={original.width} height={original.height} alt="用户提供的原TG频道推送截图，包含双狮主题图片、原帖正文和五个入口按钮" /><figcaption>原帖为双狮主题。海洋视频仅说明图片替换为视频的位置，不是这条原帖的发布版本。</figcaption></figure>
      </section> : null}
    </section>

    {children}

    <section id="tg-materials" className={styles.materials} aria-labelledby="tg-materials-title">
      <div><h2 id="tg-materials-title">视频文件与显示规格</h2><p>可下载素材视频和TG预览视频。</p></div>
      <dl className={styles.specs}><div><dt>视频尺寸</dt><dd>1280×720 · 16:9</dd></div><div><dt>时长与大小</dt><dd>约9秒 · 约1.6 MB</dd></div><div><dt>文件格式</dt><dd>MP4 · H.264视频</dd></div><div><dt>网页显示</dt><dd>640×360为等比显示示例</dd></div></dl>
      <div className={styles.materialLinks}><a href={assetPath(videoSrc)} download="tg-message-demo.mp4">下载视频 MP4</a><a href={assetPath(channelVideoSrc)} download="tg-channel-preview.mp4">下载TG预览视频</a><a href={assetPath(posterSrc)} download="tg-message-poster.jpg">下载视频首帧</a><Link href="/design/material-standards?module=tg-assets">查看TG素材规范 →</Link><Link href="/articles/content-publication-versions#visual-guide">对照公告发布与版本 →</Link></div>
      <p className={styles.smallPrint}>网站播放不会发送TG消息，真实发布状态以对应频道为准。视频首次进入可见区时尝试静音播放，离屏后暂停；手动暂停后不会因滚动反复重启。</p>
    </section>

    <dialog ref={dialogRef} className={`${styles.dialog} ${previewTarget === "channel" ? styles.channelDialog : ""}`} aria-label="TG素材放大预览" onClose={finishPreview} onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close() }}>
      <div className={styles.dialogPanel}>
        <div className={styles.dialogHeader}>
          <div><strong>{previewTitle}</strong><p>{previewTarget === "original" || previewTarget === "channel" ? "按宽度显示，可上下滚动查看" : "16:9完整画面"}</p></div>
          <div className={styles.dialogActions}>
            {previewTarget === "channel" ? <button type="button" onClick={() => { const video = expandedVideoRef.current; if (video?.paused) void video.play().catch(() => {}); else video?.pause() }}>{expandedPlaying ? "暂停" : "播放"}</button> : null}
            <button type="button" aria-label="关闭放大预览" onClick={() => dialogRef.current?.close()}><X size={20} aria-hidden="true" />关闭</button>
          </div>
        </div>
        {previewTarget === "video" ? <video ref={expandedVideoRef} src={assetPath(videoSrc)} poster={assetPath(posterSrc)} controls muted loop playsInline preload="metadata" aria-label="放大的TG动态视频示例" onLoadedMetadata={(event) => { event.currentTarget.currentTime = savedTimeRef.current }} /> : previewTarget === "channel" ? <video ref={expandedVideoRef} className={styles.channelExpanded} src={assetPath(channelVideoSrc)} poster={assetPath(channelPosterSrc)} controls muted loop playsInline preload="metadata" aria-label="放大的TG推送预览视频" onPlay={() => setExpandedPlaying(true)} onPause={() => setExpandedPlaying(false)} onLoadedMetadata={(event) => { const video = event.currentTarget; video.currentTime = channelTimeRef.current; if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !document.hidden) void video.play().catch(() => {}) }} /> : previewTarget === "poster" ? <img src={assetPath(posterSrc)} width={1280} height={720} alt="放大的视频首帧，完整显示左侧标题、右侧主体和底部说明" /> : previewTarget === "original" && original ? <img className={styles.originalExpanded} src={assetPath(original.src)} width={original.width} height={original.height} alt="放大的用户原TG截图，可上下滚动查看完整原帖" /> : null}
      </div>
    </dialog>
  </section>
}
