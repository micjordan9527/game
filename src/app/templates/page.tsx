import { TemplateLibrary } from "@/components/templates/TemplateLibrary"
import { templates } from "@/data/templates"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "模板库",
  description: "面向产品、运营、项目和运维团队的可复用工作模板资料库。",
  alternates: {
    canonical: absoluteUrl("/templates"),
  },
}

export default function TemplatesPage() {
  return (
    <div className="container-shell py-12">
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-brand-700">Templates</p>
        <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">模板库</h1>
        <p className="mt-3 text-base leading-8 text-muted">面向产品、运营、项目和运维团队的可复用资料库。支持查看详情和一键复制，方便直接放进项目文档。</p>
      </div>
      <div className="mt-8">
        <TemplateLibrary templates={templates} />
      </div>
    </div>
  )
}
