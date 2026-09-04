import { ClipboardCheck, FileText, LucideIcon, Megaphone, Network, Siren } from "lucide-react"
import type { TemplateItem } from "@/data/templates"
import { formatTemplateAsMarkdown } from "@/lib/relations"
import { CopyTemplateButton } from "@/components/templates/CopyTemplateButton"
import { DownloadTemplateButton } from "@/components/templates/DownloadTemplateButton"

const templateIcons: Record<string, LucideIcon> = {
  "white-label-requirement-form": FileText,
  "promotion-system-prd": Megaphone,
  "agent-system-prd": Network,
  "launch-checklist": ClipboardCheck,
  "incident-review": Siren,
}

export function TemplateDetail({ template }: { template: TemplateItem }) {
  const Icon = templateIcons[template.slug] ?? FileText
  const copyContent = formatTemplateAsMarkdown(template)

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink">{template.title}</h3>
          <p className="mt-2 text-sm leading-7 text-muted">{template.description}</p>
        </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyTemplateButton content={copyContent} />
          <DownloadTemplateButton content={copyContent} filename={`${template.slug}.md`} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-line bg-white p-4">
          <div className="text-sm font-semibold text-ink">适用角色</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {template.roles.map((role) => (
              <span key={role} className="rounded-full bg-paper px-2.5 py-1 text-xs text-muted">
                {role}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-line bg-white p-4 md:col-span-2">
          <div className="text-sm font-semibold text-ink">使用场景</div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {template.useCases.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {template.sections.map((section) => (
          <div key={section.title} className="rounded-md bg-paper p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-ink">{section.title}</div>
              <CopyTemplateButton content={[`## ${section.title}`, "", ...section.items.map((item) => `- [ ] ${item}`)].join("\n")} />
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {section.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
        <div className="text-sm font-semibold text-amber-950">注意事项</div>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-900">
          {template.cautions.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
