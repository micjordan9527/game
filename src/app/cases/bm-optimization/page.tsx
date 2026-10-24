import Link from "next/link"
import { LongImageGallery } from "@/components/cases/LongImageGallery"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { appendAssetVersion } from "@/lib/assetVersion"
import { getCaseItem } from "@/data/cases"
import { getCaseStudy } from "@/data/caseStudies"
import { CaseStudyAnalysis } from "@/components/cases/CaseStudyAnalysis"

const bmImages = [
  {
    title: "BM 首页优化信息图",
    description: "素材标题为“BM 后台手机端体验优化”。对照左侧标注的旧版截图和右侧生成式提案，观察状态、分类与底部区域。",
    src: "/case-assets/bm-optimization/bm-home-optimization.png",
    srcWebp: "/case-assets/bm-optimization/bm-home-optimization.webp",
    srcAvif: "/case-assets/bm-optimization/bm-home-optimization.avif",
    width: 1600,
    height: 1160,
  },
  {
    title: "BM 详情页优化信息图",
    description: "对照头区、内容分类、信息块与底部固定栏。吸顶、触控和遮挡需要在交互样机中另行验证。",
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
  description: "区分 BM 首页与详情页对照图中的材料观察和视觉提案，附判断依据及手机界面评审清单。",
  alternates: {
    canonical: absoluteUrl("/cases/bm-optimization"),
  },
}

export default function BmOptimizationCasePage() {
  const caseItem = getCaseItem("bm-optimization")
  const study = getCaseStudy("bm-optimization")
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
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">对照两张 BM 手机端信息图，分析首页分类、详情状态和固定操作区。素材右侧为生成式视觉提案，阅读时分别记录可见变化、分析依据与仍需交互验证的问题。</p>
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

      {study && caseItem ? <CaseStudyAnalysis study={study} title={caseItem.title} /> : null}

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["bm-optimization"]} />
      </div>

      <section id="case-materials" className="mt-8 scroll-mt-24" aria-labelledby="case-materials-title">
        <h2 id="case-materials-title" className="text-2xl font-semibold text-ink">查看首页与详情页对照图</h2>
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
        emptyMessage="暂时无法显示对照图，请使用材料边界说明中的原图链接。"
      />
      </section>
      <KnowledgeLinks resources={resourcesForResource("案例", "bm-optimization")} title="相关主题与实用资料" />
    </div>
  )
}
