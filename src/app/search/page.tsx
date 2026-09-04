import { Suspense } from "react"
import { SiteSearch } from "@/components/search/SiteSearch"
import { SectionHeader } from "@/components/common/SectionHeader"
import { articles } from "@/data/articles"
import { glossary } from "@/data/glossary"
import { templates } from "@/data/templates"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "全站搜索",
  description: "搜索文章、术语和模板，快速定位博彩与体育平台知识库内容。",
  alternates: {
    canonical: absoluteUrl("/search"),
  },
}

export default function SearchPage() {
  return (
    <div className="container-shell py-12">
      <SectionHeader eyebrow="Search" title="全站搜索" description="同时搜索文章、术语和模板。适合快速找概念、找流程、找可复用资料。" />
      <div className="mt-8">
        <Suspense fallback={null}>
          <SiteSearch articles={articles} terms={glossary} templates={templates} />
        </Suspense>
      </div>
    </div>
  )
}
