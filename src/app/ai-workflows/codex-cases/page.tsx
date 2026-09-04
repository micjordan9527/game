import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ClipboardCheck, FileText, ListChecks, Sparkles } from "lucide-react"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { Badge } from "@/components/common/Badge"
import { SectionHeader } from "@/components/common/SectionHeader"
import { codexCaseStudies } from "@/data/aiWorkflows"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Codex 实战案例库",
  description: "把 W-Gaming 网站建设中的真实 Codex 协作任务复盘成可复用工作流。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows/codex-cases"),
  },
  openGraph: {
    title: "Codex 实战案例库 | 包网知识库",
    description: "从触发场景、输入材料、执行动作到复用提示词，沉淀真实 Codex 工作流。",
    url: absoluteUrl("/ai-workflows/codex-cases"),
    type: "website",
  },
}

const caseStructure = [
  "触发场景：为什么要找 Codex",
  "输入材料：给它什么它才不会乱猜",
  "执行动作：Codex 应该按什么顺序做",
  "最终结果：页面、数据、检查或复盘产物",
  "复用提示词：下次怎么一句话开局",
]

export default function CodexCasesPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回 AI 工作流库
      </Link>

      <section className="grid gap-8 py-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-700">Codex Case Studies</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">Codex 实战案例库</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted md:text-lg">
            这里不只是记录“做过什么”，而是把每个任务拆成下次还能复用的工作流。你可以从案例里反推：该给 Codex 什么材料、先让它分析什么、做到什么程度算完成。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="brand">真实任务</Badge>
            <Badge>输入材料</Badge>
            <Badge>执行动作</Badge>
            <Badge>复用提示词</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <ListChecks className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">案例固定结构</h2>
              <p className="mt-1 text-sm text-muted">每个案例都按同一套结构复盘，方便横向比较。</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {caseStructure.map((item) => (
              <div key={item} className="rounded-md bg-paper px-4 py-3 text-sm font-medium text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Cases" title="已经沉淀的工作流案例" description="每个案例都保留一个可直接复制的开场提示词，方便下次从相似任务继续。" />
        <div className="mt-8 grid gap-5">
          {codexCaseStudies.map((caseStudy, index) => (
            <article key={caseStudy.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="brand">案例 {String(index + 1).padStart(2, "0")}</Badge>
                    {caseStudy.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold leading-8 text-ink">{caseStudy.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{caseStudy.trigger}</p>
                </div>
                <CopyPromptButton content={caseStudy.reusablePrompt} />
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <CaseList title="输入材料" items={caseStudy.materials} icon="file" />
                <CaseList title="Codex 动作" items={caseStudy.codexMoves} icon="check" />
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
                <div className="rounded-md border border-line bg-paper p-4">
                  <div className="text-sm font-semibold text-ink">最终结果</div>
                  <p className="mt-2 text-sm leading-7 text-muted">{caseStudy.result}</p>
                </div>
                <div className="rounded-md border border-brand-100 bg-brand-50 p-4">
                  <div className="text-sm font-semibold text-brand-700">下次升级</div>
                  <p className="mt-2 text-sm leading-7 text-brand-700">{caseStudy.nextUpgrade}</p>
                </div>
              </div>

              <pre className="mt-5 whitespace-pre-wrap rounded-md border border-line bg-paper p-4 text-sm leading-7 text-ink">{caseStudy.reusablePrompt}</pre>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-ink">怎么继续扩展这个案例库</h2>
              <p className="mt-3 text-sm leading-7 text-brand-700">
                每做完一个有代表性的任务，就补一张案例卡：触发场景、输入材料、Codex 动作、最终结果、复用提示词。这样工作流库会越来越像一本自己的 AI 操作手册。
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          回到工作流总览
        </Link>
        <Link href="/ai-workflows/prompt-library" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          打开提示词模板库
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}

function CaseList({ title, items, icon }: { title: string; items: string[]; icon: "file" | "check" }) {
  const Icon = icon === "file" ? FileText : ClipboardCheck

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
