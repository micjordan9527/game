import Link from "next/link"
import { Suspense } from "react"
import { DesignDirectoryReturnLink } from "@/components/article/DesignArticleNavigation"
import { EdgeStatePreview } from "@/components/design/EdgeStatePreview"
import { StatusFeedbackTool } from "@/components/design/StatusFeedbackTool"
import { stateExamples } from "@/data/stateExamples"
import { absoluteUrl } from "@/lib/seo"

export const metadata = { title: "界面状态对照", description: "对照加载、空结果、失败、受限、处理中与未知结果，并打开对应界面示例。", alternates: { canonical: absoluteUrl("/design/states") } }

export default function StateComparisonPage() {
  return <div className="container-shell py-8">
    <Link href="/cases#business-cases" className="text-sm font-semibold text-brand-700">← 业务流程案例</Link>
    <div className="mt-2"><Suspense fallback={null}><DesignDirectoryReturnLink /></Suspense></div>
    <h1 className="mt-4 text-3xl font-semibold text-ink">界面状态对照</h1>
    <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">同样是没有展示结果，原因可能是尚在加载、查询为空、请求失败或当前受限。对照结果是否已确认、影响范围与下一步，再打开对应演示。以下均为界面示意与演示数据。</p>
    <section aria-label="六种界面状态对照" className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{stateExamples.map((item) => <article key={item.title} className="min-w-0 rounded-xl border border-line bg-white p-5"><p className="text-xs font-semibold text-brand-700">{item.result}</p><h2 className="mt-2 text-xl font-semibold text-ink">{item.title}</h2><p className="mt-3 rounded-lg bg-paper p-3 text-sm font-semibold leading-7 text-ink">{item.message}</p><p className="mt-3 text-sm leading-7 text-muted">{item.next}</p><Link href={item.href} className="mt-4 inline-block text-sm font-semibold text-brand-700">{item.link} →</Link></article>)}</section>
    <div id="state-feedback" className="scroll-mt-24"><StatusFeedbackTool /></div>
    <div id="edge-states" className="scroll-mt-24"><EdgeStatePreview /></div>
  </div>
}
