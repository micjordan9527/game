import Link from "next/link"
import { ArrowRight, ClipboardList } from "lucide-react"
import type { TemplateItem } from "@/data/templates"
import { templateExamples } from "@/data/templateExamples"
import { resourceAudiences } from "@/lib/work-audiences"

export function TemplateCard({ template }: { template: TemplateItem }) {
  const example = templateExamples[template.slug]

  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white p-5 shadow-sm transition hover:border-brand-100 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
          {template.category}
        </span>
        <ClipboardList className="h-5 w-5 text-brand-700" aria-hidden="true" />
      </div>
      {example ? (
        <Link
          href={`/templates/${template.slug}`}
          aria-label={`${template.title}成品预览`}
          className="mt-4 block rounded-lg border border-line bg-paper p-4"
        >
          <p className="line-clamp-1 text-xs font-semibold text-brand-700">{example.title}</p>
          <div className="mt-3 space-y-2">
            {example.fields.slice(0, 2).map(([label, value]) => (
              <div key={label} className="rounded-md bg-white p-2">
                <p className="text-xs font-semibold text-ink">{label}</p>
                <p className="mt-1 line-clamp-1 text-xs text-muted">{value}</p>
              </div>
            ))}
          </div>
        </Link>
      ) : null}
      <h3 className="mt-4 text-lg font-semibold text-ink">
        <Link href={"/templates/" + template.slug} className="hover:text-brand-700">
          {template.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{template.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {resourceAudiences(`/templates/${template.slug}`, template.roles).map((role) => (
          <span key={role} className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-muted">
            {role}
          </span>
        ))}
      </div>
      <p className="mt-4 line-clamp-2 text-xs leading-6 text-muted">
        适用：{template.useCases.slice(0, 2).join(" · ")}
      </p>
      <Link
        href={"/templates/" + template.slug}
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-700 hover:underline"
      >
        查看并复制模板 <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </article>
  )
}
