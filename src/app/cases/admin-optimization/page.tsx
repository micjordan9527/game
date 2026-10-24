import { ExternalLink } from "lucide-react"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseIframeVersionPanel } from "@/components/cases/CaseIframeVersionPanel"
import { AdminOptimizationPreview } from "@/components/cases/AdminOptimizationPreview"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { getCaseItem } from "@/data/cases"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
import { appendAssetVersion, getAssetVersionMeta } from "@/lib/assetVersion"
import { assetPath } from "@/lib/assets"
import { CaseStudyAnalysis } from "@/components/cases/CaseStudyAnalysis"
import { getCaseStudy } from "@/data/caseStudies"

const caseItem = getCaseItem("admin-optimization")
const study = getCaseStudy("admin-optimization")
const previewSrc = caseItem?.previewSrc
  ? `${appendAssetVersion(caseItem.previewSrc)}#version=optimized&page=dataCenter-overview`
  : undefined
const publicPreviewSrc = previewSrc ? assetPath(previewSrc) : undefined
const previewVersionMeta = previewSrc ? getAssetVersionMeta(previewSrc) : { version: null, updatedAt: null }

export const metadata = {
  title: "后台优化案例",
  description: "依据本地原型拆解后台角色任务、统计口径与异常入口，附可复制下载的评审清单。",
  alternates: {
    canonical: absoluteUrl("/cases/admin-optimization"),
  },
}

export default function AdminOptimizationCasePage() {
  if (!caseItem) return null

  const learningGoal = caseItem.learningGoal ?? "围绕角色视角理解后台结构优化思路。"
  const estimatedMinutes = caseItem.estimatedMinutes ?? 20
  const difficulty = caseItem.difficulty ?? "进阶"

  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">案例模块</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">后台优化</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">
              对照本地新版原型，分析老板、运营、财务、客服的判断任务，理解角色看板、统计口径和异常入口的组织方式。沿着材料观察、判断依据与建议验收，完成一次有证据的后台评审。
            </p>
            <p className="mt-4 max-w-3xl rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold leading-7 text-brand-700">
              新版可直接预览；原版入口依赖项目提供的网络与登录条件。原型数据和操作仅作演示，实际权限、资金处理与效率改善需单独验证。
            </p>
            <CaseIframeVersionPanel version={previewVersionMeta.version} updatedAt={previewVersionMeta.updatedAt} />
            <CaseLearningStatePanel
              slug={caseItem.slug}
              learningGoal={learningGoal}
              estimatedMinutes={estimatedMinutes}
              difficulty={difficulty}
              audience={caseItem.audience}
            />
          </div>
          {publicPreviewSrc ? (
            <a href={publicPreviewSrc} target="_blank" rel="noopener" className="inline-flex w-fit items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              新窗口打开
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </section>

      {study ? <CaseStudyAnalysis study={study} title={caseItem.title} /> : null}

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["admin-optimization"]} />
      </div>

      <section id="case-materials" className="mt-8 scroll-mt-24" aria-labelledby="case-materials-title">
        <h2 id="case-materials-title" className="mb-4 text-2xl font-semibold text-ink">查看本地交互原型</h2>
        {previewSrc ? (
          <AdminOptimizationPreview src={previewSrc} version={previewVersionMeta.version} updatedAt={previewVersionMeta.updatedAt} />
        ) : (
          <div className="rounded-lg border border-line bg-white p-8 text-sm leading-7 text-muted">原型暂时无法显示，请使用页面顶部的新窗口入口。</div>
        )}
      </section>
      <KnowledgeLinks resources={resourcesForResource("案例", "admin-optimization")} title="相关主题与实用资料" />
    </div>
  )
}
