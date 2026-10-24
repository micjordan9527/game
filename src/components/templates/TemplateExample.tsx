import type { TemplateItem } from "@/data/templates"
import { templateExamples } from "@/data/templateExamples"
import { CopyTemplateButton } from "./CopyTemplateButton"
export function TemplateExample({ template }: { template: TemplateItem }) {
  const example = templateExamples[template.slug]
  if (!example) return null
  const markdown = [
    `# ${example.title}`,
    "",
    "虚构填写示例",
    ...example.fields.flatMap(([label, value]) => ["", `## ${label}`, value]),
  ].join("\n")
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-brand-100 bg-white" aria-label="模板成品示例">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-brand-50/60 px-5 py-3">
        <p className="text-sm font-semibold text-brand-700">填写结果预览 · 虚构示例</p>
        <CopyTemplateButton content={markdown} label="复制示例" />
      </div>
      <div className="p-5 md:p-7">
        <h2 className="text-xl font-semibold text-ink">{example.title}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {example.fields.map(([label, value], index) => (
            <div key={label} className="min-w-0 rounded-lg border border-line bg-paper p-4">
              <span className="text-xs font-semibold text-brand-700">0{index + 1}</span>
              <h3 className="mt-2 font-semibold text-ink">{label}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
