import type { Metadata } from "next"
import Link from "next/link"
import { demonstrationEntries, demonstrationGroups } from "@/data/demonstrationEntries"
import { businessQuestions } from "@/data/businessQuestions"
import { BusinessQuestionNavigation } from "@/components/updates/BusinessQuestionNavigation"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "功能演示目录",
  description: "按六个业务问题查看排查路径，或按场景打开钱包、账号、代理、BM、U8和官网的已有演示。",
  alternates: { canonical: absoluteUrl("/updates/demonstrations") },
}

export default function DemonstrationsPage() {
  return (
    <div className="container-shell max-w-5xl py-8 md:py-10">
      <Link href="/updates#demonstrations" className="text-sm font-semibold text-brand-700">← 更新记录</Link>
      <h1 className="mt-5 text-3xl font-semibold text-ink">功能演示目录</h1>
      <p className="mt-3 text-sm leading-7 text-muted">{demonstrationEntries.length} 个已有功能的说明与入口。各次发布新增或调整的内容见更新记录。</p>
      <a href="#business-process" className="mt-3 inline-block text-sm font-semibold text-brand-700">按场景查看 {demonstrationEntries.length} 个演示 ↓</a>
      <section id="business-questions" className="mt-7 scroll-mt-24" aria-labelledby="business-questions-title">
        <h2 id="business-questions-title" className="text-xl font-semibold text-ink">按问题找入口</h2>
        <p className="mt-2 text-sm leading-7 text-muted">先辨认当前问题，再对照同一记录的状态与证据。每项提供演示和正文说明。</p>
        <BusinessQuestionNavigation items={businessQuestions.map(({ id, title }) => ({ id, title }))} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {businessQuestions.map((item) => (
            <article key={item.id} id={`question-${item.id}`} className="min-w-0 scroll-mt-24 rounded-xl border border-line bg-white p-5" aria-labelledby={`question-${item.id}-title`}>
              <h3 id={`question-${item.id}-title`} tabIndex={-1} className="font-semibold leading-7 text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.summary}</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-ink">
                {item.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
              <p className="mt-4 border-t border-line pt-3 text-xs leading-6 text-muted">判断边界：{item.boundary}</p>
              <div className="mt-3 flex flex-col items-start gap-2 text-sm font-semibold leading-7 text-brand-700">
                <Link href={item.demo.href}>{item.demo.label} →</Link>
                <Link href={item.article.href}>{item.article.label} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <nav aria-label="演示场景定位" className="mt-5 flex flex-wrap gap-2">
        {demonstrationGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-brand-700">{group.title} · {demonstrationEntries.filter((item) => item.group === group.id).length}</a>)}
      </nav>
      <div className="mt-7 space-y-8" role="region" aria-label="已有功能演示">
        {demonstrationGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-24" aria-labelledby={`${group.id}-title`}>
            <h2 id={`${group.id}-title`} className="text-xl font-semibold text-ink">{group.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{group.description}</p>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {demonstrationEntries.filter((item) => item.group === group.id).map((item) => (
                <li key={item.title} data-demo-entry className="min-w-0 rounded-xl border border-line bg-white p-5">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
                  <p className="mt-2 text-xs leading-6 text-muted">位置：{item.location}</p>
                  <Link href={item.href} className="mt-3 inline-block text-sm font-semibold text-brand-700">打开{item.title} →</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
