import { glossary } from "@/data/glossary"

const terms = [...glossary].sort((a, b) => b.term.length - a.term.length)

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function linkifyText(text: string, excludeTermIds: string[]) {
  const matchedTerms = terms.filter((term) => !excludeTermIds.includes(term.id) && text.includes(term.term)).slice(0, 4)

  if (matchedTerms.length === 0) return text

  const pattern = new RegExp(`(${matchedTerms.map((term) => escapeRegExp(term.term)).join("|")})`, "g")
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    const term = matchedTerms.find((item) => item.term === part)

    if (!term) return part

    return (
      <span key={`${term.id}-${index}`} className="group/term relative inline-flex cursor-help font-medium text-brand-700 underline decoration-brand-100 underline-offset-4" tabIndex={0}>
        {part}
        <span className="invisible fixed inset-x-4 bottom-4 z-40 rounded-lg border border-line bg-white p-3 text-left text-sm font-normal leading-6 text-muted opacity-0 shadow-md transition group-hover/term:visible group-hover/term:opacity-100 group-focus/term:visible group-focus/term:opacity-100 md:absolute md:inset-x-auto md:bottom-auto md:left-1/2 md:top-full md:mt-2 md:w-72 md:-translate-x-1/2">
          <span className="block text-sm font-semibold text-ink">{term.term}</span>
          <span className="mt-1 block">{term.shortDescription}</span>
          <span className="mt-2 block rounded-md bg-paper px-2 py-1 text-xs text-muted">常见场景：{term.commonScene}</span>
        </span>
      </span>
    )
  })
}

export function TermLinker({ children, excludeTermIds = [] }: { children: React.ReactNode; excludeTermIds?: string[] }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, index) => (typeof child === "string" ? <span key={index}>{linkifyText(child, excludeTermIds)}</span> : child))
        : typeof children === "string"
          ? linkifyText(children, excludeTermIds)
          : children}
    </>
  )
}
