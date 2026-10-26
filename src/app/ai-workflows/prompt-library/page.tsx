import Link from "next/link"
import { productionPromptCards } from "@/data/aiWorkflows"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { absoluteUrl } from "@/lib/seo"
export const metadata = {
  title: "AI 提示词工具",
  description: "先看产出结构，按需复制信息图、页面和设计任务提示词。",
  alternates: { canonical: absoluteUrl("/ai-workflows/prompt-library") },
}
export default function PromptLibraryPage() {
  return (
    <div className="container-shell py-8">
      <Link href="/ai-workflows" className="text-sm font-semibold text-muted">
        ← AI 工作流
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">AI 提示词工具</h1>
      <p className="mt-3 text-sm leading-7 text-muted">按用途查看产出结构，展开后复制使用。</p>
      {productionPromptCards.map((card) => (
        <section key={card.title} className="mt-6 rounded-xl border border-line bg-white p-5">
          <h2 className="text-xl font-semibold text-ink">{card.title}</h2>
          <p className="mt-2 text-sm leading-7 text-muted">{card.value}</p>
          <FeatureFlow
            title="产出结构示意"
            steps={card.example.panels.slice(0, 4).map((title) => ({ title, text: "" }))}
          />
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-brand-700">查看与复制提示词</summary>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm leading-7 text-ink">
              {card.template}
            </pre>
            <div className="mt-3">
              <CopyPromptButton content={card.template} />
            </div>
          </details>
        </section>
      ))}
    </div>
  )
}
