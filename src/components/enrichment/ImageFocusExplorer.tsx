"use client"

import { useEffect, useId, useState } from "react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { assetPath } from "@/lib/assets"
import type { ImageFocus } from "@/data/caseEnhancements"

export function ImageFocusExplorer({ items, title, provenance }: { items: ImageFocus[]; title: string; provenance: string }) {
  const [selected, setSelected] = useState(0)
  const paired = items.some((entry) => entry.comparison)
  useEffect(() => {
    if (!paired) return
    const restore = () => {
      const id = new URLSearchParams(window.location.search).get("focus")
      const index = items.findIndex((entry) => entry.id === id)
      setSelected(index < 0 ? 0 : index)
    }
    restore()
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [items, paired])
  const select = (index: number) => {
    setSelected(index)
    if (paired) {
      const url = new URL(window.location.href)
      url.searchParams.set("focus", items[index].id)
      window.history.replaceState(window.history.state, "", url)
    }
  }
  const uid = useId()
  const item = items[selected] ?? items[0]
  if (!item) return null
  const crop = item.crop
  const comparison = item.comparison
  return (
    <section id="case-focus" className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-4 sm:p-5" aria-label={title}>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-muted">{provenance}</p>
      <div role="tablist" aria-label={`${title}切换`} className="mt-4 flex flex-wrap gap-2">
        {items.map((entry, index) => <button key={entry.id} type="button" role="tab" id={`${uid}-${index}`} aria-selected={selected === index} aria-controls={`${uid}-panel`} tabIndex={selected === index ? 0 : -1} onClick={() => select(index)} onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
          event.preventDefault()
          const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
          select(next)
          document.getElementById(`${uid}-${next}`)?.focus()
        }} className={`rounded-md border px-3 py-2 text-sm font-semibold ${selected === index ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>{entry.title}</button>)}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${selected}`} data-focus-id={item.id} className="mt-4">
        {comparison ? <>
          <p className="text-sm leading-7 text-ink">{item.caption}</p>
          <LongImageGallery key={item.id} groupLabel={`${item.title}原界面与方案局部`} label="局部对照" emptyMessage="局部材料暂时无法显示。" items={[comparison.before, comparison.after].map((side, index) => ({ id: `${item.id}-${index}`, title: side.label, description: side.caption, src: item.src, width: item.width, height: item.height, crop: side.crop }))} />
          <p className="mt-4 text-sm leading-7 text-muted">两张局部分别放大；适应屏幕按宽度显示。图注用文字说明可见变化，细小原图文字以完整材料为准。</p>
        </> : <figure>
          <div className="relative overflow-hidden rounded-lg border border-line bg-paper" style={{ aspectRatio: `${crop?.width ?? item.width} / ${crop?.height ?? item.height}` }}>
            <img src={assetPath(item.src)} alt={`${item.title}局部界面`} width={item.width} height={item.height} loading="lazy" className="absolute h-auto max-w-none" style={crop ? { width: `${item.width / crop.width * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` } : { width: "100%", left: 0, top: 0 }} />
          </div>
          <figcaption className="mt-3 text-xs leading-6 text-muted">{item.caption}</figcaption>
        </figure>}
        <p className="mt-3 border-l-2 border-brand-700 pl-3 text-sm leading-7 text-ink">{item.note}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold leading-7 text-brand-700">{comparison ? <a href={comparison.demoHref}>{comparison.demoLabel} ↓</a> : null}<a href="#case-materials">查看完整材料 ↑</a></div>
      </div>
    </section>
  )
}
