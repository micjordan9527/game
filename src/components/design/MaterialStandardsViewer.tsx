"use client"

import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"
import { materialStandards, searchMaterialStandards } from "@/data/materialStandards"
import { assetPath } from "@/lib/assets"
import styles from "./MaterialStandardsViewer.module.css"

// Apply only to the embedded document; the standalone material center keeps its own layout.
const embeddedStyles = `
  html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }
  .shell { width: 100%; height: 100%; min-height: 0; margin: 0; border: 0; border-radius: 0; box-shadow: none; }
  .sidebar { display: flex; flex-direction: column; min-height: 0; }
  .dots { display: none; }
  .brand { flex-shrink: 0; margin-top: 8px; margin-bottom: 20px; }
  .nav { flex: 1; min-height: 0; overflow-x: hidden !important; overflow-y: auto !important; overscroll-behavior: contain; scrollbar-width: thin; }
  .material-menu-toggle, .material-menu-overlay { display: none; }
  .material-tg-media { display: grid; grid-template-columns: minmax(0, 420px) minmax(0, 1fr); align-items: center; gap: 16px; margin-top: 18px; padding: 16px; }
  .material-tg-media video { display: block; width: 100%; max-height: 240px; aspect-ratio: 16 / 9; border-radius: 10px; background: #172033; object-fit: contain; }
  .material-tg-copy { min-width: 0; }
  .material-tg-copy h3 { margin: 0; font-size: 17px; color: #273552; }
  .material-tg-copy p { margin: 8px 0 0; color: #53627b; font-size: 14px; line-height: 1.7; }
  .material-tg-actions { display: flex; flex-wrap: wrap; gap: 6px 16px; margin-top: 10px; }
  .material-tg-actions a { display: inline-flex; align-items: center; min-height: 40px; color: #146cea; font-size: 14px; font-weight: 700; text-decoration: none; }
  .material-tg-actions a:hover { text-decoration: underline; }
  .material-tg-actions a:focus-visible { outline: 2px solid #146cea; outline-offset: 3px; }
  @media (max-width: 800px) {
    .sidebar { flex: 0 0 52px; min-height: 52px; height: 52px; flex-direction: row; justify-content: space-between; overflow: visible; z-index: 30; }
    .brand { margin: 0; }
    .material-menu-toggle { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 12px; border: 1px solid #59687c; border-radius: 8px; background: transparent; color: #fff; font: inherit; font-size: 13px; }
    .material-menu-toggle:focus-visible { outline: 2px solid #73b4ff; outline-offset: 2px; }
    .nav { display: none; position: fixed; z-index: 32; top: 52px; bottom: 0; left: 0; width: min(320px, 88vw); max-height: none; padding: 12px; background: #1d2632; }
    .material-menu-open .nav { display: block; }
    .material-menu-open .material-menu-overlay { display: block; position: fixed; z-index: 31; inset: 52px 0 0; width: 100%; height: auto; padding: 0; border: 0; background: rgba(13, 22, 38, .55); }
    .nav-group { margin-bottom: 6px; }
    .nav .nav-parent { display: flex !important; width: 100%; height: 44px !important; padding: 0 12px; gap: 12px; font-size: 14px !important; }
    .nav .nav-sub { padding: 4px 0 4px 20px; }
    .nav-group.open .nav-sub { display: grid; }
    .nav .nav-sub button { width: 100%; min-height: 40px; height: auto !important; padding: 8px 12px !important; font-size: 13px !important; }
    .nav button.active:before { display: none; }
    .search-results { position: absolute; top: calc(100% + 8px); left: 0; right: 0; max-height: 55vh; }
    .material-tg-media { grid-template-columns: minmax(0, 1fr); gap: 12px; margin-top: 14px; padding: 12px; }
  }
`

