"use client"

import { useEffect, useRef, useState } from "react"
import { assetPath } from "@/lib/assets"

const modules = [
  { id: "services", title: "服务展示", target: "solution", caption: "方案流程图与三类服务卡片放在一起，对照交付范围与服务差异。" },
  { id: "structure", title: "页面结构", target: "product", caption: "产品能力区用平台架构图连接前台、业务模块与底层服务，右侧补充能力说明。" },
  { id: "contact", title: "咨询入口", target: "contact", caption: "联系方式与需求表单并排展示；表单为界面演示，不会发送咨询。" },
] as const

function ModuleDiagram({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 100 46" className="mx-auto mb-2 h-9 w-20 text-brand-700" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {index === 0 ? <>
        <path d="M50 12v7M16 19h68M16 19v6m34-6v6m34-6v6" />
        <rect x="33" y="2" width="34" height="10" rx="2" />
        {[2, 36, 70].map((x) => <rect key={x} x={x} y="25" width="28" height="18" rx="2" />)}
      </> : index === 1 ? <>
        <rect x="15" y="2" width="70" height="42" rx="3" />
        <path d="M15 12h70M34 12v32M34 34h51M42 20h34M42 26h22" />
      </> : <>
        <rect x="10" y="2" width="80" height="42" rx="3" />
        <path d="M45 2v42M17 14h20M17 22h14" />
        <rect x="52" y="9" width="30" height="7" rx="1" /><rect x="52" y="21" width="30" height="7" rx="1" />
        <path d="M66 36h16" strokeWidth="3" />
      </>}
    </svg>
  )
}

export function OfficialCasePreview({ src }: { src: string }) {
  const [selected, setSelected] = useState(0)
  const previewRef = useRef<HTMLElement>(null)
  const module = modules[selected]

  useEffect(() => {
    const readHash = () => {
      const index = modules.findIndex((entry) => window.location.hash === `#official-${entry.id}`)
      setSelected(index < 0 ? 0 : index)
    }
    readHash()
    window.addEventListener("hashchange", readHash)
    window.addEventListener("popstate", readHash)
    return () => {
      window.removeEventListener("hashchange", readHash)
      window.removeEventListener("popstate", readHash)
    }
  }, [])

  return (
    <section ref={previewRef} className="mt-5 scroll-mt-20" aria-label="官网模块展示">
      <nav className="grid grid-cols-3 gap-2" aria-label="官网模块定位">
        {modules.map((entry, index) => (
          <a
            key={entry.id}
            id={`official-${entry.id}`}
            href={`#official-${entry.id}`}
            aria-current={selected === index ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault()
              setSelected(index)
              window.history.replaceState(window.history.state, "", `#official-${entry.id}`)
              previewRef.current?.scrollIntoView({ block: "start", behavior: "instant" })
            }}
            className={`scroll-mt-24 rounded-lg border px-2 py-3 text-center text-sm font-semibold transition ${selected === index ? "border-brand-700 bg-brand-50 text-brand-700" : "border-line bg-white text-ink hover:border-brand-200"}`}
          >
            <ModuleDiagram index={index} />
            {entry.title}
          </a>
        ))}
      </nav>
      <figure className="mt-3 scroll-mt-20 overflow-hidden rounded-xl border border-line bg-white">
        <figcaption className="border-b border-line bg-paper px-4 py-3 text-xs leading-6 text-muted" aria-live="polite">
          <strong className="mr-2 font-semibold text-ink">{module.title}</strong>{module.caption}
          <a className="ml-2 whitespace-nowrap font-semibold text-brand-700" href={`${assetPath(src)}#${module.target}`} target="_blank" rel="noopener">单独查看 ↗</a>
        </figcaption>
        <iframe
          src={`${assetPath(src)}&case-preview=1#${module.target}`}
          title="包网官网案例预览"
          className="h-[78vh] w-full bg-white"
          sandbox="allow-scripts allow-forms allow-popups"
        />
      </figure>
    </section>
  )
}
