"use client"

import { useId, useState } from "react"
import { CopyPromptButton } from "./CopyPromptButton"
import { practicalPrompt } from "@/data/practicalWorkflows"

export function PracticalPromptBuilder({ slug, sample }: { slug: string; sample: string }) {
  const [input, setInput] = useState(sample)
  const id = useId(), changed = input !== sample
  return <section id="workflow-prompt" aria-label="工作流输入与提示词" className="mt-6 scroll-mt-24 rounded-xl border border-line bg-white p-4 md:p-6">
    <h2 className="text-xl font-semibold">把输入整理成可复制提示词</h2><label htmlFor={id} className="mt-4 block text-sm font-semibold">输入材料（仅修改待复制提示词）</label><textarea id={id} rows={10} value={input} onChange={(e) => setInput(e.target.value)} className="mt-2 w-full rounded-lg border border-line p-3 text-sm leading-7" />
    <p role="status" data-practical-input-state className="mt-3 text-sm leading-7 text-muted">{changed ? "输入已修改。上方仍是预置示例输出，需将新提示词交给GPT处理并重新复核；本站没有生成新结果。" : "当前为预置示例输入。本站展示整理好的示例，不执行实时AI生成。"}</p>
    <div className="mt-4 flex flex-wrap gap-3"><CopyPromptButton content={practicalPrompt(slug, input)} label="复制含当前输入的提示词" /><button type="button" onClick={() => setInput(sample)} className="rounded-md border border-line px-3 py-2 text-sm font-semibold">恢复示例输入</button></div>
    {slug === "screenshot-case-description" ? <p className="mt-3 text-sm leading-7 text-muted">复制的是材料描述。实际请求GPT分析图片时，还需附上获准使用、已脱敏的截图；本页不会上传图片。</p> : null}
  </section>
}
