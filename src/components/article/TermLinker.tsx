import { glossary } from "@/data/glossary"

const terms = [...glossary].sort((a, b) => b.term.length - a.term.length)

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function linkifyText(text: string) {
  const matchedTerms = terms.filter((term) => text.includes(term.term)).slice(0, 4)

  if (matchedTerms.length === 0) return text

  const pattern = new RegExp(`(${matchedTerms.map((term) => escapeRegExp(term.term)).join("|")})`, "g")
  const parts = text.split(pattern)

  return parts.map((part, index) => {
    const term = matchedTerms.find((item) => item.term === part)

    if (!term) return part

    return (
      <span key={`${term.id}-${index}`} className="group/term relative inline-flex cursor-help font-medium text-brand-700 underline decoration-brand-100 underline-offset-4" tabIndex={0}>
        {part}
        <span className="invisible absolute left-1/2 top-full z-40 mt-2 w-72 -translate-x-1/2 rounded-lg border border-line bg-white p-3 text-left text-sm font-normal leading-6 text-muted opacity-0 shadow-md transition group-hover/term:visible group-hover/term:opacity-100 group-focus/term:visible group-focus/term:opacity-100">
          <span className="block text-sm font-semibold text-ink">{term.term}</span>
          <span className="mt-1 block">{term.shortDescription}</span>
          <span className="mt-2 block rounded-md bg-paper px-2 py-1 text-xs text-muted">常见场景：{term.commonScene}</span>
        </span>
      </span>
    )
  })
}

export function TermLinker({ children }: { children: React.ReactNode }) {
  return (
    <>
      {Array.isArray(children)
        ? children.map((child, index) => (typeof child === "string" ? <span key={index}>{linkifyText(child)}</span> : child))
        : typeof children === "string"
          ? linkifyText(children)
          : children}
    </>
  )
}
