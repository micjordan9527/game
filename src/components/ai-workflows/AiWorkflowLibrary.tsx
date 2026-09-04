"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react"
import type { AiWorkflow } from "@/data/aiWorkflowLibrary"

type FilterOption = {
  value: string
  count: number
}

export function AiWorkflowLibrary({ workflows, scenarios, tags }: { workflows: AiWorkflow[]; scenarios: string[]; tags: string[] }) {
  const [keyword, setKeyword] = useState("")
  const [scenario, setScenario] = useState("全部")
  const [tag, setTag] = useState("全部")
  const normalizedKeyword = keyword.trim().toLowerCase()
  const compactKeyword = normalizedKeyword.replace(/\s+/g, "")

  const scenarioOptions = useMemo(
    () =>
      scenarios.map((value) => ({
        value,
        count: value === "全部" ? workflows.length : workflows.filter((workflow) => workflow.scenario === value).length,
      })),
    [scenarios, workflows]
  )

  const tagOptions = useMemo(
    () =>
      tags.map((value) => ({
        value,
        count: value === "全部" ? workflows.length : workflows.filter((workflow) => workflow.tags.includes(value)).length,
      })),
    [tags, workflows]
  )

  const filteredWorkflows = useMemo(
    () =>
      workflows.filter((workflow) => {
        const searchText = [
          workflow.title,
          workflow.scenario,
          workflow.tags.join(" "),
        ].join(" ")
        const normalizedSearchText = searchText.toLowerCase()
        const compactSearchText = normalizedSearchText.replace(/\s+/g, "")
        const matchKeyword = normalizedKeyword.length === 0 || normalizedSearchText.includes(normalizedKeyword) || compactSearchText.includes(compactKeyword)
        const matchScenario = scenario === "全部" || workflow.scenario === scenario
        const matchTag = tag === "全部" || workflow.tags.includes(tag)
        return matchKeyword && matchScenario && matchTag
      }),
    [compactKeyword, normalizedKeyword, scenario, tag, workflows]
  )

  const hasActiveFilters = normalizedKeyword.length > 0 || scenario !== "全部" || tag !== "全部"

  function resetFilters() {
    setKeyword("")
    setScenario("全部")
    setTag("全部")
  }

  return (
    <div>
      <div className="sticky top-16 z-30 rounded-lg border border-line bg-white/95 p-2 shadow-sm backdrop-blur md:p-3" aria-label="AI 工作流搜索筛选">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <label htmlFor="ai-workflow-search" className="sr-only">
              搜索工作流
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input
                id="ai-workflow-search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜索：品牌设计、UI设计、Logo、移动端界面、组件规范..."
                className="w-full rounded-md border border-line bg-paper py-2 pl-10 pr-10 text-sm outline-none transition focus:border-brand-600 focus:bg-white"
              />
              {keyword ? (
                <button
                  type="button"
                  onClick={() => setKeyword("")}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-white hover:text-ink"
                  aria-label="清空搜索"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-paper px-2.5 py-2 text-xs font-medium text-muted" aria-live="polite">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                <span className="font-semibold text-ink">{filteredWorkflows.length}</span> 条
              </span>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-muted transition hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              重置
            </button>
          </div>
        </div>

        <div className="mt-2 grid gap-2 xl:grid-cols-2">
          <FilterGroup label="场景" options={scenarioOptions} active={scenario} onChange={setScenario} />
          <FilterGroup label="标签" options={tagOptions} active={tag} onChange={setTag} showMore />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <WorkflowCaseCard key={workflow.slug} workflow={workflow} />
        ))}
      </div>

      {filteredWorkflows.length === 0 ? <div className="mt-8 rounded-lg border border-line bg-white p-8 text-center text-sm text-muted">没有找到匹配的工作流。</div> : null}
    </div>
  )
}

type FilterGroupProps = {
  label: string
  options: FilterOption[]
  active: string
  onChange: (value: string) => void
  showMore?: boolean
}

