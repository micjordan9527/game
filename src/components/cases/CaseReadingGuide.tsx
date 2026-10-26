import Link from "next/link"
import { caseReadingGuides } from "@/data/caseReadingGuides"
import { assetPath } from "@/lib/assets"

export function CaseReadingGuide({ slug }: { slug: string }) {
  const guide = caseReadingGuides[slug]
  if (!guide) return null
  return (
    <section id="case-reading-guide" className="mt-8 scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6" aria-labelledby="case-reading-title">
      <h2 id="case-reading-title" className="text-xl font-semibold text-ink">界面阅读说明</h2>
      <p className="mt-2 text-sm font-semibold leading-7 text-ink">{guide.title}</p>
      <p className="mt-2 text-xs leading-6 text-muted">{guide.material}</p>
      <ol className="mt-5 grid gap-4 lg:grid-cols-3">
        {guide.steps.map((step, index) => (
          <li key={step.title} className="min-w-0 rounded-lg border border-line bg-paper p-4">
            <p className="text-xs font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-semibold leading-7 text-ink">{step.title}</h3>
            <p className="mt-2 text-xs leading-6 text-muted">位置：{step.where}</p>
            <p className="mt-3 text-sm leading-7 text-ink">{step.observation}</p>
            <p className="mt-3 border-t border-line pt-3 text-xs leading-6 text-muted">判断边界：{step.boundary}</p>
            {step.href.startsWith("/case-assets/") ? <a href={assetPath(step.href)} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-semibold leading-7 text-brand-700">{step.linkLabel} ↗</a> : step.href.startsWith("#") ? <a href={step.href} className="mt-3 inline-block text-sm font-semibold leading-7 text-brand-700">{step.linkLabel} →</a> : <Link href={step.href} className="mt-3 inline-block text-sm font-semibold leading-7 text-brand-700">{step.linkLabel} →</Link>}
          </li>
        ))}
      </ol>
    </section>
  )
}
