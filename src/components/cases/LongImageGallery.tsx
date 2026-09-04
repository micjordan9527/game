"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { useEffect, useId, useState } from "react"
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
}

type LongImageGalleryProps = {
  items: LongImageItem[]
  emptyMessage: string
}

export function LongImageGallery({ items, emptyMessage }: LongImageGalleryProps) {
  const titleId = useId()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeItem = activeIndex === null ? null : items[activeIndex] ?? null
  const canNavigate = items.length > 1

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
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (!canNavigate) return
      if (event.key === "ArrowLeft") showPrevious()
      if (event.key === "ArrowRight") showNext()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeIndex, canNavigate])

  if (items.length === 0) {
    return <div className="mt-6 rounded-lg border border-dashed border-line bg-white p-8 text-sm leading-7 text-muted">{emptyMessage}</div>
  }

  return (
    <>
      <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label="案例长图组">
        {items.map((item, index) => (
          <article key={item.id} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
            <div className="border-b border-line p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">案例长图</p>
              <h3 className="mt-2 text-xl font-semibold tracking-normal text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
            </div>
            <button
              className="group relative block w-full cursor-zoom-in bg-paper p-3 text-left"
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <picture className="block">
                {item.srcAvif ? <source srcSet={assetPath(item.srcAvif)} type="image/avif" /> : null}
                {item.srcWebp ? <source srcSet={assetPath(item.srcWebp)} type="image/webp" /> : null}
                <Image
                  src={assetPath(item.src)}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 1023px) 100vw, (min-width: 1024px) 520px"
                  className="mx-auto h-auto w-full rounded-md bg-white shadow-sm"
                  loading="lazy"
                />
              </picture>
              <span className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">查看大图</span>
              </span>
            </button>
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
        <div aria-labelledby={titleId} aria-modal="true" className="fixed inset-0 z-[70] bg-ink/80 p-4 backdrop-blur-sm sm:p-6" role="dialog">
          <div className="mx-auto flex h-full max-w-6xl flex-col rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold leading-6 text-ink sm:text-base" id={titleId}>
                {activeItem.title}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                {canNavigate ? (
                  <>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink"
                      onClick={showPrevious}
                      type="button"
                      aria-label="上一张"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="min-w-12 text-center text-xs font-medium text-muted">
                      {(activeIndex ?? 0) + 1} / {items.length}
                    </span>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink"
                      onClick={showNext}
                      type="button"
                      aria-label="下一张"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </>
                ) : null}
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink"
                  onClick={() => setActiveIndex(null)}
                  type="button"
                  aria-label="关闭"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-paper p-3 sm:p-5">
              <picture className="block">
                {activeItem.srcAvif ? <source srcSet={assetPath(activeItem.srcAvif)} type="image/avif" /> : null}
                {activeItem.srcWebp ? <source srcSet={assetPath(activeItem.srcWebp)} type="image/webp" /> : null}
                <Image
                  src={assetPath(activeItem.src)}
                  alt={activeItem.title}
                  width={activeItem.width}
                  height={activeItem.height}
                  sizes="100vw"
                  className="mx-auto h-auto w-full max-w-5xl rounded-md bg-white shadow-sm"
                  loading="lazy"
                />
              </picture>
            </div>
            {canNavigate ? (
              <div className="grid gap-2 border-t border-line bg-white p-3">
                <p className="px-1 text-xs font-semibold text-muted">
                  点击缩略图可跳转到对应长图
                </p>
                <div className="no-scrollbar grid auto-cols-max grid-flow-col gap-2 overflow-x-auto pb-1">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={[
                        "group relative h-16 w-12 overflow-hidden rounded-md border p-0.5 ring-1 transition",
                        activeIndex === index ? "border-brand-700 ring-brand-200" : "border-line hover:border-brand-100",
                      ].join(" ")}
                    >
                      <picture className="block h-full w-full">
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
                      </picture>
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
