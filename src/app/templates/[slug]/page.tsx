import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LearningCheck } from "@/components/common/LearningCheck"
import { TemplateDetail } from "@/components/templates/TemplateDetail"
import { TemplateFillTool } from "@/components/templates/TemplateFillTool"
import { templateLearningChecks } from "@/data/learningChecks"
import { templates } from "@/data/templates"
import { absoluteUrl } from "@/lib/seo"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"

export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = templates.find((item) => item.slug === slug)

  if (!template) return {}

  return {
    title: template.title,
    description: template.description,
    alternates: {
      canonical: absoluteUrl(`/templates/${template.slug}`),
    },
  }
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = templates.find((item) => item.slug === slug)

  if (!template) notFound()

  return (
    <div className="container-shell max-w-5xl py-12">
      <Link href="/templates" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回模板库
      </Link>
      <h1 className="mt-8 text-3xl font-semibold text-ink md:text-4xl">{template.title}</h1>
      {template.slug === "white-label-requirement-form" ? <TemplateFillTool template={template} /> : null}
      <div className="mt-8">
        <TemplateDetail template={template} />
      </div>
      <div className="mt-8">
        <LearningCheck check={templateLearningChecks[template.slug]} title="应用练习" />
      </div>
      <KnowledgeLinks resources={resourcesForResource("模板", template.slug)} title="相关主题与实用资料" />
      <section className="mt-8 rounded-lg border border-line bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">使用建议</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[template.slug === "white-label-requirement-form" ? "可在线填写并导出，再按项目范围补齐负责人和验收条件。" : "先复制模板，再按项目场景删减字段。", "涉及资金、权限和风控的条目必须保留负责人。", "模板完成后建议作为项目评审与复盘依据。"].map((item) => (
            <div key={item} className="rounded-md bg-paper p-4 text-sm leading-7 text-muted">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
