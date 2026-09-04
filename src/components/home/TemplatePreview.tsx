import Link from "next/link"
import { templates } from "@/data/templates"
import { SectionHeader } from "@/components/common/SectionHeader"
import { TemplateCard } from "@/components/templates/TemplateCard"

export function TemplatePreview() {
  return (
    <section className="container-shell py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeader title="模板库入口" description="把项目需求、活动设计、代理系统、上线检查和事故复盘沉淀成可复用资料。" />
        <Link href="/templates" className="text-sm font-semibold text-brand-700 hover:underline">
          查看模板库
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {templates.slice(0, 3).map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
      </div>
    </section>
  )
}
