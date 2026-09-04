import Link from "next/link"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion } from "@/lib/assetVersion"
import { getCaseItem } from "@/data/cases"

const bmImages = [
  {
    title: "BM 首页优化信息图",
    description: "从首页入口、赛事筛选、盘口色彩和投注区组织角度，整理移动端首页改版方向。",
    src: "/case-assets/bm-optimization/bm-home-optimization.png",
    srcWebp: "/case-assets/bm-optimization/bm-home-optimization.webp",
    srcAvif: "/case-assets/bm-optimization/bm-home-optimization.avif",
    width: 1600,
    height: 1160,
  },
  {
    title: "BM 详情页优化信息图",
    description: "从赛事详情、玩法分组、信息层级和操作路径角度，整理详情页体验优化方向。",
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
  title: "BM优化案例",
  description: "B优化项目里的首页与详情页优化信息图。",
  alternates: {
    canonical: absoluteUrl("/cases/bm-optimization"),
  },
}

export default function BmOptimizationCasePage() {
  const caseItem = getCaseItem("bm-optimization")
  const learningGoal = caseItem?.learningGoal ?? "理解移动端体育页面改版时应优先优化哪些承接路径。"
  const estimatedMinutes = caseItem?.estimatedMinutes ?? 20
  const difficulty = caseItem?.difficulty ?? "进阶"

  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">案例模块</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">BM优化</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">聚焦移动端体育页面的首页承接、详情页路径和投注区信息层级，适合对照信息图复盘改版重点。</p>
            <CaseLearningStatePanel
              slug="bm-optimization"
              learningGoal={learningGoal}
              estimatedMinutes={estimatedMinutes}
              difficulty={difficulty}
              audience={caseItem?.audience}
            />
          </div>
          <Link href="/cases" className="inline-flex w-fit rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-brand-100 hover:text-brand-700">
            返回案例模块
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["bm-optimization"]} />
      </div>

      <LongImageGallery
        items={versionedBmImages.map((item) => ({
          id: item.src,
          title: item.title,
          description: item.description,
          src: item.src,
          srcWebp: item.srcWebp,
          srcAvif: item.srcAvif,
          width: item.width,
          height: item.height,
          sourceHref: item.src,
        }))}
        emptyMessage="BM 信息图暂未接入，后续补充后可继续展示。"
      />
    </div>
  )
}
