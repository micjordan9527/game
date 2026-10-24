import Link from "next/link"
import { FeatureFlow } from "@/components/common/FeatureFlow"
import { CopyPromptButton } from "@/components/ai-workflows/CopyPromptButton"
import { absoluteUrl } from "@/lib/seo"
export const metadata = {
  title: "Figma 画布整理图解",
  description: "从分散的参考画布到清楚的页面与组件结构。",
  alternates: { canonical: absoluteUrl("/ai-workflows/figma-strategy") },
}
const prompt =
  "请读取这个 Figma 节点，先查看总览与顶层模块，再抽取关键页面样本。保留原始材料含义，将内容整理为页面、组件、参考与流程四组，输出模块地图与对应节点，不把结构示意描述为真实设计结果。"
export default function FigmaStrategyPage() {
  return (
    <div className="container-shell py-8">
      <Link href="/ai-workflows" className="text-sm font-semibold text-muted">
        ← AI 成果
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">Figma 画布怎样整理</h1>
      <p className="mt-3 text-sm leading-7 text-muted">把分散的页面、参考和组件归成清楚的结构。</p>
      <section className="mt-6 rounded-xl border border-line bg-white p-5" aria-label="画布整理方式示意">
        <p className="text-xs font-semibold text-brand-700">整理方式示意</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-paper p-4">
            <h2 className="font-semibold text-muted">原始材料</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["首页", "参考图", "按钮", "流程", "详情页", "卡片"].map((item, i) => (
                <div
                  key={item}
                  className={`flex min-h-20 items-center justify-center rounded-md border border-line bg-white p-2 text-sm text-muted ${i % 2 ? "mt-4" : ""}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-brand-50 p-4">
            <h2 className="font-semibold text-brand-700">归类后的结构</h2>
            <div className="mt-4 space-y-3">
              {[
                ["页面", "首页 / 详情页"],
                ["组件", "按钮 / 卡片"],
                ["参考", "风格与案例"],
                ["流程", "入口 / 状态 / 返回"],
              ].map(([name, value]) => (
                <div
                  key={name}
                  className="flex flex-wrap items-center gap-3 rounded-md border border-brand-100 bg-white p-3"
                >
                  <strong className="text-sm text-brand-700">{name}</strong>
                  <span className="text-sm text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FeatureFlow
        title="从大画布到可用结构"
        steps={[
          { title: "总览", text: "识别页面与主要区域。" },
          { title: "归类", text: "按用途保留原始含义。" },
          { title: "关联", text: "连接页面、组件与流程。" },
        ]}
      />
      <details className="rounded-lg border border-line bg-white p-4">
        <summary className="cursor-pointer font-semibold text-brand-700">查看可复制的提示词</summary>
        <p className="my-4 text-sm leading-7 text-muted">{prompt}</p>
        <CopyPromptButton content={prompt} />
      </details>
      <Link href="/ai-workflows/ui-design-system" className="mt-6 inline-block font-semibold text-brand-700">
        查看 UI 设计系统成果 →
      </Link>
    </div>
  )
}
