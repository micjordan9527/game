import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { RelatedResource } from "@/lib/knowledge-relations"

export function KnowledgeLinks({ resources, title = "延伸学习与实用资料" }: { resources: RelatedResource[]; title?: string }) {
  if (resources.length === 0) return null
  return (
    <section className="mt-8 rounded-xl border border-line bg-white p-5 md:p-6" aria-label={title}>
      <h2 className="text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">结合相关内容，从概念理解走向案例分析与实际应用。</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {resources.map((resource) => (
          <Link key={resource.kind + resource.href} href={resource.href}
            className="group flex min-w-0 flex-col rounded-lg border border-line bg-paper p-4 transition hover:border-brand-200 hover:bg-white">
            <span className="text-xs font-semibold text-brand-700">{resource.kind}</span>
            <div className="mt-2 flex items-start gap-2">
              <h3 className="min-w-0 flex-1 text-sm font-semibold leading-6 text-ink group-hover:text-brand-700">{resource.title}</h3>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
            </div>
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-muted">{resource.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
