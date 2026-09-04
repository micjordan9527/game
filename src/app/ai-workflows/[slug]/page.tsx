import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { AiWorkflowOutputGallery } from "@/components/ai-workflows/AiWorkflowOutputGallery"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { Badge } from "@/components/common/Badge"
import { SectionHeader } from "@/components/common/SectionHeader"
import { aiWorkflows, getAiWorkflow } from "@/data/aiWorkflowLibrary"
import { absoluteUrl } from "@/lib/seo"

export function generateStaticParams() {
  return aiWorkflows.map((workflow) => ({ slug: workflow.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const workflow = getAiWorkflow(slug)

  if (!workflow) return {}

  return {
    title: workflow.title,
    description: workflow.summary,
    alternates: {
      canonical: absoluteUrl(`/ai-workflows/${workflow.slug}`),
    },
    openGraph: {
      title: `${workflow.title} | 包网知识库`,
      description: workflow.summary,
      url: absoluteUrl(`/ai-workflows/${workflow.slug}`),
      type: "article",
    },
  }
}

export default async function AiWorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workflow = getAiWorkflow(slug)

  if (!workflow) notFound()

  return (
    <div className="container-shell max-w-6xl py-10 md:py-12">
      <Link href="/ai-workflows" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        返回工作流库
      </Link>

      <section className="mt-8">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{workflow.scenario}</Badge>
          {workflow.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-normal text-ink md:text-4xl">{workflow.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted md:text-lg">{workflow.summary}</p>
      </section>

      <section className="mt-10 rounded-lg border border-line bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">提示词</p>
            <p className="mt-3 max-w-4xl rounded-[24px] bg-paper px-5 py-4 text-lg leading-9 text-ink">{workflow.prompt}</p>
          </div>
          <CopyPromptButton content={workflow.prompt} />
        </div>
        <div className="mt-5">
          <p className="text-sm font-semibold text-brand-700">参考图</p>
          <p className="mt-3 max-w-4xl rounded-[24px] bg-paper px-5 py-4 text-lg leading-9 text-ink">{workflow.referenceNote}</p>
        </div>
        {workflow.extensionNote ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-brand-700">扩展场景</p>
            <p className="mt-3 max-w-4xl rounded-[24px] bg-paper px-5 py-4 text-lg leading-9 text-ink">{workflow.extensionNote}</p>
          </div>
        ) : null}
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Case" title="案例截图" description="这里放用户提供的参考截图，帮助理解这条提示词是从什么画面出发。" />
        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-white shadow-sm">
          <img src={workflow.caseImage} alt={workflow.caseAlt} className="h-auto w-full" />
        </div>
      </section>

      <section className="py-12">
        <SectionHeader eyebrow="Output" title="输出结果" description="这里放这条提示词生成出来的结果图，后续每个案例都按这个结构收纳。" />
        <AiWorkflowOutputGallery outputs={workflow.outputs} />
      </section>
    </div>
  )
}
