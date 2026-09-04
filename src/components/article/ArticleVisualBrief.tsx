"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from "lucide-react"
import { useEffect, useId, useState } from "react"
import type { ImagePrompt } from "@/data/imagePrompts"
import { assetPath } from "@/lib/assets"

export function ArticleVisualBrief({ imagePrompts }: { imagePrompts?: ImagePrompt[] }) {
  const titleId = useId()
  const imageCount = imagePrompts?.length ?? 0
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const activeImage = activeIndex === null ? null : imagePrompts?.[activeIndex] ?? null
  const canNavigate = imageCount > 1

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || imageCount === 0) return currentIndex
      return (currentIndex + imageCount - 1) % imageCount
    })
  }

  const showNextImage = () => {
    setActiveIndex((currentIndex) => {
      if (currentIndex === null || imageCount === 0) return currentIndex
      return (currentIndex + 1) % imageCount
    })
  }

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null)
      if (!canNavigate) return
      if (event.key === "ArrowLeft") showPreviousImage()
      if (event.key === "ArrowRight") showNextImage()
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activeIndex, canNavigate, imageCount])

  if (!imagePrompts?.length) return null
  const isImageGroup = imagePrompts.length > 1
  const groupTitle = imagePrompts[0]?.title.split("：")[0] ?? "信息图组"

  return (
    <>
      <section className="not-prose space-y-5">
        {isImageGroup ? (
          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
                  <Images className="h-4 w-4" aria-hidden="true" />
                  信息图组
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal text-ink">{groupTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">用长图梳理关键模块、协作关系和操作边界，方便快速建立整体理解。</p>
              </div>
              <span className="inline-flex w-fit items-center rounded-md bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">{imagePrompts.length} 张长图</span>
            </div>
          </div>
        ) : null}

        {imagePrompts.map((imagePrompt, index) => {
          const isLongInfographic = imagePrompt.kind === "long-infographic"

          return (
            <figure className={["overflow-hidden rounded-lg border border-line bg-white", isLongInfographic ? "shadow-sm" : ""].join(" ")} key={imagePrompt.slug}>
              <button className="group relative block w-full cursor-zoom-in bg-white text-left" onClick={() => setActiveIndex(index)} type="button">
                <picture className="block">
                  {imagePrompt.imageSrcAvif ? <source srcSet={assetPath(imagePrompt.imageSrcAvif)} type="image/avif" /> : null}
                  {imagePrompt.imageSrcWebp ? <source srcSet={assetPath(imagePrompt.imageSrcWebp)} type="image/webp" /> : null}
                      <Image
                        src={assetPath(imagePrompt.imageSrc)}
                        alt={imagePrompt.title}
                        width={imagePrompt.width ?? 1600}
                        height={imagePrompt.height ?? 900}
                        sizes="(min-width: 1024px) 768px, calc(100vw - 2rem)"
                        className="h-auto w-full object-contain"
                        loading="lazy"
                        unoptimized={imagePrompt.imageSrc.endsWith(".svg")}
                      />
                </picture>
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white/90 text-ink opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">查看大图</span>
                </span>
              </button>
              {isLongInfographic ? <figcaption className="border-t border-line bg-paper px-4 py-3 text-sm font-medium text-ink">{imagePrompt.title}</figcaption> : null}
            </figure>
          )
        })}
      </section>

      {activeImage ? (
        <div aria-labelledby={titleId} aria-modal="true" className="fixed inset-0 z-[70] bg-ink/80 p-4 backdrop-blur-sm sm:p-6" role="dialog">
          <div className="mx-auto flex h-full max-w-6xl flex-col rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold leading-6 text-ink sm:text-base" id={titleId}>
                {activeImage.title}
              </h2>
              <div className="flex shrink-0 items-center gap-2">
                {canNavigate ? (
                  <>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={showPreviousImage} type="button">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">上一张</span>
                    </button>
                    <span className="min-w-12 text-center text-xs font-medium text-muted">
                      {(activeIndex ?? 0) + 1} / {imageCount}
                    </span>
                    <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={showNextImage} type="button">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">下一张</span>
                    </button>
                  </>
                ) : null}
                <button className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-white text-muted hover:bg-paper hover:text-ink" onClick={() => setActiveIndex(null)} type="button">
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">关闭</span>
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-paper p-3 sm:p-5">
              <picture className="block">
                {activeImage.imageSrcAvif ? <source srcSet={assetPath(activeImage.imageSrcAvif)} type="image/avif" /> : null}
                {activeImage.imageSrcWebp ? <source srcSet={assetPath(activeImage.imageSrcWebp)} type="image/webp" /> : null}
                <Image
                  src={assetPath(activeImage.imageSrc)}
                  alt={activeImage.title}
                  width={activeImage.width ?? 1600}
                  height={activeImage.height ?? 900}
                  sizes="100vw"
                  loading="lazy"
                  className="mx-auto h-auto w-full max-w-5xl rounded-md bg-white shadow-sm"
                  unoptimized={activeImage.imageSrc.endsWith(".svg")}
                />
              </picture>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