function prepareTGMaterial(previewDocument: Document, page: HTMLElement, nav: HTMLElement) {
  const material = materialStandards.find((item) => item.slug === "tg-assets")!
  const setText = (element: Element | null, text: string) => {
    if (element && element.textContent !== text) element.textContent = text
  }
  const setIconLabel = (element: Element | null, text: string) => {
    const label = Array.from(element?.childNodes ?? []).find((node) => node.nodeType === 3)
    if (label && label.textContent !== text) label.textContent = text
  }
  const navEntry = nav.querySelector('[data-target="tg-assets"]')
  navEntry?.setAttribute("title", material.title)
  setText(navEntry?.querySelector("span") ?? null, material.title)
  let activeVideo: HTMLVideoElement | null = null

  const sync = () => {
    if (activeVideo && !activeVideo.isConnected) {
      activeVideo.pause()
      activeVideo = null
    }
    page.querySelectorAll('[data-module-card="tg-assets"]').forEach((card) => {
      setText(card.querySelector("h3"), material.title)
      setText(card.querySelector("p"), material.description)
    })
    page.querySelectorAll('.search-result[data-target="tg-assets"]').forEach((result) => {
      setText(result.querySelector("b"), `${material.title} · ${material.category}`)
      setText(result.querySelector("small"), material.description)
    })
    if (!page.querySelector('[data-detail-spec="tg-assets"]')) return
    setText(page.querySelector(".heading h1"), material.title)
    setText(page.querySelector(".heading p"), material.description)
    setText(page.querySelector(".intro h2"), "静态宣传图")
    setText(page.querySelector(".intro p"), "核对现有 JPG 规格、完整素材与 Figma 源稿。")
    setIconLabel(page.querySelector(".spec > .title"), "静态宣传图规格")
    setIconLabel(page.querySelector(".preview-head .title"), "静态宣传图预览")
    if (page.querySelector("[data-tg-message-media]")) return

    const media = previewDocument.createElement("section")
    media.className = "card material-tg-media"
    media.setAttribute("data-tg-message-media", "")
    media.setAttribute("aria-label", "TG动态素材示例")
    const video = previewDocument.createElement("video")
    video.src = assetPath("/videos/operations/tg-message-demo.mp4")
    video.poster = assetPath("/images/operations/tg-message-poster.jpg")
    video.controls = true
    video.playsInline = true
    video.preload = "metadata"
    video.setAttribute("aria-label", "TG推送动态素材示例")
    const copy = previewDocument.createElement("div")
    copy.className = "material-tg-copy"
    copy.innerHTML = '<h3>TG动态示例</h3><p>1280 × 720 · MP4 · 约 9 秒<br>点击播放，查看推送顶部的动态展示。</p><div class="material-tg-actions"></div>'
    const download = previewDocument.createElement("a")
    download.href = video.src
    download.download = "tg-message-demo.mp4"
    download.textContent = "下载视频 MP4"
    const article = previewDocument.createElement("a")
    article.href = assetPath("/articles/tg-message-media#tg-message-demo")
    article.target = "_top"
    article.textContent = "查看消息结构与展示场景 →"
    copy.querySelector(".material-tg-actions")!.append(download, article)
    media.append(video, copy)
    page.querySelector(".topbar")!.after(media)
    activeVideo = video
  }
  const addTGSearchResult = (event: Event) => {
    const input = (event.target as Element | null)?.closest<HTMLInputElement>("[data-site-search]")
    if (!input?.value.trim() || !searchMaterialStandards(input.value).some((item) => item.slug === material.slug)) return
    const results = page.querySelector<HTMLElement>("[data-search-results]")
    if (!results || results.querySelector('[data-target="tg-assets"]')) return
    const result = previewDocument.createElement("button")
    result.type = "button"
    result.className = "search-result"
    result.dataset.target = material.slug
    const title = previewDocument.createElement("b")
    title.textContent = `${material.title} · ${material.category}`
    const description = previewDocument.createElement("small")
    description.textContent = material.description
    result.append(title, description)
    results.querySelector(".search-empty")?.remove()
    results.append(result)
    results.hidden = false
  }
  page.addEventListener("input", addTGSearchResult)
  page.addEventListener("focusin", addTGSearchResult)
  const observer = new MutationObserver(sync)
  observer.observe(page, { childList: true, subtree: true })
  previewDocument.defaultView?.addEventListener("pagehide", () => {
    activeVideo?.pause()
    observer.disconnect()
  }, { once: true })
  sync()
}

