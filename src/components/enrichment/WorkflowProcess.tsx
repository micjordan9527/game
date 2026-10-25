import { workflowProcesses } from "@/data/workflowProcess"
import type { AiWorkflow } from "@/data/aiWorkflowLibrary"
import { assetPath } from "@/lib/assets"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"

export function WorkflowProcess({ workflow }: { workflow: AiWorkflow }) {
  const process = workflowProcesses[workflow.slug as keyof typeof workflowProcesses]
  if (!process) return null
  const repeatable = ["需求输入：" + process.brief, "参考约束：" + process.reference, "复核项目：", ...process.checks.map((item) => "- " + item)].join("\n")
  return (
    <section id="workflow-process" className="mt-8 scroll-mt-24" aria-label="工作流过程与对照">
      <h2 className="text-2xl font-semibold text-ink">从输入约束到成果应用</h2>
      <p className="mt-3 text-sm leading-7 text-muted">基于现有成果整理的可复用过程。调整条目是方法示范，不是原始生成会话的逐轮记录。</p>
      <ol className="mt-5 grid gap-3 md:grid-cols-4">{[
        ["需求输入", process.brief], ["参考材料", process.reference], ["调整约束", "按下面的对照表补齐使用场景、统一规则与状态说明。"], ["成果复核", process.checks.join("；") + "。"],
      ].map(([title, text], index) => <li key={title} className="min-w-0 rounded-lg border border-line bg-white p-4"><p className="text-xs font-semibold text-brand-700">0{index + 1}</p><h3 className="mt-2 font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-7 text-muted">{text}</p></li>)}</ol>
      <div className="mt-5 rounded-xl border border-line bg-white p-4 md:p-5"><h3 className="text-lg font-semibold text-ink">关键调整示范</h3><div className="mt-4 grid gap-4 lg:grid-cols-3">{process.revisions.map((revision) => <article key={revision.before} className="rounded-lg bg-paper p-4"><p className="text-xs font-semibold text-muted">初始描述示例</p><p className="mt-2 text-sm leading-7 text-ink">{revision.before}</p><p className="mt-4 text-xs font-semibold text-brand-700">补充后的约束</p><p className="mt-2 text-sm leading-7 text-ink">{revision.after}</p><p className="mt-3 text-xs leading-6 text-muted">{revision.reason}</p></article>)}</div></div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{process.comparison.map((index, order) => {
        const output = workflow.outputs[index]
        return <figure key={output.image} className="overflow-hidden rounded-xl border border-line bg-white"><img src={assetPath(output.image)} alt={output.alt} width={output.width} height={output.height} loading="lazy" className="h-80 w-full bg-paper object-contain" /><figcaption className="border-t border-line p-4"><h3 className="font-semibold text-ink">{process.comparisonLabels[order]}</h3><p className="mt-2 text-xs leading-6 text-muted">既有 AI 生成成果 · {output.title}。与另一张图对照输出范围和规则，不代表实测改版效果。</p></figcaption></figure>
      })}</div>
      <div className="mt-5 flex flex-wrap items-center gap-3"><CopyPromptButton content={repeatable} /><a href="#workflow-outputs" className="text-sm font-semibold text-brand-700">回到完整成果图 ↑</a></div>
    </section>
  )
}
