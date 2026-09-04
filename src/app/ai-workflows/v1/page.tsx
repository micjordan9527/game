import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, ClipboardCheck, FileText, FolderKanban, Search, ShieldCheck, Sparkles } from "lucide-react"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { Badge } from "@/components/common/Badge"
import { SectionHeader } from "@/components/common/SectionHeader"
import {
  codexCaseStudies,
  promptTemplates,
  workflowEntryPoints,
  workflowPlaybooks,
  workflowScenarios,
  workflowStages,
  workflowTools,
} from "@/data/aiWorkflows"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI 工作流库 V1 封版",
  description: "AI 工作流库第一版封存页，保留复杂版的入口、流程、场景、提示词和案例结构。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows/v1"),
  },
  openGraph: {
    title: "AI 工作流库 V1 封版 | 包网知识库",
    description: "保留 AI 工作流库第一版结构，作为后续 V2 简化改版的对照版本。",
    url: absoluteUrl("/ai-workflows/v1"),
    type: "website",
  },
}

const summaryCards = [
  { label: "先选任务", value: `${workflowEntryPoints.length} 类入口`, icon: Search },
  { label: "再套流程", value: `${workflowStages.length} 步方法`, icon: FolderKanban },
  { label: "直接复用", value: `${promptTemplates.length} 条模板`, icon: FileText },
]

const resourceLinks = [
  {
    title: "提示词模板库",
    description: "集中放信息图、界面图、Banner、Figma 还原和网站搭建提示词，打开就能复制。",
    href: "/ai-workflows/prompt-library",
    icon: FileText,
  },
  {
    title: "Codex 实战案例库",
    description: "用真实任务复盘触发场景、输入材料、Codex 动作、结果和下次复用方式。",
    href: "/ai-workflows/codex-cases",
    icon: BookOpen,
  },
  {
    title: "Figma 策略画布工作流",
    description: "专门处理 Arrange 这类超大 Figma 画布，从节点读取到页面方案。",
    href: "/ai-workflows/figma-strategy",
    icon: Sparkles,
  },
]

const handoffSteps = [
  { title: "目标", description: "一句话说明你要完成什么，不要一开始贴太多杂料。" },
  { title: "材料", description: "给 Figma、截图、文件路径、旧页面、文案草稿或线上地址。" },
  { title: "限制", description: "说明要保留什么、不能改哪些结构、最终用什么形式交付。" },
  { title: "验收", description: "说清最后怎么判断完成，例如页面能打开、移动端不溢出、构建通过。" },
]

