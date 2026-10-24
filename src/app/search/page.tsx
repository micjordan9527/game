import { Suspense } from "react"
import { SiteSearch } from "@/components/search/SiteSearch"
import { SectionHeader } from "@/components/common/SectionHeader"
import { buildSearchIndex } from "@/lib/search-index"
import { absoluteUrl } from "@/lib/seo"

export const metadata = {
  title: "全站搜索",
  description: "统一查找知识文章、术语、模板、案例、AI 工作流、体育专题、设计专题和素材规范。",
  alternates: { canonical: absoluteUrl("/search") },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  const items = buildSearchIndex()

  return (
    <div className="container-shell py-8 md:py-12">
      <SectionHeader
        as="h1"
        eyebrow="全站资料检索"
        title="搜索整个知识库"
        description="从一个问题出发，找到相关文章、术语、实战案例、模板、工作流、设计专题和素材规范。"
      />
      <div className="mt-6">
        <Suspense
          fallback={
            <div className="rounded-xl border border-line bg-white p-6 text-sm text-muted">正在载入搜索...</div>
          }
        >
          <SiteSearch items={items} />
        </Suspense>
      </div>
    </div>
  )
}
