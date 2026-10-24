import { ExternalLink } from "lucide-react"
import { AdminOptimizationPreview } from "@/components/cases/AdminOptimizationPreview"
import { absoluteUrl } from "@/lib/seo"
import { assetPath } from "@/lib/assets"
import { appendAssetVersion } from "@/lib/assetVersion"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import Link from "next/link"
const src = `${appendAssetVersion("/case-assets/admin-optimization/index.html")}#version=optimized&page=dataCenter-overview`
export const metadata = {
  title: "后台优化",
  description: "直接体验角色看板、经营概览和异常入口。",
  alternates: { canonical: absoluteUrl("/cases/admin-optimization") },
}
export default function AdminOptimizationCasePage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 作品案例
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-ink">后台优化</h1>
          <p className="mt-2 text-sm leading-7 text-muted">切换角色，查看经营概览、核心指标与异常入口。</p>
        </div>
        <a
          href={assetPath(src)}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white"
        >
          全屏体验 <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <section id="case-materials" className="mt-5 scroll-mt-24" aria-label="后台交互演示">
        <AdminOptimizationPreview src={src} />
      </section>
      <p className="mt-3 text-xs leading-6 text-muted">交互演示 · 使用示例数据。原版入口需要对应网络与登录条件。</p>
      <KnowledgeLinks resources={resourcesForResource("案例", "admin-optimization")} title="相关作品与图解" />
    </div>
  )
}
