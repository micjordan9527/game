import { WorkflowProcess } from "@/components/enrichment/WorkflowProcess"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AiWorkflowOutputGallery } from "@/components/ai-workflows/AiWorkflowOutputGallery"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { aiWorkflows, getAiWorkflow } from "@/data/aiWorkflowLibrary"
import { assetPath } from "@/lib/assets"
import { absoluteUrl } from "@/lib/seo"
import { resourcesForResource } from "@/lib/knowledge-relations"
import { KnowledgeLinks } from "@/components/common/KnowledgeLinks"
export function generateStaticParams() {
  return aiWorkflows.map((workflow) => ({ slug: workflow.slug }))
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workflow = getAiWorkflow(slug)
  return workflow
    ? {
        title: workflow.title,
        description: workflow.summary,
        alternates: { canonical: absoluteUrl(`/ai-workflows/${slug}`) },
      }
    : {}
}
export default async function AiWorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const workflow = getAiWorkflow(slug)
  if (!workflow) notFound()
  const brand = slug === "brand-visual-system"
  return (
    <div className="container-shell max-w-6xl py-6 md:py-8">
      <Link href="/ai-workflows" className="text-sm font-semibold text-muted hover:text-brand-700">
        ← AI 工作流
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{workflow.title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{workflow.summary}</p>
      <section id="workflow-outputs" className="scroll-mt-24" aria-label="AI生成成果">
        <AiWorkflowOutputGallery outputs={workflow.outputs} />
      </section>
      <WorkflowProcess workflow={workflow} />
      <FeatureFlow
        title="这些图怎样做出来"
        caption="AI 生成视觉方案"
        steps={
          brand
            ? [
                { title: "提供 Logo", text: "确定品牌主体与视觉方向。" },
                { title: "延展视觉", text: "生成色彩、字体和图形语言。" },
                { title: "应用到页面", text: "展示网页、手机界面与品牌物料。" },
              ]
            : [
                { title: "提供参考", text: "用主页面明确视觉风格。" },
                { title: "生成系统", text: "整理页面、卡片与核心组件。" },
                { title: "展开细节", text: "查看按钮、控件与多端布局。" },
              ]
        }
      />
      <details className="mt-6 rounded-xl border border-line bg-white p-5">
        <summary className="cursor-pointer font-semibold text-ink">查看参考输入与提示词</summary>
        <p className="mt-4 text-sm leading-7 text-muted">{workflow.referenceNote}</p>
        <pre className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm leading-7 text-ink">
          {workflow.prompt}
        </pre>
        <div className="mt-3">
          <CopyPromptButton content={workflow.prompt} />
        </div>
        {workflow.extensionNote ? <p className="mt-4 text-sm leading-7 text-muted">{workflow.extensionNote}</p> : null}
        <img
          src={assetPath(workflow.caseImage)}
          alt={workflow.caseAlt}
          width={1200}
          height={1500}
          loading="lazy"
          className="mt-5 h-auto w-full rounded-lg border border-line"
        />
      </details>
      <KnowledgeLinks resources={resourcesForResource("AI 工作流", slug)} title="相关案例与图解" />
    </div>
  )
}
