import Link from "next/link"
import { codexCaseStudies } from "@/data/aiWorkflows"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { absoluteUrl } from "@/lib/seo"
export const metadata = {
  title: "Codex 实践图解",
  description: "从输入、处理到页面结果，快速查看常见工作流。",
  alternates: { canonical: absoluteUrl("/ai-workflows/codex-cases") },
}
export default function CodexCasesPage() {
  return (
    <div className="container-shell py-8">
      <Link href="/ai-workflows" className="text-sm font-semibold text-muted">
        ← AI 成果
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">Codex 实践图解</h1>
      <p className="mt-3 text-sm leading-7 text-muted">用输入、处理和结果三个节点，看清常见工作流。</p>
      {codexCaseStudies.map((item) => (
        <section key={item.title} className="mt-6">
          <FeatureFlow
            title={item.title}
            caption="流程示意"
            steps={[
              { title: "输入材料", text: item.materials.slice(0, 2).join("、") },
              { title: "主要处理", text: item.codexMoves.slice(0, 2).join("；") },
              {
                title: "结果形式",
                text: item.title.includes("Figma")
                  ? "模块地图与页面结构"
                  : item.title.includes("样式")
                    ? "定位记录与可查看页面"
                    : item.title.includes("聊天")
                      ? "任务状态与继续执行说明"
                      : "可访问的页面与资源目录",
              },
            ]}
          />
          <details className="rounded-lg border border-line bg-white p-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand-700">复用这条提示词</summary>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm leading-7">
              {item.reusablePrompt}
            </pre>
            <div className="mt-3">
              <CopyPromptButton content={item.reusablePrompt} />
            </div>
          </details>
        </section>
      ))}
      <Link href="/cases" className="mt-6 inline-block font-semibold text-brand-700">
        查看站内案例 →
      </Link>
    </div>
  )
}
