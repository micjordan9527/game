import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseIframeVersionPanel } from "@/components/cases/CaseIframeVersionPanel"
import { AdminOptimizationPreview } from "@/components/cases/AdminOptimizationPreview"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { getCaseItem } from "@/data/cases"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion, getAssetVersionMeta } from "@/lib/assetVersion"
import { assetPath } from "@/lib/assets"

const caseItem = getCaseItem("admin-optimization")
const previewSrc = caseItem?.previewSrc
  ? `${appendAssetVersion(caseItem.previewSrc)}#version=optimized&page=dataCenter-overview`
  : undefined
const publicPreviewSrc = previewSrc ? assetPath(previewSrc) : undefined
const previewVersionMeta = previewSrc ? getAssetVersionMeta(previewSrc) : { version: null, updatedAt: null }

export const metadata = {
  title: "后台优化案例",
  description: "后台优化目标、特色与原版新版对比预览。",
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
              优化目标是把后台从功能堆叠改成角色清晰、数据可读、操作路径更短的工作台。新版以老板、运营、财务、客服等角色视角组织核心看板和常用动作，突出经营概览、资金状态、用户服务和异常处理等高频场景。下方原型支持切换原版与新版对比，也可以点击说明按钮查看新版与旧版的差异说明。
            </p>
            <p className="mt-4 max-w-3xl rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold leading-7 text-brand-700">
              重要说明：原版后台需打开 WARP 并登录后方可使用；新版预览可直接查看。
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
            <Link href={publicPreviewSrc} target="_blank" className="inline-flex w-fit items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              新窗口打开
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </section>

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["admin-optimization"]} />
      </div>

      {previewSrc ? (
        <AdminOptimizationPreview src={previewSrc} version={previewVersionMeta.version} updatedAt={previewVersionMeta.updatedAt} />
      ) : (
        <section className="mt-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm"><div className="p-8 text-sm leading-7 text-muted">案例文件暂未接入。</div></section>
      )}
    </div>
  )
}
