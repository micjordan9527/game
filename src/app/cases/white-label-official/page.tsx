import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { LearningCheck } from "@/components/common/LearningCheck"
import { CaseIframeVersionPanel } from "@/components/cases/CaseIframeVersionPanel"
import { CaseLearningStatePanel } from "@/components/cases/CaseLearningStatePanel"
import { getCaseItem } from "@/data/cases"
import { caseLearningChecks } from "@/data/learningChecks"
import { absoluteUrl } from "@/lib/seo"
import { appendAssetVersion, getAssetVersionMeta } from "@/lib/assetVersion"
import { assetPath } from "@/lib/assets"

const caseItem = getCaseItem("white-label-official")
const previewSrc = caseItem?.previewSrc ? appendAssetVersion(caseItem.previewSrc) : undefined
const publicPreviewSrc = previewSrc ? assetPath(previewSrc) : undefined
const previewVersionMeta = previewSrc ? getAssetVersionMeta(previewSrc) : { version: null, updatedAt: null }

export const metadata = {
  title: "包网官网案例",
  description: "包网官网静态页案例预览。",
  alternates: {
    canonical: absoluteUrl("/cases/white-label-official"),
  },
}

export default function WhiteLabelOfficialCasePage() {
  if (!caseItem) return null

  const learningGoal = caseItem.learningGoal ?? "先对官网结构做一次快速检查：是否能承接咨询并体现交付边界。"
  const estimatedMinutes = caseItem.estimatedMinutes ?? 12
  const difficulty = caseItem.difficulty ?? "入门"

  return (
    <div className="container-shell py-12">
      <section className="rounded-lg border border-line bg-white p-5 shadow-sm md:p-8">
        <p className="mb-2 text-sm font-semibold text-brand-700">案例模块</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">包网官网</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-muted">用于观察包网官网如何承接用户理解、展示服务能力和组织咨询路径，下方可直接预览页面效果。</p>
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
        {publicPreviewSrc ? <CaseIframeVersionPanel version={previewVersionMeta.version} updatedAt={previewVersionMeta.updatedAt} /> : null}
      </section>

      <div className="mt-8">
        <LearningCheck check={caseLearningChecks["white-label-official"]} />
      </div>

      <section className="mt-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
        {publicPreviewSrc ? (
          <iframe
            src={publicPreviewSrc}
            title="包网官网案例预览"
            className="h-[78vh] w-full bg-white"
            loading="lazy"
            sandbox="allow-scripts allow-forms allow-popups"
          />
        ) : (
          <div className="p-8 text-sm leading-7 text-muted">案例文件暂未接入。</div>
        )}
      </section>
    </div>
  )
}
