"use client"

import { Circle, CircleCheck } from "lucide-react"
import { useEffect, useState } from "react"

type CaseLearningStatePanelProps = {
  slug: string
  learningGoal: string
  estimatedMinutes: number
  difficulty?: "入门" | "进阶" | "提高"
  audience?: string[]
}

const STORAGE_KEY_PREFIX = "wg-case-learning-status"

export function CaseLearningStatePanel({ slug, learningGoal, estimatedMinutes, difficulty = "入门", audience = [] }: CaseLearningStatePanelProps) {
  const storageKey = `${STORAGE_KEY_PREFIX}:${slug}`

  const audienceText = audience.length > 0 ? audience.slice(0, 3).join(" / ") : "通用人群"

  const [completed, setCompleted] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    setCompleted(window.localStorage.getItem(storageKey) === "done")
  }, [storageKey])

  const toggle = () => {
    const next = !completed
    setCompleted(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, next ? "done" : "todo")
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-line bg-paper p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">学习引导</p>
          <p className="mt-2 text-sm leading-7 text-muted">{learningGoal}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-muted">建议时长：{estimatedMinutes} 分钟</span>
            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-muted">难度：{difficulty}</span>
            <span className="rounded-full border border-line bg-white px-2.5 py-1 text-muted">适用：{audienceText}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          className={["inline-flex h-10 items-center rounded-md px-4 py-2 text-sm font-semibold transition", completed ? "bg-brand-50 text-brand-700" : "bg-white text-muted"].join(" ")}
          aria-pressed={completed}
        >
          {completed ? <CircleCheck className="mr-2 h-4 w-4" /> : <Circle className="mr-2 h-4 w-4" />}
          {completed ? "已完成" : "未完成"}
        </button>
      </div>
    </section>
  )
}
