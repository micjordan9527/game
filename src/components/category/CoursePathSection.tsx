"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CircleCheck, Circle } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { Badge } from "@/components/common/Badge"
import type { Article } from "@/data/articles"

type CourseModule = {
  id: string
  title: string
  description: string
  learningObjectives: string[]
  estimatedMinutes: number
  durationReason: string
  difficulty: "入门" | "进阶" | "提高"
  audienceHints: string[]
  articles: Article[]
}

type CoursePathSectionProps = {
  categorySlug: string
  modules: CourseModule[]
  guideAudience: string[]
  guideDifficulty?: "入门" | "进阶" | "提高"
}

const STORAGE_KEY_PREFIX = "wg-learning-module-progress"

export function CoursePathSection({ categorySlug, modules, guideAudience, guideDifficulty = "入门" }: CoursePathSectionProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}:${categorySlug}`
  const moduleIds = useMemo(() => modules.map((module) => module.id), [modules])

  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({})
  const completedCount = Object.values(completedIds).filter(Boolean).length
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const raw = window.localStorage.getItem(storageKey)
      const stored = raw ? JSON.parse(raw) : {}
      const initialState = {} as Record<string, boolean>

      for (const id of moduleIds) {
        initialState[id] = Boolean(stored[id])
      }

      setCompletedIds(initialState)
    } catch {
      const fallback: Record<string, boolean> = {}
      for (const id of moduleIds) fallback[id] = false
      setCompletedIds(fallback)
    }
  }, [moduleIds, storageKey])

  function handleToggle(moduleId: string) {
    setCompletedIds((prev) => {
      const next = { ...prev, [moduleId]: !prev[moduleId] }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(next))
      }
      return next
    })
  }

  function handleResetAll() {
    const next = {} as Record<string, boolean>
    for (const id of moduleIds) next[id] = false
    setCompletedIds(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    }
  }

  return (
    <section className="py-12">
      <SectionHeader
        title="课程式学习路径"
        description="按阶段推进，从概念、结构到交付闭环，适合快速把知识转成可执行经验。"
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="brand">栏目难度：{guideDifficulty}</Badge>
        <Badge>{guideAudience.length > 0 ? guideAudience.slice(0, 3).join("、") : "通用人群"}</Badge>
        <Badge tone="blue">已完成：{completedCount}/{modules.length}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-white px-4 text-xs font-semibold text-muted transition hover:border-brand-100 hover:text-brand-700"
        >
          重置完成标识
        </button>
        <span className="inline-flex h-9 items-center rounded-md bg-paper px-3 text-xs font-medium text-muted">完成率：{progressPercent}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper ring-1 ring-line">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="mt-8 grid gap-4">
        {modules.map((module, index) => {
          const isCompleted = Boolean(completedIds[module.id])

          return (
            <div key={module.id} className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="flex flex-col gap-3 border-b border-line bg-paper px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-sm font-semibold text-brand-700 ring-1 ring-line">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink">{module.title}</div>
                    <p className="mt-1 text-sm leading-7 text-muted">{module.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge tone="brand">{module.difficulty}</Badge>
                      <Badge>{module.audienceHints.slice(0, 2).join("、")}</Badge>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(module.id)}
                  className={[
                    "inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-xs font-semibold transition sm:w-auto",
                    isCompleted ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200" : "bg-white text-muted ring-1 ring-line",
                  ].join(" ")}
                  aria-pressed={isCompleted}
                >
                  {isCompleted ? <CircleCheck className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
                  {isCompleted ? "已完成" : "未完成"}
                </button>
              </div>
              <div className="grid gap-4 px-5 py-4 md:grid-cols-2">
                <div className="rounded-lg border border-line bg-paper p-4">
                  <details className="group">
                    <summary className="cursor-pointer text-sm font-semibold text-ink">学习目标（可折叠）</summary>
                    <ul className="mt-3 space-y-2">
                      {module.learningObjectives.map((objective) => (
                        <li key={objective} className="flex gap-3 text-sm leading-7 text-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
                <div className="rounded-lg border border-line bg-paper p-4">
                  <div className="text-sm font-semibold text-ink">建议学习时长</div>
                  <p className="mt-3 text-sm leading-7 text-muted">约 {module.estimatedMinutes} 分钟</p>
                  <p className="mt-2 text-xs leading-6 text-muted">说明：{module.durationReason}</p>
                </div>
              </div>
              <div className="grid gap-3 px-5 pb-5 pt-1 md:grid-cols-2">
                {module.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="rounded-lg border border-line bg-paper p-3 transition hover:border-brand-100 hover:bg-white"
                  >
                    <div className="text-sm font-semibold leading-6 text-ink">{article.title}</div>
                    <p className="mt-2 text-xs leading-6 text-muted">{article.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
