import Link from "next/link"
import type { ReactNode } from "react"
import { getContentNavigation, knowledgeCategory, type ContentNavItem } from "@/lib/content-navigation"

export function ContentNavigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const category = knowledgeCategory(pathname)
  const entry = (item: ContentNavItem, nested = false): ReactNode => {
    const current = pathname === item.href
    const parent = !current && item.href === "/" + category
    return <li key={item.href}>
      <Link href={item.href} onClick={onNavigate} aria-current={current ? "page" : parent ? "location" : undefined}
        className={`flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-md px-3 py-2 leading-6 transition ${nested ? "text-xs" : "text-sm"} ${current ? "bg-ink font-medium text-white" : parent ? "bg-brand-50 font-semibold text-brand-700" : "text-muted hover:bg-paper hover:text-ink"}`}>
        <span className="min-w-0">{item.label}</span>{item.meta ? <span className="shrink-0 text-xs opacity-70">{item.meta}</span> : null}
      </Link>
      {item.children?.length ? <ul className="my-1 ml-5 space-y-1 border-l border-line pl-2">{item.children.map((child) => entry(child, true))}</ul> : null}
    </li>
  }
  return <div data-context-navigation className="space-y-6">{getContentNavigation(pathname).map((group) => <section key={group.title}>
    <h3 className="px-3 text-xs font-semibold text-muted">{group.title}</h3>
    <ul className="mt-3 space-y-1">{group.items.map((item) => entry(item))}</ul>
  </section>)}</div>
}