function prepareEmbeddedWorkspace(previewDocument: Document) {
  const sidebar = previewDocument.querySelector<HTMLElement>(".sidebar")
  const nav = previewDocument.querySelector<HTMLElement>(".nav")
  const page = previewDocument.querySelector<HTMLElement>(".page")
  if (!sidebar || !nav || !page) return false
  if (previewDocument.getElementById("material-workspace-style")) return true

  const style = previewDocument.createElement("style")
  style.id = "material-workspace-style"
  style.textContent = embeddedStyles
  previewDocument.head.append(style)

  const toggle = previewDocument.createElement("button")
  toggle.type = "button"
  toggle.className = "material-menu-toggle"
  toggle.setAttribute("aria-expanded", "false")
  toggle.setAttribute("aria-controls", "material-workspace-navigation")
  toggle.textContent = "素材目录"
  nav.id = "material-workspace-navigation"
  nav.setAttribute("aria-label", "素材目录")
  const overlay = previewDocument.createElement("button")
  overlay.type = "button"
  overlay.className = "material-menu-overlay"
  overlay.setAttribute("aria-label", "关闭素材目录遮罩")
  overlay.tabIndex = -1
  sidebar.insertBefore(toggle, nav)
  sidebar.append(overlay)
  prepareTGMaterial(previewDocument, page, nav)

  function setMenuOpen(open: boolean, restoreFocus = false) {
    previewDocument.documentElement.classList.toggle("material-menu-open", open)
    toggle.setAttribute("aria-expanded", String(open))
    toggle.textContent = open ? "关闭目录" : "素材目录"
    page!.inert = open
    if (restoreFocus) toggle.focus({ preventScroll: true })
  }
  toggle.addEventListener("click", () => setMenuOpen(toggle.getAttribute("aria-expanded") !== "true"))
  overlay.addEventListener("click", () => setMenuOpen(false, true))
  nav.addEventListener("click", (event) => {
    const button = (event.target as Element | null)?.closest("[data-target]")
    if (button && (!button.classList.contains("nav-parent") || !button.parentElement?.querySelector(".nav-sub"))) setMenuOpen(false, true)
  })
  previewDocument.addEventListener("keydown", (event) => {
    if (toggle.getAttribute("aria-expanded") !== "true") return
    if (event.key === "Escape") {
      event.preventDefault()
      setMenuOpen(false, true)
    } else if (event.key === "Tab") {
      const controls = [toggle, ...Array.from(nav!.querySelectorAll<HTMLButtonElement>("button"))].filter((button) => button.getClientRects().length)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && previewDocument.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && previewDocument.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
  })
  previewDocument.defaultView?.matchMedia("(max-width: 800px)").addEventListener("change", () => setMenuOpen(false))
  return true
}

export function MaterialStandardsViewer() {
  const searchParams = useSearchParams()
  const selectedModule = materialStandards.find((item) => item.slug === searchParams.get("module"))
  const previewSrc = assetPath(`/case-assets/material-standards/index.html${selectedModule ? `#${selectedModule.slug}` : ""}`)
  const newWindowHref = selectedModule?.slug === "tg-assets" ? assetPath("/design/material-standards?module=tg-assets") : previewSrc
  const [previewState, setPreviewState] = useState<"loading" | "ready" | "fallback">("loading")
  const loadTimer = useRef<number | undefined>(undefined)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const finishLoading = useCallback((frame: HTMLIFrameElement) => {
    window.clearTimeout(loadTimer.current)
    try {
      const previewDocument = frame.contentDocument
      setPreviewState(previewDocument && prepareEmbeddedWorkspace(previewDocument) ? "ready" : "fallback")
    } catch {
      setPreviewState("fallback")
    }
  }, [])

  useEffect(() => {
    setPreviewState("loading")
    const timer = window.setTimeout(() => setPreviewState("fallback"), 15000)
    loadTimer.current = timer
    // A cached iframe can finish loading before React hydrates its onLoad handler.
    const frame = frameRef.current
    if (frame?.contentDocument?.readyState === "complete" && frame.contentDocument.URL !== "about:blank") finishLoading(frame)
    return () => window.clearTimeout(timer)
  }, [previewSrc, finishLoading])

  return (
    <div className={styles.workspace} data-material-workspace>
      <header className={styles.toolbar}>
        <div className={styles.heading}>
          <h1 className="text-base font-semibold text-ink md:text-lg">代理素材规范</h1>
          <span className="text-xs text-muted">V1.86</span>
        </div>
        <a href={newWindowHref} target="_blank" rel="noopener" className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-xs font-semibold text-brand-700 hover:bg-brand-50 sm:text-sm">
          新窗口打开 <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </header>
      <section className={styles.frameWrap} aria-label="代理素材工作区">
        {previewState !== "ready" ? (
          <div className={styles.status} role="status">
            <p>{previewState === "loading" ? "正在加载代理素材…" : "素材中心暂时无法显示，可以在新窗口打开完整规范。"}</p>
            <a href={previewSrc} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 font-semibold text-brand-700">
              打开完整规范 <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}
        <iframe
          key={selectedModule?.slug ?? "quick"}
          ref={frameRef}
          src={previewSrc}
          title="代理素材规范 V1.86"
          className={`${styles.frame} ${previewState !== "ready" ? styles.pending : ""}`}
          loading="eager"
          onLoad={(event) => finishLoading(event.currentTarget)}
          onError={() => {
            window.clearTimeout(loadTimer.current)
            setPreviewState("fallback")
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-downloads allow-top-navigation-by-user-activation"
        />
      </section>
    </div>
  )
}
