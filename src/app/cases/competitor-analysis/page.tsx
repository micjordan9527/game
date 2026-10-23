import Link from "next/link"
import { FileSearch } from "lucide-react"
import { CompetitorGallery, type CompetitorInfographic } from "@/components/cases/CompetitorGallery"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion } from "@/lib/assetVersion"
import { getCaseItem } from "@/data/cases"

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
  const caseItem = getCaseItem("competitor-analysis")
  const learningGoal = caseItem?.learningGoal ?? "复用竞品信息构建可落地的改造优先级与验证路径。"
  const estimatedMinutes = caseItem?.estimatedMinutes ?? 18
  const difficulty = caseItem?.difficulty ?? "提高"

  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-6 shadow-sm md:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <FileSearch className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold text-brand-700">案例模块</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-ink md:text-3xl">竞品分析</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-muted">这里集中放竞品页面拆解、改版建议、信息图和项目优化方案，方便按案例复盘。</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-muted">
          <span className="rounded-md bg-paper px-2.5 py-1">U8</span>
          <span className="rounded-md bg-paper px-2.5 py-1">页面拆解</span>
          <span className="rounded-md bg-paper px-2.5 py-1">优化方案</span>
          <span className="rounded-md bg-paper px-2.5 py-1">信息图</span>
        </div>
        <CaseLearningStatePanel
          slug="competitor-analysis"
          learningGoal={learningGoal}
          estimatedMinutes={estimatedMinutes}
          difficulty={difficulty}
          audience={caseItem?.audience}
        />
        <Link href="/cases" className="mt-8 inline-flex rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand-100 hover:text-brand-700">
          返回案例模块
        </Link>
      </section>

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["competitor-analysis"]} />
      </div>

      <CompetitorGallery items={versionedCompetitorInfographics} />
    </div>
  )
}
