import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ClipboardCheck, FileText, Layers3, ListChecks, Map } from "lucide-react"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { Badge } from "@/components/common/Badge"
import { SectionHeader } from "@/components/common/SectionHeader"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Figma 策略画布整理工作流",
  description: "把 Figma 策略画布读取、归类并整理成页面方案、汇报结构和可复用提示词。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows/figma-strategy"),
  },
  openGraph: {
    title: "Figma 策略画布整理工作流 | 包网知识库",
    description: "从 Figma 节点、截图总览、模块标题到页面方案，整理一套可复用的 AI 工作流。",
    url: absoluteUrl("/ai-workflows/figma-strategy"),
    type: "website",
  },
}

const inputPack = [
  {
    title: "Figma 节点链接",
    description: "给到具体 node-id。大画布要优先读顶层页面、节点名称、截图总览，而不是一次拉完整 metadata。",
  },
  {
    title: "目标产物",
    description: "说明你要的是网站页面、汇报提纲、SOP、提示词库，还是给设计/产品继续用的结构图。",
  },
  {
    title: "保留项",
    description: "明确哪些原始业务目标、页面模块、案例名称、设计方向必须保留，不要让 AI 过度改写。",
  },
  {
    title: "验收方式",
    description: "例如：能看出主线、能分模块、能继续写页面、能拆成任务、能给下一轮设计使用。",
  },
]

const readingSteps = [
  {
    title: "先拿总览",
    description: "获取页面或节点截图，判断画布是横向时间线、模块板、设计稿集合，还是案例对比区。",
    output: "画布形态判断",
  },
  {
    title: "再建索引",
    description: "读取顶层节点名称、坐标、尺寸和子节点数量，找出真正的分区标题。",
    output: "模块索引表",
  },
  {
    title: "抽文本样本",
    description: "从关键 section 里抓少量标题和长段说明，确认每个模块讲的是什么。",
    output: "关键文本摘录",
  },
  {
    title: "归类成主线",
    description: "把零散画布归到阶段、商业支持、案例讲解、设计规范、工作量这些可讲述主题里。",
    output: "信息架构",
  },
  {
    title: "转成页面方案",
    description: "把主线转换成页面模块：首屏解释、流程、案例、提示词、工具链、验收清单。",
    output: "可实现页面结构",
  },
]

const arrangeModules = [
  {
    title: "讲解流程",
    meaning: "把试运营、完善、爆发、商业支持、案例讲解和体系建设串成一条叙事线。",
    pageUse: "适合做成页面首屏下方的总流程，让读者先知道整张画布在讲什么。",
  },
  {
    title: "商业支持",
    meaning: "围绕包网销售、自运营、落地页转化、线上网页和设计图展示来组织材料。",
    pageUse: "适合拆成业务场景卡片，说明 AI 如何把商业目标转成页面结构。",
  },
  {
    title: "落地页设计 V1.0",
    meaning: "用 CRO、AIDA、Hero、解决方案、产品能力、案例、交付流程、FAQ 等拆转化页面。",
    pageUse: "适合沉淀为落地页分析模板：每一屏负责什么、为什么放在这个顺序。",
  },
  {
    title: "案例讲解",
    meaning: "用增长设计和具体皮肤案例，说明从策略、设计、开发到运营迭代的过程。",
    pageUse: "适合做案例打法库，讲清楚一个设计案例如何从参考变成可执行方案。",
  },
  {
    title: "整体工作量与体系",
    meaning: "包括版本迭代、游戏图、皮肤、彩票、品牌、运营和移动端设计规范。",
    pageUse: "适合做成资源地图，说明长期项目如何拆资产、拆版本、拆规范。",
  },
]

const outputs = [
  {
    title: "画布摘要",
    description: "一句话说明这个 Figma 画布在解决什么问题，再用 3-5 条列出核心主线。",
  },
  {
    title: "模块地图",
    description: "把顶层节点变成模块卡片，每张卡写清楚：模块名、作用、输入、输出。",
  },
  {
    title: "页面结构",
    description: "把画布内容转成网站可实现结构，例如首屏、流程、案例、工具链、提示词模板。",
  },
  {
    title: "任务清单",
    description: "把下一步变成可执行任务：新增页面、补数据、接导航、验证页面、复盘提示词。",
  },
  {
    title: "提示词模板",
    description: "把这次读取方式沉淀成下次可复制的 prompt，减少重新解释成本。",
  },
]

