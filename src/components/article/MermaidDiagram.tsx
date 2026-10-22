"use client"

import { useEffect, useId, useRef, useState } from "react"

type MermaidDiagramProps = {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "")
  const hostRef = useRef<HTMLDivElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [svg, setSvg] = useState("")
  const [error, setError] = useState(false)

  // Rendering a diagram imports a comparatively large library.
  // Defer it until the reader approaches this section.
  useEffect(() => {
    const element = hostRef.current
    if (!element) return
    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: "320px 0px" })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!nearViewport) return
    let cancelled = false

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid")
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          themeVariables: {
            background: "#ffffff",
            primaryColor: "#EEF8F6",
            primaryTextColor: "#172033",
            primaryBorderColor: "#D7F0EA",
            lineColor: "#98A2B3",
            secondaryColor: "#F1F6FF",
            tertiaryColor: "#F7F8FA",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          },
        })
        const result = await mermaid.render("mermaid-" + id, chart)
        if (!cancelled) {
          setSvg(result.svg)
          setError(false)
        }
      } catch {
        if (!cancelled) setError(true)
      }
    }

    renderDiagram()
    return () => { cancelled = true }
  }, [chart, id, nearViewport])

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-line bg-ink p-4 text-sm leading-7 text-white">
        <code>{chart}</code>
      </pre>
    )
  }

  return (
    <div ref={hostRef} className="not-prose my-8 overflow-x-auto rounded-lg border border-line bg-white p-4">
      {svg ? (
        <div className="min-w-[640px]" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <div className="flex min-h-40 items-center text-sm text-muted" role="status">
          {nearViewport ? "流程图加载中..." : "滚动至此处查看流程图"}
        </div>
      )}
    </div>
  )
}
