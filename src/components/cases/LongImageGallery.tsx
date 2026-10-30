"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react"
import { assetPath } from "@/lib/assets"

type LongImageItem = {
  id: string
  title: string
  description: string
  src: string
  srcWebp?: string
  srcAvif?: string
  width: number
  height: number
  sourceHref?: string
  crop?: { x: number; y: number; width: number; height: number }
  annotations?: { x: number; y: number; width: number; height: number; label: string; color: string }[]
  maxPreviewWidth?: number
  annotationLegend?: string
}

function CroppedImage({ item, className, style }: { item: LongImageItem; className?: string; style?: CSSProperties }) {
  const crop = item.crop!
  return <svg data-gallery-image data-cropped-image role="img" aria-label={item.title} viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`} width={crop.width} height={crop.height} className={className} style={style} overflow="hidden">
    <image href={assetPath(item.src)} width={item.width} height={item.height} />
    {item.annotations?.map((mark, index) => <g key={index} aria-hidden="true">
      <rect x={mark.x} y={mark.y} width={mark.width} height={mark.height} rx="3" fill={mark.color} fillOpacity="0.04" stroke={mark.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={mark.x + 8} cy={mark.y + 8} r="9" fill={mark.color} />
      <text x={mark.x + 8} y={mark.y + 8} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="11" fontWeight="700">{mark.label}</text>
    </g>)}
  </svg>
}

type LongImageGalleryProps = {
  items: LongImageItem[]
  emptyMessage: string
  label?: string
  groupLabel?: string
}

export function LongImageGallery({ items, emptyMessage, label = "案例长图", groupLabel = "案例长图组" }: LongImageGalleryProps) {
  const titleId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeItem = activeIndex === null ? null : items[activeIndex] ?? null
  const activeWidth = activeItem?.crop?.width ?? activeItem?.width
  const activeHeight = activeItem?.crop?.height ?? activeItem?.height
  const canNavigate = items.length > 1
  const isOpen = activeItem !== null
  const [viewMode, setViewMode] = useState<"fit" | "actual">("fit")
  const dialogRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const viewPointRef = useRef<{ top: number; centerX: number } | null>(null)

  const changeViewMode = (mode: typeof viewMode) => {
    if (mode === viewMode) return
    const viewport = viewportRef.current
    const image = viewport?.querySelector("[data-gallery-image]")
    if (viewport && image) {
      const size = image.getBoundingClientRect()
      viewPointRef.current = {
        top: viewport.scrollTop / size.height,
        centerX: (viewport.scrollLeft + viewport.clientWidth / 2) / size.width,
      }
    }
    setViewMode(mode)
  }

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    const image = viewport?.querySelector("[data-gallery-image]")
    const point = viewPointRef.current
    if (!viewport || !image || !point) return
    const size = image.getBoundingClientRect()
    viewport.scrollTo({
      top: point.top * size.height,
      left: viewMode === "fit" ? 0 : point.centerX * size.width - viewport.clientWidth / 2,
      behavior: "instant",
    })
    viewPointRef.current = null
  }, [viewMode])

  const showPrevious = () => {
    setActiveIndex((index) => {
      if (index === null || items.length === 0) return index
      return (index + items.length - 1) % items.length
    })
  }

  const showNext = () => {
    setActiveIndex((index) => {
      if (index === null || items.length === 0) return index
      return (index + 1) % items.length
    })
  }

  useEffect(() => {
    if (!isOpen) return

    const scrollY = window.scrollY
    const body = document.body
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.width = "100%"
    body.style.overflow = "hidden"
    if (scrollbar) body.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (canNavigate && event.key === "ArrowLeft") { event.preventDefault(); showPrevious() }
      if (canNavigate && event.key === "ArrowRight") { event.preventDefault(); showNext() }
      if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLElement>("button, [tabindex=\"0\"]")
        const first = buttons?.[0]
        const last = buttons?.[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      Object.assign(body.style, previous)
      window.scrollTo({ top: scrollY, behavior: "instant" })
      triggerRef.current?.focus({ preventScroll: true })
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, canNavigate])

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [activeIndex])

  if (items.length === 0) {
    return <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-8 text-sm leading-7 text-muted">{emptyMessage}</div>
  }

  return (
    <>
      <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label={groupLabel}>
        {items.map((item, index) => (
          <article key={item.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{label}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
            <button
              className="group relative block w-full cursor-zoom-in bg-paper p-3 text-left"
              onClick={(event) => {
                triggerRef.current = event.currentTarget
                setViewMode("fit")
                setActiveIndex(index)
              }}
              type="button"
            >
              {item.crop ? <div className="mx-auto block overflow-hidden rounded-md" style={item.maxPreviewWidth ? { maxWidth: item.maxPreviewWidth } : undefined}><CroppedImage item={item} className="mx-auto block h-auto w-full rounded-md bg-white shadow-sm" /></div> : <picture className="block max-h-80 overflow-hidden rounded-md sm:max-h-[28rem]">
                {item.srcAvif ? <source srcSet={assetPath(item.srcAvif)} type="image/avif" /> : null}
                {item.srcWebp ? <source srcSet={assetPath(item.srcWebp)} type="image/webp" /> : null}
                <Image
                  data-gallery-image
                  src={assetPath(item.src)}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 1023px) 100vw, (min-width: 1024px) 520px"
                  className="mx-auto h-auto w-full rounded-md bg-white shadow-sm"
                  loading="lazy"
                />
              </picture>}
              <span className={`mt-3 flex items-center justify-center gap-2 rounded-md border border-line bg-white px-3 py-2 ${item.crop ? "text-sm" : "text-xs"} font-semibold text-brand-700 group-hover:border-brand-200`}>
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                {item.crop ? "放大这一局部" : "查看完整长图"}
              </span>
            </button>
            {item.annotationLegend ? <p className="border-t border-line px-4 py-3 text-sm leading-7 text-muted">{item.annotationLegend}</p> : null}
            {item.sourceHref ? (
              <div className="px-3 pb-3 pt-2">
                <Link
                  href={item.sourceHref}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 hover:text-ink"
                  onClick={(event) => event.stopPropagation()}
                >
                  查看原图
                </Link>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      {activeItem ? (
        <div ref={dialogRef} aria-labelledby={titleId} aria-modal="true" className="fixed inset-0 z-[70] bg-ink/80 p-2 backdrop-blur-sm sm:p-6" role="dialog">
          <div className="mx-auto flex h-full max-w-6xl flex-col rounded-lg bg-white shadow-2xl">
            <div className="shrink-0 border-b border-line px-3 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 text-sm font-semibold leading-6 text-ink sm:text-base" id={titleId}>
                  {activeItem.title}
                </h2>
                <button ref={closeRef} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line text-muted hover:bg-paper hover:text-ink" onClick={() => setActiveIndex(null)} type="button" aria-label="关闭">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex gap-1 rounded-md bg-paper p-1" aria-label="图片显示比例">
                  {([['fit', '适应屏幕'], ['actual', '原尺寸']] as const).map(([mode, label]) => (
                    <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => changeViewMode(mode)} className={`rounded px-3 py-2 text-xs font-semibold ${viewMode === mode ? "bg-ink text-white" : "text-muted hover:bg-white"}`}>
                      {label}
                    </button>
                  ))}
                </div>
                {canNavigate ? (
                  <div className="flex items-center gap-1">
                    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted hover:bg-paper" onClick={showPrevious} type="button" aria-label="上一张">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-10 text-center text-xs text-muted" aria-live="polite">{(activeIndex ?? 0) + 1} / {items.length}</span>
                    <button className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-muted hover:bg-paper" onClick={showNext} type="button" aria-label="下一张">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted" id={`${titleId}-hint`}>
                {viewMode === "actual" ? `原尺寸 ${activeWidth} × ${activeHeight}，上下左右滑动查看细节。` : activeItem.crop ? "局部按窗口宽度显示，上下滑动查看；可切换原界面与方案。" : "按窗口宽度显示，上下滑动查看完整长图。"}
              </p>
            </div>
            <div ref={viewportRef} role="region" aria-label="图片浏览区域" aria-describedby={`${titleId}-hint`} tabIndex={0} className="min-h-0 flex-1 overflow-auto overscroll-contain bg-paper p-2 sm:p-4">
              {activeItem.crop ? <CroppedImage item={activeItem} className={viewMode === "fit" ? "block h-auto w-full max-w-full shadow-sm" : "block h-auto max-w-none bg-white shadow-sm"} style={viewMode === "actual" ? { width: activeWidth } : undefined} /> : <picture className="block w-full" style={viewMode === "actual" ? { width: activeWidth } : undefined}>
                {activeItem.srcAvif ? <source srcSet={assetPath(activeItem.srcAvif)} type="image/avif" /> : null}
                {activeItem.srcWebp ? <source srcSet={assetPath(activeItem.srcWebp)} type="image/webp" /> : null}
                <Image
                  data-gallery-image
                  src={assetPath(activeItem.src)}
                  alt={activeItem.title}
                  width={activeItem.width}
                  height={activeItem.height}
                  sizes="100vw"
                  className={viewMode === "fit" ? "h-auto w-full max-w-full shadow-sm" : "h-auto max-w-none bg-white shadow-sm"}
                  style={viewMode === "actual" ? { width: activeItem.width } : undefined}
                />
              </picture>}
            </div>
            {canNavigate ? (
              <div className="grid shrink-0 gap-2 border-t border-line bg-white p-3">
                <p className="px-1 text-xs font-semibold text-muted">
                  {activeItem.crop ? "点击缩略图可切换原界面与方案局部" : "点击缩略图可跳转到对应长图"}
                </p>
                <div className="no-scrollbar grid auto-cols-max grid-flow-col gap-2 overflow-x-auto pb-1">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`查看${item.title}`}
                      aria-pressed={activeIndex === index}
                      className={[
                        "group relative h-16 w-12 overflow-hidden rounded-md border p-0.5 ring-1 transition",
                        activeIndex === index ? "border-brand-700 ring-brand-200" : "border-line hover:border-brand-100",
                      ].join(" ")}
                    >
                      {item.crop ? <CroppedImage item={item} className="block h-full w-full rounded-sm" /> : <picture className="block h-full w-full">
                        {item.srcAvif ? <source srcSet={assetPath(item.srcAvif)} type="image/avif" /> : null}
                        {item.srcWebp ? <source srcSet={assetPath(item.srcWebp)} type="image/webp" /> : null}
                        <Image
                          src={assetPath(item.src)}
                          alt={item.title}
                          width={item.width}
                          height={item.height}
                          sizes="48px"
                          className="h-full w-full rounded-sm object-cover"
                          loading="lazy"
                        />
                      </picture>}
                      <span
                        className={[
                          "absolute left-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-[10px] text-white",
                          activeIndex === index ? "bg-brand-700" : "",
                        ].join(" ")}
                      >
                        {index + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}
