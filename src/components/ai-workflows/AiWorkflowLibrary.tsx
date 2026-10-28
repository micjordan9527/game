"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { AiWorkflow } from "@/data/aiWorkflowLibrary"
import { assetPath } from "@/lib/assets"

export function AiWorkflowLibrary({
  workflows,
  scenarios,
  tags,
}: {
  workflows: AiWorkflow[]
  scenarios: string[]
  tags: string[]
}) {
  const [keyword, setKeyword] = useState("")
  const [scenario, setScenario] = useState("全部")
  const [tag, setTag] = useState("全部")
  const filtered = useMemo(
    () =>
      workflows.filter((workflow) => {
        const query = keyword.trim().toLowerCase()
        const text = [workflow.title, workflow.summary, workflow.scenario, ...workflow.tags].join(" ").toLowerCase()
        return (
          (!query || text.includes(query)) &&
          (scenario === "全部" || workflow.scenario === scenario) &&
          (tag === "全部" || workflow.tags.includes(tag))
        )
      }),
    [workflows, keyword, scenario, tag]
  )
  return (
    <div>
      <div className="rounded-xl border border-line bg-white p-4" aria-label="AI 工作流筛选">
        <label htmlFor="ai-workflow-search" className="sr-only">
          搜索 AI 工作流
        </label>
        <input
          id="ai-workflow-search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="搜索需求、矩阵、截图、品牌、UI…"
          className="w-full min-w-0 rounded-lg border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-brand-300"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {scenarios.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setScenario(value)}
              aria-pressed={scenario === value}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${scenario === value ? "border-ink bg-ink text-white" : "border-line text-muted"}`}
            >
              {value}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted">{filtered.length} 个工作流</span>
        </div>
        <details className="mt-3 border-t border-line pt-3">
          <summary className="cursor-pointer text-xs font-semibold text-muted">
            按标签筛选{tag !== "全部" ? ` · ${tag}` : ""}
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={tag === value}
                onClick={() => setTag(value)}
                className={`rounded-full border px-3 py-1.5 text-xs ${tag === value ? "border-brand-300 bg-brand-50 text-brand-700" : "border-line text-muted"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </details>
        {keyword || scenario !== "全部" || tag !== "全部" ? (
          <button
            type="button"
            onClick={() => {
              setKeyword("")
              setScenario("全部")
              setTag("全部")
            }}
            className="mt-3 text-xs font-semibold text-brand-700"
          >
            清除筛选
          </button>
        ) : null}
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {filtered.map((workflow) => (
          <Link
            key={workflow.slug}
            href={`/ai-workflows/${workflow.slug}`}
            className="group min-w-0 overflow-hidden rounded-xl border border-line bg-white transition hover:border-brand-200 hover:shadow-soft"
          >
            <div className="aspect-[16/10] overflow-hidden bg-paper">
              <img
                src={assetPath(workflow.outputs[0]?.image ?? workflow.caseImage)}
                alt={workflow.outputs[0]?.alt ?? workflow.caseAlt}
                width={workflow.outputs[0]?.width ?? 1200}
                height={workflow.outputs[0]?.height ?? 900}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold text-brand-700">
                {workflow.scenario} · {workflow.kind === "structured" ? "输入与输出示例" : `${workflow.outputs.length} 张成果`}
              </span>
              <h2 className="mt-2 text-xl font-semibold text-ink">{workflow.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-7 text-muted">{workflow.summary}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-brand-700">{workflow.kind === "structured" ? "查看示例 →" : "查看成果 →"}</span>
            </div>
          </Link>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="my-8 text-center text-sm text-muted">没有匹配的工作流，可以清除筛选重新查看。</p>
      ) : null}
    </div>
  )
}
