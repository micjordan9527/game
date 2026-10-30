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
  title: "BM赛事列表：队名、赛况与盘口分组",
  description: "从现有赛事截图的三处标注出发，用同一组演示内容比较赛事、赛况与盘口的布局，并查看长队名和放大文字的取舍。",
  alternates: { canonical: absoluteUrl("/cases/bm-optimization") },
}
export default function BmOptimizationCasePage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 案例
      </Link>
      <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-snug text-ink md:text-4xl">BM 赛事列表：队名、赛况与盘口分组</h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">用一张赛事卡，讲清信息分组与小屏取舍。</p>
      <nav aria-label="案例位置" className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-5 text-sm font-semibold text-brand-700"><a href="#bm-design-rationale">设计取舍说明 ↓</a><a href="#bm-layout-study">同内容布局示意 ↓</a><a href="#case-focus">查看局部对照 ↓</a><a href="#case-reading-guide">界面阅读说明 ↓</a></nav>
      <BmCaseStudy />
      <BmMobilePrototype />
      <div className="mt-12 border-t border-line pt-7"><h2 className="text-xl font-semibold text-ink">其他页面局部</h2><p className="mt-2 text-sm leading-7 text-muted">继续对照首页分类与详情操作区；保留原有图片、局部定位与放大查看。</p></div>
      <ImageFocusExplorer items={bmFocus} title="BM 局部对照" provenance="原材料局部：左侧嵌入的旧界面，右侧生成式方案。两侧内容不同，只比较结构。" />
      <CaseReadingGuide slug="bm-optimization" />
      <section id="case-materials" className="mt-10 scroll-mt-24 border-t border-line pt-7" aria-label="BM优化对照图">
        <h2 className="text-xl font-semibold text-ink">完整来源材料</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">两张早期分析图按原样保留。图内评价性文字不作为本页结论；原界面来源未独立核验，右侧视觉提案也不代表已经上线。</p>
        <LongImageGallery
          items={versionedBmImages.map((item) => ({ id: item.src, ...item, sourceHref: item.src }))}
          emptyMessage="对照图暂时无法显示，请稍后重试。"
        />
      </section>
      <KnowledgeLinks open resources={resourcesForResource("案例", "bm-optimization")} title="相关案例与图解" />
    </div>
  )
}
