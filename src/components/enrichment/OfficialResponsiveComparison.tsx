"use client"

import { useState } from "react"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { assetPath } from "@/lib/assets"
import captures from "../../../public/images/official-comparison/manifest.json"

const modules = [{ id: "services", title: "服务展示", target: "solution" }, { id: "structure", title: "页面结构", target: "product" }, { id: "contact", title: "咨询入口", target: "contact" }]

export function OfficialResponsiveComparison() {
  const [selected, setSelected] = useState(0)
  const module = modules[selected]
  const pair = captures.filter((item) => item.id === module.id)
  return <section id="official-responsive-comparison" aria-label="官网桌面与手机对照" className="mt-8 scroll-mt-24 rounded-xl border border-line bg-paper p-4 md:p-6">
    <h2 className="text-2xl font-semibold text-ink">官网桌面与手机对照</h2>
    <p className="mt-3 text-sm leading-7 text-muted">来自同一现有官网演示的实际截图：桌面1440宽度与手机390宽度。手机长模块完整展示，桌面显示模块首屏；点击图片可按宽度放大并纵向阅读。</p>
    <div aria-label="选择官网对照模块" className="mt-4 grid grid-cols-3 gap-2">{modules.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`rounded-md border px-2 py-3 text-sm font-semibold ${selected === index ? "border-brand-700 bg-brand-50 text-brand-700" : "border-line bg-white text-muted"}`}>{item.title}</button>)}</div>
    <p className="mt-4 text-sm leading-7 text-ink">{pair[0].difference}</p>
    <a href={assetPath(`/case-assets/white-label-official/index.html?case-preview=1#${module.target}`)} target="_blank" rel="noopener" className="mt-2 inline-block text-sm font-semibold text-brand-700">在原演示中查看此模块 ↗</a>
    <LongImageGallery key={module.id} label="实际界面对照" items={pair.map((item) => ({ id: `${item.id}-${item.device}`, title: `${module.title} · ${item.device === "desktop" ? "桌面1440" : "手机390"}`, description: `${item.caption} ${item.device === "desktop" ? "1440×900模块首屏截图。" : "390宽度完整模块截图，浏览器视口按内容加高；没有拼接或改写页面。"}`, src: `/images/official-comparison/${item.file}`, width: item.width, height: item.height }))} emptyMessage="对照截图暂时无法显示。" />
  </section>
}
