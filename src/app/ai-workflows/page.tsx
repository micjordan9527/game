import type { Metadata } from "next"
import { AiWorkflowLibrary } from "@/components/ai-workflows/AiWorkflowLibrary"
import { aiWorkflowScenarios, aiWorkflowTags, aiWorkflows } from "@/data/aiWorkflowLibrary"
import { absoluteUrl } from "@/lib/seo"

export const metadata: Metadata = {
  title: "AI 成果",
  description: "把 AI 设计、出图、Figma、建站和内容生产流程整理成可搜索、可筛选、可复制的工作流库。",
  alternates: {
    canonical: absoluteUrl("/ai-workflows"),
  },
  openGraph: {
    title: "AI 成果 | 包网知识库",
    description: "用搜索筛选、案例卡片和详情图组沉淀可复刻的 AI 工作流。",
    url: absoluteUrl("/ai-workflows"),
    type: "website",
  },
}

export default function AiWorkflowsPage() {
  return (
    <div className="container-shell py-6 md:py-8">
      <section className="mb-4">
        <p className="text-sm font-semibold text-brand-700">Library</p>
        <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <h1 className="text-2xl font-semibold tracking-normal text-ink md:text-3xl">AI 成果</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted">查看生成的品牌与界面成果，展开了解做法。</p>
        </div>
      </section>

      <section>
        <AiWorkflowLibrary workflows={aiWorkflows} scenarios={aiWorkflowScenarios} tags={aiWorkflowTags} />
      </section>
    </div>
  )
}
