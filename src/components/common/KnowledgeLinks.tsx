import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { RelatedResource } from "@/lib/knowledge-relations"

export function KnowledgeLinks({
  resources,
  title = "相关案例与资料",
  open = false,
}: {
  resources: RelatedResource[]
  title?: string
  open?: boolean
}) {
  if (resources.length === 0) return null
  return (
    <details open={open} className="mt-6 rounded-xl border border-line bg-white p-4 md:p-5" aria-label={title}>
      <summary className="cursor-pointer text-sm font-semibold text-ink">
        {title} · {resources.length}
      </summary>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <Link
            key={resource.kind + resource.href}
            href={resource.href}
            className="group flex min-w-0 flex-col rounded-lg border border-line bg-paper p-4 transition hover:border-brand-200 hover:bg-white"
          >
            <span className="text-xs font-semibold text-brand-700">{resource.kind}</span>
            <div className="mt-2 flex items-start gap-2">
              <h3 className="min-w-0 flex-1 text-sm font-semibold leading-6 text-ink group-hover:text-brand-700">
                {resource.title}
              </h3>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">{resource.description}</p>
          </Link>
        ))}
      </div>
    </details>
  )
}
