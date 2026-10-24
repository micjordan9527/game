"use client"

import { useEffect, useId, useState, type ReactNode } from "react"

export function PrototypeTabs({ panels }: { panels: { id: string; title: string; content: ReactNode }[] }) {
  const groupId = useId()
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    function selectFromHash() {
      const hash = window.location.hash.slice(1)
      const index = panels.findIndex((panel) => hash.includes(panel.id))
      if (index >= 0) setSelected(index)
    }
    selectFromHash()
    window.addEventListener("hashchange", selectFromHash)
    return () => window.removeEventListener("hashchange", selectFromHash)
  }, [panels])

  function activate(index: number, focus = false) {
    setSelected(index)
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${panels[index].id}`)
    if (focus) document.getElementById(`${groupId}-tab-${index}`)?.focus()
  }

  return (
    <div className="mt-6">
      <div
        role="tablist"
        aria-label="切换设计演示"
        className="flex flex-wrap gap-2 rounded-xl border border-line bg-white p-3"
      >
        {panels.map((panel, index) => (
          <button
            key={panel.id}
            id={`${groupId}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls={`${groupId}-panel`}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => activate(index)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (index + 1) % panels.length
                  : event.key === "ArrowLeft"
                    ? (index + panels.length - 1) % panels.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? panels.length - 1
                        : -1
              if (next >= 0) {
                event.preventDefault()
                activate(next, true)
              }
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${selected === index ? "bg-ink text-white" : "bg-paper text-muted hover:text-brand-700"}`}
          >
            {panel.title}
          </button>
        ))}
      </div>
      <div id={`${groupId}-panel`} role="tabpanel" aria-labelledby={`${groupId}-tab-${selected}`}>
        {panels[selected]?.content}
      </div>
    </div>
  )
}