const promptBlocks = [
  {
    title: "读取 Figma 画布",
    text: "请读取这个 Figma 节点。先拿顶层页面/节点结构和截图总览，不要直接写代码。按原始材料整理：画布主线、顶层模块、每个模块的作用、适合落成什么页面内容。",
  },
  {
    title: "整理成页面方案",
    text: "请把上一步的 Figma 结构转成网站页面方案。输出：首屏说明、流程模块、场景卡片、案例打法、提示词模板、工具链地图，以及每块内容应该使用的数据字段。",
  },
  {
    title: "继续实现",
    text: "请按当前项目风格实现这个页面。优先使用已有组件和数据结构，不做无关重构。完成后运行内容检查和 TypeScript 检查，并给出本地访问路径。",
  },
]

export default function FigmaStrategyWorkflowPage() {
  return (
    <div className="container-shell py-10 md:py-12">
      <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回 AI 工作流库
      </Link>

      <section className="grid gap-8 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div>
          <p className="mb-2 text-sm font-semibold text-brand-700">Figma Strategy Workflow</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">Figma 策略画布整理工作流</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted md:text-lg">
            这个工作流用于处理超大 Figma 画布：先读总览，再建模块索引，再抽关键文本，最后把分散画布整理成页面方案、汇报结构、任务清单和提示词模板。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="brand">Figma</Badge>
            <Badge tone="blue">策略画布</Badge>
            <Badge>信息架构</Badge>
            <Badge>提示词模板</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
              <Map className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">适用场景</h2>
              <p className="mt-1 text-sm text-muted">当 Figma 已经有大量策略、页面、参考和案例，但缺少可讲述结构时使用。</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            {["策略复盘", "页面方案", "案例讲解", "设计规范整理"].map((item) => (
              <div key={item} className="rounded-md bg-paper px-4 py-3 text-sm font-medium text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Input" title="先准备这 4 类材料" description="材料越清楚，AI 越容易把画布整理成可执行方案。" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {inputPack.map((item, index) => (
            <article key={item.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</div>
              <h2 className="mt-4 text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Reading Order" title="Codex 读取 Figma 的顺序" description="大画布不要一次性读全量。先总览，再索引，再抓关键样本，最后归类。" />
        <div className="mt-8 grid gap-3 lg:grid-cols-5">
          {readingSteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-line bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-brand-700">{String(index + 1).padStart(2, "0")}</div>
              <h2 className="mt-3 text-base font-semibold text-ink">{step.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p>
              <p className="mt-3 rounded-md bg-paper px-3 py-2 text-xs leading-6 text-muted">产出：{step.output}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Arrange Example" title="以 Arrange / 策略画布为例" description="这类画布可以先按模块含义整理，再决定每块落成页面、案例还是提示词。" />
            <div className="mt-6 rounded-lg border border-line bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-ink">
                <Layers3 className="h-5 w-5 text-brand-700" aria-hidden="true" />
                整理口径
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">
                不把画布当成一张长图，而是拆成“阶段、商业支持、落地页设计、案例讲解、体系建设”这些可继续生产内容的模块。
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {arrangeModules.map((item) => (
              <article key={item.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-muted">{item.meaning}</p>
                <p className="mt-4 rounded-md bg-brand-50 p-3 text-sm leading-7 text-brand-700">
                  <span className="font-semibold">页面用途：</span>
                  {item.pageUse}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Output" title="最后应该输出什么" description="不要只给一段总结。最好输出成下一步可以直接实施的结构。" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {outputs.map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <FileText className="h-5 w-5 text-brand-700" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <SectionHeader eyebrow="Prompt" title="可直接复用的提示词" description="下面三段可以按阶段复制：先读取、再整理、最后实现。" />
            <div className="mt-6 rounded-lg border border-line bg-paper p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-ink">
                <ClipboardCheck className="h-5 w-5 text-brand-700" aria-hidden="true" />
                使用建议
              </div>
              <p className="mt-3 text-sm leading-7 text-muted">先只让 AI 分析，不要一开始就写代码。确认结构后，再进入页面实现。</p>
            </div>
          </div>

          <div className="grid gap-4">
            {promptBlocks.map((prompt) => (
              <article key={prompt.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-ink">{prompt.title}</h2>
                  <CopyPromptButton content={prompt.text} />
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-md border border-line bg-paper p-4 text-sm leading-7 text-ink">{prompt.text}</pre>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="rounded-lg border border-brand-100 bg-brand-50 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <ListChecks className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-ink">验收标准</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {["能看出画布主线", "能列出核心模块", "能说明每个模块怎么落页面", "能给出下一步实现任务", "能沉淀提示词模板", "能回到 Figma 或页面继续迭代"].map((item) => (
                  <div key={item} className="rounded-md bg-white px-4 py-3 text-sm font-medium text-muted ring-1 ring-brand-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          回到工作流总览
        </Link>
        <Link href="/ai-workflows#prompt-templates" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-ink">
          查看更多提示词模板
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
