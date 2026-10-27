"use client"

export function BusinessQuestionNavigation({ items }: { items: { id: string; title: string }[] }) {
  return <nav aria-label="业务问题定位" className="mt-4 flex flex-wrap gap-2">{items.map((item, index) => {
    const hash = `#question-${item.id}`
    return <a key={item.id} href={hash} className="rounded-md border border-line bg-white px-3 py-2 text-sm text-brand-700" onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      event.preventDefault()
      if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash)
      window.requestAnimationFrame(() => {
        if (!target.isConnected) return
        target.scrollIntoView({ block: "start", behavior: "instant" })
        target.querySelector<HTMLElement>("h3")?.focus({ preventScroll: true })
      })
    }}>{index + 1}. {item.title}</a>
  })}</nav>
}
