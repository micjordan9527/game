import Link from "next/link"
import { ClipboardCheck, FileText, LucideIcon, Megaphone, Network, Siren } from "lucide-react"
import type { TemplateItem } from "@/data/templates"
import { Badge } from "@/components/common/Badge"

const templateIcons: Record<string, LucideIcon> = {
  "white-label-requirement-form": FileText,
  "promotion-system-prd": Megaphone,
  "agent-system-prd": Network,
  "launch-checklist": ClipboardCheck,
  "incident-review": Siren,
}

export function TemplateCard({ template }: { template: TemplateItem }) {
  const Icon = templateIcons[template.slug] ?? FileText

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand-100 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <Badge tone="brand">{template.category}</Badge>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={2} />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">
        <Link href={`/templates/${template.slug}`} className="hover:text-brand-700">
          {template.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-7 text-muted">{template.description}</p>
      <div className="mt-5 space-y-3">
        {template.sections.slice(0, 2).map((section) => (
          <div key={section.title} className="rounded-md bg-paper p-3">
            <div className="text-sm font-semibold text-ink">{section.title}</div>
            <div className="mt-2 text-xs leading-6 text-muted">{section.items.slice(0, 3).join(" / ")}</div>
          </div>
        ))}
      </div>
      <Link href={`/templates/${template.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-700 hover:underline">
        查看详情
      </Link>
    </article>
  )
}
