import { ImageFocusExplorer } from "@/components/enrichment/ImageFocusExplorer"
import { BmMobilePrototype } from "@/components/enrichment/MobileCasePrototypes"
import { CaseReadingGuide } from "@/components/cases/CaseReadingGuide"
import { BmCaseStudy } from "@/components/cases/BmCaseStudy"
import { bmFocus } from "@/data/caseEnhancements"
import Link from "next/link"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion } from "@/lib/assetVersion"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { assetPath } from "@/lib/assets"

const bmImages = [
  {
    title: "BM 首页界面对照",
    description: "",
    src: "/images/cases/bm-home-overview.jpg",
    width: 1600,
    height: 1160,
  },
  {
    title: "BM 详情页界面对照",
    description: "",
    src: "/images/cases/bm-detail-overview.jpg",
    width: 1600,
    height: 1160,
  },
]

const versionedBmImages = bmImages.map((image) => ({
  ...image,
  src: appendAssetVersion(image.src),
}))

export const metadata = {
  title: "BM手机端界面对照",
  description: "先查看首页与详情页整体，再看赛事列表标注、同内容布局示意与小屏设计取舍。",
  alternates: { canonical: absoluteUrl("/cases/bm-optimization") },
}
export default function BmOptimizationCasePage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 案例
      </Link>
      <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-snug text-ink md:text-4xl">BM 手机端界面对照</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">先看首页与详情页整体，再看赛事列表的局部拆解。</p>
      <section id="case-materials" className="mt-6 scroll-mt-24" aria-labelledby="bm-overview-title">
        <h2 id="bm-overview-title" className="text-lg font-semibold text-ink">首页与详情页对照</h2>
        <p className="mt-2 text-sm leading-7 text-muted">左侧为材料中的旧界面，右侧为视觉提案。</p>
        <LongImageGallery
          items={versionedBmImages.map((item) => ({ id: item.src, ...item }))}
          mobileLabels={["首页", "详情页"]}
          compactPreview
          previewLabel="放大查看"
          emptyMessage="对照图暂时无法显示，请稍后重试。"
        />
      </section>
      <nav aria-label="案例位置" className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-5 text-sm font-semibold text-brand-700"><a href="#bm-design-rationale">设计取舍说明 ↓</a><a href="#bm-layout-study">同内容布局示意 ↓</a><a href="#case-focus">查看局部对照 ↓</a><a href="#case-reading-guide">界面阅读说明 ↓</a></nav>
      <BmCaseStudy />
      <BmMobilePrototype />
      <div className="mt-12 border-t border-line pt-7"><h2 className="text-xl font-semibold text-ink">其他页面局部</h2><p className="mt-2 text-sm leading-7 text-muted">继续对照首页分类与详情操作区；保留原有图片、局部定位与放大查看。</p></div>
      <ImageFocusExplorer items={bmFocus} title="BM 局部对照" provenance="原材料局部：左侧嵌入的旧界面，右侧生成式方案。两侧内容不同，只比较结构。" />
      <CaseReadingGuide slug="bm-optimization" />
      <aside className="mt-7 border-t border-line pt-5 text-xs leading-6 text-muted" aria-label="BM素材来源">
        <p>整体预览使用既有界面局部重新编排图注。来源文件按原样保留，原界面来源未独立核验；视觉提案不代表上线结果。</p>
        <div className="mt-2 flex flex-wrap gap-5 font-semibold text-brand-700"><a href={assetPath("/case-assets/bm-optimization/bm-home-optimization.png")} target="_blank" rel="noopener">首页来源文件 ↗</a><a href={assetPath("/case-assets/bm-optimization/bm-detail-optimization.png")} target="_blank" rel="noopener">详情页来源文件 ↗</a></div>
      </aside>
      <KnowledgeLinks open resources={resourcesForResource("案例", "bm-optimization")} title="相关案例与图解" />
    </div>
  )
}
