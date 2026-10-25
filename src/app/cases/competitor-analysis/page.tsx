import { ImageFocusExplorer } from "@/components/enrichment/ImageFocusExplorer"
import { u8Focus } from "@/data/caseEnhancements"
import Link from "next/link"
import { CompetitorGallery, type CompetitorInfographic } from "@/components/cases/CompetitorGallery"
import { absoluteUrl } from "@/lib/seo"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { appendAssetVersion } from "@/lib/assetVersion"

const competitorInfographics: CompetitorInfographic[] = [
  {
    brand: "U8",
    title: "U8 首页优化信息图",
    description: "从首屏结构、入口组织、视觉层级和关键路径角度，整理首页改版建议。",
    src: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.jpg",
    srcWebp: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.webp",
    srcAvif: "/case-assets/competitor-analysis/u8/u8-homepage-optimization.avif",
    width: 2160,
    height: 5696,
  },
  {
    brand: "U8",
    title: "U8 个人中心优化信息图",
    description: "从账户信息、资产入口、常用功能和服务路径角度，整理个人中心改版建议。",
    src: "/case-assets/competitor-analysis/u8/u8-profile-optimization.jpg",
    srcWebp: "/case-assets/competitor-analysis/u8/u8-profile-optimization.webp",
    srcAvif: "/case-assets/competitor-analysis/u8/u8-profile-optimization.avif",
    width: 2160,
    height: 5696,
  },
]

const versionedCompetitorInfographics = competitorInfographics.map((item) => ({
  ...item,
  src: appendAssetVersion(item.src),
  srcWebp: item.srcWebp ? appendAssetVersion(item.srcWebp) : undefined,
  srcAvif: item.srcAvif ? appendAssetVersion(item.srcAvif) : undefined,
}))

export const metadata = {
  title: "竞品分析",
  description: "沉淀竞品页面拆解、优化方案和信息图。",
  alternates: {
    canonical: absoluteUrl("/cases/competitor-analysis"),
  },
}

export default function CompetitorAnalysisPage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <Link href="/cases" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← 案例
      </Link>
      <nav aria-label="案例位置"><a href="#case-focus" className="text-xs font-semibold text-brand-700">查看局部对照 ↓</a></nav>
      <h1 className="mt-4 text-3xl font-semibold text-ink">U8 页面优化</h1>
      <p className="mt-2 text-sm leading-7 text-muted">首页与个人中心的界面拆解，点击信息图查看细节。</p>
      <CompetitorGallery items={versionedCompetitorInfographics} />
      <ImageFocusExplorer items={u8Focus} title="U8 重点位置" provenance="现有分析信息图的局部材料，原界面与方案建议以图中标注区分。" />
      <KnowledgeLinks open resources={resourcesForResource("案例", "competitor-analysis")} title="相关案例与图解" />
    </div>
  )
}
