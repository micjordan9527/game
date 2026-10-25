"use client"

import { useId, useState } from "react"
import { assetPath } from "@/lib/assets"
import type { ImageFocus } from "@/data/caseEnhancements"

export function ImageFocusExplorer({ items, title, provenance }: { items: ImageFocus[]; title: string; provenance: string }) {
  const [selected, setSelected] = useState(0)
  const uid = useId()
  const item = items[selected] ?? items[0]
  if (!item) return null
  const crop = item.crop
  return (
    <section id="case-focus" className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-4 sm:p-5" aria-label={title}>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-muted">{provenance}</p>
      <div role="tablist" aria-label={`${title}切换`} className="mt-4 flex flex-wrap gap-2">
        {items.map((entry, index) => <button key={entry.id} type="button" role="tab" id={`${uid}-${index}`} aria-selected={selected === index} aria-controls={`${uid}-panel`} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
          event.preventDefault()
          const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
          setSelected(next)
          document.getElementById(`${uid}-${next}`)?.focus()
        }} className={`rounded-md border px-3 py-2 text-sm font-semibold ${selected === index ? "border-ink bg-ink text-white" : "border-line text-muted hover:text-brand-700"}`}>{entry.title}</button>)}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${selected}`} className="mt-4">
        <figure>
          <div className="relative overflow-hidden rounded-lg border border-line bg-paper" style={{ aspectRatio: `${crop?.width ?? item.width} / ${crop?.height ?? item.height}` }}>
            <img src={assetPath(item.src)} alt={`${item.title}局部界面`} width={item.width} height={item.height} loading="lazy" className="absolute h-auto max-w-none" style={crop ? { width: `${item.width / crop.width * 100}%`, left: `${-crop.x / crop.width * 100}%`, top: `${-crop.y / crop.height * 100}%` } : { width: "100%", left: 0, top: 0 }} />
          </div>
          <figcaption className="mt-3 text-xs leading-6 text-muted">{item.caption}</figcaption>
        </figure>
        <p className="mt-3 border-l-2 border-brand-700 pl-3 text-sm leading-7 text-ink">{item.note}</p>
        <a href="#case-materials" className="mt-3 inline-block text-xs font-semibold text-brand-700">查看完整材料 ↑</a>
      </div>
    </section>
  )
}
