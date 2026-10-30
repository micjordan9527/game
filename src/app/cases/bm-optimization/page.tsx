import { ImageFocusExplorer } from "@/components/enrichment/ImageFocusExplorer"
import { BmMobilePrototype } from "@/components/enrichment/MobileCasePrototypes"
import { CaseReadingGuide } from "@/components/cases/CaseReadingGuide"
import { CaseDesignRationale } from "@/components/cases/CaseDesignRationale"
import { bmFocus } from "@/data/caseEnhancements"
import Link from "next/link"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion } from "@/lib/assetVersion"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"

const bmImages = [
  {
    title: "BM 首页优化信息图",
    description: "左侧为原版截图，右侧为生成式视觉方案。看分类与状态怎样分层。",
    src: "/case-assets/bm-optimization/bm-home-optimization.png",
    srcWebp: "/case-assets/bm-optimization/bm-home-optimization.webp",
    srcAvif: "/case-assets/bm-optimization/bm-home-optimization.avif",
    width: 1600,
    height: 1160,
  },
  {
    title: "BM 详情页优化信息图",
    description: "对照头区、信息块和底部操作区。右侧为生成式视觉方案。",
    src: "/case-assets/bm-optimization/bm-detail-optimization.png",
    srcWebp: "/case-assets/bm-optimization/bm-detail-optimization.webp",
    srcAvif: "/case-assets/bm-optimization/bm-detail-optimization.avif",
    width: 1600,
    height: 1160,
  },
]

const versionedBmImages = bmImages.map((image) => ({
  ...image,
  src: appendAssetVersion(image.src),
  srcWebp: appendAssetVersion(image.srcWebp),
  srcAvif: appendAssetVersion(image.srcAvif),
}))

export const metadata = {
  title: "BM手机端优化",
  description: "首页分类、状态层级与详情操作区三组局部对照，原界面和生成式方案可分别放大，并对照手机原型。",
  alternates: { canonical: absoluteUrl("/cases/bm-optimization") },
}
export default function BmOptimizationCasePage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 案例
      </Link>
      <nav aria-label="案例位置" className="flex flex-wrap gap-4"><a href="#case-focus" className="text-xs font-semibold text-brand-700">查看局部对照 ↓</a><a href="#bm-design-rationale" className="text-xs font-semibold text-brand-700">设计取舍说明 ↓</a><a href="#case-reading-guide" className="text-xs font-semibold text-brand-700">界面阅读说明 ↓</a></nav>
      <a href="#bm-mobile-prototype" className="mt-2 inline-block text-sm font-semibold text-brand-700">打开手机交互原型 ↓</a>
      <h1 className="mt-4 text-3xl font-semibold text-ink">BM 手机端优化</h1>
      <p className="mt-2 text-sm leading-7 text-muted">首页与详情页，直接对照分类、信息层级和操作区。点击图片放大。</p>
      <section id="case-materials" className="scroll-mt-24" aria-label="BM优化对照图">
        <LongImageGallery
          items={versionedBmImages.map((item) => ({ id: item.src, ...item, sourceHref: item.src }))}
          emptyMessage="对照图暂时无法显示，请稍后重试。"
        />
      </section>
      <ImageFocusExplorer items={bmFocus} title="BM 局部对照" provenance="原材料局部放大：左侧原版截图，右侧生成式方案；并非上线效果证明。" />
      <CaseDesignRationale kind="bm" />
      <BmMobilePrototype />
      <CaseReadingGuide slug="bm-optimization" />
      <KnowledgeLinks open resources={resourcesForResource("案例", "bm-optimization")} title="相关案例与图解" />
    </div>
  )
}
