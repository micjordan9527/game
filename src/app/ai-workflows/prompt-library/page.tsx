import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ClipboardCheck, ImageIcon, Layers3, MonitorSmartphone, PanelsTopLeft, Sparkles } from "lucide-react"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { Badge } from "@/components/common/Badge"
import { SectionHeader } from "@/components/common/SectionHeader"
import { productionPromptCards } from "@/data/aiWorkflows"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI 提示词模板库",
  description: "整理信息图、界面图、Banner、Figma 还原和网站搭建等高价值 AI 生产提示词。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows/prompt-library"),
  },
  openGraph: {
    title: "AI 提示词模板库 | 包网知识库",
    description: "看案例流程，复制高价值生产提示词。",
    url: absoluteUrl("/ai-workflows/prompt-library"),
    type: "website",
  },
}

const useSteps = [
  {
    title: "看案例",
    description: "先看这条提示词适合产出什么：信息图、界面图、Banner、设计还原或网站基础版。",
  },
  {
    title: "换材料",
    description: "把主题、读者、尺寸、Figma 链接、项目路径和必须保留的内容替换进去。",
  },
  {
    title: "复制执行",
    description: "直接复制提示词，让 Codex 或图像模型按流程输出方案、图片提示词或页面实现。",
  },
]

const categoryIcons = {
  图文内容: ImageIcon,
  产品界面: MonitorSmartphone,
  视觉资产: PanelsTopLeft,
  设计还原: Layers3,
  网站搭建: Sparkles,
}

export default function PromptLibraryPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回 AI 工作流库
      </Link>

      <section className="grid gap-8 py-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-700">Prompt Library</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">AI 提示词模板库</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted md:text-lg">
            这里不放零散聊天话术，只放能直接产出东西的高价值场景：信息图、界面图、Banner、Figma 还原和网站搭建。每条都按“案例画面 / 流程 / 复制提示词”来用。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="brand">图文案例</Badge>
            <Badge>流程清楚</Badge>
            <Badge>可复制</Badge>
            <Badge>能落地</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">最小用法</h2>
              <p className="mt-1 text-sm text-muted">选场景，换材料，复制执行。</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {useSteps.map((step, index) => (
              <div key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-paper text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="text-sm font-semibold text-ink">{step.title}</div>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="High Value Prompts" title="5 个高价值生产场景" description="每个场景都先给你一个“会长什么样”的案例，再给流程，最后复制提示词。" />
        <div className="mt-8 grid gap-6">
          {productionPromptCards.map((card, index) => {
            const Icon = categoryIcons[card.category as keyof typeof categoryIcons] ?? Sparkles

            return (
              <article key={card.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="brand">{card.category}</Badge>
                      <Badge>模板 {String(index + 1).padStart(2, "0")}</Badge>
                    </div>
                    <div className="mt-5 overflow-hidden rounded-lg border border-line bg-paper">
                      <div className="border-b border-line bg-white px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <div className="text-sm font-semibold text-ink">{card.example.title}</div>
                            <p className="mt-1 text-xs leading-5 text-muted">{card.example.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-3 p-4 sm:grid-cols-2">
                        {card.example.panels.map((panel, panelIndex) => (
                          <div key={panel} className="min-h-20 rounded-md bg-white p-3 ring-1 ring-line">
                            <div className="text-xs font-semibold text-brand-700">0{panelIndex + 1}</div>
                            <div className="mt-2 text-sm font-semibold leading-6 text-ink">{panel}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold leading-8 text-ink">{card.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-muted">{card.value}</p>
                        <p className="mt-3 rounded-md bg-brand-50 px-4 py-3 text-sm leading-7 text-brand-700">
                          <span className="font-semibold">适合：</span>
                          {card.useWhen}
                        </p>
                      </div>
                      <CopyPromptButton content={card.template} />
                    </div>

                    <div className="mt-5">
                      <div className="text-sm font-semibold text-ink">流程</div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {card.flow.map((step, stepIndex) => (
                          <span key={step} className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-muted">
                            {stepIndex > 0 ? <ArrowRight className="h-3 w-3" aria-hidden="true" /> : null}
                            {step}
                          </span>
                        ))}
                      </div>
                    </div>

                    <pre className="mt-5 max-h-[360px] overflow-auto whitespace-pre-wrap rounded-md border border-line bg-paper p-4 text-sm leading-7 text-ink">{card.template}</pre>

                    <div className="mt-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <ClipboardCheck className="h-4 w-4 text-brand-700" aria-hidden="true" />
                        复制前确认
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {card.checklist.map((item) => (
                          <span key={item} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          回到工作流总览
        </Link>
        <Link href="/ai-workflows/figma-strategy" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          查看 Figma 画布工作流
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