export default function AiWorkflowsPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <section className="grid gap-8 py-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-700">AI Workflows</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">AI 工作流库 V1 封版</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted md:text-lg">
            这是第一版封存页，保留复杂版的入口、流程、场景、提示词模板、案例打法和工具链地图，方便和 V2 简化版对照。
          </p>
          <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-ink">一句话理解</div>
            <p className="mt-3 text-lg font-semibold leading-8 text-brand-700">输入材料 / AI 拆解 / 产出结果 / 人工验收 / 复用模板</p>
            <p className="mt-3 text-sm leading-7 text-muted">
              每个任务都按这个链路走：先给清楚材料，再让 Codex 拆结构和执行，最后用页面、构建、截图或 Figma 节点来验收。
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {summaryCards.map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white p-4 shadow-sm">
                <div>
                  <div className="text-sm font-semibold text-ink">{item.label}</div>
                  <div className="mt-1 text-sm text-muted">{item.value}</div>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            )
          })}
          <div className="rounded-lg border border-brand-100 bg-brand-50 p-4 text-sm leading-7 text-brand-700">
            先从下面四个入口选一个，不需要先读完整页。
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Library" title="先打开这 3 个高频库" description="这三个页面最适合反复用：一个复制提示词，一个看真实案例，一个拆 Figma 大画布。" />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {resourceLinks.map((resource) => {
            const Icon = resource.icon

            return (
              <Link key={resource.title} href={resource.href} className="group rounded-lg border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-ink">{resource.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{resource.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 group-hover:text-ink">
                  进入
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="entry-points" className="scroll-mt-24 py-12">
        <SectionHeader eyebrow="Start Here" title="你现在想让 AI 帮你做什么？" description="先按任务选择入口。每个入口都告诉你：要给 Codex 什么材料、Codex 会怎么做、最后得到什么。" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {workflowEntryPoints.map((entry, index) => (
            <article key={entry.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-brand-700">入口 {String(index + 1).padStart(2, "0")}</div>
                  <h2 className="mt-2 text-xl font-semibold leading-8 text-ink">{entry.title}</h2>
                  <p className="mt-2 text-sm text-muted">{entry.audience}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper text-brand-700 ring-1 ring-line">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <p className="mt-4 rounded-md bg-paper p-3 text-sm leading-7 text-muted">{entry.problem}</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ListBlock title="你给 Codex" items={entry.giveCodex} />
                <ListBlock title="Codex 会做" items={entry.codexSteps} />
              </div>

              <div className="mt-5 rounded-md border border-brand-100 bg-brand-50 p-4">
                <div className="text-sm font-semibold text-brand-700">可以这样开头</div>
                <p className="mt-2 text-sm leading-7 text-brand-700">{entry.promptStart}</p>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted">
                <span className="font-semibold text-ink">最后产出：</span>
                {entry.result}
              </p>
              {entry.href ? (
                <Link href={entry.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
                  查看完整工作流
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="How To Brief" title="给 AI 任务时，按这四句话说" description="很多任务看不懂，是因为材料、目标和验收混在一起。先按这个顺序说，Codex 才好接。" />
            <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-ink">
                <ShieldCheck className="h-5 w-5 text-brand-700" aria-hidden="true" />
                最小交接格式
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                我想做什么；我给你哪些材料；哪些不能动；最后你要怎么验证。
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {handoffSteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</div>
                <h2 className="mt-4 text-lg font-semibold text-ink">{step.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Process" title="通用五步流程" description="不管是做网页、读 Figma、接图片，还是排查发布问题，底层流程基本一样。" />
        <div className="mt-8 grid gap-3 lg:grid-cols-5">
          {workflowStages.map((stage, index) => (
            <article key={stage.title} className="rounded-lg border border-line bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</div>
              <h2 className="mt-3 text-base font-semibold text-ink">{stage.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{stage.description}</p>
              <p className="mt-3 rounded-md bg-paper px-3 py-2 text-xs leading-6 text-muted">产出：{stage.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Scenarios" title="场景库：遇到这些任务时怎么用" description="这里把真实做过的任务归类成可复用场景。先看“什么时候用”，再看输入、产出和验收。" />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {workflowScenarios.map((scenario) => (
            <article key={scenario.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {scenario.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-ink">{scenario.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{scenario.description}</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <ListBlock title="输入材料" items={scenario.inputs} />
                <ListBlock title="产出结果" items={scenario.outputs} />
              </div>
              <p className="mt-4 rounded-md bg-brand-50 p-3 text-sm leading-7 text-brand-700">
                <span className="font-semibold">验收：</span>
                {scenario.acceptance}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="prompt-templates" className="scroll-mt-24 py-12">
        <SectionHeader eyebrow="Prompt Templates" title="高价值生产提示词" description="优先放能直接产出图、界面、设计还原和网站基础版的模板。" />
        <Link href="/ai-workflows/prompt-library" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          打开完整提示词库
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="mt-8 grid gap-4">
          {promptTemplates.map((prompt) => (
            <details key={prompt.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="brand">{prompt.scenario}</Badge>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-ink">{prompt.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-muted">{prompt.purpose}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-md bg-paper px-3 py-2 text-sm font-semibold text-brand-700">
                    展开模板
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </summary>
              <div className="mt-5">
                <CopyPromptButton content={prompt.template} />
              </div>
              <pre className="mt-5 whitespace-pre-wrap rounded-md border border-line bg-paper p-4 text-sm leading-7 text-ink">{prompt.template}</pre>
              <div className="mt-4">
                <div className="text-sm font-semibold text-ink">使用前检查</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {prompt.checkpoints.map((checkpoint) => (
                    <span key={checkpoint} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                      <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {checkpoint}
                    </span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Case Studies" title="Codex 实战案例库" description="把做过的任务按“触发、材料、动作、结果、下次复用”复盘，方便以后照着开新任务。" />
        <Link href="/ai-workflows/codex-cases" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          查看完整案例库
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {codexCaseStudies.slice(0, 2).map((caseStudy) => (
            <article key={caseStudy.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {caseStudy.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-ink">{caseStudy.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{caseStudy.trigger}</p>
              <p className="mt-4 rounded-md bg-brand-50 p-3 text-sm leading-7 text-brand-700">
                <span className="font-semibold">复用方式：</span>
                {caseStudy.nextUpgrade}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Playbooks" title="案例打法库" description="这些是已经跑通过的做法，用来告诉你“一类任务可以怎么复盘和复用”。" />
            <div className="mt-8 grid gap-4">
              {workflowPlaybooks.map((playbook) => (
                <article key={playbook.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-ink">{playbook.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{playbook.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playbook.flow.map((step, index) => (
                      <span key={step} className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-muted">
                        {index > 0 ? <ArrowRight className="h-3 w-3" aria-hidden="true" /> : null}
                        {step}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 rounded-md bg-brand-50 px-4 py-3 text-sm leading-7 text-brand-700">复用经验：{playbook.reusableLesson}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">工具链地图</h2>
                <p className="mt-1 text-sm text-muted">每个工具只负责一段，不要期待一个工具包办所有事。</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {workflowTools.map((tool) => (
                <div key={tool.name} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                  <div className="text-sm font-semibold text-ink">{tool.name}</div>
                  <p className="mt-2 text-sm leading-7 text-muted">{tool.role}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tool.bestFor.map((item) => (
                      <span key={item} className="rounded-md bg-paper px-2.5 py-1 text-xs font-medium text-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-sm font-semibold text-ink">{title}</div>
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