function FilterGroup({ label, options, active, onChange, showMore = false }: FilterGroupProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const visibleLimit = 5
  const hasMore = showMore && options.length > visibleLimit
  const visibleOptions = hasMore ? options.slice(0, visibleLimit) : options
  const remainingCount = options.length - visibleLimit

  const optionClass = (isActive: boolean) =>
    [
      "group shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition",
      isActive ? "bg-ink text-white ring-ink" : "bg-white text-muted ring-line hover:bg-paper hover:text-ink",
    ].join(" ")

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="w-7 shrink-0 text-xs font-semibold text-ink">{label}</div>
      <div
        className="relative flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-visible py-0.5"
        onMouseLeave={() => setIsMoreOpen(false)}
      >
        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden px-0.5 py-1">
          {visibleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active === option.value}
              className={optionClass(active === option.value)}
            >
              {option.value}
              {option.value !== "全部" ? (
                <span
                  className={[
                    "ml-1.5 inline-flex min-w-4 justify-center rounded px-1 text-[10px] font-semibold",
                    active === option.value ? "bg-white/20 text-white/90" : "bg-paper text-muted group-hover:bg-white",
                  ].join(" ")}
                >
                  {option.count}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {hasMore ? (
          <div className="shrink-0 py-1" onMouseEnter={() => setIsMoreOpen(true)}>
            <button
              type="button"
              onClick={() => setIsMoreOpen((value) => !value)}
              className="shrink-0 rounded-full border border-dashed border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink"
              aria-label={`查看更多${label}筛选项`}
              aria-expanded={isMoreOpen}
            >
              更多+{remainingCount}
            </button>
          </div>
        ) : null}
        {hasMore ? (
          <div
            className={[
              "absolute right-0 top-full z-40 mt-1 max-h-56 w-full max-w-[44rem] overflow-y-auto rounded-lg border border-line bg-white p-2 shadow-md",
              "transition-opacity duration-150",
              isMoreOpen ? "visible opacity-100" : "invisible opacity-0",
            ].join(" ")}
            role="menu"
            aria-label={`${label}筛选项`}
          >
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsMoreOpen(false)
                  }}
                  aria-pressed={active === option.value}
                  className={optionClass(active === option.value).concat(" w-full justify-start")}
                >
                  {option.value}
                  {option.value !== "全部" ? (
                    <span
                      className={[
                        "ml-1.5 inline-flex min-w-4 justify-center rounded px-1 text-[10px] font-semibold",
                        active === option.value ? "bg-white/20 text-white/90" : "bg-paper text-muted",
                      ].join(" ")}
                    >
                      {option.count}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function WorkflowCaseCard({ workflow }: { workflow: AiWorkflow }) {
  const visibleTags = workflow.tags.slice(0, 3)
  const hiddenTags = workflow.tags.slice(visibleTags.length)
  const hiddenTagCount = workflow.tags.length - visibleTags.length

  return (
    <Link
      href={`/ai-workflows/${workflow.slug}`}
      className="group flex h-full flex-col rounded-lg border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-line bg-paper">
        <img src={workflow.caseImage} alt={workflow.caseAlt} className="h-full w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
        <div className="absolute right-2 top-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5">
          <span className="truncate rounded-full bg-brand-50/95 px-2 py-1 text-xs font-medium text-brand-700 shadow-sm ring-1 ring-brand-100 backdrop-blur">
            {workflow.scenario}
          </span>
          <span className="shrink-0 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-ink shadow-sm ring-1 ring-line/80 backdrop-blur">
            {workflow.outputs.length} 张输出
          </span>
        </div>
      </div>
      <h2 className="mt-4 text-lg font-semibold leading-7 text-ink">{workflow.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{workflow.summary}</p>
      <div className="mt-3 flex gap-2 border-l-2 border-brand-100 pl-3">
        <span className="shrink-0 text-xs font-semibold leading-6 text-brand-700">提示词</span>
        <p className="line-clamp-2 text-sm leading-6 text-ink">{workflow.prompt}</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-paper px-2 py-1 text-xs font-medium text-muted ring-1 ring-line">
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 ? (
            <span className="group/tag relative inline-flex items-center rounded-full bg-paper px-2 py-1 text-xs font-medium text-muted ring-1 ring-line transition hover:bg-white hover:text-ink">
              +{hiddenTagCount}
              <span className="invisible absolute bottom-full left-0 z-20 mb-2 w-48 rounded-md border border-line bg-white p-2 text-left opacity-0 shadow-md transition group-hover/tag:visible group-hover/tag:opacity-100">
                <span className="flex flex-wrap gap-1.5">
                  {hiddenTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-paper px-2 py-1 text-xs font-medium text-muted ring-1 ring-line">
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </span>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:text-ink">
          查看
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
