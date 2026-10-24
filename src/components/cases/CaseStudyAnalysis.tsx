import Link from "next/link"
import type { CaseStudy } from "@/data/caseStudies"
import { CopyTemplateButton } from "@/components/templates/CopyTemplateButton"
import { DownloadTemplateButton } from "@/components/templates/DownloadTemplateButton"
import { absoluteUrl } from "@/lib/seo"
import { assetPath } from "@/lib/assets"

export function CaseStudyAnalysis({ study, title }: { study: CaseStudy; title: string }) {
  const checklist = [
    `# ${title} · 案例评审清单`, "", `材料类型：${study.materialType}`, "", study.evidenceNote, "",
    "评审人：", "评审日期：", "版本 / 设备 / 数据范围：", "任务：", "",
    ...study.checklist.map((item) => `- [ ] ${item}`), "",
    "## 证据与结论", "", "- 材料中观察到的内容：", "- 分析假设：", "- 测试输入与期望：", "- 实际结果及证据：", "- 未验证项与负责人：", "- 复核结论：", "",
    "## 材料", "", ...study.sources.map((source) => `- [${source.title}](${absoluteUrl(source.href)})`), "",
    `案例分析：${absoluteUrl(`/cases/${study.slug}`)}`, "",
  ].join("\n")

  return (
    <div className="mt-8 space-y-8" id="case-analysis">
      <nav aria-label="案例阅读导航" className="flex flex-wrap gap-2">
        {[["case-context", "问题背景"], ["case-structure", "原有结构"], ["case-decisions", "方案与依据"], ["case-checklist", "评审清单"], ["case-materials", "查看材料"]].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-brand-700">{label}</a>
        ))}
      </nav>
      <section id="case-context" className="scroll-mt-24 rounded-xl border border-line bg-white p-5 md:p-8" aria-labelledby="case-context-title">
        <p className="text-xs font-semibold text-brand-700">{study.materialType}</p>
        <h2 id="case-context-title" className="mt-2 text-2xl font-semibold text-ink">问题背景与材料边界</h2>
        <p className="mt-4 text-sm leading-7 text-muted">{study.context}</p>
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">{study.evidenceNote}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {study.sources.map((source) => <a key={source.href} href={assetPath(source.href)} target="_blank" rel="noopener" className="text-sm font-semibold leading-7 text-brand-700 underline underline-offset-4">{source.title} ↗</a>)}
        </div>
      </section>
      <section id="case-structure" className="scroll-mt-24 rounded-xl border border-line bg-white p-5 md:p-8" aria-labelledby="case-structure-title">
        <h2 id="case-structure-title" className="text-2xl font-semibold text-ink">原有结构与角色任务</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-muted">{study.originalStructure.map((item) => <li key={item} className="border-l-2 border-brand-100 pl-4">{item}</li>)}</ul>
        <div className="mt-6 grid gap-3 md:grid-cols-2">{study.roles.map((item) => (
          <div key={item.role} className="min-w-0 rounded-lg border border-line bg-paper p-4">
            <h3 className="font-semibold text-ink">{item.role}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{item.task}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{item.review}</p>
          </div>
        ))}</div>
      </section>
      <section id="case-decisions" className="scroll-mt-24" aria-labelledby="case-decisions-title">
        <h2 id="case-decisions-title" className="text-2xl font-semibold text-ink">调整方案与判断依据</h2>
        <p className="mt-3 text-sm leading-7 text-muted">先看材料实际呈现的内容，再把判断转成可以复核的问题。</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">{study.changes.map((item, index) => (
          <article key={item.title} className="min-w-0 rounded-xl border border-line bg-white p-5 md:p-6">
            <p className="text-xs font-semibold text-brand-700">分析 {index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
            <dl className="mt-4 space-y-4 text-sm leading-7">
              <div><dt className="font-semibold text-brand-700">材料观察</dt><dd className="mt-1 text-muted">{item.observation}</dd></div>
              <div><dt className="font-semibold text-ink">对照位置</dt><dd className="mt-1 text-muted">{item.evidence}</dd></div>
              <div><dt className="font-semibold text-ink">判断依据</dt><dd className="mt-1 text-muted">{item.reasoning}</dd></div>
              <div className="rounded-lg bg-paper p-3"><dt className="font-semibold text-ink">建议验收</dt><dd className="mt-1 text-muted">{item.verification}</dd></div>
            </dl>
          </article>
        ))}</div>
      </section>
      <section id="case-checklist" className="scroll-mt-24 rounded-xl border border-line bg-white p-5 md:p-8" aria-labelledby="case-checklist-title">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 id="case-checklist-title" className="text-2xl font-semibold text-ink">可复用评审清单</h2>
          <div className="flex flex-wrap gap-2"><CopyTemplateButton content={checklist} /><DownloadTemplateButton content={checklist} filename={`${study.slug}-review.md`} /></div>
        </div>
        <ul className="mt-5 space-y-3 text-sm leading-7 text-muted">{study.checklist.map((item, index) => <li key={item} className="flex gap-3"><span className="shrink-0 font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0">{item}</span></li>)}</ul>
        <div className="mt-6 rounded-lg bg-paper p-4"><h3 className="font-semibold text-ink">动手练习</h3><p className="mt-2 text-sm leading-7 text-muted">{study.exercise}</p></div>
        <p className="mt-4 text-sm leading-7 text-muted">复制或下载后，补充观察证据、测试输入、实际结果和复核结论。继续使用<Link href="/templates" className="font-semibold text-brand-700 underline underline-offset-4">模板库</Link>中的需求与验收资料。</p>
      </section>
    </div>
  )
}
