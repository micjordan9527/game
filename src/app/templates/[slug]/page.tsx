import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TemplateDetail } from "@/components/templates/TemplateDetail"
import { TemplateExample } from "@/components/templates/TemplateExample"
import { TemplateFillTool } from "@/components/templates/TemplateFillTool"
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
      <Link
        href="/templates"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回模板库
      </Link>
      <h1 className="mt-8 text-3xl font-semibold text-ink md:text-4xl">{template.title}</h1>
      <TemplateExample template={template} />
      {template.slug === "white-label-requirement-form" ? (
        <details className="mt-6 rounded-lg border border-line bg-white p-4">
          <summary className="cursor-pointer font-semibold text-ink">在线填写（可选）</summary>
          <TemplateFillTool template={template} />
        </details>
      ) : null}
      <div className="mt-8">
        <TemplateDetail template={template} />
      </div>
      <KnowledgeLinks resources={resourcesForResource("模板", template.slug)} title="相关主题与实用资料" />
    </div>
  )
}
